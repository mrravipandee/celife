import mongoose, { Schema, Document, Types } from "mongoose";

export interface IProductHighlight {
  label: string;
  value: string;
}

export interface IProductImage {
  url: string;
  alt: string;
  type: string; // "main" | "front" | "back" | "bottle" | "graphic"
  order: number;
}

export interface ICompositionItem {
  ingredient: string;
  amount?: number | null;
  unit?: string | null;
  rdaPercentage?: number | null;
  rdaDisplay: string; // "#" or "100%", etc.
}

export interface IProductNutrition {
  servingSize?: string | null;
  energy?: string | null;
  fat?: string | null;
  protein?: string | null;
  carbohydrates?: string | null;
  excipients?: string | null;
}

export interface IProductSEO {
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogImage?: string | null;
}

export type ProductStatusType = "draft" | "published" | "archived";

export interface IProduct extends Document {
  name: string;
  slug: string;
  brand: string;
  productType?: string;
  subtitle?: string;
  category: string;
  categoryId?: Types.ObjectId | null;
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
  keyFocus: string[];
  highlights: IProductHighlight[];
  productTags: string[];

  // Composition & Nutrition
  composition: ICompositionItem[];
  nutrition?: IProductNutrition;
  otherIngredients: string[];

  // Usage, Storage, Warnings
  recommendedUsage?: string;
  storageInstructions: string[];
  warnings: string[];

  // 5 Gallery Images
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
    alt: { type: String, required: true, trim: true },
    type: {
      type: String,
      required: true,
      trim: true,
      default: "main",
    },
    order: { type: Number, required: true, default: 1 },
  },
  { _id: false }
);

const CompositionItemSchema = new Schema<ICompositionItem>(
  {
    ingredient: { type: String, required: true, trim: true },
    amount: { type: Number, default: null },
    unit: { type: String, trim: true, default: null },
    rdaPercentage: { type: Number, default: null },
    rdaDisplay: { type: String, required: true, trim: true, default: "#" },
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

const ProductSEOSchema = new Schema<IProductSEO>(
  {
    metaTitle: { type: String, trim: true, default: null },
    metaDescription: { type: String, trim: true, default: null },
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
    subtitle: { type: String, trim: true, default: "" },
    category: { type: String, required: true, trim: true, index: true },
    categoryId: { type: Schema.Types.ObjectId, ref: "ProductCategory", default: null, index: true },
    shortDescription: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    fullDescription: { type: String, trim: true, default: "" },

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

    // Directions, Storage & Warnings
    recommendedUsage: { type: String, trim: true, default: "" },
    storageInstructions: { type: [String], default: [] },
    warnings: { type: [String], default: [] },

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
    sourceType: { type: String, trim: true, default: "Product packaging" },
    sourceNotes: { type: String, trim: true, default: "" },
    contentVerified: { type: Boolean, default: true },

    // SEO
    seo: { type: ProductSEOSchema, default: () => ({}) },
  },
  { timestamps: true }
);

// Pre-save middleware to keep published <-> status, featured <-> isFeatured, order <-> displayOrder in sync
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
  if (!mongoose.models.Product.schema.paths["composition"]) {
    delete (mongoose.models as Record<string, unknown>).Product;
  }
}

const Product =
  mongoose.models.Product ||
  mongoose.model<IProduct>("Product", ProductSchema);

export default Product;

