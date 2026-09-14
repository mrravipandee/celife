import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { constructMetadata } from "@/config/seo";
import { Navbar } from "@/components/layout/Navbar";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/animations/SmoothScroll";
import { Check, ShieldCheck, Microscope, HeartHandshake, Send } from "lucide-react";
import { getPageContent, defaultAboutPageContent } from "@/lib/services/page-content";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent("about");
  const seo = content.seo || {};

  return constructMetadata({
    title:
      seo.metaTitle ||
      "About Celife Health Solutions | Science, Botanicals & Quality",
    description:
      seo.metaDescription ||
      "Learn about Celife Health Solutions' philosophy, evidence-guided formulations, and commitment to purity in nutraceuticals and herbal wellness.",
    image: seo.ogImage || undefined,
  });
}

interface PillarItem {
  title: string;
  desc: string;
}

export default async function AboutPage() {
  const pageData = await getPageContent("about");
  const sections = pageData.sections || defaultAboutPageContent;

  const hero = sections.hero || defaultAboutPageContent.hero;
  const narrative = sections.narrative || defaultAboutPageContent.narrative;
  const principles = sections.principles || defaultAboutPageContent.principles;
  const cta = sections.cta || defaultAboutPageContent.cta;

  const pillars: PillarItem[] = (narrative.pillars || defaultAboutPageContent.narrative.pillars) as PillarItem[];
  const principleItems: PillarItem[] = (principles.items || defaultAboutPageContent.principles.items) as PillarItem[];

  return (
    <SmoothScroll>
      <Navbar />
      <MobileMenu />

      <main className="bg-[#F8FAF6] text-[#171B18] min-h-screen pt-28 pb-20">
        {/* Editorial Header */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-20">
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ED1C24]" />
              <span className="text-xs uppercase tracking-[0.24em] font-sans font-semibold text-[#123C2D]">
                {hero.eyebrow || "About Celife Health Solutions"}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-[#171B18] tracking-tight leading-[1.08]">
              {hero.heading}
            </h1>

            <p className="text-base sm:text-lg font-sans text-[#52635A] leading-relaxed">
              {hero.description}
            </p>
          </div>
        </section>

        {/* Brand Narrative Section with Imagery */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-6 relative">
              <div className="relative aspect-[4/3] w-full bg-white rounded-xs overflow-hidden border border-[#123C2D]/15 shadow-xl">
                <Image
                  src={narrative.image || "/images/hero/celife-wellness-hero.jpg"}
                  alt={hero.heading || "Celife Health Solutions"}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#171B18]">
                {narrative.heading}
              </h2>

              <p className="text-sm font-sans text-[#52635A] leading-relaxed">
                {narrative.description}
              </p>

              <div className="space-y-4 pt-2">
                {pillars.map((item: PillarItem, idx: number) => (
                  <div key={idx} className="flex items-start gap-3.5">
                    <div className="w-5 h-5 rounded-full bg-[#123C2D]/10 text-[#123C2D] flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={12} className="text-[#123C2D]" />
                    </div>
                    <div>
                      <h3 className="text-xs uppercase tracking-wider font-sans font-bold text-[#171B18]">
                        {item.title}
                      </h3>
                      <p className="text-xs font-sans text-[#52635A] leading-relaxed mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Quality & Responsibility Pillars */}
        <section className="bg-white border-y border-[#123C2D]/10 py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <span className="text-xs uppercase tracking-[0.24em] font-sans font-semibold text-[#123C2D]">
                Core Principles
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#171B18]">
                {principles.heading}
              </h2>
              {principles.description && (
                <p className="text-xs sm:text-sm font-sans text-[#52635A]">
                  {principles.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {principleItems.map((item: PillarItem, idx: number) => (
                <div key={idx} className="p-8 bg-[#F8FAF6] border border-[#123C2D]/10 rounded-xs space-y-3">
                  {idx === 0 && <ShieldCheck size={28} className="text-[#123C2D]" />}
                  {idx === 1 && <Microscope size={28} className="text-[#123C2D]" />}
                  {idx >= 2 && <HeartHandshake size={28} className="text-[#123C2D]" />}
                  <h3 className="text-base font-serif font-bold text-[#171B18]">
                    {item.title}
                  </h3>
                  <p className="text-xs font-sans text-[#52635A] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Strip */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 pt-16">
          <div className="bg-[#123C2D] text-white p-8 md:p-12 rounded-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 max-w-xl">
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-white">
                {cta.heading}
              </h2>
              <p className="text-xs sm:text-sm font-sans text-white/75">
                {cta.description}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/products"
                className="px-6 py-3.5 bg-white text-[#123C2D] text-xs uppercase tracking-wider font-semibold rounded-xs hover:bg-[#F4F5EF] transition-colors"
              >
                View Products
              </Link>
              <Link
                href={cta.ctaLink || "/enquire"}
                className="px-6 py-3.5 bg-transparent border border-white/30 text-white text-xs uppercase tracking-wider font-semibold rounded-xs hover:border-white transition-colors flex items-center gap-2"
              >
                <span>{cta.ctaLabel || "Enquire Now"}</span>
                <Send size={12} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </SmoothScroll>
  );
}
