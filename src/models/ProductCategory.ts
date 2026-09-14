import mongoose, { Schema, Document } from "mongoose";

export interface IProductCategory extends Document {
  name: string;
  slug: string;
  tagline?: string;
  description?: string;
  order: number;
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductCategorySchema = new Schema<IProductCategory>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true, index: true },
    tagline: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
    order: { type: Number, default: 0, index: true },
    archived: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

const ProductCategory =
  mongoose.models.ProductCategory ||
  mongoose.model<IProductCategory>("ProductCategory", ProductCategorySchema);

export default ProductCategory;
