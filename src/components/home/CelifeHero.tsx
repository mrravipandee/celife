import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

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
  };
}

export function CelifeHero({ content }: CelifeHeroProps) {

  const eyebrow = content?.eyebrow || "NUTRACEUTICAL & BOTANICAL FORMULATIONS";
  const heading = content?.heading || "Formulations built on specification, not on claims.";
  const description =
    content?.description ||
    "Celife develops nutraceutical and standardised herbal formulations for neurological support, joint mobility, hepatic function and daily immunity — manufactured to verified specification and supplied direct to healthcare professionals, pharmacies and distributors.";
  const heroImage = content?.heroImage || "/images/products/nervify-forte.jpg";

  return (
    <section className="relative pt-32 pb-16 md:pt-36 md:pb-24 lg:pt-40 lg:pb-28 bg-[var(--bone)] overflow-hidden">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-16 items-center">
          {/* Left Column: 7-cols Typography & Actions */}
          <div className="lg:col-span-7 space-y-7 xl:space-y-8">
            {/* Eyebrow with Single Clay Dot */}
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--clay)] shrink-0" />
              <span className="text-[11px] sm:text-xs uppercase tracking-[0.14em] font-sans font-semibold text-[var(--sage)]">
                {eyebrow}
              </span>
            </div>

            {/* Display Editorial H1 */}
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] xl:text-[64px] font-serif font-bold text-[var(--ink)] tracking-tight leading-[1.06]">
              {heading}
            </h1>

            {/* Constrained Paragraph Sub (Max 2-3 lines, ~65ch) */}
            <p className="text-base sm:text-[17px] font-sans text-[var(--ink)]/80 leading-[1.65] max-w-[65ch]">
              {description}
            </p>

            {/* Actions: Primary & Tertiary */}
            <div className="flex flex-wrap items-center gap-5 pt-2">
              <Button variant="primary" href="/enquire" showArrow>
                Submit a Product Enquiry
              </Button>
              <Button variant="tertiary" href="/products">
                View the Formulation Catalogue →
              </Button>
            </div>

            {/* Thin Hairline Row of Three Facts with Tabular Numbers */}
            <div className="pt-8 border-t border-[var(--line)] grid grid-cols-3 gap-4 sm:gap-6 text-xs font-sans text-[var(--sage)]">
              <div>
                <div className="font-semibold text-[var(--ink)] tabular-nums text-sm sm:text-base">
                  4 Formulations
                </div>
                <div className="text-[11px] sm:text-xs mt-0.5">Calibrated Portfolios</div>
              </div>
              <div className="border-l border-[var(--line)] pl-4 sm:pl-6">
                <div className="font-semibold text-[var(--ink)] text-sm sm:text-base">
                  Standardised
                </div>
                <div className="text-[11px] sm:text-xs mt-0.5">Verified Bioactives</div>
              </div>
              <div className="border-l border-[var(--line)] pl-4 sm:pl-6">
                <div className="font-semibold text-[var(--ink)] text-sm sm:text-base">
                  Mumbai, India
                </div>
                <div className="text-[11px] sm:text-xs mt-0.5">Central Operations</div>
              </div>
            </div>
          </div>

          {/* Right Column: 5-cols Large Image on Warm Bone Plinth */}
          <div className="lg:col-span-5">
            <div className="bg-[var(--bone)] border border-[var(--line)] rounded-[6px] p-3.5 sm:p-5 shadow-xs max-w-[540px] mx-auto lg:ml-auto">
              <div className="relative aspect-[4/3] sm:aspect-[5/4] lg:aspect-[4/3] w-full rounded-[4px] overflow-hidden bg-[var(--paper)]">
                <Image
                  src={heroImage}
                  alt="Nervify Forte - Flagship Celife Formulation"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover object-center"
                />
              </div>

              {/* Single Restrained Caption Line */}
              <div className="pt-3.5 px-1 flex flex-wrap items-center justify-between gap-2 text-[11px] uppercase tracking-[0.12em] font-sans text-[var(--sage)]">
                <span className="font-medium text-[var(--ink)]">Nervify Forte</span>
                <span>Box of 60 Tablets · Neuro-Cellular Matrix</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
