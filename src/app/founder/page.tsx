import React from "react";
import type { Metadata } from "next";
import { constructMetadata } from "@/config/seo";
import { Navbar } from "@/components/layout/Navbar";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/animations/SmoothScroll";

// Section Components
import { FounderHero } from "@/components/founder/FounderHero";
import { FounderPillars } from "@/components/founder/FounderPillars";
import { FounderBackground } from "@/components/founder/FounderBackground";
import { AdvisoryApproach } from "@/components/founder/AdvisoryApproach";
import { FounderCTA } from "@/components/founder/FounderCTA";

export const metadata: Metadata = constructMetadata({
  title: "Meet Manav Chandak | Founder & Lead Advisor | THEDCO",
  description: "Hospitality entrepreneur and founder of THEDCO. Explore Manav Chandak's proven operational leadership, third-generation heritage, and advisory methodology.",
});

export default function FounderPage() {
  return (
    <SmoothScroll>
      <Navbar />
      <MobileMenu />

      <main className="bg-[#0b0b0b] text-white relative min-h-screen selection:bg-primary selection:text-black">
        {/* Section 1: Hero & Badges */}
        <FounderHero />
        <FounderPillars />

        {/* Section 2: Foundation Built on Real Experience */}
        <FounderBackground />

        {/* Section 3: What Guides the Approach & Quote */}
        <AdvisoryApproach />

        {/* Section 4: Consultation CTA */}
        <FounderCTA />
      </main>

      <Footer />
    </SmoothScroll>
  );
}
