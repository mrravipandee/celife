export const siteConfig = {
  name: "Celife Health Solutions",
  shortName: "Celife",
  title: "Celife Health Solutions | Premium Wellness & Healthcare Formulations",
  description: "Celife Health Solutions is a dedicated healthcare, nutraceutical, and herbal wellness brand creating evidence-guided botanical and nutritional formulations.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://celifehealth.com",
  ogImage: "/images/hero/celife-wellness-hero.jpg",
  contact: {
    email: "enquiry@celifehealth.com",
    phone: "+91 98200 12345",
    address: "Mumbai, Maharashtra, India",
  },
  socials: {
    linkedin: "https://linkedin.com/company/celifehealth",
    instagram: "https://instagram.com/celifehealth",
  },
};

export type SiteConfig = typeof siteConfig;
