import { z } from "zod";
import { BLOG_STATUSES, BLOG_CATEGORIES } from "@/types/blog";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const seoSchema = z.object({
  metaTitle: z
    .string()
    .trim()
    .max(60, { message: "Meta title cannot exceed 60 characters." })
    .optional()
    .or(z.literal("")),
  metaDescription: z
    .string()
    .trim()
    .max(160, { message: "Meta description cannot exceed 160 characters." })
    .optional()
    .or(z.literal("")),
  keywords: z
    .array(z.string().trim())
    .max(20, { message: "You can specify at most 20 keywords." })
    .optional()
    .default([]),
  canonicalUrl: z
    .string()
    .url({ message: "Canonical URL must be a valid URL." })
    .optional()
    .or(z.literal("")),
  ogImage: z
    .string()
    .url({ message: "OG Image must be a valid URL." })
    .optional()
    .or(z.literal("")),
}).strict();

export const createBlogSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, { message: "Title must be at least 5 characters." })
    .max(200, { message: "Title cannot exceed 200 characters." }),
  slug: z
    .string()
    .trim()
    .lowercase()
    .max(220, { message: "Slug cannot exceed 220 characters." })
    .regex(slugRegex, {
      message: "Slug must be URL-safe (lowercase letters, numbers, and hyphens only, no spaces or consecutive hyphens).",
    }),
  excerpt: z
    .string()
    .trim()
    .min(20, { message: "Excerpt must be at least 20 characters." })
    .max(500, { message: "Excerpt cannot exceed 500 characters." }),
  content: z
    .string()
    .min(50, { message: "Content must be at least 50 characters." })
    .max(100000, { message: "Content cannot exceed 100,000 characters." }),
  coverImage: z.object({
    url: z
      .string()
      .trim()
      .min(1, { message: "Cover image URL is required." })
      .refine(
        (val) =>
          val.startsWith("/") ||
          val.startsWith("http://") ||
          val.startsWith("https://"),
        { message: "Cover image must be a valid URL or path." }
      ),
    alt: z.string().trim().min(1, { message: "Alt text is required for the cover image." }),
    publicId: z.string().trim().optional(),
  }).strict(),
  category: z.enum(BLOG_CATEGORIES, {
    message: "Please select a valid blog category.",
  }),
  tags: z
    .array(
      z
        .string()
        .trim()
        .lowercase()
        .max(50, { message: "Tag cannot exceed 50 characters." })
    )
    .max(10, { message: "You can specify at most 10 tags." })
    .optional()
    .default([]),
  author: z.object({
    name: z
      .string()
      .trim()
      .min(1, { message: "Author name is required." })
      .max(100, { message: "Author name cannot exceed 100 characters." }),
    id: z.string().trim().optional(),
  }).strict(),
  status: z
    .enum(BLOG_STATUSES, {
      message: "Invalid status value.",
    })
    .optional(),
  publishedAt: z
    .preprocess(
      (val) => (val ? new Date(val as string) : undefined),
      z.date().optional()
    )
    .optional(),
  readTime: z
    .number()
    .int({ message: "Read time must be an integer." })
    .min(1, { message: "Read time must be at least 1 minute." })
    .max(120, { message: "Read time cannot exceed 120 minutes." }),
  seo: seoSchema.optional(),
}).strict();

export const updateBlogSchema = createBlogSchema.partial();

export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;
