import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { verifyAccessToken } from '@/lib/services/tokenService';

async function getAuthUser(req: NextRequest) {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) return null;
    const decoded = verifyAccessToken(authHeader.split(' ')[1]);
    if (!decoded) return null;
    return await User.findById(decoded.userId);
}

// DELETE /api/users/wishlist/[productId]
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ productId: string }> }) {
    try {
        await connectDB();
        const { productId } = await params;
        const user = await getAuthUser(req);
        if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
        await user.save();

        return NextResponse.json({ message: 'Removed from wishlist' });
    } catch (error: unknown) {
        const err = error as Error;
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
