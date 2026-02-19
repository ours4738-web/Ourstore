import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import connectDB from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import Order from '@/lib/models/Order';
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

// GET /api/admin/stats
export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const admin = await getAdminUser(req);
        if (!admin) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

        const totalOrders = await Order.countDocuments();
        const pendingOrders = await Order.countDocuments({ orderStatus: 'Pending' });
        const processingOrders = await Order.countDocuments({ orderStatus: 'Processing' });
        const shippedOrders = await Order.countDocuments({ orderStatus: 'Shipped' });
        const deliveredOrders = await Order.countDocuments({ orderStatus: 'Delivered' });
        const cancelledOrders = await Order.countDocuments({ orderStatus: 'Cancelled' });
        const totalProducts = await Product.countDocuments({ status: 'active' });
        const totalUsers = await User.countDocuments({ isActive: true });

        const revenue = await Order.aggregate([
            { $match: { orderStatus: { $ne: 'Cancelled' } } },
            { $group: { _id: null, total: { $sum: '$total' } } },
        ]);

        const monthlyRevenue = await Order.aggregate([
            { $match: { orderStatus: { $ne: 'Cancelled' } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                    revenue: { $sum: '$total' },
                    orders: { $sum: 1 },
                },
            },
            { $sort: { _id: -1 } },
            { $limit: 12 },
        ]);

        return NextResponse.json({
            totalOrders, pendingOrders, processingOrders, shippedOrders, deliveredOrders, cancelledOrders,
            totalProducts, totalUsers,
            totalRevenue: revenue[0]?.total || 0,
            monthlyRevenue,
        });
    } catch (error: unknown) {
        const err = error as Error;
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
