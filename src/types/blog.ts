export const BLOG_STATUSES = ["draft", "published", "archived"] as const;
export type BlogStatus = (typeof BLOG_STATUSES)[number];

export const BLOG_CATEGORIES = [
  "Hospitality",
  "Hotels",
  "Restaurants",
  "Operations",
  "Finance",
  "Marketing",
  "Staffing",
  "Food & Beverage",
  "Business Strategy",
  "Industry Insights",
] as const;
export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export interface IBlogCoverImage {
  url: string;
  alt: string;
  publicId?: string;
}

export interface IBlogAuthor {
  name: string;
  id?: string;
}

export interface IBlogSEO {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
}

export interface BackendBlog {
  id?: string;
  _id?: { toString(): string };
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: IBlogCoverImage;
  category: string;
  tags?: string[];
  author?: IBlogAuthor;
  status: string;
  publishedAt?: string;
  readTime: number;
  seo?: IBlogSEO;
  createdAt: string;
  updatedAt: string;
}

