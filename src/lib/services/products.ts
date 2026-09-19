import { cache } from "react";
import { connectToDatabase } from "@/lib/mongodb";
import Product, { IProduct } from "@/models/Product";
import ProductCategory, { IProductCategory } from "@/models/ProductCategory";
import { productsData } from "@/data/products";
import { Product as ProductType } from "@/types/product";

export const VITAFIV_PRODUCT: ProductType = {
  id: "prod-vitafiv",
  slug: "vitafiv-syrup",
  name: "VITAFIV Syrup",
  brand: "CELIFE",
  productType: "Health Supplement / Multivitamin & Mineral Syrup",
  subtitle: "Calibrated Multivitamin & Mineral Daily Health Supplement",
  category: "Health Supplement",
  shortDescription:
    "A balanced multivitamin and mineral formulation in delicious chocolate flavour with no added sugar, designed for daily metabolic and vitality support.",
  description:
    "VITAFIV Syrup is an evidence-informed health supplement developed by Celife Health Solutions. Formulated with a comprehensive spectrum of essential bioactive vitamins, amino acids, and vital trace minerals in an enjoyable chocolate flavour with no added sugar, it delivers calibrated micronutrition for individuals above the age of five years.",
  fullDescription:
    "VITAFIV Syrup is an evidence-informed health supplement developed by Celife Health Solutions. Formulated with a comprehensive spectrum of essential bioactive vitamins, amino acids, and vital trace minerals in an enjoyable chocolate flavour with no added sugar, it delivers calibrated micronutrition for individuals above the age of five years.",
  packSize: "200 ml",
  flavour: "Chocolate Flavour",
  netVolume: "200 ml",
  sugarStatement: "No Added Sugar",
  ageStatement: "Product use for above the age of five years.",
  productClassification: "Health Supplement, Not For Medicinal Use",
  form: "Oral Liquid Syrup",
  packaging: "Amber Glass Bottle of 200 ml with Outer Carton",
  wellnessFocus: "Metabolic vitality, immune defense, and micronutrient sufficiency",
  usageAdvice: "1–2 teaspoonful twice a day or as directed by Dietician or Doctor.",
  recommendedUsage: "1–2 teaspoonful twice a day or as directed by Dietician or Doctor.",
  keyFocus: [
    "25 calibrated vitamins, minerals & co-factors",
    "No added sugar formulation",
    "Delicious chocolate taste profile",
    "Suitable for ages 5 and above",
  ],
  highlights: [
    { label: "Category", value: "Health Supplement" },
    { label: "Pack Size", value: "200 ml" },
    { label: "Flavour", value: "Chocolate Flavour" },
    { label: "Sugar Statement", value: "No Added Sugar" },
    { label: "Product Class", value: "Multivitamin & Mineral Syrup" },
  ],
  composition: [
    { ingredient: "Lysine Hydrochloride", amount: 5, unit: "mg", rdaPercentage: null, rdaDisplay: "#" },
    { ingredient: "Vitamin A (Acetate)", amount: 1320, unit: "IU", rdaPercentage: 66, rdaDisplay: "66%" },
    { ingredient: "Vitamin B1 (Thiamine)", amount: 0.6, unit: "mg", rdaPercentage: 43, rdaDisplay: "43%" },
    { ingredient: "Vitamin B2 (Riboflavin)", amount: 0.6, unit: "mg", rdaPercentage: 40, rdaDisplay: "40%" },
    { ingredient: "Vitamin B3 (Niacinamide)", amount: 8, unit: "mg", rdaPercentage: 44, rdaDisplay: "44%" },
    { ingredient: "Vitamin B5 (Pantothenic acid)", amount: 3, unit: "mg", rdaPercentage: 60, rdaDisplay: "60%" },
    { ingredient: "Vitamin B6 (Pyridoxine)", amount: 0.6, unit: "mg", rdaPercentage: 30, rdaDisplay: "30%" },
    { ingredient: "Vitamin B7 (Biotin)", amount: 10, unit: "mcg", rdaPercentage: 33, rdaDisplay: "33%" },
    { ingredient: "Vitamin B9 (Folic Acid)", amount: 200, unit: "mcg", rdaPercentage: 50, rdaDisplay: "50%" },
    { ingredient: "Vitamin B12 (Cyanocobalamin)", amount: 1.5, unit: "mcg", rdaPercentage: 100, rdaDisplay: "100%" },
    { ingredient: "Vitamin C (Ascorbic Acid)", amount: 25, unit: "mg", rdaPercentage: 63, rdaDisplay: "63%" },
    { ingredient: "Vitamin D3 (Lichen)", amount: 10, unit: "mcg", rdaPercentage: 100, rdaDisplay: "100%" },
    { ingredient: "Vitamin E5 (Acetate)", amount: 2.5, unit: "IU", rdaPercentage: 10, rdaDisplay: "10%" },
    { ingredient: "Vitamin K2 (Menaquinone)", amount: 55, unit: "mcg", rdaPercentage: 100, rdaDisplay: "100%" },
    { ingredient: "Copper Sulphate (Elemental)", amount: 100, unit: "mcg", rdaPercentage: 6, rdaDisplay: "6%" },
    { ingredient: "Iodine Potassium (Elemental)", amount: 50, unit: "mcg", rdaPercentage: 25, rdaDisplay: "25%" },
    { ingredient: "Ferrous Fumarate", amount: 5, unit: "mg", rdaPercentage: 33, rdaDisplay: "33%" },
    { ingredient: "Magnesium", amount: 80, unit: "mg", rdaPercentage: 24, rdaDisplay: "24%" },
    { ingredient: "Manganese", amount: 1.5, unit: "mg", rdaPercentage: 38, rdaDisplay: "38%" },
    { ingredient: "Phosphorus", amount: 50, unit: "mg", rdaPercentage: null, rdaDisplay: "#" },
    { ingredient: "Potassium", amount: 3.8, unit: "mg", rdaPercentage: null, rdaDisplay: "#" },
    { ingredient: "Zinc Sulphate (Elemental)", amount: 5, unit: "mg", rdaPercentage: 42, rdaDisplay: "42%" },
    { ingredient: "Molybdenum", amount: 8, unit: "mcg", rdaPercentage: 1, rdaDisplay: "1%" },
    { ingredient: "Chromium", amount: 5, unit: "mcg", rdaPercentage: 1, rdaDisplay: "1%" },
    { ingredient: "Selenium Sodium (Elemental)", amount: 10, unit: "mcg", rdaPercentage: 25, rdaDisplay: "25%" },
  ],
  nutrition: {
    servingSize: "Each serving of 5 ml",
    energy: "12.12 kcal",
    fat: "0.0 g",
    protein: "0.0 g",
    carbohydrates: "2.75 g",
    excipients: "q.s.",
  },
  otherIngredients: [
    "Purified Water",
    "Sodium Methyl Paraben (INS-219)",
    "Sodium Propyl Paraben (INS-217)",
    "Bronopol",
    "Sorbitol Liquid (INS-420(ii))",
    "Xanthan Gum (INS-415)",
    "Sucralose (INS-955)",
    "Ethylene Diamine Tetra Acetate (INS-386)",
    "Propyl Sodium Benzoate (INS-211)",
    "Citric Acid (INS-330)",
    "Vitamins & Minerals",
    "Polyethylene Glycol",
    "Glycerine (INS-422)",
    "Added Colours",
    "Added Artificial Flavouring Substances",
    "Chocolate Flavour",
  ],
  storageInstructions: [
    "Keep in a cool & dry place.",
    "Protect from direct sunlight.",
    "Keep out of reach of children.",
  ],
  warnings: [
    "Shake well before use.",
    "Appropriate overages of vitamins are used to compensate for loss on storage.",
    "This product is not intended to diagnose, treat, cure or prevent any disease.",
    "Do not exceed the stated recommended daily usage.",
    "HEALTH SUPPLEMENT, NOT FOR MEDICINAL USE.",
    "This product use for above the age of five years.",
    "Health supplement is not to be used as a substitute for a varied diet.",
  ],
  image: "/images/products/vitafiv-syrup.jpg",
  images: [
    {
      url: "/images/products/vitafiv-syrup.jpg",
      alt: "VITAFIV Syrup 200 ml",
      type: "main",
      order: 1,
    },
    {
      url: "/images/products/vitafiv-syrup-front.jpg",
      alt: "VITAFIV Syrup front packaging",
      type: "front",
      order: 2,
    },
    {
      url: "/images/products/vitafiv-syrup-back.jpg",
      alt: "VITAFIV Syrup packaging information",
      type: "back",
      order: 3,
    },
    {
      url: "/images/products/vitafiv-syrup-bottle.jpg",
      alt: "VITAFIV Syrup bottle",
      type: "bottle",
      order: 4,
    },
    {
      url: "/images/products/vitafiv-syrup-graphic.jpg",
      alt: "VITAFIV Syrup product graphic",
      type: "graphic",
      order: 5,
    },
  ],
  gallery: [
    "/images/products/vitafiv-syrup.jpg",
    "/images/products/vitafiv-syrup-front.jpg",
    "/images/products/vitafiv-syrup-back.jpg",
    "/images/products/vitafiv-syrup-bottle.jpg",
    "/images/products/vitafiv-syrup-graphic.jpg",
  ],
  status: "published",
  published: true,
  featured: true,
  isFeatured: true,
  order: 0,
  displayOrder: 0,
  sourceType: "Product packaging",
  sourceNotes: "Verified extraction from physical packaging artwork",
  contentVerified: true,
  seo: {
    metaTitle: "VITAFIV Syrup 200 ml | Celife Health Solutions",
    metaDescription:
      "VITAFIV Syrup is a calibrated multivitamin and mineral health supplement in chocolate flavour with no added sugar by Celife Health Solutions.",
    ogImage: "/images/products/vitafiv-syrup.jpg",
  },
};

