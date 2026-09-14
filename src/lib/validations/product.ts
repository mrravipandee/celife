import { z } from "zod";

const highlightSchema = z.object({
  label: z.string().trim().min(1, "Highlight label is required"),
  value: z.string().trim().min(1, "Highlight value is required"),
});

export const productCreateSchema = z.object({
  name: z.string().trim().min(2, "Product name must be at least 2 characters").max(100),
  slug: z
    .string()
    .trim()
    .min(2, "Slug must be at least 2 characters")
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase alphanumeric characters and hyphens"),
  subtitle: z.string().trim().max(150).optional().default(""),
  category: z.string().trim().min(1, "Category is required"),
  shortDescription: z.string().trim().min(10, "Short description must be at least 10 characters").max(300),
  description: z.string().trim().min(20, "Full description must be at least 20 characters"),
  formulation: z.string().trim().max(200).optional().default(""),
  form: z.string().trim().max(100).optional().default(""),
  packaging: z.string().trim().max(100).optional().default(""),
  wellnessFocus: z.string().trim().max(200).optional().default(""),
  usageAdvice: z.string().trim().max(300).optional().default(""),
  keyFocus: z.array(z.string().trim()).default([]),
  highlights: z.array(highlightSchema).default([]),
  image: z.string().trim().min(1, "Product image is required"),
  gallery: z.array(z.string().trim()).default([]),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  order: z.number().int().default(0),
});

export const productUpdateSchema = productCreateSchema.partial();

export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;
