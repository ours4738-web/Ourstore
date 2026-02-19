import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IAddress {
    _id?: mongoose.Types.ObjectId;
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    dzongkhag: string;
    postalCode: string;
    isDefault: boolean;
}

export interface IUser extends Document {
    fullName: string;
    email: string;
    password?: string;
    phone?: string;
    profilePicture: string;
    addresses: IAddress[];
    role: 'user' | 'admin';
    isVerified: boolean;
    googleId?: string;
    wishlist: mongoose.Types.ObjectId[];
    otp?: string;
    otpExpiry?: Date;
    refreshToken?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const addressSchema = new Schema<IAddress>({
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    dzongkhag: { type: String, required: true },
    postalCode: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
});

const userSchema = new Schema<IUser>(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true, lowercase: true },
        password: { type: String },
        phone: { type: String },
        profilePicture: { type: String, default: '' },
        addresses: [addressSchema],
        role: { type: String, enum: ['user', 'admin'], default: 'user' },
        isVerified: { type: Boolean, default: false },
        googleId: { type: String },
        wishlist: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
        otp: { type: String },
        otpExpiry: { type: Date },
        refreshToken: { type: String },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

userSchema.pre('save', async function () {
    if (!this.isModified('password') || !this.password) return;
    this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    if (!this.password) return false;
    return await bcrypt.compare(candidatePassword, this.password);
};

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
