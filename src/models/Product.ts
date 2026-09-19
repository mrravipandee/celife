import mongoose, { Schema, Document, Types } from "mongoose";

export interface IProductHighlight {
  label: string;
  value: string;
}

export interface IProductImage {
  url: string;
  alt: string;
  type: string; // "hero" | "front" | "back" | "detail" | "lifestyle" | "main" | "bottle" | "graphic"
  order: number;
}

export interface ICompositionItem {
  ingredient: string;
  quantity?: string; // string quantity representation (e.g. "50 million spores", "100", "eq. to elemental...")
  amount?: number | null; // legacy numeric value
  unit?: string | null;
  group?: string; // e.g. "Active Ingredients", "Vitamins & Minerals"
  note?: string;
  order?: number;
  rdaPercentage?: number | null;
  rdaDisplay?: string; // "#" or "100%", etc.
}

export interface IProductComponent {
  name: string;
  description?: string;
  packSize?: string;
  composition?: ICompositionItem[];
}

export interface IUsageRule {
  ageGroup?: string;
  dosage?: string;
  frequency?: string;
  instructions?: string;
}

export interface IProductNutrition {
  servingSize?: string | null;
  energy?: string | null;
  fat?: string | null;
  protein?: string | null;
  carbohydrates?: string | null;
  excipients?: string | null;
}

export interface IProductSource {
  sourceType?: string;
  sourceReference?: string;
  verified?: boolean;
  verifiedAt?: Date | null;
}

export interface IProductSEO {
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  keywords?: string[];
  ogImage?: string | null;
}

export type ProductStatusType = "draft" | "published" | "archived";

export interface IProduct extends Document {
  name: string;
  slug: string;
  brand: string;
  productType?: string;
  format?: string;
  dosageForm?: string;
  therapeuticDomain?: string;
  subtitle?: string;
  category: string;
  categoryId?: Types.ObjectId | null;
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
  keyFocus: string[];
  highlights: IProductHighlight[];
  productTags: string[];

  // Composition & Nutrition
  composition: ICompositionItem[];
  nutrition?: IProductNutrition;
  otherIngredients: string[];

  // Multi-component support (e.g. Bonigo Combo)
  components?: IProductComponent[];

  // Usage, Administration & Compliance
  recommendedUse?: string;
  recommendedUsage?: string;
  usageInstructions?: string;
  administrationNotes?: string;
  usageRules?: IUsageRule[];
  storageInstructions: string[];

  // Professional Caution & Warnings
  professionalCaution?: string;
  warnings: string[];
  notes?: string;

  // Excipients
  excipientStandard?: string;

  // Gallery (Max 5 images)
  image: string;
  images: IProductImage[];
  gallery: string[];

  // Publishing & Ordering
  status: ProductStatusType;
  published: boolean;
  featured: boolean;
  isFeatured: boolean;
  order: number;
  displayOrder: number;

  // Source / Verification Quality
  source?: IProductSource;
  sourceType?: string;
  sourceNotes?: string;
  contentVerified: boolean;

  // SEO
  seo?: IProductSEO;

  createdAt: Date;
  updatedAt: Date;
}

const ProductHighlightSchema = new Schema<IProductHighlight>(
  {
    label: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const ProductImageSchema = new Schema<IProductImage>(
  {
    url: { type: String, required: true, trim: true },
    alt: { type: String, trim: true, default: "" },
    type: {
      type: String,
      required: true,
      trim: true,
      default: "hero",
    },
    order: { type: Number, required: true, default: 1 },
  },
  { _id: false }
);

const CompositionItemSchema = new Schema<ICompositionItem>(
  {
    ingredient: { type: String, required: true, trim: true },
    quantity: { type: String, trim: true, default: "" },
    amount: { type: Number, default: null },
    unit: { type: String, trim: true, default: "" },
    group: { type: String, trim: true, default: "" },
    note: { type: String, trim: true, default: "" },
    order: { type: Number, default: 0 },
    rdaPercentage: { type: Number, default: null },
    rdaDisplay: { type: String, trim: true, default: "#" },
  },
  { _id: false }
);

const ProductComponentSchema = new Schema<IProductComponent>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: "" },
    packSize: { type: String, trim: true, default: "" },
    composition: { type: [CompositionItemSchema], default: [] },
  },
  { _id: false }
);

