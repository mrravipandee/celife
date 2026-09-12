import React from "react";
import type { Metadata } from "next";
import { constructMetadata } from "@/config/seo";
import { Navbar } from "@/components/layout/Navbar";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/animations/SmoothScroll";

// Section Components
import { AboutIntro } from "@/components/about/AboutIntro";
import { WhoWeAre } from "@/components/about/WhoWeAre";
import { WhatWeUnderstand } from "@/components/about/WhatWeUnderstand";
import { HowWeWork } from "@/components/about/HowWeWork";
import { WhyChoose } from "@/components/about/WhyChoose";
import { WhoWeWorkWith } from "@/components/about/WhoWeWorkWith";
import { ClosingCTA } from "@/components/about/ClosingCTA";

export const metadata: Metadata = constructMetadata({
  title: "About THEDCO | Hospitality Advisory",
  description: "THEDCO combines hands-on hospitality experience with business strategy, operations, branding, staffing, and financial planning to help hotel and restaurant owners turn ideas into profitable businesses.",
});

export default function AboutPage() {
  return (
    <SmoothScroll>
      <Navbar />
      <MobileMenu />

      <main className="bg-black text-white relative min-h-screen">
        {/* Section 1: Page Intro */}
        <AboutIntro />
        {/* Section 2: Who We Are */}
        <WhoWeAre />
        {/* Section 3: Timeline (Commented out) */}
        {/* <Timeline /> */}
        {/* Section 4: What We Understand */}
        <WhatWeUnderstand />
        {/* Section 5: How We Work */}
        <HowWeWork />
        {/* Section 6: Why Choose THEDCO */}
        <WhyChoose />
        {/* Section 7: Who We Work With */}
        <WhoWeWorkWith />
        {/* Section 8: Closing CTA */}
        <ClosingCTA />
      </main>

      <Footer />
    </SmoothScroll>
  );
}
