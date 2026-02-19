import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import Review from '@/lib/models/Review';
import Order from '@/lib/models/Order';
import User from '@/lib/models/User';
import { verifyAccessToken } from '@/lib/services/tokenService';

async function getUser(req: NextRequest) {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) return null;
    const decoded = verifyAccessToken(authHeader.split(' ')[1]);
    if (!decoded) return null;
    return await User.findById(decoded.userId);
}

// POST /api/products/reviews - create a review
export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const user = await getUser(req);
        if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const { productId, orderId, rating, comment } = await req.json();

        // Verify order belongs to user and is delivered
        const order = await Order.findOne({ _id: orderId, userId: user._id, orderStatus: 'Delivered' });
        if (!order) {
            return NextResponse.json({ message: 'Only delivered orders can be reviewed' }, { status: 400 });
        }

        const review = await Review.create({
            productId,
            userId: user._id,
            rating,
            comment
        });

        // Update product rating
        const reviews = await Review.find({ productId });
        const avgRating = reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length;

        await Product.findByIdAndUpdate(productId, {
            'ratings.average': avgRating,
            'ratings.count': reviews.length
        });

        return NextResponse.json(review, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
