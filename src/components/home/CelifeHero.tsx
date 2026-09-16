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
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: 6-cols Typography & Actions */}
          <div className="lg:col-span-6 space-y-7">
            {/* Eyebrow with Single Clay Dot */}
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--clay)] shrink-0" />
              <span className="text-[11px] sm:text-xs uppercase tracking-[0.14em] font-sans font-semibold text-[var(--sage)]">
                {eyebrow}
              </span>
            </div>

            {/* Display Editorial H1 */}
            <h1 className="text-4xl sm:text-5xl lg:text-[60px] font-serif font-bold text-[var(--ink)] tracking-tight leading-[1.06]">
              {heading}
            </h1>

            {/* Constrained Paragraph Sub (Max 2 lines, ~65ch) */}
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
            <div className="pt-8 border-t border-[var(--line)] grid grid-cols-3 gap-4 text-xs font-sans text-[var(--sage)]">
              <div>
                <div className="font-semibold text-[var(--ink)] tabular-nums text-sm">
                  4 Formulations
                </div>
                <div className="text-[11px] mt-0.5">Calibrated Portfolios</div>
              </div>
              <div className="border-l border-[var(--line)] pl-4">
                <div className="font-semibold text-[var(--ink)] text-sm">
                  Standardised
                </div>
                <div className="text-[11px] mt-0.5">Verified Bioactives</div>
              </div>
              <div className="border-l border-[var(--line)] pl-4">
                <div className="font-semibold text-[var(--ink)] text-sm">
                  Mumbai, India
                </div>
                <div className="text-[11px] mt-0.5">Central Operations</div>
              </div>
            </div>
          </div>

          {/* Right Column: 6-cols Large Image on Warm Bone Plinth */}
          <div className="lg:col-span-6">
            <div className="bg-[var(--bone)] border border-[var(--line)] rounded-[6px] p-3 sm:p-4 shadow-xs">
              <div className="relative aspect-[4/3] sm:aspect-[1/1] w-full rounded-[4px] overflow-hidden bg-[var(--paper)]">
                <Image
                  src={heroImage}
                  alt="Nervify Forte - Flagship Celife Formulation"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center"
                />
              </div>

              {/* Single Restrained Caption Line (No floating overlapping chips) */}
              <div className="pt-3 px-1 flex items-center justify-between text-[11px] uppercase tracking-[0.12em] font-sans text-[var(--sage)]">
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
