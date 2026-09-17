export const siteConfig = {
  name: "Celife Health Solutions",
  shortName: "Celife",
  title: "Celife Health Solutions | Evidence-Guided Botanical & Nutraceutical Formulations",
  description:
    "Celife Health Solutions crafts precision botanical extracts, clinical herbal medicine, and standardized nutraceutical formulations. Engineered for neuro-cellular vitality, joint mobility, liver detoxification, and holistic wellness. GMP & ISO certified.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://celifehealth.com",
  ogImage: "/og-image.jpg",
  keywords: [
    "Celife Health Solutions",
    "Celife",
    "botanical formulations",
    "nutraceutical supplements",
    "herbal healthcare India",
    "clinical herbal medicine",
    "Nervify Forte",
    "OrthoCare Active",
    "LivCleanse Synergy",
    "ImmunoShield Daily",
    "Vitafiv Syrup",
    "neuro-cellular vitality",
    "joint mobility supplement",
    "liver detox herbal formula",
    "standardized bioactives",
    "ICMR RDA compliant supplements",
    "non-GMO herbal extracts",
    "GMP certified nutraceuticals",
    "ISO certified herbal manufacturer",
    "evidence-informed wellness",
  ],
  contact: {
    email: "enquiry@celifehealth.com",
    phone: "+91 98200 12345",
    address: "Mumbai, Maharashtra, India",
  },
  socials: {
    linkedin: "https://linkedin.com/company/celifehealth",
    instagram: "https://instagram.com/celifehealth",
    twitter: "https://twitter.com/celifehealth",
  },
};

export type SiteConfig = typeof siteConfig;

