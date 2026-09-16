export interface CompositionItem {
  ingredient: string;
  standardisedTo: string;
  quantity: string;
}

export interface FormulationDetail {
  slug: string;
  positioning: string;
  pullQuote: string;
  overviewParagraphs: string[];
  specs: Array<{ label: string; value: string }>;
  composition: CompositionItem[];
  excipientFootnote: string;
  targetSystem: string;
  targetComponents: string[];
  supportStatements: string[];
  activesMapping: Array<{ name: string; marker: string }>;
  usage: string;
  storage: string;
  cautions: string;
}

export const formulationDetails: Record<string, FormulationDetail> = {
  "vitafiv-syrup": {
    slug: "vitafiv-syrup",
    positioning:
      "A high-potency, multi-nutrient syrup formulation delivering 25 essential vitamins, minerals, and amino acids in a light-protected amber bottle.",
    pullQuote:
      "Calibrated multivitamin and mineral supplementation to support energy metabolism, immune defense, and general physiological wellbeing.",
    overviewParagraphs: [
      "VITAFIV Syrup is a calibrated health supplement containing a synergistic matrix of 25 micronutrients including essential B-complex vitamins, antioxidant vitamins A, C, and E, vital trace minerals (Zinc, Iodine, Selenium, Molybdenum, Manganese, Copper, Chromium), and conditionally essential amino acid L-Lysine.",
      "Engineered for superior bioavailability in an oral liquid syrup format with pleasant mixed fruit flavour. Calibrated to ICMR 2020 RDA guidelines for adults and adolescents, packaged in amber bottle to preserve photosensitive co-factors.",
    ],
    specs: [
      { label: "Dosage Form", value: "Liquid Oral Formulation (Syrup)" },
      { label: "Pack Presentation", value: "200 ml Amber Bottle in Unit Carton" },
      { label: "Flavour", value: "Mixed Fruit Flavour" },
      { label: "Therapeutic Domain", value: "General Wellness & Multi-Micronutrient Support" },
      { label: "Serving Size", value: "5 ml (One Teaspoonful)" },
      { label: "Regulatory Category", value: "Health Supplement (FSSAI Regulated)" },
    ],
    composition: [
      { ingredient: "L-Lysine Hydrochloride", standardisedTo: "Essential Amino Acid", quantity: "37.5 mg" },
      { ingredient: "Vitamin C (L-Ascorbic Acid)", standardisedTo: "Antioxidant Vitamin (100% RDA)", quantity: "40 mg" },
      { ingredient: "Vitamin B3 (Nicotinamide)", standardisedTo: "Niacinamide (100% RDA)", quantity: "14 mg" },
      { ingredient: "Vitamin E (dl-alpha-Tocopheryl Acetate)", standardisedTo: "Fat-Soluble Antioxidant (100% RDA)", quantity: "7.5 mg" },
      { ingredient: "Zinc (as Zinc Sulphate)", standardisedTo: "Essential Trace Mineral (75.8% RDA)", quantity: "10 mg" },
      { ingredient: "Vitamin B5 (D-Panthenol)", standardisedTo: "Co-Enzyme A Precursor (25% RDA)", quantity: "1.25 mg" },
      { ingredient: "Vitamin B1 (Thiamine Hydrochloride)", standardisedTo: "Thiamine (71.4% RDA)", quantity: "1 mg" },
      { ingredient: "Vitamin B2 (Riboflavin Sodium Phosphate)", standardisedTo: "Bioactive Riboflavin (62.5% RDA)", quantity: "1.25 mg" },
      { ingredient: "Vitamin B6 (Pyridoxine Hydrochloride)", standardisedTo: "Pyridoxine (52.6% RDA)", quantity: "1 mg" },
      { ingredient: "Vitamin A (Retinyl Palmitate)", standardisedTo: "Vision & Immune Micronutrient (100% RDA)", quantity: "600 mcg" },
      { ingredient: "Vitamin B12 (Cyanocobalamin)", standardisedTo: "Bioactive Cobalamin (45.5% RDA)", quantity: "1 mcg" },
    ],
    excipientFootnote: "Contains permitted natural and synthetic food colours and added flavour (nature identical flavouring substances). Non-medicinal excipients listed on verified carton packaging.",
    targetSystem: "Multisystem Cellular Metabolism & Vitality",
    targetComponents: [
      "Energy Metabolism & ATP Production",
      "Innate & Adaptive Immune Function",
      "Cellular Antioxidant Defense",
      "Tissue Growth & Maintenance",
    ],
    supportStatements: [
      "B-complex vitamins support mitochondrial cellular respiration and efficient nutrient conversion into energy.",
      "Vitamins A, C, E, and Zinc contribute to normal immune function and mucosal barrier integrity.",
      "Essential trace minerals serve as essential co-factors for primary antioxidant enzyme pathways.",
      "Liquid oral syrup ensures rapid gastrointestinal absorption and high patient compliance.",
    ],
    activesMapping: [
      { name: "B-Complex Matrix", marker: "B1, B2, B3, B5, B6, B12 & Folic Acid" },
      { name: "Antioxidant Trio", marker: "Vitamins A (100%), C (100%) & E (100% RDA)" },
      { name: "Essential Trace Minerals", marker: "Zinc, Iodine, Copper, Selenium, Molybdenum & Chromium" },
      { name: "L-Lysine & Choline", marker: "Lysine HCl (37.5 mg) & Choline Bitartrate (10 mg)" },
    ],
    usage:
      "Recommended Usage: One teaspoonful (5 ml) daily or as directed by the Healthcare Professional.",
    storage:
      "Store in a cool, dry & dark place, below 25°C. Protect from direct sunlight, heat & moisture. Keep bottle tightly closed. Keep out of reach of children.",
    cautions:
      "NOT FOR MEDICINAL USE. Health supplement. Not to be used as a substitute for a varied diet. Not to exceed the recommended daily usage. In case of accidental overdose, contact a physician.",
  },
  "nervify-forte": {
    slug: "nervify-forte",
    positioning:
      "A calibrated neuro-nutritional matrix engineered with bioactive co-enzymes and standardized antioxidant co-factors to support peripheral nerve integrity and neural signaling.",
    pullQuote:
      "Calibrated to support peripheral myelin sheath resilience and cellular energy production without synthetic excipients or marketing fillers.",
    overviewParagraphs: [
      "Nervify Forte is formulated for healthcare practitioners and patients seeking structured nutritional support for peripheral nerve tissue and neuromuscular communication.",
      "By combining the bioactive co-enzyme methylcobalamin with lipid-soluble benfotiamine and high-purity alpha-lipoic acid, this formulation delivers targeted cellular co-factors capable of crossing lipid membranes to nourish mitochondrial ATP pathways and neural micro-architecture.",
    ],
    specs: [
      { label: "Format", value: "Film-Coated Tablets" },
      { label: "Pack Presentation", value: "Box of 60 Tablets (6 × 10 Alu-Alu Blister Strips)" },
      { label: "Dosage Form", value: "Solid Oral Formulation" },
      { label: "Therapeutic Domain", value: "Neurological Wellness & Peripheral Nerve Support" },
      { label: "Recommended Use", value: "1 Tablet Daily After Main Meal, or as Advised" },
      { label: "Excipient Standard", value: "Non-GMO, Titanium Dioxide-Free Clean Coating" },
    ],
    composition: [
      {
        ingredient: "Methylcobalamin",
        standardisedTo: "Pure Bio-Active Co-Enzyme B12 (98%)",
        quantity: "1500 mcg",
      },
      {
        ingredient: "Alpha Lipoic Acid",
        standardisedTo: "Standardised Bio-Available Extract (99%)",
        quantity: "100 mg",
      },
      {
        ingredient: "Benfotiamine",
        standardisedTo: "Lipid-Soluble Thiamine Derivative (98.5%)",
        quantity: "50 mg",
      },
      {
        ingredient: "Pyridoxal-5-Phosphate (P-5-P)",
        standardisedTo: "Active Vitamin B6 Co-Factor (98%)",
        quantity: "3 mg",
      },
      {
        ingredient: "L-Methylfolate (as Calcium Salt)",
        standardisedTo: "Bio-Active Folate Isomer (99%)",
        quantity: "1.5 mg",
      },
      {
        ingredient: "Chromium Polynicotinate",
        standardisedTo: "Elemental Chromium Complex (12%)",
        quantity: "200 mcg",
      },
      {
        ingredient: "Myo-Inositol",
        standardisedTo: "Standardised Phyto-Extract (99%)",
        quantity: "100 mg",
      },
    ],
    excipientFootnote:
      "Excipient Profile: Microcrystalline cellulose (USP), Croscarmellose sodium, Vegetable magnesium stearate, Colloidal silicon dioxide. Free from synthetic colorants, titanium dioxide, gluten, lactose, and GMO ingredients.",
    targetSystem: "Peripheral Neurological Matrix",
    targetComponents: [
      "Peripheral Myelin Sheath Resilience",
      "Micro-Neural Transmission & Signaling",
      "Cellular Mitochondrial ATP Generation",
    ],
    supportStatements: [
      "Supports structural maintenance of peripheral nerve tissue and myelin integrity.",
      "Aids normal neuro-muscular signaling and balanced micro-cellular conduction.",
      "Promotes mitochondrial ATP generation within metabolically active neural cells.",
      "Provides targeted intracellular antioxidant protection against cellular oxidative stress.",
    ],
    activesMapping: [
      { name: "Methylcobalamin", marker: "Co-Enzyme B12 (1500 mcg)" },
      { name: "Alpha Lipoic Acid", marker: "Standardised 99% (100 mg)" },
      { name: "Benfotiamine", marker: "Lipid-Soluble B1 (50 mg)" },
      { name: "Pyridoxal-5-Phosphate", marker: "Bio-Active B6 (3 mg)" },
    ],
    usage:
      "Take one tablet daily after a main meal with water, or strictly as instructed by your healthcare practitioner. Do not exceed the advised intake.",
    storage:
      "Store below 25°C in a dry place. Protect from direct light, heat, and moisture. Keep out of reach of children.",
    cautions:
      "For adult use only. Healthcare practitioner supervision recommended. Consult your physician if pregnant, nursing, or undergoing concurrent medical therapy.",
  },

  "orthocare-active": {
    slug: "orthocare-active",
    positioning:
      "Standardised botanical and joint co-nutrient complex formulated to support connective tissue flexibility, cartilage resilience, and physical mobility.",
    pullQuote:
      "Engineered for structural ease, cartilage matrix preservation, and daily joint comfort without gastric distress.",
    overviewParagraphs: [
      "OrthoCare Active delivers standardized botanical extracts calibrated for structural joint comfort and proactive connective tissue support.",
      "Built upon verified phytochemical markers, this formulation assists synovial fluid balance, natural cartilage integrity, and musculoskeletal ease during active daily life.",
    ],
    specs: [
      { label: "Format", value: "Vegetarian Capsules" },
      { label: "Pack Presentation", value: "Amber Glass Bottle of 60 Capsules" },
      { label: "Dosage Form", value: "Capsular Formulation (HPMC Shell)" },
      { label: "Therapeutic Domain", value: "Joint Mobility & Musculoskeletal Care" },
      { label: "Recommended Use", value: "1–2 Capsules Daily With Meals" },
      { label: "Excipient Standard", value: "100% Plant-Derived, Solvent-Free Botanicals" },
    ],
    composition: [
      {
        ingredient: "Boswellia serrata Extract",
        standardisedTo: "65% Boswellic Acids (including AKBA)",
        quantity: "250 mg",
      },
      {
        ingredient: "Curcuma longa (Curcuminoid Complex)",
        standardisedTo: "95% Total Curcuminoids with Piperine",
        quantity: "200 mg",
      },
      {
        ingredient: "Glucosamine Sulphate 2KCl",
        standardisedTo: "Pharmaceutical Grade (USP)",
        quantity: "500 mg",
      },
      {
        ingredient: "Native Undenatured Collagen Type II",
        standardisedTo: "Bioactive Intact Triple Helix Matrix",
        quantity: "40 mg",
      },
      {
        ingredient: "Zinc Bisglycinate",
        standardisedTo: "Fully Chelated Elemental Zinc (20%)",
        quantity: "15 mg",
      },
    ],
    excipientFootnote:
      "Excipient Profile: Vegetable cellulose capsule shell (HPMC), organic rice husk extract. Free from bovine gelatin, synthetic lubricants, and artificial additives.",
    targetSystem: "Musculoskeletal & Synovial Matrix",
    targetComponents: [
      "Synovial Joint Lubrication & Range",
      "Cartilage Extracellular Structure",
      "Connective Tissue Recovery",
    ],
    supportStatements: [
      "Assists healthy synovial fluid viscosity and joint physical comfort.",
      "Promotes natural cartilage collagen structure and elasticity.",
      "Supports recovery from everyday joint stiffness and physical exertion.",
      "Delivers botanical bioflavonoids that encourage systemic tissue balance.",
    ],
    activesMapping: [
      { name: "Boswellia serrata", marker: "65% Boswellic Acids (250 mg)" },
      { name: "Curcuminoid Matrix", marker: "95% Curcuminoids (200 mg)" },
      { name: "Type II Collagen", marker: "Intact Triple Helix (40 mg)" },
      { name: "Glucosamine 2KCl", marker: "USP Grade (500 mg)" },
    ],
    usage:
      "Take 1 to 2 capsules daily with a meal, or as directed by an orthopaedic specialist or wellness consultant.",
    storage:
      "Store tightly sealed in a cool, dry place. Protect from heat and excessive humidity.",
    cautions:
      "Not recommended for individuals with known shellfish sensitivities (for glucosamine fraction). Consult your doctor before use.",
  },

  "livcleanse-synergy": {
    slug: "livcleanse-synergy",
    positioning:
      "Standardised herbal bitter complex formulated to support natural hepatic filtration efficiency, bile flow, and metabolic processing.",
    pullQuote:
      "A pure botanical formulation supporting endogenous liver enzymatic equilibrium and digestive balance.",
    overviewParagraphs: [
      "LivCleanse Synergy utilizes time-tested botanical actives formulated to support natural hepatic filtration and lipid metabolism.",
      "Standardized silymarin and herbal polyphenols promote hepatocyte cell membrane stability and digestive comfort without harsh laxatives.",
    ],
    specs: [
      { label: "Format", value: "Vegetarian Capsules" },
      { label: "Pack Presentation", value: "Amber Glass Bottle of 60 Capsules" },
      { label: "Dosage Form", value: "Capsular Formulation (HPMC Shell)" },
      { label: "Therapeutic Domain", value: "Hepatic Wellness & Digestive Equilibrium" },
      { label: "Recommended Use", value: "1 Capsule Twice Daily Before Meals" },
      { label: "Excipient Standard", value: "Zero Synthetic Binders or Colorants" },
    ],
    composition: [
      {
        ingredient: "Milk Thistle (Silybum marianum)",
        standardisedTo: "80% Silymarin (HPLC verified)",
        quantity: "200 mg",
      },
      {
        ingredient: "Picrorhiza kurroa (Kutki)",
        standardisedTo: "8% Kutkin Bioactive Glycosides",
        quantity: "150 mg",
      },
      {
        ingredient: "Andrographis paniculata (Kalmegh)",
        standardisedTo: "10% Andrographolides",
        quantity: "100 mg",
      },
      {
        ingredient: "Phyllanthus niruri (Bhumyamalaki)",
        standardisedTo: "Standardised Aqueous Herbal Extract",
        quantity: "100 mg",
      },
    ],
    excipientFootnote:
      "Excipient Profile: Vegetable capsule (HPMC), colloidal silica. 100% vegan, clean-label formulation.",
    targetSystem: "Hepatic & Digestive System",
    targetComponents: [
      "Hepatocyte Cellular Resilience",
      "Normal Bile Production & Flow",
      "Metabolic Clearance Pathways",
    ],
    supportStatements: [
      "Supports liver cell membrane resilience against metabolic stress.",
      "Encourages healthy bile production and digestive enzyme balance.",
      "Promotes endogenous cellular glutathione and antioxidant defenses.",
      "Assists natural lipid processing and metabolic clearance.",
    ],
    activesMapping: [
      { name: "Silymarin Extract", marker: "80% Silymarin (200 mg)" },
      { name: "Picrorhiza kurroa", marker: "8% Kutkin Glycosides (150 mg)" },
      { name: "Andrographis paniculata", marker: "10% Andrographolides (100 mg)" },
      { name: "Phyllanthus niruri", marker: "Standardised Extract (100 mg)" },
    ],
    usage:
      "Take 1 capsule twice daily approximately 20 minutes before meals with warm water, or as recommended by your physician.",
    storage:
      "Store in a dry location below 25°C. Keep bottle tightly closed.",
    cautions:
      "Consult a healthcare professional prior to use if undergoing hepatobiliary treatment or gallbladder complications.",
  },

  "immunoshield-daily": {
    slug: "immunoshield-daily",
    positioning:
      "Daily bio-available mineral and standardized elderberry bioflavonoid matrix designed for non-acidic immune defense and cellular resilience.",
    pullQuote:
      "Calibrated everyday cellular defense combining chelated trace elements with active botanical polyphenols.",
    overviewParagraphs: [
      "ImmunoShield Daily is engineered to provide steady first-line nutritional support for immune cells facing seasonal variations and demanding schedules.",
      "By using fully chelated zinc and non-acidic buffered ascorbate with standardized elderberry extracts, it ensures comfortable daily absorption without gastrointestinal distress.",
    ],
    specs: [
      { label: "Format", value: "Vegetarian Capsules" },
      { label: "Pack Presentation", value: "Box of 60 Capsules (Blister Packed)" },
      { label: "Dosage Form", value: "Capsular Formulation" },
      { label: "Therapeutic Domain", value: "Immune Readiness & Antioxidant Defense" },
      { label: "Recommended Use", value: "1 Capsule Daily With Morning Meal" },
      { label: "Excipient Standard", value: "Non-Acidic, Gentle-Stomach Bio-Available Profile" },
    ],
    composition: [
      {
        ingredient: "Black Elderberry (Sambucus nigra)",
        standardisedTo: "15% Anthocyanins & Polyphenols",
        quantity: "250 mg",
      },
      {
        ingredient: "Buffered Vitamin C (Calcium Ascorbate)",
        standardisedTo: "Non-Acidic Ester C Equivalent",
        quantity: "500 mg",
      },
      {
        ingredient: "Zinc Bisglycinate Chelate",
        standardisedTo: "Fully Reacted Elemental Zinc (20%)",
        quantity: "15 mg",
      },
      {
        ingredient: "Vitamin D3 (Cholecalciferol)",
        standardisedTo: "Lichen-Sourced Plant D3 (100% Vegan)",
        quantity: "1000 IU",
      },
      {
        ingredient: "Citrus Bioflavonoid Complex",
        standardisedTo: "60% Hesperidin & Citrus Flavonoids",
        quantity: "50 mg",
      },
    ],
    excipientFootnote:
      "Excipient Profile: Vegetable capsule shell (cellulose), organic rice extract. Hypoallergenic, yeast-free, and non-acidic.",
    targetSystem: "Immune & Cellular Matrix",
    targetComponents: [
      "First-Line Immune Cell Readiness",
      "Cellular Antioxidant Scavenging",
      "Respiratory Mucosal Defense",
    ],
    supportStatements: [
      "Supports normal innate and adaptive immune cell function.",
      "Provides sustained cellular antioxidant defense against free radicals.",
      "Assists healthy mucosal barrier integrity and seasonal resilience.",
      "Delivers gentle, highly absorbable zinc and non-acidic vitamin C.",
    ],
    activesMapping: [
      { name: "Black Elderberry", marker: "15% Anthocyanins (250 mg)" },
      { name: "Buffered Vitamin C", marker: "Non-Acidic (500 mg)" },
      { name: "Zinc Bisglycinate", marker: "Fully Chelated (15 mg)" },
      { name: "Vegan Vitamin D3", marker: "Lichen Origin (1000 IU)" },
    ],
    usage:
      "Take 1 capsule daily with breakfast or your first meal of the day, or as advised by a qualified healthcare practitioner.",
    storage:
      "Store in a cool, dry place. Avoid excessive heat and direct sunlight.",
    cautions:
      "Dietary supplement. Keep out of reach of children. Consult healthcare advisor before combining with high-dose mineral supplements.",
  },
};

export function getFormulationDetail(slug: string): FormulationDetail {
  return formulationDetails[slug] || formulationDetails["nervify-forte"];
}
