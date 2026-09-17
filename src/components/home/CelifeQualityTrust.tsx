import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CelifeQualityTrust() {
  const systems = [
    {
      title: "Neurological Wellness",
      desc: "Targeted neuro-cellular nourishment, peripheral nerve support, and healthy signaling co-factors.",
      product: "Nervify Forte",
      href: "/products/nervify-forte",
    },
    {
      title: "Joint & Mobility",
      desc: "Musculoskeletal flexibility, synovial fluid maintenance, and connective cartilage resilience.",
      product: "OrthoCare Active",
      href: "/products/orthocare-active",
    },
    {
      title: "Hepatic & Digestive",
      desc: "Standardised bitter botanicals supporting endogenous liver filtration and digestive equilibrium.",
      product: "LivCleanse Synergy",
      href: "/products/livcleanse-synergy",
    },
    {
      title: "Immunity & Resilience",
      desc: "Chelated trace minerals and bioflavonoid polyphenols for steady everyday cellular defense.",
      product: "ImmunoShield Daily",
      href: "/products/immunoshield-daily",
    },
  ];

  return (
    <section className="py-20 md:py-28 lg:py-32 bg-[var(--paper)] border-b border-[var(--line)]">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-16 items-start">
          {/* Left Column: 5-cols Sticky on Desktop */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-4 sm:space-y-5 text-center lg:text-left flex flex-col items-center lg:items-start">
            <div className="flex items-center justify-center lg:justify-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--clay)] shrink-0" />
              <span className="text-[11px] uppercase tracking-[0.16em] font-sans font-semibold text-[var(--sage)]">
                Therapeutic Focus
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-[var(--ink)] tracking-tight leading-[1.12]">
              Four systems. Four formulations.
            </h2>

            <p className="text-xs sm:text-base font-sans text-[var(--ink)]/80 leading-relaxed max-w-[52ch] font-light">
              Each Celife formulation targets a defined physiological system with a calibrated actives profile — no broad-spectrum multivitamins, no filler ingredients.
            </p>

            <div className="pt-2 self-center lg:self-start">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] font-semibold text-[var(--forest)] hover:text-[var(--forest-700)] transition-colors border-b border-[var(--forest)] pb-0.5"
              >
                <span>Browse All Formulations</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Right Column: 7-cols Stacked Hairline List */}
          <div className="lg:col-span-7 border-t border-[var(--line)]">
            {systems.map((sys, idx) => (
              <Link
                key={idx}
                href={sys.href}
                className="group block py-5 sm:py-7 px-3 sm:px-6 lg:px-8 border-b border-[var(--line)] transition-all duration-200 hover:bg-[var(--bone)] cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3 sm:gap-4">
                  <div className="space-y-1.5 sm:space-y-2 max-w-[56ch]">
                    <div className="flex flex-wrap sm:flex-nowrap items-baseline sm:items-center gap-2 sm:gap-3">
                      <h3 className="text-lg sm:text-2xl font-bold text-[var(--ink)] group-hover:text-[var(--forest)] transition-colors">
                        {sys.title}
                      </h3>
                      <span className="text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.12em] font-semibold text-[var(--forest)] bg-[var(--paper)] border border-[var(--line)] px-2 py-0.5 rounded-[4px] shrink-0">
                        {sys.product}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm font-sans text-[var(--sage)] leading-relaxed font-light">
                      {sys.desc}
                    </p>
                  </div>

                  <div className="pt-1 text-[var(--sage)] group-hover:text-[var(--forest)] transition-colors shrink-0">
                    <ArrowRight
                      size={16}
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