const UsageRuleSchema = new Schema<IUsageRule>(
  {
    ageGroup: { type: String, trim: true, default: "" },
    dosage: { type: String, trim: true, default: "" },
    frequency: { type: String, trim: true, default: "" },
    instructions: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const ProductNutritionSchema = new Schema<IProductNutrition>(
  {
    servingSize: { type: String, trim: true, default: null },
    energy: { type: String, trim: true, default: null },
    fat: { type: String, trim: true, default: null },
    protein: { type: String, trim: true, default: null },
    carbohydrates: { type: String, trim: true, default: null },
    excipients: { type: String, trim: true, default: null },
  },
  { _id: false }
);

const ProductSourceSchema = new Schema<IProductSource>(
  {
    sourceType: { type: String, trim: true, default: "Product packaging" },
    sourceReference: { type: String, trim: true, default: "" },
    verified: { type: Boolean, default: false },
    verifiedAt: { type: Date, default: null },
  },
  { _id: false }
);

const ProductSEOSchema = new Schema<IProductSEO>(
  {
    metaTitle: { type: String, trim: true, default: null },
    metaDescription: { type: String, trim: true, default: null },
    canonicalUrl: { type: String, trim: true, default: null },
    keywords: { type: [String], default: [] },
    ogImage: { type: String, trim: true, default: null },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true, index: true },
    brand: { type: String, required: true, trim: true, default: "CELIFE" },
    productType: { type: String, trim: true, default: "Health Supplement" },
    format: { type: String, trim: true, default: "" },
    dosageForm: { type: String, trim: true, default: "" },
    therapeuticDomain: { type: String, trim: true, default: "" },
    subtitle: { type: String, trim: true, default: "" },
    category: { type: String, required: true, trim: true, index: true },
    categoryId: { type: Schema.Types.ObjectId, ref: "ProductCategory", default: null, index: true },
    shortDescription: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    fullDescription: { type: String, trim: true, default: "" },

    // Formulation Information
    aboutFormulation: { type: String, trim: true, default: "" },
    scientificBackground: { type: String, trim: true, default: "" },
    coreRationale: { type: String, trim: true, default: "" },

    // Packaging & Attributes
    packSize: { type: String, trim: true, default: "" },
    flavour: { type: String, trim: true, default: "" },
    netVolume: { type: String, trim: true, default: "" },
    sugarStatement: { type: String, trim: true, default: "" },
    ageStatement: { type: String, trim: true, default: "" },
    productClassification: { type: String, trim: true, default: "" },
    formulation: { type: String, trim: true, default: "" },
    form: { type: String, trim: true, default: "" },
    packaging: { type: String, trim: true, default: "" },
    wellnessFocus: { type: String, trim: true, default: "" },
    usageAdvice: { type: String, trim: true, default: "" },

    // Highlights & Tags
    keyFocus: { type: [String], default: [] },
    highlights: { type: [ProductHighlightSchema], default: [] },
    productTags: { type: [String], default: [] },

    // Composition & Nutrition
    composition: { type: [CompositionItemSchema], default: [] },
    nutrition: { type: ProductNutritionSchema, default: () => ({}) },
    otherIngredients: { type: [String], default: [] },

    // Multi-component Support
    components: { type: [ProductComponentSchema], default: [] },

    // Usage, Administration & Compliance
    recommendedUse: { type: String, trim: true, default: "" },
    recommendedUsage: { type: String, trim: true, default: "" },
    usageInstructions: { type: String, trim: true, default: "" },
    administrationNotes: { type: String, trim: true, default: "" },
    usageRules: { type: [UsageRuleSchema], default: [] },
    storageInstructions: { type: [String], default: [] },

    // Professional Caution & Warnings
    professionalCaution: { type: String, trim: true, default: "" },
    warnings: { type: [String], default: [] },
    notes: { type: String, trim: true, default: "" },

    // Excipient Information
    excipientStandard: { type: String, trim: true, default: "" },

    // Gallery (Max 5 images)
    image: { type: String, required: true, trim: true },
    images: {
      type: [ProductImageSchema],
      default: [],
      validate: [
        (val: IProductImage[]) => val.length <= 5,
        "A product can have a maximum of 5 gallery images",
      ],
    },
    gallery: { type: [String], default: [] },

    // Status, Publishing & Ordering
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "published",
      index: true,
    },
    published: { type: Boolean, default: true, index: true },
    featured: { type: Boolean, default: false, index: true },
    isFeatured: { type: Boolean, default: false, index: true },
    order: { type: Number, default: 0, index: true },
    displayOrder: { type: Number, default: 0, index: true },

    // Verification & Audit Quality
    source: { type: ProductSourceSchema, default: () => ({}) },
    sourceType: { type: String, trim: true, default: "Product packaging" },
    sourceNotes: { type: String, trim: true, default: "" },
    contentVerified: { type: Boolean, default: true },

    // SEO
    seo: { type: ProductSEOSchema, default: () => ({}) },
  },
  { timestamps: true }
);

