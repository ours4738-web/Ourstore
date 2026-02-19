import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { verifyAccessToken } from '@/lib/services/tokenService';
import bcrypt from 'bcryptjs';

// POST /api/users/delete-account
export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const authHeader = req.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        const decoded = verifyAccessToken(authHeader.split(' ')[1]);
        if (!decoded) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const { password } = await req.json();
        const user = await User.findById(decoded.userId);
        if (!user || !user.password) return NextResponse.json({ message: 'User not found or password not set' }, { status: 404 });

        const isMatch = await bcrypt.compare(password, user.password as string);
        if (!isMatch) return NextResponse.json({ message: 'Invalid password' }, { status: 400 });

        await User.findByIdAndDelete(decoded.userId);

        return NextResponse.json({ message: 'Account deleted successfully' });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
