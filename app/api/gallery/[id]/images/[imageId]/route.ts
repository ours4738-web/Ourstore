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

// PUT /api/gallery/[id]/images/[imageId] - update image caption
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string; imageId: string }> }) {
    try {
        await connectDB();
        const { id, imageId } = await params;
        const admin = await getAdminUser(req);
        if (!admin) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

        const { caption } = await req.json();
        const gallery = await Gallery.findById(id);
        if (!gallery) return NextResponse.json({ message: 'Gallery not found' }, { status: 404 });

        const image = (gallery.images as any).id(imageId);
        if (!image) return NextResponse.json({ message: 'Image not found' }, { status: 404 });

        image.caption = caption;
        await gallery.save();

        return NextResponse.json(gallery);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// DELETE /api/gallery/[id]/images/[imageId] - delete image from gallery
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string; imageId: string }> }) {
    try {
        await connectDB();
        const { id, imageId } = await params;
        const admin = await getAdminUser(req);
        if (!admin) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

        const gallery = await Gallery.findById(id);
        if (!gallery) return NextResponse.json({ message: 'Gallery not found' }, { status: 404 });

        gallery.images = gallery.images.filter((img: any) => img._id.toString() !== imageId);
        await gallery.save();

        return NextResponse.json(gallery);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
