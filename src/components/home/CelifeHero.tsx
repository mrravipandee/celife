"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Send, Sparkles, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface CelifeHeroProps {
  content?: {
    eyebrow?: string;
    heading?: string;
    description?: string;
    primaryCtaLabel?: string;
    primaryCtaLink?: string;
    secondaryCtaLabel?: string;
    secondaryCtaLink?: string;
    heroImage?: string;
    spotlightBadge?: string;
    spotlightTitle?: string;
    spotlightSubtitle?: string;
    spotlightLink?: string;
    packInfo?: string;
  };
}

export function CelifeHero({ content }: CelifeHeroProps) {
  const preferReduced = useReducedMotion();

  const eyebrow = content?.eyebrow || "Healthcare & Wellness Formulations";
  const heading = content?.heading || "Targeted Wellness Guided by Botanical Purity & Evidence.";
  const description =
    content?.description ||
    "Celife Health Solutions develops evidence-informed nutraceutical and botanical formulations — designed for neurological support, structural mobility, and everyday cellular vitality.";
  const primaryCtaLabel = content?.primaryCtaLabel || "Explore Products";
  const primaryCtaLink = content?.primaryCtaLink || "/products";
  const secondaryCtaLabel = content?.secondaryCtaLabel || "Product Enquiry";
  const secondaryCtaLink = content?.secondaryCtaLink || "/enquire";
  const heroImage = content?.heroImage || "/images/products/nervify-forte.jpg";
  const spotlightBadge = content?.spotlightBadge || "Flagship Formulation";
  const spotlightTitle = content?.spotlightTitle || "Nervify Forte";
  const spotlightSubtitle = content?.spotlightSubtitle || "Neuro-Cellular & Vitality Matrix";
  const spotlightLink = content?.spotlightLink || "/products/nervify-forte";
  const packInfo = content?.packInfo || "60 Film-Coated Tablets";

  return (
    <section className="relative min-h-[90vh] lg:min-h-[96vh] flex items-center pt-28 pb-16 md:pt-32 md:pb-24 overflow-hidden bg-[#F8FAF6]">
      {/* Gentle ambient background gradients */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 right-0 w-[550px] lg:w-[750px] h-[550px] lg:h-[750px] bg-[#81998D]/15 rounded-full blur-[140px] -translate-y-1/3 translate-x-1/4"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 w-[450px] h-[450px] bg-[#123C2D]/8 rounded-full blur-[120px] translate-y-1/4 -translate-x-1/4"
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-7 space-y-7 md:space-y-8">
            {/* Top Brand Tag Pill */}
            <motion.div
              initial={preferReduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white border border-[#123C2D]/15 rounded-xs shadow-xs"
            >
              <span className="w-2 h-2 rounded-full bg-[#ED1C24]" />
              <span className="text-[11px] uppercase tracking-[0.24em] font-sans font-semibold text-[#123C2D]">
                {eyebrow}
              </span>
            </motion.div>

            {/* Main Editorial Headline */}
            <motion.div
              initial={preferReduced ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-2"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-[4.2rem] font-serif font-bold text-[#171B18] tracking-tight leading-[1.08]">
                {heading}
              </h1>
            </motion.div>

            {/* Sub-headline text */}
            <motion.p
              initial={preferReduced ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-base sm:text-lg font-sans text-[#52635A] leading-relaxed max-w-xl"
            >
              {description}
            </motion.p>

            {/* Dual CTAs */}
            <motion.div
              initial={preferReduced ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
            >
              {/* Primary CTA */}
              <Link
                href={primaryCtaLink}
                className="px-8 py-4 bg-[#123C2D] text-white hover:bg-[#294F3D] text-xs uppercase tracking-[0.2em] font-semibold rounded-xs transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-3 cursor-pointer"
              >
                <span>{primaryCtaLabel}</span>
                <ArrowRight size={14} />
              </Link>

              {/* Secondary CTA */}
              <Link
                href={secondaryCtaLink}
                className="px-7 py-4 bg-white text-[#123C2D] border border-[#123C2D]/25 hover:bg-[#F4F5EF] text-xs uppercase tracking-[0.18em] font-semibold rounded-xs transition-colors flex items-center justify-center gap-2.5 cursor-pointer shadow-xs"
              >
                <Send size={13} className="text-[#123C2D]" />
                <span>{secondaryCtaLabel}</span>
              </Link>
            </motion.div>

            {/* Micro Trust Indicators */}
            <motion.div
              initial={preferReduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="pt-6 border-t border-[#123C2D]/10 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs font-sans text-[#52635A]"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#123C2D]" />
                <span className="font-medium text-[#171B18]">Standardized Bioactives</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles size={15} className="text-[#A87560]" />
                <span className="font-medium text-[#171B18]">Nutraceutical Precision</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#123C2D]" />
                <span className="font-medium text-[#171B18]">Professional Healthcare Direct</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Layered Editorial Product Composition */}
          <motion.div
            initial={preferReduced ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative"
          >
            {/* Main Product Feature Frame */}
            <div className="relative aspect-[4/3] sm:aspect-[1/1] w-full rounded-xs overflow-hidden border border-[#123C2D]/15 shadow-2xl bg-white">
              <Image
                src={heroImage}
                alt={spotlightTitle}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover object-center"
              />

              {/* Top Accent Badge */}
              <div className="absolute top-4 left-4 z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] font-sans font-semibold bg-white/95 text-[#123C2D] border border-[#123C2D]/10 rounded-xs shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ED1C24]" />
                  {spotlightBadge}
                </span>
              </div>

              {/* Bottom Floating Spec Overlay */}
              <div className="absolute bottom-4 left-4 right-4 z-10 bg-white/95 backdrop-blur-md border border-[#123C2D]/10 rounded-xs p-4 shadow-lg flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-sans text-[#52635A] block">
                    Product Spotlight
                  </span>
                  <strong className="text-base font-serif font-bold text-[#171B18] block leading-tight">
                    {spotlightTitle}
                  </strong>
                  <span className="text-[11px] text-[#123C2D] font-medium block mt-0.5">
                    {spotlightSubtitle}
                  </span>
                </div>

                <Link
                  href={spotlightLink}
                  className="px-3.5 py-2 bg-[#123C2D] hover:bg-[#294F3D] text-white text-[11px] uppercase tracking-wider font-semibold rounded-xs transition-colors shrink-0 flex items-center gap-1.5"
                >
                  <span>View</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>

            {/* Subtle Floating Corner Pill */}
            <div className="hidden sm:block absolute -bottom-5 -left-5 bg-[#123C2D] text-white p-3.5 px-4 rounded-xs shadow-xl border border-white/20 z-20">
              <span className="text-[10px] uppercase tracking-[0.18em] text-[#C4D5C7] block font-medium">
                Pack Presentation
              </span>
              <span className="text-xs font-sans font-semibold block mt-0.5">
                {packInfo}
              </span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
