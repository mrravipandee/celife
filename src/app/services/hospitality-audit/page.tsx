import React from "react";
import type { Metadata } from "next";
import { constructMetadata } from "@/config/seo";
import { Navbar } from "@/components/layout/Navbar";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/animations/SmoothScroll";

// Section Components
import { AuditHero } from "@/components/hospitality-audit/AuditHero";
import { AuditOverview } from "@/components/hospitality-audit/AuditOverview";
import { AuditScopeRestaurant } from "@/components/hospitality-audit/AuditScopeRestaurant";
import { AuditScopeHotel } from "@/components/hospitality-audit/AuditScopeHotel";
import { AuditProcess } from "@/components/hospitality-audit/AuditProcess";
import { AuditDeliverables } from "@/components/hospitality-audit/AuditDeliverables";
import { AuditWhoIsItFor } from "@/components/hospitality-audit/AuditWhoIsItFor";
import { AuditScoreInsight } from "@/components/hospitality-audit/AuditScoreInsight";
import { AuditClosingCTA } from "@/components/hospitality-audit/AuditClosingCTA";

export const metadata: Metadata = constructMetadata({
  title: "Hospitality Audit Services | THE DCO",
  description:
    "Professional hospitality audits for restaurants, hotels, resorts and hospitality businesses. Identify operational gaps, revenue leakages and improvement opportunities with THE DCO.",
});

export default function HospitalityAuditPage() {
  return (
    <SmoothScroll>
      <Navbar />
      <MobileMenu />

      <main className="bg-black text-white relative min-h-screen">
        {/* Hero Section */}
        <AuditHero />

        {/* Section 1: Overview */}
        <AuditOverview />

        {/* Section 2: Restaurant Audit */}
        <AuditScopeRestaurant />

        {/* Section 3: Hotel & Resort Audit */}
        <AuditScopeHotel />

        {/* Section 4: Audit Process */}
        <AuditProcess />

        {/* Section 5: Audit Deliverables */}
        <AuditDeliverables />

        {/* Section 6: Who Is It For */}
        <AuditWhoIsItFor />

        {/* Section 7: Audit Score / Insight Visual */}
        <AuditScoreInsight />

        {/* Section 8: Closing CTA */}
        <AuditClosingCTA />
      </main>

      <Footer />
    </SmoothScroll>
  );
}
