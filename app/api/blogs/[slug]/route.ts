import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Blog from '@/lib/models/Blog';
import User from '@/lib/models/User';
import { verifyAccessToken } from '@/lib/services/tokenService';
import { uploadToCloudinary } from '@/lib/services/uploadService';

async function getAdminUser(req: NextRequest) {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) return null;
    const decoded = verifyAccessToken(authHeader.split(' ')[1]);
    if (!decoded) return null;
    const user = await User.findById(decoded.userId);
    if (!user || user.role !== 'admin') return null;
    return user;
}

// GET /api/blogs/[slug] - get blog by slug
export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    try {
        await connectDB();
        const { slug } = await params;
        const blog = await Blog.findOne({ slug, status: 'published' }).populate('author', 'fullName profilePicture');
        if (!blog) return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
        return NextResponse.json(blog);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// PUT /api/blogs/[id] - update blog (Admin only)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    try {
        await connectDB();
        const { slug: id } = await params;
        const admin = await getAdminUser(req);
        if (!admin) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

        const contentType = req.headers.get('content-type') || '';
        let data: any;

        if (contentType.includes('multipart/form-data')) {
            const formData = await req.formData();
            data = Object.fromEntries(formData.entries());

            const file = formData.get('image') as File;
            if (file) {
                const buffer = Buffer.from(await file.arrayBuffer());
                const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`;
                data.image = await uploadToCloudinary(base64Image, 'blogs');
            }
        } else {
            data = await req.json();
        }

        const blog = await Blog.findByIdAndUpdate(id, data, { new: true });
        if (!blog) return NextResponse.json({ message: 'Blog not found' }, { status: 404 });

        return NextResponse.json(blog);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// DELETE /api/blogs/[id] - delete blog (Admin only)
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    try {
        await connectDB();
        const { slug: id } = await params;
        const admin = await getAdminUser(req);
        if (!admin) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

        const blog = await Blog.findByIdAndDelete(id);
        if (!blog) return NextResponse.json({ message: 'Blog not found' }, { status: 404 });

        return NextResponse.json({ message: 'Blog deleted successfully' });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
