import mongoose, { Schema, Document } from "mongoose";
import {
  BLOG_STATUSES,
  BLOG_CATEGORIES,
  type BlogStatus,
  type BlogCategory,
  type IBlogCoverImage,
  type IBlogAuthor,
  type IBlogSEO,
} from "@/types/blog";

export interface IBlog extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: IBlogCoverImage;
  category: BlogCategory;
  tags: string[];
  author: IBlogAuthor;
  status: BlogStatus;
  publishedAt?: Date;
  readTime: number;
  seo?: IBlogSEO;
  createdAt: Date;
  updatedAt: Date;
}

const CoverImageSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
    alt: {
      type: String,
      required: true,
      trim: true,
    },
    publicId: {
      type: String,
      required: false,
      trim: true,
    },
  },
  { _id: false }
);

const AuthorSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    id: {
      type: String,
      required: false,
      trim: true,
    },
  },
  { _id: false }
);

const SEOSchema = new Schema(
  {
    metaTitle: {
      type: String,
      required: false,
      trim: true,
      maxlength: 60,
    },
    metaDescription: {
      type: String,
      required: false,
      trim: true,
      maxlength: 160,
    },
    keywords: {
      type: [String],
      required: false,
      default: [],
    },
    canonicalUrl: {
      type: String,
      required: false,
      trim: true,
    },
    ogImage: {
      type: String,
      required: false,
      trim: true,
    },
  },
  { _id: false }
);

const BlogSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 200,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 220,
    },
    excerpt: {
      type: String,
      required: true,
      trim: true,
      minlength: 20,
      maxlength: 500,
    },
    content: {
      type: String,
      required: true,
      minlength: 50,
      maxlength: 100000,
    },
    coverImage: {
      type: CoverImageSchema,
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      enum: BLOG_CATEGORIES,
    },
    tags: {
      type: [String],
      required: false,
      default: [],
    },
    author: {
      type: AuthorSchema,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: BLOG_STATUSES,
      default: "draft",
    },
    publishedAt: {
      type: Date,
      required: false,
    },
    readTime: {
      type: Number,
      required: true,
      min: 1,
      max: 120,
    },
    seo: {
      type: SEOSchema,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Optimize sorting, status, category, and slug lookups
BlogSchema.index({ status: 1 });
BlogSchema.index({ publishedAt: -1 });
BlogSchema.index({ category: 1 });

const Blog = mongoose.models.Blog || mongoose.model<IBlog>("Blog", BlogSchema);

export default Blog;
