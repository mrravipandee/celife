import { z } from "zod";

export const categoryCreateSchema = z.object({
  name: z.string().trim().min(2, "Category name must be at least 2 characters").max(60),
  slug: z
    .string()
    .trim()
    .min(2, "Slug must be at least 2 characters")
    .max(60)
    .regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase alphanumeric characters and hyphens"),
  tagline: z.string().trim().max(150).optional().default(""),
  description: z.string().trim().max(500).optional().default(""),
  order: z.number().int().default(0),
  archived: z.boolean().default(false),
});

export const categoryUpdateSchema = categoryCreateSchema.partial();

export type CategoryCreateInput = z.infer<typeof categoryCreateSchema>;
export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>;
