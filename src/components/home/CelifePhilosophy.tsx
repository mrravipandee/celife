import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

export function CelifePhilosophy() {
  const points = [
    "Pure, traceable botanical sources selected for active compound density",
    "Balanced nutraceutical co-factors to support physiological assimilation",
    "Non-GMO, clean excipient standards across all tablet and capsule formats",
    "Transparent formulation specifications designed for healthcare practitioner trust",
  ];

  return (
    <section className="py-20 md:py-28 bg-[#F4F5EF] border-y border-[#123C2D]/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Visual Story */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/3] sm:aspect-[4/5] w-full rounded-xs overflow-hidden border border-[#123C2D]/15 shadow-xl bg-white">
              <Image
                src="/images/hero/celife-wellness-hero.jpg"
                alt="Celife Health Solutions Formulation Environment"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center"
              />
            </div>

            {/* Floating Brand Mission Note */}
            <div className="hidden sm:block absolute -bottom-6 -right-6 bg-white border border-[#123C2D]/15 p-6 rounded-xs shadow-xl max-w-xs">
              <span className="text-[10px] uppercase tracking-[0.2em] font-sans font-semibold text-[#A87560] block">
                Brand Principle
              </span>
              <p className="text-xs font-serif italic text-[#171B18] mt-1 leading-snug">
                &ldquo;Where botanical tradition meets modern nutritional precision.&rdquo;
              </p>
            </div>
          </div>

          {/* Right Column: Editorial Narrative */}
          <div className="lg:col-span-7 space-y-6 lg:pl-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ED1C24]" />
              <span className="text-xs uppercase tracking-[0.24em] font-sans font-semibold text-[#123C2D]">
                Our Philosophy
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#171B18] tracking-tight leading-tight">
              A Disciplined Approach to Nutritional & Herbal Science
            </h2>

            <p className="text-sm sm:text-base font-sans text-[#52635A] leading-relaxed">
              At Celife Health Solutions, we believe human vitality is best preserved through measured, targeted nutrition. We refrain from commercial trends or exaggerated promises — prioritizing verifiable ingredient purity, stability, and thoughtful synergy.
            </p>

            <ul className="space-y-3 pt-2">
              {points.map((pt, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm font-sans text-[#171B18] leading-snug">
                  <div className="w-5 h-5 rounded-full bg-[#123C2D]/10 text-[#123C2D] flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={12} className="text-[#123C2D]" />
                  </div>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#123C2D] text-white text-xs uppercase tracking-[0.18em] font-semibold rounded-xs hover:bg-[#294F3D] transition-colors"
              >
                <span>Read About Celife</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
