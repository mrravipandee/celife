import { Product } from "@/types/product";

export const productsData: Product[] = [
  {
    id: "prod-1",
    slug: "nervify-forte",
    name: "Nervify Forte",
    subtitle: "Advanced Neuro-Cellular & Vitality Botanical Formulation",
    category: "Neurological Wellness",
    shortDescription:
      "A specialized nutraceutical formulation providing targeted micronutrients, neuro-supportive botanical co-factors, and essential bio-active vitamins.",
    description:
      "Nervify Forte is developed by Celife Health Solutions as a targeted dietary formulation to nourish nerve cellular health, maintain neural signaling pathways, and support everyday metabolic vitality. Built upon balanced nutraceutical science, it is designed for individuals seeking structured daily neuro-nutritional support.",
    formulation:
      "Targeted neuro-supportive micronutrient matrix combined with standardized botanical co-factors and cellular energy co-enzymes.",
    form: "Film-Coated Tablets",
    packaging: "Box of 60 Tablets (6 × 10 Blister Pack)",
    keyFocus: [
      "Nerve tissue nourishment & micro-cellular support",
      "Assists healthy neuro-muscular signaling",
      "Essential B-complex bio-active co-factors",
      "Daily vitality & metabolic resilience",
    ],
    highlights: [
      { label: "Category", value: "Neurological Wellness" },
      { label: "Form", value: "Film-Coated Tablets" },
      { label: "Pack Size", value: "60 Tablets / Box" },
      { label: "Formulation Class", value: "Nutraceutical" },
    ],
    wellnessFocus:
      "Formulated for structured support of the peripheral nervous system and sustained daily vitality.",
    usageAdvice:
      "Take as directed by your healthcare professional. Store in a cool, dry place away from direct sunlight.",
    image: "/images/products/nervify-forte.jpg",
    featured: true,
  },
  {
    id: "prod-2",
    slug: "orthocare-active",
    name: "OrthoCare Active",
    subtitle: "Joint Mobility & Musculoskeletal Botanical Complex",
    category: "Joint & Mobility",
    shortDescription:
      "A synergistic botanical and mineral blend curated to support joint flexibility, cartilage nourishment, and comfortable daily mobility.",
    description:
      "OrthoCare Active brings together standardized herbal extracts and structural co-nutrients to support ease of movement and connective tissue resilience. Crafted for active lifestyles and proactive musculoskeletal care, this formulation assists joint lubrication and physical flexibility.",
    formulation:
      "Herbal phyto-actives with glucosamine-compatible bio-minerals and natural anti-stiffness botanicals.",
    form: "Vegetarian Capsules",
    packaging: "Amber Glass Bottle of 60 Capsules",
    keyFocus: [
      "Maintains cartilage matrix integrity",
      "Assists joint flexibility and ease of motion",
      "Botanical support against everyday joint stiffness",
      "Gentle daily musculoskeletal nourishment",
    ],
    highlights: [
      { label: "Category", value: "Joint & Mobility" },
      { label: "Form", value: "Vegetarian Capsules" },
      { label: "Pack Size", value: "60 Capsules / Bottle" },
      { label: "Formulation Class", value: "Botanical Nutraceutical" },
    ],
    wellnessFocus:
      "Engineered for individuals seeking proactive joint health, structural ease, and sustained physical flexibility.",
    usageAdvice:
      "Take as directed by your healthcare professional. Drink adequate water throughout the day.",
    image: "/images/products/orthocare-active.jpg",
    featured: true,
  },
  {
    id: "prod-3",
    slug: "livcleanse-synergy",
    name: "LivCleanse Synergy",
    subtitle: "Herbal Hepatic Wellness & Metabolic Support",
    category: "Hepatic & Digestive",
    shortDescription:
      "A pure herbal complex formulated with standardized bitter botanicals and antioxidants to encourage normal liver metabolism and digestive harmony.",
    description:
      "LivCleanse Synergy utilizes time-honored botanical actives to support the body's natural liver filtering functions. Designed to assist hepatic efficiency and metabolic processing, it promotes clean digestive flow and internal equilibrium.",
    formulation:
      "Standardized herbal extract blend with traditional hepatic botanicals and natural antioxidant polyphenols.",
    form: "Vegetarian Capsules",
    packaging: "Glass Bottle of 60 Capsules",
    keyFocus: [
      "Assists natural liver metabolic pathways",
      "Encourages bile secretion & digestive ease",
      "Provides cellular antioxidant defense for hepatic tissue",
      "Supports balanced lipid assimilation",
    ],
    highlights: [
      { label: "Category", value: "Hepatic & Digestive" },
      { label: "Form", value: "Vegetarian Capsules" },
      { label: "Pack Size", value: "60 Capsules" },
      { label: "Formulation Class", value: "Standardized Herbal" },
    ],
    wellnessFocus:
      "Designed for routine hepatic care, balanced metabolism, and digestive resilience.",
    usageAdvice:
      "Take as recommended by your health practitioner with a glass of warm water.",
    image: "/images/products/livcleanse-synergy.jpg",
    featured: true,
  },
  {
    id: "prod-4",
    slug: "immunoshield-daily",
    name: "ImmunoShield Daily",
    subtitle: "Vital Defense & Botanical Antioxidant Matrix",
    category: "Immunity & Resilience",
    shortDescription:
      "A daily nutritional formulation combining essential trace minerals with concentrated bioflavonoids for everyday immune readiness.",
    description:
      "ImmunoShield Daily is Celife's comprehensive defense formula developed to help the body adapt to seasonal changes and environmental stressors. It provides a balanced concentration of zinc, vitamin C co-factors, and standardized botanicals for continuous cellular vitality.",
    formulation:
      "Bio-chelated trace elements, standardized elderberry & citrus bioflavonoids, and fat-soluble protective vitamins.",
    form: "Vegetarian Capsules",
    packaging: "Box of 60 Capsules",
    keyFocus: [
      "Reinforces first-line immune responsiveness",
      "Broad-spectrum antioxidant cellular defense",
      "Assists seasonal resistance and recovery",
      "Non-acidic, gentle stomach absorption",
    ],
    highlights: [
      { label: "Category", value: "Immunity & Resilience" },
      { label: "Form", value: "Vegetarian Capsules" },
      { label: "Pack Size", value: "60 Capsules" },
      { label: "Formulation Class", value: "Mineral & Phyto-Nutrient" },
    ],
    wellnessFocus:
      "Provides reliable daily nutritional defense for individuals facing demanding schedules and seasonal transitions.",
    usageAdvice:
      "Consume daily with morning meal or as instructed by your healthcare advisor.",
    image: "/images/products/immunoshield-daily.jpg",
    featured: true,
  },
];
