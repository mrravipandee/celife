import React from "react";
import { Button } from "@/components/ui/Button";
import { BotanicalArt } from "@/components/ui/BotanicalArt";
import { BotanicalSpecificationGraphic } from "@/components/home/BotanicalSpecificationGraphic";
import { Check } from "lucide-react";

interface CelifePhilosophyProps {
  content?: {
    eyebrow?: string;
    heading?: string;
    description?: string;
  };
}

export function CelifePhilosophy({ content }: CelifePhilosophyProps) {
  const eyebrow = content?.eyebrow || "OUR STANDARD";
  const heading = content?.heading || "We would rather under-promise than over-formulate.";
  const description =
    content?.description ||
    "Celife formulations are specified before they are marketed. Every botanical input is selected for active compound density and traceability, dosed against established nutritional science, and documented so a practitioner can evaluate it properly.";

  const points = [
    "Traceable botanical sourcing, selected for active compound density",
    "Nutraceutical co-factors dosed to support physiological assimilation",
    "Non-GMO, clean excipient standards across tablet and capsule formats",
    "Full formulation specifications available to healthcare professionals",
  ];

  return (
    <section className="relative py-24 md:py-32 bg-[var(--forest)] text-white overflow-hidden">
      {/* Large Oversized Botanical Line Art Bleeding Off Edges */}
      <BotanicalArt
        variant="leaf"
        className="-left-24 -top-24 w-[450px] sm:w-[600px] h-[750px] text-[var(--sage)] opacity-10"
      />
      <BotanicalArt
        variant="seed-pod"
        className="-right-20 -bottom-20 w-[400px] h-[500px] text-[var(--sage)] opacity-10"
      />

      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 xl:gap-16 items-center">
          {/* Left Column (7-cols): Typography, Checklist & CTA */}
          <div className="lg:col-span-7 space-y-7">
            {/* Eyebrow */}
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--clay)] shrink-0" />
              <span className="text-[11px] uppercase tracking-[0.16em] font-sans font-semibold text-[var(--sage)]">
                {eyebrow}
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] xl:text-[48px] font-serif font-bold text-white tracking-tight leading-[1.12]">
              {heading}
            </h2>

            {/* Body */}
            <p className="text-base sm:text-[17px] font-sans text-white/85 leading-[1.65] max-w-[62ch]">
              {description}
            </p>

            {/* Four Checked Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {points.map((pt, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 text-xs sm:text-sm font-sans text-white/90 border border-white/10 bg-white/5 p-4 rounded-[4px]"
                >
                  <Check
                    size={16}
                    strokeWidth={2}
                    className="text-[var(--sage)] shrink-0 mt-0.5"
                  />
                  <span className="leading-relaxed">{pt}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="pt-3">
              <Button variant="secondary-dark" href="/about" showArrow>
                Read Our Quality Standards
              </Button>
            </div>
          </div>

          {/* Right Column (5-cols): Botanical & Pharmaceutical Specification Graphic */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end w-full">
            <BotanicalSpecificationGraphic />
          </div>
        </div>
      </div>
    </section>
  );
}
