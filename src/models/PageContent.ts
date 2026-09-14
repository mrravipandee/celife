import mongoose, { Schema, Document } from "mongoose";

export interface IPageSEO {
  metaTitle?: string;
  metaDescription?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
}

export interface IPageContent extends Document {
  pageKey: string;
  sections: Record<string, unknown>;
  seo?: IPageSEO;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SEOSchema = new Schema<IPageSEO>(
  {
    metaTitle: { type: String, trim: true, default: "" },
    metaDescription: { type: String, trim: true, default: "" },
    ogTitle: { type: String, trim: true, default: "" },
    ogDescription: { type: String, trim: true, default: "" },
    ogImage: { type: String, trim: true, default: "" },
    canonicalUrl: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const PageContentSchema = new Schema<IPageContent>(
  {
    pageKey: { type: String, required: true, unique: true, trim: true, index: true },
    sections: { type: Schema.Types.Mixed, default: {} },
    seo: { type: SEOSchema, default: () => ({}) },
    published: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

const PageContent =
  mongoose.models.PageContent ||
  mongoose.model<IPageContent>("PageContent", PageContentSchema);

export default PageContent;
