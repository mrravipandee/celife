import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
  title: string;
  slug: string;
  description: string;
  category: string;
  location: string;
  coverImage: string;
  gallery: string[];
  year: number;
  services: string[];
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    location: { type: String, required: true },
    coverImage: { type: String, required: true },
    gallery: { type: [String], default: [] },
    year: { type: Number, required: true },
    services: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Indexes for query performance and sorting
ProjectSchema.index({ featured: 1, createdAt: -1 });
ProjectSchema.index({ createdAt: -1 });

const Project = mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);

export default Project;