// Pre-save middleware to keep published <-> status, featured <-> isFeatured, order <-> displayOrder, and recommendedUse <-> recommendedUsage in sync
ProductSchema.pre("save", function (this: IProduct & mongoose.Document) {
  if (this.isModified("status")) {
    this.published = this.status === "published";
  } else if (this.isModified("published")) {
    this.status = this.published ? "published" : "draft";
  }

  if (this.isModified("isFeatured")) {
    this.featured = this.isFeatured;
  } else if (this.isModified("featured")) {
    this.isFeatured = this.featured;
  }

  if (this.isModified("displayOrder")) {
    this.order = this.displayOrder;
  } else if (this.isModified("order")) {
    this.displayOrder = this.order;
  }

  if (this.isModified("recommendedUse") && !this.isModified("recommendedUsage")) {
    this.recommendedUsage = this.recommendedUse;
  } else if (this.isModified("recommendedUsage") && !this.isModified("recommendedUse")) {
    this.recommendedUse = this.recommendedUsage;
  }

  if (this.isModified("source") && this.source) {
    if (this.source.sourceType && !this.isModified("sourceType")) {
      this.sourceType = this.source.sourceType;
    }
    if (this.source.verified !== undefined && !this.isModified("contentVerified")) {
      this.contentVerified = Boolean(this.source.verified);
    }
  }

  // Ensure primary image exists in images array if images is empty
  if (this.image && (!this.images || this.images.length === 0)) {
    this.images = [
      {
        url: this.image,
        alt: `${this.name} packaging`,
        type: "main",
        order: 1,
      },
    ];
  }
});

// Compound indexes for public catalogue, PDP, category filters, and admin queries
ProductSchema.index({ status: 1, isFeatured: 1, displayOrder: 1, createdAt: -1 });
ProductSchema.index({ status: 1, category: 1, displayOrder: 1, createdAt: -1 });
ProductSchema.index({ categoryId: 1, status: 1 });

if (mongoose.models && mongoose.models.Product) {
  if (
    !mongoose.models.Product.schema.paths["composition"] ||
    !mongoose.models.Product.schema.paths["components"]
  ) {
    delete (mongoose.models as Record<string, unknown>).Product;
  }
}

const Product =
  mongoose.models.Product ||
  mongoose.model<IProduct>("Product", ProductSchema);

export default Product;

