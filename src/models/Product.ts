import mongoose, { Schema, Document } from "mongoose";

export interface IProductHighlight {
  label: string;
  value: string;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  subtitle?: string;
  category: string;
  shortDescription: string;
  description: string;
  formulation?: string;
  form?: string;
  packaging?: string;
  wellnessFocus?: string;
  usageAdvice?: string;
  keyFocus: string[];
  highlights: IProductHighlight[];
  image: string;
  gallery: string[];
  featured: boolean;
  published: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductHighlightSchema = new Schema<IProductHighlight>(
  {
    label: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true, index: true },
    subtitle: { type: String, trim: true, default: "" },
    category: { type: String, required: true, trim: true, index: true },
    shortDescription: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    formulation: { type: String, trim: true, default: "" },
    form: { type: String, trim: true, default: "" },
    packaging: { type: String, trim: true, default: "" },
    wellnessFocus: { type: String, trim: true, default: "" },
    usageAdvice: { type: String, trim: true, default: "" },
    keyFocus: { type: [String], default: [] },
    highlights: { type: [ProductHighlightSchema], default: [] },
    image: { type: String, required: true, trim: true },
    gallery: { type: [String], default: [] },
    featured: { type: Boolean, default: false, index: true },
    published: { type: Boolean, default: true, index: true },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true }
);

const Product =
  mongoose.models.Product ||
  mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