// Process-level cache flag to avoid calling countDocuments() on every incoming request
let isProductsSeeded = false;

/**
 * Ensures initial Celife products, categories, and VITAFIV Syrup are seeded into MongoDB
 * if the collections are currently empty or VITAFIV does not exist yet.
 * Idempotent: checks by slug and will not create duplicates.
 */
export async function ensureDefaultProductsSeeded() {
  if (isProductsSeeded) return;

  try {
    await connectToDatabase();

    const count = await Product.countDocuments();
    if (count === 0) {
      const docsToInsert = productsData.map((p, idx) => ({
        name: p.name,
        slug: p.slug,
        subtitle: p.subtitle,
        category: p.category,
        shortDescription: p.shortDescription,
        description: p.description,
        formulation: p.formulation,
        form: p.form,
        packaging: p.packaging,
        wellnessFocus: p.wellnessFocus,
        usageAdvice: p.usageAdvice,
        keyFocus: p.keyFocus,
        highlights: p.highlights,
        image: p.image,
        images: [{ url: p.image, alt: p.name, type: "main", order: 1 }],
        gallery: [],
        featured: Boolean(p.featured),
        isFeatured: Boolean(p.featured),
        published: true,
        status: "published",
        order: idx + 1,
        displayOrder: idx + 1,
      }));
      await Product.insertMany(docsToInsert);
    }

    // Check if VITAFIV Syrup already exists; only seed initial draft if not present
    const existingVitafiv = await Product.findOne({ slug: "vitafiv-syrup" });
    if (!existingVitafiv) {
      await Product.create({
        name: VITAFIV_PRODUCT.name,
        slug: VITAFIV_PRODUCT.slug,
        brand: VITAFIV_PRODUCT.brand,
        productType: VITAFIV_PRODUCT.productType,
        subtitle: VITAFIV_PRODUCT.subtitle,
        category: "Multivitamin Supplement",
        packSize: VITAFIV_PRODUCT.packSize,
        flavour: VITAFIV_PRODUCT.flavour,
        netVolume: VITAFIV_PRODUCT.netVolume,
        sugarStatement: VITAFIV_PRODUCT.sugarStatement,
        ageStatement: VITAFIV_PRODUCT.ageStatement,
        productClassification: VITAFIV_PRODUCT.productClassification,
        form: VITAFIV_PRODUCT.form,
        packaging: VITAFIV_PRODUCT.packaging,
        wellnessFocus: VITAFIV_PRODUCT.wellnessFocus,
        usageAdvice: VITAFIV_PRODUCT.usageAdvice,
        recommendedUsage: VITAFIV_PRODUCT.recommendedUsage,
        keyFocus: VITAFIV_PRODUCT.keyFocus,
        highlights: VITAFIV_PRODUCT.highlights,
        composition: VITAFIV_PRODUCT.composition,
        nutrition: VITAFIV_PRODUCT.nutrition,
        otherIngredients: VITAFIV_PRODUCT.otherIngredients,
        storageInstructions: VITAFIV_PRODUCT.storageInstructions,
        warnings: VITAFIV_PRODUCT.warnings,
        image: VITAFIV_PRODUCT.image,
        images: VITAFIV_PRODUCT.images,
        gallery: VITAFIV_PRODUCT.gallery,
        status: "draft",
        published: false,
        featured: false,
        isFeatured: false,
        order: 0,
        displayOrder: 0,
        sourceType: VITAFIV_PRODUCT.sourceType,
        sourceNotes: VITAFIV_PRODUCT.sourceNotes,
        contentVerified: true,
        seo: VITAFIV_PRODUCT.seo,
      });
    }

    // Ensure all canonical Celife categories exist idempotently
    const canonicalCategories = [
      { name: "Multivitamin Supplement", slug: "multivitamin-supplement", order: 0 },
      { name: "Oral Health", slug: "oral-health", order: 1 },
      { name: "Nerve Nutrition", slug: "nerve-nutrition", order: 2 },
      { name: "Bone Health", slug: "bone-health", order: 3 },
      { name: "Iron Supplement", slug: "iron-supplement", order: 4 },
      { name: "Protein & Wellness", slug: "protein-wellness", order: 5 },
      { name: "Digestive Health", slug: "digestive-health", order: 6 },
      { name: "Liver Protection", slug: "liver-protection", order: 7 },
      { name: "Calmness + Stress Support", slug: "calmness-stress-support", order: 8 },
      { name: "Health Supplement", slug: "health-supplement", order: 9 },
      { name: "Neurological Wellness", slug: "neurological-wellness", order: 10 },
      { name: "Joint & Mobility", slug: "joint-mobility", order: 11 },
      { name: "Hepatic Wellness", slug: "hepatic-wellness", order: 12 },
      { name: "Immune & Cellular", slug: "immune-cellular", order: 13 },
    ];

    for (const cat of canonicalCategories) {
      const exists = await ProductCategory.findOne({
        $or: [{ slug: cat.slug }, { name: cat.name }],
      });
      if (!exists) {
        await ProductCategory.create(cat);
      }
    }

    isProductsSeeded = true;
  } catch (error) {
    console.error("Product seeding notice:", error);
  }
}

