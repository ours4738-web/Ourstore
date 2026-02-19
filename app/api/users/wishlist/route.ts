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

// GET /api/users/wishlist
export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const user = await getAuthUser(req);
        if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const fullUser = await User.findById(user._id).populate('wishlist', 'title price images discountPrice stock ratings');
        return NextResponse.json(fullUser?.wishlist || []);
    } catch (error: unknown) {
        const err = error as Error;
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}

// POST /api/users/wishlist - add to wishlist
export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const user = await getAuthUser(req);
        if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const { productId } = await req.json();

        if (user.wishlist.some((id) => id.toString() === productId)) {
            return NextResponse.json({ message: 'Product already in wishlist' }, { status: 400 });
        }

        user.wishlist.push(productId);
        await user.save();

        return NextResponse.json({ message: 'Added to wishlist' });
    } catch (error: unknown) {
        const err = error as Error;
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
