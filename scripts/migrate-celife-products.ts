import mongoose from "mongoose";
import fs from "fs";
import path from "path";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/celife";

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
  // Backward compatibility categories
  { name: "Health Supplement", slug: "health-supplement", order: 9 },
  { name: "Neurological Wellness", slug: "neurological-wellness", order: 10 },
  { name: "Joint & Mobility", slug: "joint-mobility", order: 11 },
  { name: "Hepatic Wellness", slug: "hepatic-wellness", order: 12 },
  { name: "Immune & Cellular", slug: "immune-cellular", order: 13 },
];

export const verifiedProducts = [
  // BATCH 1: VITAFIV SYRUP
  {
    name: "VITAFIV SYRUP",
    slug: "vitafiv-syrup",
    brand: "CELIFE",
    packSize: "200 ml",
    productType: "Health Supplement / Multivitamin & Mineral Syrup",
    format: "Syrup",
    dosageForm: "Syrup",
    flavour: "Chocolate Flavour",
    sugarStatement: "NO ADDED SUGAR",
    category: "Multivitamin Supplement",
    status: "draft",
    featured: false,
    isFeatured: false,
    displayOrder: 1,
    order: 1,
    nutrition: {
      servingSize: "Each serving of 5 ml",
      energy: "12.12 kcal",
      fat: "0.0 g",
      protein: "0.0 g",
      carbohydrates: "2.75 g",
      excipients: "q.s.",
    },
    composition: [
      { ingredient: "Lysine Hydrochloride", amount: 5, unit: "mg", rdaPercentage: null, rdaDisplay: "#", order: 1 },
      { ingredient: "Vitamin A (Acetate)", amount: 1320, unit: "IU", rdaPercentage: 66, rdaDisplay: "66%", order: 2 },
      { ingredient: "Vitamin B1 (Thiamine)", amount: 0.6, unit: "mg", rdaPercentage: 43, rdaDisplay: "43%", order: 3 },
      { ingredient: "Vitamin B2", amount: 0.6, unit: "mg", rdaPercentage: 40, rdaDisplay: "40%", order: 4 },
      { ingredient: "Vitamin B3", amount: 8, unit: "mg", rdaPercentage: 44, rdaDisplay: "44%", order: 5 },
      { ingredient: "Vitamin B5", amount: 3, unit: "mg", rdaPercentage: 60, rdaDisplay: "60%", order: 6 },
      { ingredient: "Vitamin B6", amount: 0.6, unit: "mg", rdaPercentage: 30, rdaDisplay: "30%", order: 7 },
      { ingredient: "Vitamin B7", amount: 10, unit: "mcg", rdaPercentage: 33, rdaDisplay: "33%", order: 8 },
      { ingredient: "Vitamin B9", amount: 200, unit: "mcg", rdaPercentage: 50, rdaDisplay: "50%", order: 9 },
      { ingredient: "Vitamin B12", amount: 1.5, unit: "mcg", rdaPercentage: 100, rdaDisplay: "100%", order: 10 },
      { ingredient: "Vitamin C", amount: 25, unit: "mg", rdaPercentage: 63, rdaDisplay: "63%", order: 11 },
      { ingredient: "Vitamin D3 (Lichen)", amount: 10, unit: "mcg", rdaPercentage: 100, rdaDisplay: "100%", order: 12 },
      { ingredient: "Vitamin E (Acetate)", amount: 2.5, unit: "IU", rdaPercentage: 10, rdaDisplay: "10%", order: 13 },
      { ingredient: "Vitamin K2 (Menaquinone)", amount: 55, unit: "mcg", rdaPercentage: 100, rdaDisplay: "100%", order: 14 },
      { ingredient: "Copper Sulphate (Elemental)", amount: 100, unit: "mcg", rdaPercentage: 6, rdaDisplay: "6%", order: 15 },
      { ingredient: "Iodine Potassium (Elemental)", amount: 50, unit: "mcg", rdaPercentage: 25, rdaDisplay: "25%", order: 16 },
      { ingredient: "Ferrous Fumarate", amount: 5, unit: "mg", rdaPercentage: 33, rdaDisplay: "33%", order: 17 },
      { ingredient: "Magnesium", amount: 80, unit: "mg", rdaPercentage: 24, rdaDisplay: "24%", order: 18 },
      { ingredient: "Manganese", amount: 1.5, unit: "mg", rdaPercentage: 38, rdaDisplay: "38%", order: 19 },
      { ingredient: "Phosphorus", amount: 50, unit: "mg", rdaPercentage: null, rdaDisplay: "#", order: 20 },
      { ingredient: "Potassium", amount: 3.8, unit: "mg", rdaPercentage: null, rdaDisplay: "#", order: 21 },
      { ingredient: "Zinc Sulphate (Elemental)", amount: 5, unit: "mg", rdaPercentage: 42, rdaDisplay: "42%", order: 22 },
      { ingredient: "Molybdenum", amount: 8, unit: "mcg", rdaPercentage: 1, rdaDisplay: "1%", order: 23 },
      { ingredient: "Chromium", amount: 5, unit: "mcg", rdaPercentage: 1, rdaDisplay: "1%", order: 24 },
      { ingredient: "Selenium Sodium (Elemental)", amount: 10, unit: "mcg", rdaPercentage: 25, rdaDisplay: "25%", order: 25 },
    ],
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
    recommendedUse: "1–2 teaspoonful twice a day or as directed by Dietician or Doctor.",
    recommendedUsage: "1–2 teaspoonful twice a day or as directed by Dietician or Doctor.",
    storageInstructions: [
      "Keep in cool & dry place; protect from direct sunlight; keep out of reach of children.",
    ],
    warnings: [
      "Shake well before use.",
      "Appropriate overages of vitamins used to compensate for loss on storage.",
      "Not intended to diagnose, treat, cure or prevent any disease.",
      "Do not exceed stated recommended daily usage.",
      "HEALTH SUPPLEMENT, NOT FOR MEDICINAL USE.",
      "Product use for above age of five years.",
      "Health supplement not a substitute for varied diet.",
    ],
    images: [
      { url: "/images/products/vitafiv-syrup.jpg", alt: "VITAFIV Syrup 200 ml main packaging", type: "main", order: 1 },
      { url: "/images/products/vitafiv-syrup-front.jpg", alt: "VITAFIV Syrup front label", type: "front", order: 2 },
      { url: "/images/products/vitafiv-syrup-back.jpg", alt: "VITAFIV Syrup composition & nutrition details", type: "back", order: 3 },
      { url: "/images/products/vitafiv-syrup-bottle.jpg", alt: "VITAFIV Syrup amber bottle", type: "bottle", order: 4 },
      { url: "/images/products/vitafiv-syrup-graphic.jpg", alt: "VITAFIV Syrup product graphic", type: "graphic", order: 5 },
    ],
    image: "/images/products/vitafiv-syrup.jpg",
    seo: {
      metaTitle: "VITAFIV Syrup | Celife Health Solutions",
      metaDescription: "",
    },
    shortDescription: "",
    description: "",
    aboutFormulation: "",
    scientificBackground: "",
    coreRationale: "",
    sourceType: "Product packaging",
    sourceNotes: "Verified extraction from physical packaging artwork",
    contentVerified: true,
  },

  // BATCH 2: VITAFIV TABLET & VITAFIV DROPS
  {
    name: "VITAFIV TABLET",
    slug: "vitafiv-tablet",
    brand: "CELIFE",
    category: "Multivitamin Supplement",
    productType: "Health Supplement / Multivitamin & Mineral Tablet",
    format: "Tablet",
    dosageForm: "Tablet",
    status: "draft",
    featured: false,
    isFeatured: false,
    displayOrder: 2,
    order: 2,
    composition: [],
    components: [],
    usageRules: [],
    images: [],
    notes: "CLIENT VERIFICATION REQUIRED: Confirmed portfolio product. Detailed active composition and pack size pending client supply.",
    contentVerified: false,
  },
  {
    name: "VITAFIV DROPS",
    slug: "vitafiv-drops",
    brand: "CELIFE",
    category: "Multivitamin Supplement",
    productType: "Health Supplement / Multivitamin & Mineral Drops",
    format: "Drops",
    dosageForm: "Oral Drops",
    status: "draft",
    featured: false,
    isFeatured: false,
    displayOrder: 3,
    order: 3,
    composition: [],
    components: [],
    usageRules: [],
    images: [],
    notes: "CLIENT VERIFICATION REQUIRED: Confirmed portfolio product. Detailed active composition and pack size pending client supply.",
    contentVerified: false,
  },

  // BATCH 3: NERVIFY TABLET & NERVIFY FORTE TABLET
  {
    name: "NERVIFY TABLET",
    slug: "nervify-tablet",
    brand: "NERVIFY®",
    category: "Oral Health",
    productType: "Health Supplement / Oral Submucosa Care",
    format: "Film coated tablets",
    dosageForm: "Film Coated Tablet",
    packSize: "Box of 100 tabs (10 × 10 alu alu)",
    therapeuticDomain: "Neurological wellness and structural rebuilding",
    recommendedUse: "1 tab daily after dinner or as advised by a Doctor",
    recommendedUsage: "1 tab daily after dinner or as advised by a Doctor",
    excipientStandard: "Non-GMO, Titanium Dioxide-free, clean coating",
    warnings: ["Consult doctor before starting therapy."],
    notes: "Formulated in relation to oral submucosa and chronic chewing/tobacco/arecanut-related problems.",
    status: "draft",
    featured: false,
    isFeatured: false,
    displayOrder: 4,
    order: 4,
    composition: [
      { ingredient: "Alpha Lipoic Acid", amount: 100, unit: "mg", order: 1 },
      { ingredient: "Lycopene", amount: 5000, unit: "mcg", order: 2 },
      { ingredient: "Chromium", amount: 100, unit: "mcg", order: 3 },
      { ingredient: "Selenium", amount: 40, unit: "mcg", order: 4 },
      { ingredient: "Copper", amount: 200, unit: "mcg", order: 5 },
      { ingredient: "Vitamin B1", amount: 1.7, unit: "mg", order: 6 },
      { ingredient: "Vitamin B6", amount: 2.1, unit: "mg", order: 7 },
      { ingredient: "Vitamin B9", amount: 400, unit: "mcg", order: 8 },
      { ingredient: "Vitamin B12", amount: 1500, unit: "mcg", order: 9 },
      { ingredient: "Beta carotene", amount: 15, unit: "mg", order: 10 },
      { ingredient: "Lactic acid bacillus", amount: 50, unit: "million spores", order: 11 },
    ],
    components: [],
    usageRules: [],
    images: [],
    sourceType: "Client formulation documentation",
    contentVerified: true,
  },
  {
    name: "NERVIFY FORTE TABLET",
    slug: "nervify-forte-tablet",
    brand: "NERVIFY FORTE",
    category: "Nerve Nutrition",
    productType: "Health Supplement / Nerve Nutrition",
    format: "Tablet",
    dosageForm: "Tablet",
    packSize: "Monocarton of 10 tabs Alu Alu",
    therapeuticDomain: "Neurological wellness",
    description: "Formulation developed to nourish nerve cells and maintain neural signaling pathways.",
    excipientStandard: "Non-GMO, Titanium Dioxide-free clean coating",
    recommendedUse: "1 tablet daily after main meal, or as advised by a physician",
    recommendedUsage: "1 tablet daily after main meal, or as advised by a physician",
    status: "draft",
    featured: false,
    isFeatured: false,
    displayOrder: 5,
    order: 5,
    composition: [
      { ingredient: "Vitamin B1", amount: 2.3, unit: "mg", order: 1 },
      { ingredient: "Vitamin B2", amount: 3.2, unit: "mg", order: 2 },
      { ingredient: "Vitamin B3", amount: 23, unit: "mg", order: 3 },
      { ingredient: "Vitamin B5", amount: 3.1, unit: "mg", order: 4 },
      { ingredient: "Vitamin B6", amount: 3.1, unit: "mg", order: 5 },
      { ingredient: "Vitamin B7", amount: 30, unit: "mcg", order: 6 },
      { ingredient: "Vitamin B9", amount: 300, unit: "mcg", order: 7 },
      { ingredient: "Vitamin B12", amount: 1500, unit: "mcg", order: 8 },
      { ingredient: "Alpha Lipoic Acid", amount: 100, unit: "mg", order: 9 },
      { ingredient: "N-Acetyl Cysteine", amount: 600, unit: "mg", order: 10 },
      { ingredient: "Acetyl L-Carnitine", amount: 500, unit: "mg", order: 11 },
    ],
    images: [
      { url: "/images/products/nervify-forte.jpg", alt: "NERVIFY FORTE packaging", type: "main", order: 1 },
    ],
    image: "/images/products/nervify-forte.jpg",
    components: [],
    usageRules: [],
    sourceType: "Client formulation documentation",
    contentVerified: true,
  },

  // BATCH 4: BONIGO TABLET & BONIGO COMBO PACK
  {
    name: "BONIGO TABLET",
    slug: "bonigo-tablet",
    brand: "CELIFE",
    category: "Bone Health",
    productType: "Health Supplement / Bone Care",
    format: "Film coated tablets",
    dosageForm: "Film Coated Tablet",
    packSize: "Box of 100 tabs (10 strips of 10 Alu Alu)",
    recommendedUse: "1–2 tablets daily with meals or as advised by orthopaedic doctor",
    recommendedUsage: "1–2 tablets daily with meals or as advised by orthopaedic doctor",
    excipientStandard: "Non-GMO, Titanium Dioxide-free, Clean coating",
    warnings: ["Consult doctor."],
    status: "draft",
    featured: false,
    isFeatured: false,
    displayOrder: 6,
    order: 6,
    composition: [
      { ingredient: "Calcium", amount: 500, unit: "mg", group: "Minerals", order: 1 },
      { ingredient: "Chromium", amount: 0.025, unit: "mg", group: "Minerals", order: 2 },
      { ingredient: "Copper", amount: 1, unit: "mg", group: "Minerals", order: 3 },
      { ingredient: "Magnesium", amount: 192.5, unit: "mg", group: "Minerals", order: 4 },
      { ingredient: "Manganese", amount: 2, unit: "mg", group: "Minerals", order: 5 },
      { ingredient: "Phosphorous", amount: 100, unit: "mg", group: "Minerals", order: 6 },
      { ingredient: "Potassium", amount: 350, unit: "mg", group: "Minerals", order: 7 },
      { ingredient: "Silicon", amount: 5, unit: "mg", group: "Minerals", order: 8 },
      { ingredient: "Selenium", amount: 0.02, unit: "mg", group: "Minerals", order: 9 },
      { ingredient: "Zinc", amount: 8.5, unit: "mg", group: "Minerals", order: 10 },
      { ingredient: "Vitamin A", amount: 300, unit: "mcg", group: "Vitamins", order: 11 },
      { ingredient: "Vitamin B1", amount: 0.7, unit: "mg", group: "Vitamins", order: 12 },
      { ingredient: "Vitamin B2", amount: 0.8, unit: "mg", group: "Vitamins", order: 13 },
      { ingredient: "Vitamin B3", amount: 9, unit: "mg", group: "Vitamins", order: 14 },
      { ingredient: "Vitamin B6", amount: 1, unit: "mg", group: "Vitamins", order: 15 },
      { ingredient: "Vitamin B9", amount: 100, unit: "mcg", group: "Vitamins", order: 16 },
      { ingredient: "Vitamin B12", amount: 0.5, unit: "mg", group: "Vitamins", order: 17 },
      { ingredient: "Vitamin C", amount: 20, unit: "mg", group: "Vitamins", order: 18 },
      { ingredient: "Vitamin D3", amount: 200, unit: "IU", group: "Vitamins", order: 19 },
      { ingredient: "Vitamin K2", amount: 27.5, unit: "mcg", group: "Vitamins", order: 20 },
      { ingredient: "Withania somnifera", amount: 50, unit: "mg", group: "Natural Extracts", order: 21 },
      { ingredient: "Tinosporia cordifolia", amount: 50, unit: "mg", group: "Natural Extracts", order: 22 },
    ],
    components: [],
    usageRules: [],
    images: [],
    sourceType: "Client formulation documentation",
    contentVerified: true,
  },
  {
    name: "BONIGO COMBO PACK",
    slug: "bonigo-combo",
    brand: "CELIFE",
    category: "Bone Health",
    productType: "Health Supplement / Dual-Pack Suspension",
    format: "Suspension",
    dosageForm: "Oral Suspension",
    packSize: "2 × 100 ml amber bottles",
    therapeuticDomain: "Bone care",
    recommendedUse: "Adults: 5 ml once daily from both bottles; Children: 2.5 ml once daily from both bottles, or as directed by physician.",
    recommendedUsage: "Adults: 5 ml once daily from both bottles; Children: 2.5 ml once daily from both bottles, or as directed by physician.",
    warnings: ["Consult doctor."],
    status: "draft",
    featured: false,
    isFeatured: false,
    displayOrder: 7,
    order: 7,
    composition: [],
    components: [
      {
        name: "Component 1 (Minerals & Core Vitamins)",
        description: "Amber bottle 1 containing primary bone mineral and vitamin matrix",
        composition: [
          { ingredient: "Calcium", amount: 400, unit: "mg" },
          { ingredient: "Magnesium", amount: 192.5, unit: "mg" },
          { ingredient: "Zinc", amount: 2.3, unit: "mg" },
          { ingredient: "Vitamin B12", amount: 1, unit: "mcg" },
          { ingredient: "Vitamin D3", amount: 400, unit: "IU" },
        ],
      },
      {
        name: "Component 2 (Co-factors, Vitamins & Botanicals)",
        description: "Amber bottle 2 containing trace co-factors, multi-vitamins and botanical extracts",
        composition: [
          { ingredient: "Chromium", amount: 25, unit: "mcg" },
          { ingredient: "Copper", amount: 1, unit: "mg" },
          { ingredient: "Manganese", amount: 2, unit: "mg" },
          { ingredient: "Phosphorous", amount: 500, unit: "mg" },
          { ingredient: "Potassium", amount: 875, unit: "mg" },
          { ingredient: "Silicon", amount: 10, unit: "mg" },
          { ingredient: "Selenium", amount: 20, unit: "mcg" },
          { ingredient: "Vitamin A", amount: 500, unit: "mcg" },
          { ingredient: "Vitamin B1", amount: 0.9, unit: "mg" },
          { ingredient: "Vitamin B2", amount: 1.25, unit: "mg" },
          { ingredient: "Vitamin B3", amount: 9, unit: "mg" },
          { ingredient: "Vitamin B6", amount: 1.2, unit: "mg" },
          { ingredient: "Vitamin B9", amount: 250, unit: "mcg" },
          { ingredient: "Vitamin C", amount: 40, unit: "mg" },
          { ingredient: "Vitamin K", amount: 27.5, unit: "mcg" },
          { ingredient: "Withania somnifera", amount: 100, unit: "mg" },
          { ingredient: "Tinosporia cordifolia", amount: 100, unit: "mg" },
        ],
      },
    ],
    usageRules: [
      { ageGroup: "5–9 years", dosage: "2.5 ml", frequency: "Once daily", instructions: "From both packs" },
      { ageGroup: "10–12 years", dosage: "5 ml", frequency: "Once daily", instructions: "From both packs" },
      { ageGroup: "13+ years", dosage: "10 ml", frequency: "Once daily", instructions: "From both packs" },
      { ageGroup: "Adult", dosage: "5 ml", frequency: "Once daily", instructions: "From both bottles" },
      { ageGroup: "Child", dosage: "2.5 ml", frequency: "Once daily", instructions: "From both bottles" },
    ],
    images: [],
    sourceType: "Client formulation documentation",
    contentVerified: true,
  },

  // BATCH 5: FERIFY TABLETS & FERIFY SYRUP
  {
    name: "FERIFY TABLETS",
    slug: "ferify-tablet",
    brand: "CELIFE",
    category: "Iron Supplement",
    productType: "Health Supplement / Iron Formulation",
    format: "Film coated tablet",
    dosageForm: "Film Coated Tablet",
    flavour: "Chocolate flavour",
    excipientStandard: "Non-GMO, Titanium Dioxide-free, Clean coating",
    recommendedUse: "1 tab daily after meal or as directed by gynaecologist.",
    recommendedUsage: "1 tab daily after meal or as directed by gynaecologist.",
    usageInstructions: "Not to be chewed; swallow whole.",
    notes: "CLIENT VERIFICATION REQUIRED: Source contains an unresolved '100 mg' line without ingredient name; also dual zinc notation (5 mg vs 22.5 mg).",
    status: "draft",
    featured: false,
    isFeatured: false,
    displayOrder: 8,
    order: 8,
    composition: [
      { ingredient: "Ferrous Ascorbate eq elemental Iron", amount: 30, unit: "mg", order: 1 },
      { ingredient: "Zinc sulphate eq elemental zinc", amount: 5, unit: "mg", note: "Source also lists 22.5 mg; flagged for client verification", order: 2 },
      { ingredient: "Vitamin C", amount: 40, unit: "mg", order: 3 },
      { ingredient: "Vitamin D3", amount: 400, unit: "IU", order: 4 },
      { ingredient: "Vitamin B1", amount: 1.4, unit: "mg", order: 5 },
      { ingredient: "Vitamin B2", amount: 1.4, unit: "mg", order: 6 },
      { ingredient: "Vitamin B3", amount: 18, unit: "mg", order: 7 },
      { ingredient: "Vitamin B5", amount: 5, unit: "mg", order: 8 },
      { ingredient: "Vitamin B6", amount: 2, unit: "mg", order: 9 },
      { ingredient: "Vitamin B7", amount: 30, unit: "mcg", order: 10 },
      { ingredient: "Vitamin B9", amount: 400, unit: "mcg", order: 11 },
      { ingredient: "Vitamin B12", amount: 1.5, unit: "mcg", order: 12 },
      { ingredient: "Lactic acid bacillus", amount: 10, unit: "million spores", order: 13 },
    ],
    components: [],
    usageRules: [],
    images: [],
    sourceType: "Client formulation documentation",
    contentVerified: false,
  },
  {
    name: "FERIFY SYRUP",
    slug: "ferify-syrup",
    brand: "CELIFE",
    category: "Iron Supplement",
    productType: "Health Supplement / Iron Syrup",
    packSize: "200 ml amber PET bottle",
    format: "Syrup",
    dosageForm: "Syrup",
    therapeuticDomain: "Iron Deficiency Anaemia",
    flavour: "Chocolate flavour",
    recommendedUse: "5 ml once daily after dinner",
    recommendedUsage: "5 ml once daily after dinner",
    notes: "CLIENT VERIFICATION REQUIRED: Source contains an unresolved '100 mg' line in formulation; also dual zinc notation (12 mg vs 52.17 mg).",
    status: "draft",
    featured: false,
    isFeatured: false,
    displayOrder: 9,
    order: 9,
    composition: [
      { ingredient: "Ferrous Ascorbate eq elemental Iron", amount: 30, unit: "mg", order: 1 },
      { ingredient: "Vitamin B1", amount: 1.4, unit: "mg", order: 2 },
      { ingredient: "Vitamin B2", amount: 1.4, unit: "mg", order: 3 },
      { ingredient: "Vitamin B3", amount: 18, unit: "mg", order: 4 },
      { ingredient: "Vitamin B5", amount: 5, unit: "mg", order: 5 },
      { ingredient: "Vitamin B6", amount: 2, unit: "mg", order: 6 },
      { ingredient: "Vitamin B7", amount: 30, unit: "mcg", order: 7 },
      { ingredient: "Vitamin B9", amount: 400, unit: "mcg", order: 8 },
      { ingredient: "Vitamin B12", amount: 1.5, unit: "mcg", order: 9 },
      { ingredient: "Zinc sulphate eq elemental zinc", amount: 12, unit: "mg", note: "Source also lists 52.17 mg; flagged for client verification", order: 10 },
      { ingredient: "Protein Hydrolysate 20%", amount: 100, unit: "mg", order: 11 },
      { ingredient: "L-lysine monohydrate", amount: 50, unit: "mg", order: 12 },
    ],
    components: [],
    usageRules: [],
    images: [],
    sourceType: "Client formulation documentation",
    contentVerified: false,
  },

  // BATCH 6: REQIPRO MALT
  {
    name: "REQIPRO MALT",
    slug: "reqipro-malt",
    brand: "CELIFE",
    category: "Protein & Wellness",
    productType: "Health Supplement / Nutritional Malt",
    format: "Malt",
    dosageForm: "Malt",
    status: "draft",
    featured: false,
    isFeatured: false,
    displayOrder: 10,
    order: 10,
    composition: [],
    components: [],
    usageRules: [],
    images: [],
    notes: "CLIENT VERIFICATION REQUIRED: Confirmed portfolio product. Detailed active composition, pack size and serving instructions pending client supply.",
    contentVerified: false,
  },

  // BATCH 7: RESTOAPP SYRUP
  {
    name: "RESTOAPP SYRUP",
    slug: "restoapp-syrup",
    brand: "CELIFE",
    category: "Digestive Health",
    productType: "Health Supplement / Digestive Syrup",
    format: "Syrup",
    dosageForm: "Syrup",
    status: "draft",
    featured: false,
    isFeatured: false,
    displayOrder: 11,
    order: 11,
    composition: [],
    components: [],
    usageRules: [],
    images: [],
    notes: "CLIENT VERIFICATION REQUIRED: Confirmed portfolio product. Detailed active composition, pack size and dosage instructions pending client supply.",
    contentVerified: false,
  },

  // BATCH 8: OURLIV-24 TABLET & OURLIV-24 SYRUP
  {
    name: "OURLIV-24 TABLET",
    slug: "ourliv-24-tablet",
    brand: "CELIFE",
    category: "Liver Protection",
    productType: "Health Supplement / Hepatic Support Tablet",
    format: "Tablet",
    dosageForm: "Tablet",
    status: "draft",
    featured: false,
    isFeatured: false,
    displayOrder: 12,
    order: 12,
    composition: [],
    components: [],
    usageRules: [],
    images: [],
    notes: "CLIENT VERIFICATION REQUIRED: Confirmed portfolio product. Detailed active composition, pack size and dosage instructions pending client supply.",
    contentVerified: false,
  },
  {
    name: "OURLIV-24 SYRUP",
    slug: "ourliv-24-syrup",
    brand: "CELIFE",
    category: "Liver Protection",
    productType: "Health Supplement / Hepatic Support Syrup",
    format: "Syrup",
    dosageForm: "Syrup",
    status: "draft",
    featured: false,
    isFeatured: false,
    displayOrder: 13,
    order: 13,
    composition: [],
    components: [],
    usageRules: [],
    images: [],
    notes: "CLIENT VERIFICATION REQUIRED: Confirmed portfolio product. Detailed active composition, pack size and dosage instructions pending client supply.",
    contentVerified: false,
  },

  // BATCH 9: CALMIFY-24 TABLET
  {
    name: "CALMIFY-24 TABLET",
    slug: "calmify-24-tablet",
    brand: "CELIFE",
    category: "Calmness + Stress Support",
    productType: "Health Supplement / Stress Support Tablet",
    format: "Tablet",
    dosageForm: "Tablet",
    status: "draft",
    featured: false,
    isFeatured: false,
    displayOrder: 14,
    order: 14,
    composition: [],
    components: [],
    usageRules: [],
    images: [],
    notes: "CLIENT VERIFICATION REQUIRED: Confirmed portfolio product. Detailed active composition, pack size and dosage instructions pending client supply.",
    contentVerified: false,
  },
];

