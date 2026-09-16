import { z } from "zod";

const highlightSchema = z.object({
  label: z.string().trim().min(1, "Highlight label is required"),
  value: z.string().trim().min(1, "Highlight value is required"),
});

export const productImageSchema = z.object({
  url: z.string().trim().min(1, "Image URL is required"),
  alt: z.string().trim().min(1, "Image alt text is required"),
  type: z.enum(["main", "front", "back", "bottle", "graphic"]).or(z.string().trim()),
  order: z.number().int().min(1).max(5),
});

export const compositionItemSchema = z.object({
  ingredient: z.string().trim().min(1, "Ingredient name is required"),
  amount: z.number().nullable().optional(),
  unit: z.string().trim().nullable().optional(),
  rdaPercentage: z.number().nullable().optional(),
  rdaDisplay: z.string().trim().min(1, "RDA display value is required"), // Allows "#", "100%", etc.
});

export const nutritionSchema = z.object({
  servingSize: z.string().trim().nullable().optional(),
  energy: z.string().trim().nullable().optional(),
  fat: z.string().trim().nullable().optional(),
  protein: z.string().trim().nullable().optional(),
  carbohydrates: z.string().trim().nullable().optional(),
  excipients: z.string().trim().nullable().optional(),
});

export const productSEOSchema = z.object({
  metaTitle: z.string().trim().nullable().optional(),
  metaDescription: z.string().trim().nullable().optional(),
  ogImage: z.string().trim().nullable().optional(),
});

export const productCreateSchema = z.object({
  name: z.string().trim().min(2, "Product name must be at least 2 characters").max(100),
  slug: z
    .string()
    .trim()
    .min(2, "Slug must be at least 2 characters")
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase alphanumeric characters and hyphens"),
  brand: z.string().trim().max(100).optional().default("CELIFE"),
  productType: z.string().trim().max(150).optional().default("Health Supplement"),
  subtitle: z.string().trim().max(150).optional().default(""),
  category: z.string().trim().min(1, "Category is required"),
  categoryId: z.string().trim().nullable().optional(),
  shortDescription: z.string().trim().min(10, "Short description must be at least 10 characters").max(500),
  description: z.string().trim().min(20, "Full description must be at least 20 characters"),
  fullDescription: z.string().trim().optional().default(""),

  // Packaging & Attributes
  packSize: z.string().trim().max(100).optional().default(""),
  flavour: z.string().trim().max(100).optional().default(""),
  netVolume: z.string().trim().max(100).optional().default(""),
  sugarStatement: z.string().trim().max(100).optional().default(""),
  ageStatement: z.string().trim().max(150).optional().default(""),
  productClassification: z.string().trim().max(150).optional().default(""),
  formulation: z.string().trim().max(250).optional().default(""),
  form: z.string().trim().max(100).optional().default(""),
  packaging: z.string().trim().max(150).optional().default(""),
  wellnessFocus: z.string().trim().max(250).optional().default(""),
  usageAdvice: z.string().trim().max(500).optional().default(""),

  // Highlights & Tags
  keyFocus: z.array(z.string().trim()).default([]),
  highlights: z.array(highlightSchema).default([]),
  productTags: z.array(z.string().trim()).default([]),

  // Composition & Nutrition
  composition: z.array(compositionItemSchema).default([]),
  nutrition: nutritionSchema.optional().default({}),
  otherIngredients: z.array(z.string().trim()).default([]),

  // Directions, Storage & Warnings
  recommendedUsage: z.string().trim().max(500).optional().default(""),
  storageInstructions: z.array(z.string().trim()).default([]),
  warnings: z.array(z.string().trim()).default([]),

  // Images (Max 5)
  image: z.string().trim().min(1, "Product image is required"),
  images: z.array(productImageSchema).max(5, "Maximum 5 gallery images allowed").default([]),
  gallery: z.array(z.string().trim()).default([]),

  // Publishing & Ordering
  status: z.enum(["draft", "published", "archived"]).default("published"),
  published: z.boolean().default(true),
  featured: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  order: z.number().int().default(0),
  displayOrder: z.number().int().default(0),

  // Source & Verification Quality
  sourceType: z.string().trim().optional().default("Product packaging"),
  sourceNotes: z.string().trim().optional().default(""),
  contentVerified: z.boolean().default(true),

  // SEO
  seo: productSEOSchema.optional().default({}),
});

export const productUpdateSchema = productCreateSchema.partial();

export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;

