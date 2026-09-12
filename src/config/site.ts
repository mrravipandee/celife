export const siteConfig = {
  name: "THE DCO",
  shortName: "DCO",
  title: "THE DCO | Hospitality Advisory",
  description: "Cinematic, sophisticated, and bespoke hospitality advisory services for global luxury brands, hotels, and resorts.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://thedco.com",
  ogImage: "/images/general/og-image.jpg",
  contact: {
    email: "advisory@thedco.com",
    phone: "+44 20 7946 0958",
    address: "Mayfair, London, UK",
  },
  socials: {
    linkedin: "https://linkedin.com/company/thedco",
    instagram: "https://instagram.com/thedco",
  },
};

export type SiteConfig = typeof siteConfig;
