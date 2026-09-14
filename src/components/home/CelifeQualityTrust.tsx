import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Activity, Dna, FlaskConical } from "lucide-react";

export function CelifeQualityTrust() {
  const categories = [
    {
      icon: Dna,
      title: "Neurological Wellness",
      desc: "Neuro-cellular nourishment and vitality co-nutrients.",
      sample: "Nervify Forte",
      href: "/products/nervify-forte",
    },
    {
      icon: Activity,
      title: "Joint & Mobility",
      desc: "Musculoskeletal flexibility and structural cartilage support.",
      sample: "OrthoCare Active",
      href: "/products/orthocare-active",
    },
    {
      icon: FlaskConical,
      title: "Hepatic & Digestive",
      desc: "Botanical liver filtration and gentle digestive equilibrium.",
      sample: "LivCleanse Synergy",
      href: "/products/livcleanse-synergy",
    },
    {
      icon: ShieldCheck,
      title: "Immunity & Resilience",
      desc: "Essential trace mineral defense and cellular protection.",
      sample: "ImmunoShield Daily",
      href: "/products/immunoshield-daily",
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-[#F8FAF6]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14 md:mb-18">
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ED1C24]" />
            <span className="text-xs uppercase tracking-[0.24em] font-sans font-semibold text-[#123C2D]">
              Therapeutic Focus
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#171B18] tracking-tight">
            Targeted Wellness Categories
          </h2>

          <p className="text-sm font-sans text-[#52635A] leading-relaxed">
            Every Celife formulation addresses specific human wellness requirements with calibrated nutrient delivery.
          </p>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-[#123C2D]/10 rounded-xs p-6 flex flex-col justify-between space-y-6 hover:border-[#123C2D]/30 transition-all hover:shadow-md group"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xs bg-[#123C2D]/8 text-[#123C2D] flex items-center justify-center">
                    <Icon size={22} className="text-[#123C2D]" />
                  </div>

                  <h3 className="text-lg font-serif font-bold text-[#171B18] group-hover:text-[#123C2D] transition-colors">
                    {cat.title}
                  </h3>

                  <p className="text-xs font-sans text-[#52635A] leading-relaxed">
                    {cat.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#123C2D]/8">
                  <span className="text-[10px] uppercase tracking-wider text-[#52635A] block">
                    Featured:
                  </span>
                  <Link
                    href={cat.href}
                    className="text-xs font-sans font-semibold text-[#123C2D] hover:underline flex items-center justify-between mt-0.5"
                  >
                    <span>{cat.sample}</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
