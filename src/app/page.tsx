import type { Metadata } from "next";
import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/animations/SmoothScroll";
import { CelifeHero } from "@/components/home/CelifeHero";
import { CelifeTrustStatement } from "@/components/home/CelifeTrustStatement";
import { CelifeFeaturedProducts } from "@/components/home/CelifeFeaturedProducts";
import { CelifeQualityTrust } from "@/components/home/CelifeQualityTrust";
import { CelifePhilosophy } from "@/components/home/CelifePhilosophy";
import { CelifeCTA } from "@/components/home/CelifeCTA";
import { constructMetadata } from "@/config/seo";
import { siteConfig } from "@/config/site";
import { getPageContent } from "@/lib/services/page-content";
import { getFeaturedProducts } from "@/lib/services/products";



// Incremental Static Regeneration (ISR): cached for 300s, purged on-demand when CMS content updates
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent("homepage");
  const seo = content?.seo || {};

  return constructMetadata({
    title:
      seo.metaTitle ||
      "Celife Health Solutions | Evidence-Guided Botanical & Nutraceutical Formulations",
    description:
      seo.metaDescription ||
      "Celife Health Solutions crafts precision botanical extracts, clinical herbal medicine, and standardized nutraceutical formulations. Engineered for neuro-vitality, joint mobility, liver health, and cellular vitality.",
    image: seo.ogImage || "/og-image.jpg",
    canonical: seo.canonicalUrl || "/",
    keywords: [
      "Celife Health Solutions",
      "botanical formulations",
      "nutraceutical supplements India",
      "Nervify Forte",
      "OrthoCare Active",
      "LivCleanse Synergy",
      "ImmunoShield Daily",
      "Vitafiv Syrup",
      "clinical herbal medicine",
      "evidence-guided wellness",
      "standardized bioactives",
      "ICMR RDA compliant",
      "GMP certified herbal extracts",
    ],
  });
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  name: "Celife Health Solutions",
  description:
    "Dedicated healthcare, nutraceutical, and herbal wellness brand creating evidence-guided botanical and nutritional formulations.",
  url: siteConfig.url,
  logo: `${siteConfig.url}/celife-brand.png`,
  image: `${siteConfig.url}/og-image.jpg`,
  address: {
    "@type": "PostalAddress",
    addressRegion: "Maharashtra",
    addressCountry: "IN",
  },

  areaServed: {
    "@type": "Country",
    name: "India",
  },
  knowsAbout: [
    "Nutraceuticals",
    "Botanical Formulations",
    "Neurological Vitality",
    "Joint and Mobility Care",
    "Herbal Hepatic Wellness",
    "Dietary Supplements",
  ],
};

export default async function Home() {
  const [pageData, featuredProducts] = await Promise.all([
    getPageContent("homepage"),
    getFeaturedProducts(),
  ]);
  const sections = pageData.sections || {};

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <SmoothScroll>
        <Navbar />

        <main className="bg-[var(--bone)] text-[var(--ink)] relative min-h-screen">
          {/* Section 1: Hero */}
          <CelifeHero content={sections.hero} />

          {/* Section 2: Trust Statement Hairline Band */}
          <CelifeTrustStatement />

          {/* Section 3: Therapeutic Focus (5/7 Asymmetric Split) */}
          {sections.qualityTrust?.enabled !== false && <CelifeQualityTrust />}

          {/* Section 4: Featured Formulations */}
          {sections.featuredProducts?.enabled !== false && (
            <CelifeFeaturedProducts products={featuredProducts} />
          )}

          {/* Section 5: Brand Philosophy (Single Full-Bleed Forest Green Section) */}
          {sections.philosophy?.enabled !== false && <CelifePhilosophy />}

          {/* Section 6: Product Enquiry Close Block */}
          {sections.cta?.enabled !== false && <CelifeCTA />}
        </main>

        <Footer />
      </SmoothScroll>
    </>
  );
}
