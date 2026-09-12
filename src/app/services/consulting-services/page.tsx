import React from "react";
import type { Metadata } from "next";
import { constructMetadata } from "@/config/seo";
import { Navbar } from "@/components/layout/Navbar";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/animations/SmoothScroll";

// Section Components
import { ServicesHero } from "@/components/services/ServicesHero";
import { WhatWeOfferServices } from "@/components/services/WhatWeOfferServices";
import { ConsultancyServicesList } from "@/components/services/ConsultancyServicesList";
import { HighlightedFeaturePanel } from "@/components/services/HighlightedFeaturePanel";
import { ServicesClosingCTA } from "@/components/services/ServicesClosingCTA";

export const metadata: Metadata = constructMetadata({
  title: "Consulting Services | THEDCO Hospitality Advisory",
  description:
    "THEDCO works with hotel and restaurant owners on strategy, operations, staffing and profitability, from the earliest planning stage through daily execution.",
});

export default function ConsultingServicesPage() {
  return (
    <SmoothScroll>
      <Navbar />
      <MobileMenu />

      <main className="bg-black text-white relative min-h-screen">
        {/* Section 1: Hero */}
        <ServicesHero />

        {/* Section 2: What We Offer */}
        <WhatWeOfferServices />

        {/* Section 3: Consultancy Services (Full Detail on 10 Practices) */}
        <ConsultancyServicesList />

        {/* Section 4: Highlighted Feature Panel */}
        <HighlightedFeaturePanel />

        {/* Section 5: Closing CTA */}
        <ServicesClosingCTA />
      </main>

      <Footer />
    </SmoothScroll>
  );
}
