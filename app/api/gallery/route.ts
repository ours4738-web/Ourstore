import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import connectDB from '@/lib/mongodb';
import Gallery from '@/lib/models/Gallery';
import User from '@/lib/models/User';
import { verifyAccessToken } from '@/lib/services/tokenService';

async function getAdminUser(req: NextRequest) {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) return null;
    const decoded = verifyAccessToken(authHeader.split(' ')[1]);
    if (!decoded) return null;
    const user = await User.findById(decoded.userId);
    if (!user || user.role !== 'admin') return null;
    return user;
}

// GET /api/gallery - list all galleries
export async function GET() {
    try {
        await connectDB();
        const galleries = await Gallery.find().sort({ createdAt: -1 });
        return NextResponse.json(galleries);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// POST /api/gallery - create a gallery (Admin only)
export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const admin = await getAdminUser(req);
        if (!admin) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

        const data = await req.json();
        const gallery = await Gallery.create(data);

        return NextResponse.json(gallery, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
