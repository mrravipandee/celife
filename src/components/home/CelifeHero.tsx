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
          <div className="lg:col-span-7 space-y-6 sm:space-y-7 xl:space-y-8 flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* Eyebrow with Single Clay Dot */}
            <div className="flex items-center justify-center lg:justify-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--clay)] shrink-0" />
              <span className="text-[11px] sm:text-xs uppercase tracking-[0.14em] font-sans font-semibold text-[var(--sage)]">
                {eyebrow}
              </span>
            </div>

            {/* Display Editorial H1 */}
            <h1 className="text-3xl sm:text-5xl lg:text-[54px] xl:text-[60px] font-bold text-[var(--ink)] tracking-tight leading-[1.12] max-w-2xl">
              {heading}
            </h1>

            {/* Constrained Paragraph Sub */}
            <p className="text-sm sm:text-base lg:text-[17px] font-sans text-[var(--ink)]/80 leading-relaxed max-w-[62ch] mx-auto lg:mx-0 font-normal">
              {description}
            </p>

            {/* Actions: Primary & Tertiary (Centered on Mobile) */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2 w-full sm:w-auto">
              <Button variant="primary" href="/enquire" showArrow className="w-full sm:w-auto justify-center">
                Submit a Product Enquiry
              </Button>
              <Button variant="tertiary" href="/products" className="w-full sm:w-auto justify-center text-center">
                View Formulation Catalogue →
              </Button>
            </div>

            {/* Thin Hairline Row of Three Facts with Tabular Numbers */}
            <div className="pt-6 sm:pt-8 border-t border-[var(--line)] grid grid-cols-3 gap-2 sm:gap-6 text-xs font-sans text-[var(--sage)] w-full text-center lg:text-left">
              <div>
                <div className="font-semibold text-[var(--ink)] tabular-nums text-sm sm:text-base">
                  4 Formulations
                </div>
                <div className="text-[10px] sm:text-xs mt-0.5">Calibrated Portfolios</div>
              </div>
              <div className="border-l border-[var(--line)] pl-2 sm:pl-6">
                <div className="font-semibold text-[var(--ink)] text-sm sm:text-base">
                  Standardised
                </div>
                <div className="text-[10px] sm:text-xs mt-0.5">Verified Bioactives</div>
              </div>
              <div className="border-l border-[var(--line)] pl-2 sm:pl-6">
                <div className="font-semibold text-[var(--ink)] text-sm sm:text-base">
                  Mumbai, India
                </div>
                <div className="text-[10px] sm:text-xs mt-0.5">Central Operations</div>
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
                  loading="eager"
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
