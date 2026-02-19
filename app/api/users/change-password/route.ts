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

// POST /api/users/change-password
export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const user = await getAuthUser(req);
        if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const { currentPassword, newPassword } = await req.json();

        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) return NextResponse.json({ message: 'Current password is incorrect' }, { status: 400 });

        user.password = newPassword;
        await user.save();

        return NextResponse.json({ message: 'Password changed successfully' });
    } catch (error: unknown) {
        const err = error as Error;
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
