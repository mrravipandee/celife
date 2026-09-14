import { connectToDatabase } from "@/lib/mongodb";
import Settings from "@/models/Settings";
import { siteConfig } from "@/config/site";

export interface PublicSettings {
  brand: {
    companyName: string;
    logo: string;
    favicon: string;
    tagline: string;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
    website: string;
    whatsapp: string;
    businessHours: string;
    googleMaps: string;
  };
  social: {
    linkedin: string;
    instagram: string;
    youtube: string;
    facebook: string;
  };
  footer: {
    description: string;
    copyright: string;
    disclaimer: string;
  };
  seo: {
    defaultTitle: string;
    defaultDescription: string;
    defaultOgImage: string;
  };
}

export function getDefaultPublicSettings(): PublicSettings {
  return {
    brand: {
      companyName: siteConfig.name,
      logo: "",
      favicon: "",
      tagline: "Targeted Botanical & Nutritional Wellness Formulations",
    },
    contact: {
      email: siteConfig.contact.email,
      phone: siteConfig.contact.phone,
      address: siteConfig.contact.address,
      website: siteConfig.url,
      whatsapp: siteConfig.contact.phone,
      businessHours: "Mon – Fri: 9:00 AM – 6:00 PM IST",
      googleMaps: "",
    },
    social: {
      linkedin: siteConfig.socials.linkedin,
      instagram: siteConfig.socials.instagram,
      youtube: "",
      facebook: "",
    },
    footer: {
      description: siteConfig.description,
      copyright: `© ${new Date().getFullYear()} ${siteConfig.name}. All rights reserved.`,
      disclaimer:
        "Information on this website is for educational and trade purposes and is not a substitute for professional medical advice.",
    },
    seo: {
      defaultTitle: siteConfig.title,
      defaultDescription: siteConfig.description,
      defaultOgImage: siteConfig.ogImage,
    },
  };
}

export async function getPublicSettings(): Promise<PublicSettings> {
  const defaults = getDefaultPublicSettings();
  try {
    await connectToDatabase();
    const doc = await Settings.findOne({ _singleton: "main" }).lean();
    if (!doc) {
      return defaults;
    }

    return {
      brand: {
        companyName: doc.brand?.companyName || defaults.brand.companyName,
        logo: doc.brand?.logo || defaults.brand.logo,
        favicon: doc.brand?.favicon || defaults.brand.favicon,
        tagline: doc.brand?.tagline || defaults.brand.tagline,
      },
      contact: {
        email: doc.contact?.email || defaults.contact.email,
        phone: doc.contact?.phone || defaults.contact.phone,
        address: doc.contact?.address || defaults.contact.address,
        website: doc.contact?.website || defaults.contact.website,
        whatsapp: doc.contact?.whatsapp || defaults.contact.whatsapp,
        businessHours: doc.contact?.businessHours || defaults.contact.businessHours,
        googleMaps: doc.contact?.googleMaps || defaults.contact.googleMaps,
      },
      social: {
        linkedin: doc.social?.linkedin || defaults.social.linkedin,
        instagram: doc.social?.instagram || defaults.social.instagram,
        youtube: doc.social?.youtube || defaults.social.youtube,
        facebook: doc.social?.facebook || defaults.social.facebook,
      },
      footer: {
        description: doc.footer?.description || defaults.footer.description,
        copyright: doc.footer?.copyright || defaults.footer.copyright,
        disclaimer: doc.footer?.disclaimer || defaults.footer.disclaimer,
      },
      seo: {
        defaultTitle: doc.seo?.defaultTitle || defaults.seo.defaultTitle,
        defaultDescription: doc.seo?.defaultDescription || defaults.seo.defaultDescription,
        defaultOgImage: doc.seo?.defaultOgImage || defaults.seo.defaultOgImage,
      },
    };
  } catch (error) {
    console.error("Error loading public settings, using defaults:", error);
    return defaults;
  }
}
