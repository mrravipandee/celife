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
import { getPageContent } from "@/lib/services/page-content";
import { getFeaturedProducts } from "@/lib/services/products";

// Incremental Static Regeneration (ISR): cached for 300s, purged on-demand when CMS content updates
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent("homepage");
  const seo = content.seo || {};

  return {
    title:
      seo.metaTitle ||
      "Celife Health Solutions | Targeted Wellness & Healthcare Formulations",
    description:
      seo.metaDescription ||
      "Celife Health Solutions is a dedicated healthcare and nutraceutical brand formulating evidence-guided botanical solutions, including Nervify Forte for neuro-vitality.",
    openGraph: {
      title:
        seo.ogTitle ||
        seo.metaTitle ||
        "Celife Health Solutions | Targeted Healthcare & Wellness",
      description:
        seo.ogDescription ||
        seo.metaDescription ||
        "Evidence-informed nutraceutical and botanical formulations designed for human vitality and targeted wellness.",
      images: seo.ogImage ? [{ url: seo.ogImage }] : undefined,
    },
    alternates: {
      canonical: seo.canonicalUrl || "https://celifehealth.com",
    },
  };
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  name: "Celife Health Solutions",
  description:
    "Dedicated healthcare, nutraceutical, and herbal wellness brand creating evidence-guided botanical and nutritional formulations.",
  url: "https://celifehealth.com",
  logo: "https://celifehealth.com/images/general/celife-logo.png",
  image: "https://celifehealth.com/images/hero/celife-wellness-hero.jpg",
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
