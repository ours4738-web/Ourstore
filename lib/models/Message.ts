import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMessage extends Document {
    userId?: mongoose.Types.ObjectId;
    name: string;
    email: string;
    subject: string;
    message: string;
    isRead: boolean;
    reply?: string;
    repliedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        name: { type: String, required: true },
        email: { type: String, required: true },
        subject: { type: String, required: true },
        message: { type: String, required: true },
        isRead: { type: Boolean, default: false },
        reply: { type: String },
        repliedAt: { type: Date },
    },
    { timestamps: true }
);

const Message: Model<IMessage> = mongoose.models.Message || mongoose.model<IMessage>('Message', messageSchema);

export default Message;
