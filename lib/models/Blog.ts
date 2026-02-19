import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBlog extends Document {
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    featuredImage?: string;
    category?: string;
    tags: string[];
    author: mongoose.Types.ObjectId;
    status: 'draft' | 'published';
    views: number;
    createdAt: Date;
    updatedAt: Date;
}

const blogSchema = new Schema<IBlog>(
    {
        title: { type: String, required: true },
        slug: { type: String, unique: true, required: true },
        content: { type: String, required: true },
        excerpt: { type: String },
        featuredImage: { type: String },
        category: { type: String },
        tags: [{ type: String }],
        author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        status: { type: String, enum: ['draft', 'published'], default: 'draft' },
        views: { type: Number, default: 0 },
    },
    { timestamps: true }
);

blogSchema.index({ slug: 1, status: 1, category: 1 });

const Blog: Model<IBlog> = mongoose.models.Blog || mongoose.model<IBlog>('Blog', blogSchema);

export default Blog;
