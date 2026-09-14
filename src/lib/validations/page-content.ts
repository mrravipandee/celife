import { z } from "zod";

const seoSchema = z.object({
  metaTitle: z.string().trim().max(120).optional().default(""),
  metaDescription: z.string().trim().max(300).optional().default(""),
  ogTitle: z.string().trim().max(120).optional().default(""),
  ogDescription: z.string().trim().max(300).optional().default(""),
  ogImage: z.string().trim().optional().default(""),
  canonicalUrl: z.string().trim().optional().default(""),
});

export const pageContentUpdateSchema = z.object({
  sections: z.record(z.string(), z.any()),
  seo: seoSchema.optional(),
  published: z.boolean().optional().default(true),
});

export type PageContentUpdateInput = z.infer<typeof pageContentUpdateSchema>;
