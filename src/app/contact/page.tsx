import React from "react";
import type { Metadata } from "next";
import { constructMetadata } from "@/config/seo";
import { Navbar } from "@/components/layout/Navbar";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/animations/SmoothScroll";

// Section Components
import { ContactHero } from "@/components/contact/ContactHero";
import { ContactForm } from "@/components/forms/ContactForm";
import { ContactInfo } from "@/components/contact/ContactInfo";
import { WhatHappensNext } from "@/components/contact/WhatHappensNext";
import { ContactClosingCTA } from "@/components/contact/ContactClosingCTA";

export const metadata: Metadata = constructMetadata({
  title: "Contact THEDCO | Hospitality Advisory",
  description:
    "Get in touch with THE DCO for premium hospitality advisory engagements. Let's talk about hotel, resort, and restaurant investments, branding, and operations improvement.",
});

export default function ContactPage() {
  return (
    <SmoothScroll>
      <Navbar />
      <MobileMenu />

      <main className="bg-black text-white relative min-h-screen">
        {/* Section 1: Intro Hero */}
        <ContactHero />

        {/* Section 2: Contact Content (Grid with info & form) */}
        <section className="bg-black text-white py-16 md:py-24 relative border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-4">
              <ContactInfo />
            </div>
            <div className="lg:col-span-8">
              <ContactForm />
            </div>
          </div>
        </section>

        {/* Section 3: Supporting Info */}
        <WhatHappensNext />

        {/* Section 4: Final CTA */}
        <ContactClosingCTA />
      </main>

      <Footer />
    </SmoothScroll>
  );
}
