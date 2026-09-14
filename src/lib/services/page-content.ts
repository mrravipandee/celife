import { connectToDatabase } from "@/lib/mongodb";
import PageContent from "@/models/PageContent";

export const defaultHomepageContent = {
  hero: {
    eyebrow: "Healthcare & Wellness Formulations",
    heading: "Targeted Wellness Guided by Botanical Purity & Evidence.",
    description:
      "Celife Health Solutions develops evidence-informed nutraceutical and botanical formulations — designed for neurological support, structural mobility, and everyday cellular vitality.",
    primaryCtaLabel: "Explore Products",
    primaryCtaLink: "/products",
    secondaryCtaLabel: "Product Enquiry",
    secondaryCtaLink: "/enquire",
    heroImage: "/images/products/nervify-forte.jpg",
    spotlightBadge: "Flagship Formulation",
    spotlightTitle: "Nervify Forte",
    spotlightSubtitle: "Neuro-Cellular & Vitality Matrix",
    spotlightLink: "/products/nervify-forte",
    packInfo: "60 Film-Coated Tablets",
  },
  featuredProducts: {
    enabled: true,
    eyebrow: "Formulation Portfolio",
    heading: "Targeted Formulations Crafted for Vitality",
    description:
      "Every Celife product is engineered with standardized bioactives to support specific physiological domains.",
  },
  philosophy: {
    enabled: true,
    eyebrow: "Philosophy & Heritage",
    heading: "The Celife Standard: Where Ancient Botanicals Meet Rigorous Science",
    description:
      "Modern lifestyles place unprecedented stress on the human nervous, muscular, and metabolic systems. We formulate clean solutions rooted in botanical synergy and biological efficacy.",
    image: "/images/hero/celife-wellness-hero.jpg",
    ctaLabel: "Read Our Story",
    ctaLink: "/about",
    points: [
      {
        title: "Standardized Bioactive Extracts",
        desc: "Strictly measured bioactive markers ensure potency remains consistent batch after batch.",
      },
      {
        title: "Clean Excipient Profile",
        desc: "Zero superfluous binders or synthetic colorants. Only pure, high-integrity ingredients.",
      },
      {
        title: "Transparent Sourcing",
        desc: "Rigorous quality inspection at every phase of sourcing and formulation.",
      },
    ],
  },
  qualityTrust: {
    enabled: true,
    eyebrow: "Therapeutic Categories",
    heading: "Structured Solutions for Every Stage of Wellness",
    description:
      "Our therapeutic categories focus on high-impact physiological needs, providing healthcare practitioners and discerning individuals with trusted formulations.",
  },
  cta: {
    enabled: true,
    heading: "Partner with Celife for Advanced Healthcare Formulations",
    description:
      "Whether you are a healthcare practitioner, distribution partner, or an individual seeking specialized formulations, our team is here to assist.",
    primaryCtaLabel: "Submit Product Enquiry",
    primaryCtaLink: "/enquire",
    secondaryCtaLabel: "Contact Our Desk",
    secondaryCtaLink: "/contact",
  },
};

export const defaultAboutPageContent = {
  hero: {
    eyebrow: "About Celife Health Solutions",
    heading: "Restoring Vitality Through Disciplined Botanical Science",
    description:
      "Celife Health Solutions was established with a clear mission: to provide pure, scientifically considered nutraceutical and herbal formulations that elevate everyday health without marketing hype.",
  },
  narrative: {
    heading: "Our Formulation Standard",
    description:
      "In a wellness landscape crowded with generic private labels and unsupported claims, Celife stands for measured integrity. We study physiological requirements — whether supporting nerve cellular resilience, joint ease, or hepatic balance.",
    image: "/images/hero/celife-wellness-hero.jpg",
    pillars: [
      {
        title: "Evidence-Guided Synergies",
        desc: "We formulate each product around proven physiological pathways, pairing traditional herbal actives with modern bio-available co-nutrients.",
      },
      {
        title: "Strict Ingredient Traceability",
        desc: "Our botanical extracts undergo rigorous identity and potency verification to eliminate adulteration and ensure consistent batch efficacy.",
      },
      {
        title: "Healthcare Practitioner Focus",
        desc: "Our technical data sheets and formulation transparency enable medical professionals and pharmacists to make confident recommendations.",
      },
    ],
  },
  principles: {
    heading: "Core Principles We Formulate By",
    description:
      "Every capsule and tablet we develop represents a pledge of purity, precision, and respect for human health.",
    items: [
      {
        title: "Standardized Herbals",
        desc: "We prioritize standardized herbal extracts rather than generic powdered roots, delivering reliable biomarker concentrations.",
      },
      {
        title: "Zero Unsupported Claims",
        desc: "We never exaggerate outcomes. Every benefit statement is anchored in recognized nutritional science and traditional wisdom.",
      },
      {
        title: "Dedicated Quality Testing",
        desc: "Batch-by-batch testing for purity, microbial safety, and heavy metals before any formulation reaches our partners.",
      },
    ],
  },
  cta: {
    heading: "Looking for Healthcare & Formulation Enquiries?",
    description:
      "Our team is available to answer questions from healthcare professionals, distributors, and wellness seekers.",
    ctaLabel: "Get in Touch",
    ctaLink: "/contact",
  },
};

export async function getPageContent(pageKey: "homepage" | "about" | "quality") {
  try {
    await connectToDatabase();
    const doc = await PageContent.findOne({ pageKey }).lean();

    if (pageKey === "homepage") {
      if (!doc || !doc.sections) {
        return {
          sections: defaultHomepageContent,
          seo: doc?.seo || {},
          published: doc ? doc.published : true,
        };
      }
      return {
        sections: {
          hero: { ...defaultHomepageContent.hero, ...doc.sections.hero },
          featuredProducts: { ...defaultHomepageContent.featuredProducts, ...doc.sections.featuredProducts },
          philosophy: { ...defaultHomepageContent.philosophy, ...doc.sections.philosophy },
          qualityTrust: { ...defaultHomepageContent.qualityTrust, ...doc.sections.qualityTrust },
          cta: { ...defaultHomepageContent.cta, ...doc.sections.cta },
        },
        seo: doc.seo || {},
        published: doc.published,
      };
    }

    if (pageKey === "about") {
      if (!doc || !doc.sections) {
        return {
          sections: defaultAboutPageContent,
          seo: doc?.seo || {},
          published: doc ? doc.published : true,
        };
      }
      return {
        sections: {
          hero: { ...defaultAboutPageContent.hero, ...doc.sections.hero },
          narrative: { ...defaultAboutPageContent.narrative, ...doc.sections.narrative },
          principles: { ...defaultAboutPageContent.principles, ...doc.sections.principles },
          cta: { ...defaultAboutPageContent.cta, ...doc.sections.cta },
        },
        seo: doc.seo || {},
        published: doc.published,
      };
    }

    return {
      sections: doc?.sections || {},
      seo: doc?.seo || {},
      published: doc ? doc.published : true,
    };
  } catch (error) {
    console.error(`Error loading page content for ${pageKey}:`, error);
    // Return sensible fallback
    if (pageKey === "homepage") {
      return { sections: defaultHomepageContent, seo: {}, published: true };
    }
    return { sections: defaultAboutPageContent, seo: {}, published: true };
  }
}
