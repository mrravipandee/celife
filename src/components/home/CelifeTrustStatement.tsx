import React from "react";
import { Leaf, ShieldCheck, Microscope, HeartHandshake } from "lucide-react";

export function CelifeTrustStatement() {
  const pillars = [
    {
      icon: Leaf,
      title: "Botanical Purity",
      desc: "Carefully sourced herbal actives and clean phyto-extracts.",
    },
    {
      icon: Microscope,
      title: "Evidence-Guided",
      desc: "Formulations engineered around established nutritional science.",
    },
    {
      icon: ShieldCheck,
      title: "Quality Assured",
      desc: "Batch-verified consistency and verified specification standards.",
    },
    {
      icon: HeartHandshake,
      title: "Professional Direct",
      desc: "Direct advisory and distribution support for healthcare partners.",
    },
  ];

  return (
    <section className="bg-white border-y border-[#123C2D]/10 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xs bg-[#123C2D]/8 text-[#123C2D] flex items-center justify-center shrink-0 mt-1">
                  <Icon size={20} className="text-[#123C2D]" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-sans font-bold text-[#171B18] tracking-tight uppercase">
                    {item.title}
                  </h3>
                  <p className="text-xs font-sans text-[#52635A] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
