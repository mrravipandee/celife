export interface ProductHighlight {
  label: string;
  value: string;
}

export type ProductImageType =
  | "hero"
  | "front"
  | "back"
  | "detail"
  | "lifestyle"
  | "main"
  | "bottle"
  | "graphic";

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
  quantity?: string; // string quantity representation (e.g. "50 million spores", "100", "eq. to elemental...")
  amount?: number | null; // legacy numeric value
  unit?: string | null;
  group?: string; // e.g. "Active Ingredients", "Vitamins & Minerals"
  note?: string;
  order?: number;
  rdaPercentage?: number | null;
  rdaDisplay?: string; // Supports "100%", "#", etc.
  standardisedTo?: string;
  category?: string;
}

export interface ProductComponent {
  name: string;
  description?: string;
  packSize?: string;
  composition?: CompositionItem[];
}

export interface UsageRule {
  ageGroup?: string;
  dosage?: string;
  frequency?: string;
  instructions?: string;
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

export interface ProductSource {
  sourceType?: string;
  sourceReference?: string;
  verified?: boolean;
  verifiedAt?: string | Date | null;
}

export interface ProductSEO {
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  keywords?: string[];
  ogImage?: string | null;
}

export type ProductStatus = "draft" | "published" | "archived";

export interface Product {
  id: string;
  _id?: string;
  slug: string;
  name: string;
  brand?: string;
  productType?: string;
  format?: string;
  dosageForm?: string;
  therapeuticDomain?: string;
  subtitle?: string;
  category: string;
  categoryId?: string | null;
  shortDescription: string;
  description: string;
  fullDescription?: string;

  // Formulation Information
  aboutFormulation?: string;
  scientificBackground?: string;
  coreRationale?: string;

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

  // Multi-component Support (e.g. Bonigo Combo)
  components?: ProductComponent[];

  // Directions & Compliance
  recommendedUse?: string;
  recommendedUsage?: string;
  usageInstructions?: string;
  administrationNotes?: string;
  usageRules?: UsageRule[];
  storageInstructions?: string[];

  // Professional Caution & Warnings
  professionalCaution?: string;
  warnings?: string[];
  notes?: string;

  // Excipients
  excipientStandard?: string;

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
  source?: ProductSource;
  sourceType?: string;
  sourceNotes?: string;
  contentVerified?: boolean;

  // SEO
  seo?: ProductSEO;

  createdAt?: string | Date;
  updatedAt?: string | Date;
}