function transformProduct(doc: IProduct): ProductType {
  const images = Array.isArray(doc.images) && doc.images.length > 0
    ? doc.images
    : [{ url: doc.image, alt: doc.name, type: "main", order: 1 }];

  return {
    id: doc._id?.toString() || doc.slug,
    slug: doc.slug,
    name: doc.name,
    brand: doc.brand || "CELIFE",
    productType: doc.productType || "Health Supplement",
    format: doc.format || "",
    dosageForm: doc.dosageForm || "",
    therapeuticDomain: doc.therapeuticDomain || "",
    subtitle: doc.subtitle || "",
    category: doc.category,
    categoryId: doc.categoryId ? doc.categoryId.toString() : null,
    shortDescription: doc.shortDescription,
    description: doc.description,
    fullDescription: doc.fullDescription || doc.description || "",
    aboutFormulation: doc.aboutFormulation || "",
    scientificBackground: doc.scientificBackground || "",
    coreRationale: doc.coreRationale || "",
    packSize: doc.packSize || "",
    flavour: doc.flavour || "",
    netVolume: doc.netVolume || "",
    sugarStatement: doc.sugarStatement || "",
    ageStatement: doc.ageStatement || "",
    productClassification: doc.productClassification || "",
    formulation: doc.formulation || "",
    form: doc.form || "",
    packaging: doc.packaging || "",
    wellnessFocus: doc.wellnessFocus || "",
    usageAdvice: doc.usageAdvice || "",
    recommendedUse: doc.recommendedUse || doc.recommendedUsage || doc.usageAdvice || "",
    recommendedUsage: doc.recommendedUsage || doc.recommendedUse || doc.usageAdvice || "",
    usageInstructions: doc.usageInstructions || "",
    administrationNotes: doc.administrationNotes || "",
    usageRules: doc.usageRules || [],
    keyFocus: doc.keyFocus || [],
    highlights: doc.highlights || [],
    productTags: doc.productTags || [],
    composition: doc.composition || [],
    components: doc.components || [],
    nutrition: doc.nutrition || {},
    otherIngredients: doc.otherIngredients || [],
    storageInstructions: doc.storageInstructions || [],
    warnings: doc.warnings || [],
    professionalCaution: doc.professionalCaution || "",
    notes: doc.notes || "",
    excipientStandard: doc.excipientStandard || "",
    image: doc.image,
    images: images,
    gallery: doc.gallery || [],
    status: doc.status || (doc.published ? "published" : "draft"),
    featured: doc.featured ?? doc.isFeatured ?? false,
    isFeatured: doc.isFeatured ?? doc.featured ?? false,
    published: doc.published ?? (doc.status === "published"),
    order: doc.order ?? doc.displayOrder ?? 0,
    displayOrder: doc.displayOrder ?? doc.order ?? 0,
    source: doc.source || {
      sourceType: doc.sourceType || "Product packaging",
      sourceReference: doc.sourceNotes || "",
      verified: doc.contentVerified ?? true,
      verifiedAt: null,
    },
    sourceType: doc.sourceType || "Product packaging",
    sourceNotes: doc.sourceNotes || "",
    contentVerified: doc.contentVerified ?? true,
    seo: doc.seo || {},
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export const getProducts = cache(async (category?: string): Promise<ProductType[]> => {
  try {
    await connectToDatabase();
    await ensureDefaultProductsSeeded();

    const query: Record<string, unknown> = {
      $or: [{ status: "published" }, { published: true }],
    };
    if (category && category !== "all") {
      query.category = new RegExp(`^${category}$`, "i");
    }

    const products = await Product.find(query)
      .sort({ displayOrder: 1, order: 1, createdAt: -1 })
      .lean<IProduct[]>();

    if (products.length > 0) {
      return products.map(transformProduct);
    }
  } catch (error) {
    console.warn("getProducts notice, using fallback:", (error as Error)?.message || error);
  }

  // Fallback to static data
  const staticCombined = [VITAFIV_PRODUCT, ...productsData];
  if (!category || category === "all") {
    return staticCombined;
  }
  return staticCombined.filter(
    (p) => p.category.toLowerCase() === category.toLowerCase()
  );
});

export const getProductBySlug = cache(async (slug: string): Promise<ProductType | null> => {
  try {
    await connectToDatabase();
    await ensureDefaultProductsSeeded();

    const product = await Product.findOne({
      slug,
      $or: [{ status: "published" }, { published: true }],
    }).lean<IProduct>();

    if (product) {
      return transformProduct(product);
    }
  } catch (error) {
    console.warn("getProductBySlug notice, using fallback:", (error as Error)?.message || error);
  }

  // Fallback to static data
  if (slug === "vitafiv-syrup") return VITAFIV_PRODUCT;
  const fallback = productsData.find((p) => p.slug === slug);
  return fallback || null;
});

export const getFeaturedProducts = cache(async (): Promise<ProductType[]> => {
  try {
    await connectToDatabase();
    await ensureDefaultProductsSeeded();

    const products = await Product.find({
      $or: [{ status: "published" }, { published: true }],
      $and: [{ $or: [{ featured: true }, { isFeatured: true }] }],
    })
      .sort({ displayOrder: 1, order: 1, createdAt: -1 })
      .lean<IProduct[]>();

    if (products.length > 0) {
      return products.map(transformProduct);
    }
  } catch (error) {
    console.warn("getFeaturedProducts notice, using fallback:", (error as Error)?.message || error);
  }

  const staticCombined = [VITAFIV_PRODUCT, ...productsData];
  return staticCombined.filter((p) => p.featured || p.isFeatured);
});

export const getProductCategories = cache(async (): Promise<string[]> => {
  try {
    await connectToDatabase();
    await ensureDefaultProductsSeeded();

    const categories = await ProductCategory.find({ archived: { $ne: true } })
      .sort({ order: 1, name: 1 })
      .lean();

    if (categories.length > 0) {
      return (categories as unknown as IProductCategory[]).map((c) => c.name);
    }

    const distinct = await Product.distinct("category", {
      $or: [{ status: "published" }, { published: true }],
    });
    if (distinct.length > 0) {
      return distinct;
    }
  } catch (error) {
    console.warn("getProductCategories notice, using fallback:", (error as Error)?.message || error);
  }

  const set = new Set(["Health Supplement", ...productsData.map((p) => p.category)]);
  return Array.from(set);
});

