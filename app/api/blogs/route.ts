import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
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

// GET /api/blogs - list all blogs
export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category');
        const status = searchParams.get('status'); // 'published', 'draft', or 'all'
        const limit = Number(searchParams.get('limit') || 10);
        const page = Number(searchParams.get('page') || 1);

        const query: any = {};

        if (status === 'all') {
            const admin = await getAdminUser(req);
            if (!admin) {
                query.status = 'published';
            }
            // If admin, we don't set a status filter to get all
        } else if (status) {
            query.status = status;
        } else {
            query.status = 'published';
        }

        if (category) query.category = category;

        const blogs = await Blog.find(query)
            .populate('author', 'fullName profilePicture')
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip((page - 1) * limit);

        const total = await Blog.countDocuments(query);

        return NextResponse.json({
            blogs,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// POST /api/blogs - create a blog (Admin only)
export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const admin = await getAdminUser(req);
        if (!admin) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

        const contentType = req.headers.get('content-type') || '';
        let data: any;

        if (contentType.includes('multipart/form-data')) {
            const formData = await req.formData();
            data = Object.fromEntries(formData.entries());

            const file = formData.get('featuredImage') as File;
            if (file) {
                const buffer = Buffer.from(await file.arrayBuffer());
                const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`;
                data.featuredImage = await uploadToCloudinary(base64Image, 'blogs');
            }

            if (data.tags && typeof data.tags === 'string') {
                data.tags = data.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean);
            }
        } else {
            data = await req.json();
        }

        if (!data.slug && data.title) {
            data.slug = data.title
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/--+/g, '-')
                .trim();
        }

        const blog = await Blog.create({
            ...data,
            author: admin._id
        });

        return NextResponse.json(blog, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
