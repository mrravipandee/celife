export interface ProductHighlight {
  label: string;
  value: string;
}

export type ProductImageType = "main" | "front" | "back" | "bottle" | "graphic";

export interface ProductImage {
  url: string;
  alt: string;
  type: ProductImageType | string;
  order: number;
  isPrimary?: boolean;
  altText?: string;
  sortOrder?: number;
}

export interface CompositionItem {
  ingredient: string;
  amount?: number | null;
  unit?: string | null;
  rdaPercentage?: number | null;
  rdaDisplay: string; // Supports "100%", "#", etc.
  quantity?: string;
  standardisedTo?: string;
  category?: string;
}

export interface ProductNutrition {
  servingSize?: string | null;
  energy?: string | null;
  fat?: string | null;
  protein?: string | null;
  carbohydrates?: string | null;
  excipients?: string | null;
  totalSugars?: string | null;
  addedSugars?: string | null;
  sodium?: string | null;
  servingsPerContainer?: string | null;
}

export interface ProductSEO {
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogImage?: string | null;
  keywords?: string[];
}

export type ProductStatus = "draft" | "published" | "archived";

export interface Product {
  id: string;
  _id?: string;
  slug: string;
  name: string;
  brand?: string;
  productType?: string;
  subtitle?: string;
  category: string;
  categoryId?: string | null;
  shortDescription: string;
  description: string;
  fullDescription?: string;

  // Packaging & Attributes
  packSize?: string;
  flavour?: string;
  netVolume?: string;
  sugarStatement?: string;
  ageStatement?: string;
  productClassification?: string;
  formulation?: string;
  form?: string;
  packaging?: string;
  wellnessFocus?: string;
  usageAdvice?: string;

  // Highlights & Tags
  keyFocus?: string[];
  highlights?: ProductHighlight[];
  specs?: Array<{ label: string; value: string }>;
  productTags?: string[];

  // Composition & Nutrition
  composition?: CompositionItem[];
  nutrition?: ProductNutrition;
  otherIngredients?: string[];

  // Directions & Compliance
  recommendedUsage?: string;
  storageInstructions?: string[];
  warnings?: string[];

  // Gallery (Up to 5 images)
  image: string;
  images?: ProductImage[];
  gallery?: string[];

  // Publishing & Ordering
  status?: ProductStatus;
  published?: boolean;
  featured?: boolean;
  isFeatured?: boolean;
  order?: number;
  displayOrder?: number;

  // Source & Verification Quality
  sourceType?: string;
  sourceNotes?: string;
  contentVerified?: boolean;

  // SEO
  seo?: ProductSEO;

  createdAt?: string | Date;
  updatedAt?: string | Date;
}

