import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IGallery extends Document {
    title?: string;
    images: { url: string; caption?: string }[];
    album?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const galleryImageSchema = new Schema({
    url: { type: String, required: true },
    caption: { type: String },
});

const gallerySchema = new Schema<IGallery>(
    {
        title: { type: String },
        images: [galleryImageSchema],
        album: { type: String, index: true },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

const Gallery: Model<IGallery> = mongoose.models.Gallery || mongoose.model<IGallery>('Gallery', gallerySchema);

export default Gallery;
