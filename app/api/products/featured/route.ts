import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/lib/models/Product';

// GET /api/products/featured
export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const products = await Product.find({ isFeatured: true, status: 'active' })
            .limit(8)
            .sort({ createdAt: -1 });
        return NextResponse.json(products);
    } catch (error: unknown) {
        const err = error as Error;
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
