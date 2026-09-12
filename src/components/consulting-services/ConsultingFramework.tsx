"use client";

import React from "react";
import { Reveal } from "@/components/motion/Reveal";

const FRAMEWORK_STEPS = [
  {
    step: "01",
    title: "Diagnostic Audit & Floor Discovery",
    desc: "We perform an unvarnished on-ground review of kitchen logistics, room yield dynamics, procurement contracts, and team service choreography.",
  },
  {
    step: "02",
    title: "Strategic Action Blueprint",
    desc: "Formulate concrete SOPs, menu re-engineering matrices, staffing schedules, and cost reduction roadmaps tailored to your property's commercial goals.",
  },
  {
    step: "03",
    title: "Ground-Level Execution & Training",
    desc: "Our senior team works directly alongside your general managers and department heads to implement systems, train staff, and resolve bottlenecks.",
  },
  {
    step: "04",
    title: "Yield Optimization & Scaling",
    desc: "Continuous metric tracking across ADR, RevPAR, GOPPAR, and COGS to ensure margin expansion is permanently anchored into daily operations.",
  },
];

export function ConsultingFramework() {
  return (
    <section className="bg-[#050505] text-white py-24 md:py-32 border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <Reveal className="max-w-3xl mb-16 space-y-4">
          <span className="text-xs uppercase tracking-[0.3em] text-primary block font-mono font-semibold">
            METHODOLOGY
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-white tracking-tight leading-tight">
            Our 4-Phase Advisory Framework
          </h2>
          <p className="text-base md:text-lg text-white/75 leading-relaxed font-sans font-light">
            We don&apos;t hand over a static PDF report and walk away. THEDCO&apos;s consulting process is built around active, ground-level involvement.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {FRAMEWORK_STEPS.map((item) => (
            <div
              key={item.step}
              className="p-8 border border-white/10 bg-white/[0.015] rounded-sm space-y-4 relative overflow-hidden"
            >
              <span className="text-3xl md:text-4xl font-serif font-light text-primary/60 block font-mono">
                {item.step}
              </span>
              <h3 className="text-xl font-serif text-white">{item.title}</h3>
              <p className="text-xs md:text-sm text-white/70 leading-relaxed font-sans font-light">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
