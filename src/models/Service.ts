import mongoose, { Schema, Document } from "mongoose";

export interface IService extends Document {
  name: string;
  slug: string;
  shortDescription: string;
  category: string;
  displayOrder: number;
  status: "active" | "draft" | "hidden";
  featured: boolean;
  heroLabel: string;
  description: string;
  keyPoints: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 200,
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    displayOrder: {
      type: Number,
      required: true,
      default: 1,
    },
    status: {
      type: String,
      required: true,
      enum: ["active", "draft", "hidden"],
      default: "draft",
    },
    featured: {
      type: Boolean,
      required: true,
      default: false,
    },
    heroLabel: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    keyPoints: {
      type: [String],
      required: true,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for query speed & reordering sorting operations
ServiceSchema.index({ status: 1 });
ServiceSchema.index({ category: 1 });
ServiceSchema.index({ displayOrder: 1 });

const ServiceModel = mongoose.models.Service || mongoose.model<IService>("Service", ServiceSchema);

export default ServiceModel;
