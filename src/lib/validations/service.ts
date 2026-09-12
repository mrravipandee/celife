import { z } from "zod";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const createServiceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Service name is required." })
    .max(150, { message: "Service name cannot exceed 150 characters." }),
  slug: z
    .string()
    .trim()
    .lowercase()
    .max(200, { message: "Slug cannot exceed 200 characters." })
    .regex(slugRegex, {
      message: "Slug must be URL-safe (lowercase letters, numbers, and hyphens only).",
    }),
  shortDescription: z
    .string()
    .trim()
    .min(1, { message: "Short description is required." })
    .max(500, { message: "Short description cannot exceed 500 characters." }),
  category: z
    .string()
    .trim()
    .min(1, { message: "Category is required." }),
  displayOrder: z
    .number()
    .int()
    .positive({ message: "Display order must be a positive integer." }),
  status: z
    .enum(["active", "draft", "hidden"], {
      message: "Invalid status value.",
    })
    .optional(),
  featured: z
    .boolean()
    .optional()
    .default(false),
  heroLabel: z
    .string()
    .trim()
    .min(1, { message: "Hero label is required." })
    .max(100, { message: "Hero label cannot exceed 100 characters." }),
  description: z
    .string()
    .trim()
    .min(1, { message: "Full description is required." })
    .max(2000, { message: "Full description cannot exceed 2000 characters." }),
  keyPoints: z
    .array(z.string().trim())
    .max(15, { message: "You can specify at most 15 key points." })
    .optional()
    .default([]),
}).strict();

export const updateServiceSchema = createServiceSchema.partial();

export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
