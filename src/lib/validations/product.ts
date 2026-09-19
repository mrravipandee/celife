import { z } from "zod";

const highlightSchema = z.object({
  label: z.string().trim().min(1, "Highlight label is required"),
  value: z.string().trim().min(1, "Highlight value is required"),
});

export const productImageSchema = z.object({
  url: z.string().trim().min(1, "Image URL is required"),
  alt: z.string().trim().optional().default(""),
  type: z
    .enum(["hero", "front", "back", "detail", "lifestyle", "main", "bottle", "graphic"])
    .or(z.string().trim())
    .default("hero"),
  order: z.number().int().min(1).max(5).default(1),
});

export const compositionItemSchema = z.object({
  ingredient: z.string().trim().min(1, "Ingredient name is required"),
  quantity: z.string().trim().optional().default(""),
  amount: z.number().nullable().optional(),
  unit: z.string().trim().nullable().optional().default(""),
  group: z.string().trim().optional().default(""),
  note: z.string().trim().optional().default(""),
  order: z.number().int().optional().default(0),
  rdaPercentage: z.number().nullable().optional(),
  rdaDisplay: z.string().trim().optional().default("#"),
  standardisedTo: z.string().trim().optional().default(""),
  category: z.string().trim().optional().default(""),
});

export const usageRuleSchema = z.object({
  ageGroup: z.string().trim().optional().default(""),
  dosage: z.string().trim().optional().default(""),
  frequency: z.string().trim().optional().default(""),
  instructions: z.string().trim().optional().default(""),
});

export const productComponentSchema = z.object({
  name: z.string().trim().min(1, "Component name is required"),
  description: z.string().trim().optional().default(""),
  packSize: z.string().trim().optional().default(""),
  composition: z.array(compositionItemSchema).optional().default([]),
});

export const nutritionSchema = z.object({
  servingSize: z.string().trim().nullable().optional(),
  energy: z.string().trim().nullable().optional(),
  fat: z.string().trim().nullable().optional(),
  protein: z.string().trim().nullable().optional(),
  carbohydrates: z.string().trim().nullable().optional(),
  excipients: z.string().trim().nullable().optional(),
  totalSugars: z.string().trim().nullable().optional(),
  addedSugars: z.string().trim().nullable().optional(),
  sodium: z.string().trim().nullable().optional(),
  servingsPerContainer: z.string().trim().nullable().optional(),
});

export const productSourceSchema = z.object({
  sourceType: z.string().trim().optional(),
  sourceReference: z.string().trim().optional(),
  verified: z.boolean().optional(),
  verifiedAt: z.union([z.string(), z.date()]).nullable().optional(),
});

export const productSEOSchema = z.object({
  metaTitle: z.string().trim().nullable().optional(),
  metaDescription: z.string().trim().nullable().optional(),
  canonicalUrl: z.string().trim().nullable().optional(),
  keywords: z.array(z.string().trim()).optional(),
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
  format: z.string().trim().max(100).optional().default(""),
  dosageForm: z.string().trim().max(100).optional().default(""),
  therapeuticDomain: z.string().trim().max(150).optional().default(""),
  subtitle: z.string().trim().max(150).optional().default(""),
  category: z.string().trim().min(1, "Category is required"),
  categoryId: z.string().trim().nullable().optional(),
  shortDescription: z.string().trim().min(10, "Short description must be at least 10 characters").max(500),
  description: z.string().trim().min(20, "Full description must be at least 20 characters"),
  fullDescription: z.string().trim().optional().default(""),

  // Formulation Information
  aboutFormulation: z.string().trim().optional().default(""),
  scientificBackground: z.string().trim().optional().default(""),
  coreRationale: z.string().trim().optional().default(""),

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

  // Multi-component Support (e.g. Bonigo Combo)
  components: z.array(productComponentSchema).optional().default([]),

  // Directions, Usage & Warnings
  recommendedUse: z.string().trim().max(500).optional().default(""),
  recommendedUsage: z.string().trim().max(500).optional().default(""),
  usageInstructions: z.string().trim().optional().default(""),
  administrationNotes: z.string().trim().optional().default(""),
  usageRules: z.array(usageRuleSchema).optional().default([]),
  storageInstructions: z
    .union([z.string().trim().transform((s) => (s ? [s] : [])), z.array(z.string().trim())])
    .default([]),
  warnings: z
    .union([z.string().trim().transform((s) => (s ? [s] : [])), z.array(z.string().trim())])
    .default([]),
  professionalCaution: z.string().trim().optional().default(""),
  notes: z.string().trim().optional().default(""),

  // Excipients
  excipientStandard: z.string().trim().max(200).optional().default(""),

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
  source: productSourceSchema.optional().default({}),
  sourceType: z.string().trim().optional().default("Product packaging"),
  sourceNotes: z.string().trim().optional().default(""),
  contentVerified: z.boolean().default(true),

  // SEO
  seo: productSEOSchema.optional().default({}),
});

export const productUpdateSchema = productCreateSchema.partial();

export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;


