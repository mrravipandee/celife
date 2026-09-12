import { z } from "zod";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const createProjectSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: "Project title is required." })
    .max(150, { message: "Project title cannot exceed 150 characters." }),
  slug: z
    .string()
    .trim()
    .lowercase()
    .max(200, { message: "Slug cannot exceed 200 characters." })
    .regex(slugRegex, {
      message: "Slug must be URL-safe (lowercase letters, numbers, and hyphens only).",
    }),
  description: z
    .string()
    .trim()
    .min(1, { message: "Full description is required." })
    .max(2000, { message: "Full description cannot exceed 2000 characters." }),
  category: z
    .string()
    .trim()
    .min(1, { message: "Category is required." }),
  location: z
    .string()
    .trim()
    .min(1, { message: "Location is required." }),
  coverImage: z
    .string()
    .trim()
    .min(1, { message: "Cover image is required." }),
  gallery: z
    .array(z.string().trim())
    .max(20, { message: "You can specify at most 20 gallery images." })
    .optional()
    .default([]),
  year: z
    .number()
    .int()
    .positive({ message: "Year must be a positive integer." }),
  services: z
    .array(z.string().trim())
    .max(15, { message: "You can specify at most 15 services." })
    .optional()
    .default([]),
  featured: z
    .boolean()
    .optional()
    .default(false),
}).strict();

export const updateProjectSchema = createProjectSchema.partial();

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
