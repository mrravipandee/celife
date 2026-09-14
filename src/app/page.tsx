import type { Metadata } from "next";
import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/animations/SmoothScroll";
import { CelifeHero } from "@/components/home/CelifeHero";
import { CelifeTrustStatement } from "@/components/home/CelifeTrustStatement";
import { CelifeFeaturedProducts } from "@/components/home/CelifeFeaturedProducts";
import { CelifeQualityTrust } from "@/components/home/CelifeQualityTrust";
import { CelifePhilosophy } from "@/components/home/CelifePhilosophy";
import { CelifeCTA } from "@/components/home/CelifeCTA";

// ─── Page-level SEO metadata ──────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Celife Health Solutions | Targeted Wellness & Healthcare Formulations",
  description:
    "Celife Health Solutions is a dedicated healthcare and nutraceutical brand formulating evidence-guided botanical solutions, including Nervify Forte for neuro-vitality.",
  keywords: [
    "Celife Health Solutions",
    "Nervify Forte",
    "nutraceutical formulations",
    "herbal healthcare India",
    "neuro-cellular wellness",
    "joint mobility supplements",
    "botanical healthcare",
  ],
  openGraph: {
    title: "Celife Health Solutions | Targeted Healthcare & Wellness",
    description:
      "Evidence-informed nutraceutical and botanical formulations designed for human vitality and targeted wellness.",
    type: "website",
    siteName: "Celife Health Solutions",
  },
  alternates: {
    canonical: "https://celifehealth.com",
  },
};

// ─── JSON-LD structured data ──────────────────────────────────────────────────

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

// ─── Page component ───────────────────────────────────────────────────────────

export default function Home() {
  return (
    <>
      {/* Structured data for Search Engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <SmoothScroll>
        <Navbar />
        <MobileMenu />

        <main className="bg-[#F8FAF6] text-[#171B18] relative min-h-screen">
          {/* Section 1: Hero */}
          <CelifeHero />

          {/* Section 2: Trust Pillars */}
          <CelifeTrustStatement />

          {/* Section 3: Therapeutic Categories */}
          <CelifeQualityTrust />

          {/* Section 4: Featured Products */}
          <CelifeFeaturedProducts />

          {/* Section 5: Brand Philosophy */}
          <CelifePhilosophy />

          {/* Section 6: Product Enquiry CTA */}
          <CelifeCTA />
        </main>

        <Footer />
      </SmoothScroll>
    </>
  );
}
