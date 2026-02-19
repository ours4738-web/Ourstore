import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import connectDB from '@/lib/mongodb';
import Message from '@/lib/models/Message';
import User from '@/lib/models/User';
import { verifyAccessToken } from '@/lib/services/tokenService';

// POST /api/messages - send a message (public)
export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const { name, email, subject, message } = await req.json();

        if (!name || !email || !subject || !message) {
            return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
        }

        // Optionally attach user ID if authenticated
        let userId = undefined;
        const authHeader = req.headers.get('authorization');
        if (authHeader?.startsWith('Bearer ')) {
            const decoded = verifyAccessToken(authHeader.split(' ')[1]);
            if (decoded) userId = decoded.userId;
        }

        const newMessage = await Message.create({ userId, name, email, subject, message });
        return NextResponse.json({ message: 'Message sent successfully', id: newMessage._id }, { status: 201 });
    } catch (error: unknown) {
        const err = error as Error;
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}

// GET /api/messages - admin only
export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const authHeader = req.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        const decoded = verifyAccessToken(authHeader.split(' ')[1]);
        if (!decoded) return NextResponse.json({ message: 'Invalid token' }, { status: 401 });

        const user = await User.findById(decoded.userId);
        if (!user || user.role !== 'admin') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

        const { searchParams } = new URL(req.url);
        const page = Number(searchParams.get('page') || 1);
        const limit = Number(searchParams.get('limit') || 20);
        const isRead = searchParams.get('isRead');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: Record<string, any> = {};
        if (isRead !== null) query.isRead = isRead === 'true';

        const messages = await Message.find(query).sort({ createdAt: -1 }).limit(limit).skip((page - 1) * limit);
        const count = await Message.countDocuments(query);

        return NextResponse.json({ messages, total: count, totalPages: Math.ceil(count / limit), currentPage: page });
    } catch (error: unknown) {
        const err = error as Error;
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
