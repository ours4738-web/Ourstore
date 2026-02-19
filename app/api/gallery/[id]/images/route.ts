import { NextRequest, NextResponse } from 'next/server';
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

// POST /api/gallery/[id]/images - add images to gallery
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;
        const admin = await getAdminUser(req);
        if (!admin) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

        const { images } = await req.json(); // Array of { url, caption }
        const gallery = await Gallery.findById(id);
        if (!gallery) return NextResponse.json({ message: 'Gallery not found' }, { status: 404 });

        gallery.images.push(...images);
        await gallery.save();

        return NextResponse.json(gallery);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
