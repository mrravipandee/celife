import type { Metadata } from "next";
import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/animations/SmoothScroll";
import { Hero } from "@/components/home/Hero";
import { Intro } from "@/components/home/Intro";
import { WhoWeWorkWithHome } from "@/components/home/WhoWeWorkWithHome";
import { ServicesPreview } from "@/components/home/ServicesPreview";
import { ProblemsYouSolve } from "@/components/home/ProblemsYouSolve";
import { WhyChooseHome } from "@/components/home/WhyChooseHome";
import { HowWeHelp } from "@/components/home/HowWeHelp";
import { Philosophy } from "@/components/home/Philosophy";
import { BrandsVentures } from "@/components/home/BrandsVentures";
import { CTA } from "@/components/home/CTA";

// ─── Page-level SEO metadata ──────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Hotel & Restaurant Advisory Services India | THE DCO",
  description:
    "THE DCO is a leading hospitality advisory firm based in Maharashtra, India. We specialise in hotel operations, restaurant advisory, pre-opening consulting, revenue strategy, staff training and branding for hotels, resorts, cafés and food service businesses.",
  keywords: [
    "hotel advisory India",
    "restaurant advisory India",
    "hospitality consulting India",
    "hotel operations consulting",
    "restaurant management consulting",
    "pre-opening hotel consulting",
    "food service advisory",
    "café consulting India",
    "banquet advisory India",
    "resort advisory India",
    "hotel revenue management",
    "restaurant branding India",
    "Maharashtra hospitality advisory",
    "hotel SOP development",
    "restaurant profitability consultant",
    "hotel management consultant",
    "Panchavati Group",
    "hospitality advisory firm",
  ],
  openGraph: {
    title: "Hotel & Restaurant Advisory Services | THE DCO",
    description:
      "Bespoke hospitality advisory for hotels, restaurants, resorts and food service businesses across India. Real operating experience. Practical strategy.",
    type: "website",
    siteName: "THE DCO",
  },
  alternates: {
    canonical: "https://thedco.com",
  },
};

// ─── JSON-LD structured data ──────────────────────────────────────────────────

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "THE DCO",
  description:
    "Hospitality advisory firm offering hotel consulting, restaurant advisory, pre-opening services, operations management and branding across India.",
  url: "https://thedco.com",
  logo: "https://thedco.com/images/general/logo.png",
  image: "https://thedco.com/images/general/og-image.jpg",
  address: {
    "@type": "PostalAddress",
    addressRegion: "Maharashtra",
    addressCountry: "IN",
  },
  areaServed: {
    "@type": "Country",
    name: "India",
  },
  serviceType: [
    "Hotel Advisory",
    "Restaurant Advisory",
    "Hospitality Consulting",
    "Pre-Opening Consulting",
    "Operations Management",
    "Staff Training",
    "Revenue Management",
    "Branding and Marketing",
  ],
  knowsAbout: [
    "Hotel Management",
    "Restaurant Operations",
    "Food Service Industry",
    "Hospitality Consulting",
    "Revenue Management",
    "Brand Strategy",
  ],
};

// ─── Page component ───────────────────────────────────────────────────────────

export default function Home() {
  return (
    <>
      {/* Structured data for Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <SmoothScroll>
        <Navbar />
        <MobileMenu />

        <main className="bg-black text-white relative min-h-screen">
          {/* Section 1: Hero */}
          <Hero />
          {/* Section 2: Short Introduction */}
          <Intro />
          {/* Section 3: Businesses You Serve */}
          <WhoWeWorkWithHome />
          {/* Section 4: Main Services */}
          <ServicesPreview />
          {/* Section 5: Problems You Solve */}
          <ProblemsYouSolve />
          {/* Section 6: Why Choose THEDCO */}
          <WhyChooseHome />
          {/* Section 7: Consulting Process */}
          <HowWeHelp />
          {/* Section 9: Founder Profile & Section 10: Testimonials */}
          <Philosophy />
          {/* Partner Brands */}
          <BrandsVentures />
          {/* Section 11: Final Consultation CTA */}
          <CTA />
        </main>

        <Footer />
      </SmoothScroll>
    </>
  );
}

