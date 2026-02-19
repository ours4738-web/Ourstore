import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { generateOTP } from '@/lib/utils/helpers';
import { sendOTPEmail } from '@/lib/services/emailService';

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const { email } = await req.json();

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const otp = generateOTP();
        user.otp = otp;
        user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        await sendOTPEmail(email, otp, 'password-reset');

        return NextResponse.json({ message: 'Password reset OTP sent to your email', userId: user._id });
    } catch (error: unknown) {
        const err = error as Error;
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