async function migrate() {
  console.log("Connecting to MongoDB:", MONGODB_URI);
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db!;

  console.log("\n--- STEP 1: CATEGORY SYNCHRONIZATION ---");
  const categoriesCol = db.collection("productcategories");
  const categoryMap = new Map<string, Record<string, unknown> | null>();

  for (const cat of canonicalCategories) {
    let existing = await categoriesCol.findOne({
      $or: [{ slug: cat.slug }, { name: cat.name }],
    });
    if (!existing) {
      const res = await categoriesCol.insertOne({
        ...cat,
        tagline: "",
        description: "",
        archived: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      existing = await categoriesCol.findOne({ _id: res.insertedId });
      console.log(`[CREATED CATEGORY] ${cat.name} (${cat.slug})`);
    } else {
      console.log(`[EXISTING CATEGORY] ${existing.name} (${existing.slug})`);
    }
    categoryMap.set(cat.name.toLowerCase(), existing as Record<string, unknown> | null);
  }

  console.log("\n--- STEP 2: PRODUCT MIGRATION & UPDATES ---");
  const productsCol = db.collection("products");

  let createdCount = 0;
  let updatedCount = 0;

  for (const prodData of verifiedProducts) {
    const catObj = categoryMap.get(prodData.category.toLowerCase());
    const categoryId = catObj?._id ? String(catObj._id) : null;

    // Search by slug or name (or previous aliases like nervify-forte)
    const existing = await productsCol.findOne({
      $or: [
        { slug: prodData.slug },
        { name: new RegExp(`^${prodData.name}$`, "i") },
        // If nervify-forte-tablet, check legacy slug nervify-forte
        ...(prodData.slug === "nervify-forte-tablet" ? [{ slug: "nervify-forte" }] : []),
      ],
    });

    if (existing) {
      console.log(`\n[FOUND EXISTING RECORD] ID: ${existing._id} | Name: "${existing.name}" | Slug: "${existing.slug}"`);

      // Prepare updated payload preserving IDs
      const updateDoc: Record<string, unknown> = {
        ...prodData,
        categoryId,
        updatedAt: new Date(),
      };

      // Ensure draft status per Phase 3 instruction
      updateDoc.status = "draft";
      updateDoc.published = false;
      updateDoc.featured = false;
      updateDoc.isFeatured = false;

      await productsCol.updateOne(
        { _id: existing._id },
        { $set: updateDoc }
      );
      updatedCount++;
      console.log(`  -> Successfully updated existing record to match Phase 3 specs (Status: draft, Category: ${prodData.category})`);
    } else {
      const newDoc: Record<string, unknown> = {
        ...prodData,
        categoryId,
        published: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const res = await productsCol.insertOne(newDoc);
      createdCount++;
      console.log(`\n[CREATED NEW DRAFT RECORD] ID: ${res.insertedId} | Name: "${prodData.name}" | Slug: "${prodData.slug}"`);
    }
  }

  console.log("\n--- STEP 3: DATABASE AUDIT & DATA QA ---");
  const allProducts = await productsCol.find().toArray();
  console.log(`Total products now in MongoDB: ${allProducts.length}`);

  // Duplicate checks
  const nameCounts = new Map<string, number>();
  const slugCounts = new Map<string, number>();

  for (const p of allProducts) {
    const normName = String(p.name).toLowerCase().trim();
    nameCounts.set(normName, (nameCounts.get(normName) || 0) + 1);
    slugCounts.set(String(p.slug), (slugCounts.get(String(p.slug)) || 0) + 1);
  }

  const dupNames = Array.from(nameCounts.entries()).filter(([, count]) => count > 1);
  const dupSlugs = Array.from(slugCounts.entries()).filter(([, count]) => count > 1);

  console.log(`Duplicate Names found: ${dupNames.length}`);
  if (dupNames.length > 0) console.log("  ->", dupNames);

  console.log(`Duplicate Slugs found: ${dupSlugs.length}`);
  if (dupSlugs.length > 0) console.log("  ->", dupSlugs);

  // Check images existence on disk
  console.log("\n--- STEP 4: IMAGE FILE VALIDATION ---");
  let brokenImages = 0;
  for (const p of allProducts) {
    if (p.images && Array.isArray(p.images)) {
      for (const img of p.images) {
        if (typeof img?.url === "string" && img.url.startsWith("/")) {
          const filePath = path.join(process.cwd(), "public", img.url);
          if (!fs.existsSync(filePath)) {
            console.error(`  [BROKEN IMAGE] Product "${p.name}": ${img.url} does not exist at ${filePath}`);
            brokenImages++;
          } else {
            console.log(`  [VALID IMAGE] Product "${p.name}": ${img.url} exists on disk`);
          }
        }
      }
    }
  }
  console.log(`Total broken images: ${brokenImages}`);

  // Check Phase 3 Vitafiv Syrup composition
  const vitafiv = await productsCol.findOne({ slug: "vitafiv-syrup" });
  console.log("\n--- STEP 5: VITAFIV SYRUP VERIFICATION ---");
  console.log("Vitafiv ID:", vitafiv?._id);
  console.log("Status:", vitafiv?.status);
  console.log("Category:", vitafiv?.category);
  console.log("Composition count:", Array.isArray(vitafiv?.composition) ? vitafiv.composition.length : 0);
  const compArray = Array.isArray(vitafiv?.composition) ? vitafiv.composition : [];
  const hashItems = compArray.filter((c: Record<string, unknown>) => c.rdaDisplay === "#");
  console.log("Items with '#' RDA display:", hashItems.map((h: Record<string, unknown>) => `${h.ingredient}: ${h.amount} ${h.unit}`));

  console.log("\n==========================================");
  console.log("MIGRATION & QA SUMMARY:");
  console.log(`- Reviewed Products: ${verifiedProducts.length}`);
  console.log(`- Updated Existing: ${updatedCount}`);
  console.log(`- Created New: ${createdCount}`);
  console.log(`- Total In DB: ${allProducts.length}`);
  console.log("==========================================");

  await mongoose.disconnect();
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
