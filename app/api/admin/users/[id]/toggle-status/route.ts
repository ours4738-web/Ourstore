import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
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

// PUT /api/admin/users/[id]/toggle-status
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const admin = await getAdminUser(req);
        if (!admin) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

        const { id } = await params;
        if (id === admin._id.toString()) {
            return NextResponse.json({ message: 'You cannot deactivate your own account' }, { status: 400 });
        }

        const user = await User.findById(id);
        if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });

        user.isActive = !user.isActive;
        await user.save();

        return NextResponse.json({
            message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                isActive: user.isActive
            }
        });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
