"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";

interface CelifePhilosophyProps {
  content?: {
    eyebrow?: string;
    heading?: string;
    description?: string;
  };
}

export function CelifePhilosophy({ content }: CelifePhilosophyProps) {
  const eyebrow = content?.eyebrow || "OUR STANDARD";
  const heading =
    content?.heading || "We would rather under-promise than over-formulate.";
  const description =
    content?.description ||
    "Celife formulations are specified before they are marketed. Every botanical input is selected for active compound density and traceability, dosed against established nutritional science.";

  return (
    <section className="relative py-20 lg:py-28 bg-[var(--forest)] text-white overflow-hidden select-none">
      {/* Subtle atmospheric ambient glow */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--forest-700)] rounded-full blur-[140px] opacity-40 pointer-events-none" />

      <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Clean, Minimal, High-Impact Content */}
          <div className="lg:col-span-7 space-y-8">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-[var(--clay)] animate-pulse" />
              <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[var(--sage)]">
                {eyebrow}
              </span>
            </div>

            {/* Main Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-bold text-white tracking-tight leading-[1.14] max-w-xl">
              {heading}
            </h2>

            {/* Focused Core Description */}
            <p className="text-base sm:text-lg text-white/80 leading-relaxed font-light max-w-xl">
              {description}
            </p>

            {/* Minimal Important Metrics */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10 max-w-lg">
              <div>
                <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight block">
                  100%
                </span>
                <span className="text-[11px] sm:text-xs text-[var(--sage)] uppercase tracking-wider block mt-1">
                  Traceable Actives
                </span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight block">
                  Zero
                </span>
                <span className="text-[11px] sm:text-xs text-[var(--sage)] uppercase tracking-wider block mt-1">
                  GMO Fillers
                </span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight block">
                  Verified
                </span>
                <span className="text-[11px] sm:text-xs text-[var(--sage)] uppercase tracking-wider block mt-1">
                  Bioactives
                </span>
              </div>
            </div>

            {/* Clean CTA */}
            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-white text-[var(--forest)] hover:bg-[#F0F4F0] text-xs uppercase tracking-widest font-semibold rounded-full transition-all duration-300 shadow-md group"
              >
                <span>Read Our Quality Standards</span>
                <ArrowUpRight
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </div>
          </div>

          {/* Right Column: Rotating Oval Frame with Botanical Image */}
          <div className="lg:col-span-5 flex items-center justify-center relative py-6">
            <div className="relative w-[280px] sm:w-[320px] md:w-[350px] flex items-center justify-center">

              {/* 1. Outer Orbiting Ring 1 (Slow Clockwise Rotation) */}
              <div className="absolute -inset-7 sm:-inset-9 rounded-[220px] border border-dashed border-white/20 animate-[spin_28s_linear_infinite] pointer-events-none">
                {/* Accent Planet Node 1 */}
                <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[var(--clay)] shadow-[0_0_14px_rgba(237,28,36,0.9)]" />
                {/* Accent Node 2 */}
                <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[var(--sage)] shadow-[0_0_10px_rgba(110,139,124,0.8)]" />
              </div>

              {/* 2. Outer Orbiting Ring 2 (Gentle Counter-Clockwise Hairline) */}
              <div className="absolute -inset-3 sm:-inset-4 rounded-[200px] border border-white/15 animate-[spin_38s_linear_infinite_reverse] pointer-events-none" />

              {/* 3. The Oval Image Frame */}
              <div className="relative w-full aspect-[3/4] rounded-[180px] overflow-hidden border-2 border-white/25 shadow-[0_20px_50px_rgba(0,0,0,0.45)] z-10 group">
                <Image
                  src="/images/general/botanical-extract-oval.jpg"
                  alt="Celife Botanical Extraction Formulation"
                  fill
                  sizes="(max-width: 768px) 280px, 350px"
                  priority
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                {/* Soft Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--forest)]/50 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* 4. Circular Rotating Stamp Badge (Rotating round in a circle) */}
              <div className="absolute -bottom-6 -left-6 sm:-bottom-8 sm:-left-8 z-20 pointer-events-none">
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
                  {/* Rotating Circular Text Ring */}
                  <div className="absolute inset-0 animate-[spin_16s_linear_infinite]">
                    <svg className="w-full h-full" viewBox="0 0 120 120">
                      <path
                        id="textPath"
                        d="M 60,60 m -45,0 a 45,45 0 1,1 90,0 a 45,45 0 1,1 -90,0"
                        fill="none"
                      />
                      <text className="text-[9.5px] uppercase tracking-[0.24em] fill-white font-bold">
                        <textPath href="#textPath" startOffset="0%">
                          • BOTANICAL EVIDENCE • CELIFE STANDARDS
                        </textPath>
                      </text>
                    </svg>
                  </div>

                  {/* Center Badge Core */}
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[var(--forest-700)] border border-white/25 flex items-center justify-center shadow-lg backdrop-blur-md">
                    <Sparkles className="w-5 h-5 text-[var(--sage)] animate-pulse" />
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
