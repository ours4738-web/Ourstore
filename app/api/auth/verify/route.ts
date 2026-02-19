import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { generateTokens } from '@/lib/services/tokenService';

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const { userId, otp } = await req.json();

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        if (user.otp !== otp || !user.otpExpiry || user.otpExpiry < new Date()) {
            return NextResponse.json({ message: 'Invalid or expired OTP' }, { status: 400 });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        const { accessToken, refreshToken } = generateTokens(user._id.toString());
        user.refreshToken = refreshToken;
        await user.save();

        return NextResponse.json({
            message: 'Email verified successfully',
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                profilePicture: user.profilePicture,
            },
        });
    } catch (error: unknown) {
        const err = error as Error;
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
