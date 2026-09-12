"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Reveal } from "@/components/motion/Reveal";
import { LineReveal } from "@/components/motion/LineReveal";
import { TEN_ADVISORY_PRACTICES } from "@/data/practicesData";

export function ConsultancyServicesList() {
  const [selectedPracticeId, setSelectedPracticeId] = useState<string>("all");
  const preferReduced = useReducedMotion();

  const filteredPractices =
    selectedPracticeId === "all"
      ? TEN_ADVISORY_PRACTICES
      : TEN_ADVISORY_PRACTICES.filter((p) => p.id === selectedPracticeId);

  return (
    <section
      id="consultancy-services"
      className="bg-[#070707] text-white py-24 md:py-32 border-b border-white/5 relative scroll-mt-20"
    >
      {/* Background Ambient Radial Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/[0.025] blur-[150px] rounded-full"
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 space-y-4">
          <Reveal>
            <span className="text-xs uppercase tracking-[0.3em] text-primary block font-semibold">
              COMPREHENSIVE ADVISORY SCOPE
            </span>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="text-3xl md:text-5xl font-serif text-white tracking-tight leading-tight">
              Consultancy Services
            </h2>
          </Reveal>

          <LineReveal className="bg-primary/50 max-w-[100px]" delay={0.2} />

          <Reveal delay={0.25}>
            <p className="text-base md:text-xl text-white/80 leading-relaxed font-sans font-light">
              Full detail on everything THEDCO offers, across ten advisory practices.
            </p>
          </Reveal>
        </div>

        {/* Practice Quick Jump / Filter Tabs */}
        <Reveal delay={0.3} className="mb-14">
          <div className="flex items-center gap-2 overflow-x-auto pb-4 pt-1 no-scrollbar border-b border-white/10">
            <button
              onClick={() => setSelectedPracticeId("all")}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-mono rounded-sm transition-all duration-200 shrink-0 cursor-pointer ${
                selectedPracticeId === "all"
                  ? "bg-primary text-black font-semibold shadow-sm"
                  : "bg-white/[0.03] text-white/70 hover:text-white hover:bg-white/[0.07] border border-white/5"
              }`}
            >
              All Practices (10)
            </button>

            {TEN_ADVISORY_PRACTICES.map((practice) => {
              const isActive = selectedPracticeId === practice.id;
              return (
                <button
                  key={practice.id}
                  onClick={() => setSelectedPracticeId(practice.id)}
                  className={`px-4 py-2 text-xs uppercase tracking-wider font-mono rounded-sm transition-all duration-200 shrink-0 cursor-pointer ${
                    isActive
                      ? "bg-primary text-black font-semibold shadow-sm"
                      : "bg-white/[0.03] text-white/70 hover:text-white hover:bg-white/[0.07] border border-white/5"
                  }`}
                >
                  {practice.num}. {practice.title}
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Detailed Practices Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredPractices.map((practice, idx) => (
              <motion.article
                key={practice.id}
                layout
                initial={preferReduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{
                  duration: 0.45,
                  delay: preferReduced ? 0 : idx * 0.04,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group relative bg-white/[0.015] border border-white/10 hover:border-primary/40 rounded-sm p-8 md:p-10 transition-colors duration-300 flex flex-col justify-between"
              >
                {/* Top Accent & Practice Header */}
                <div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-5 mb-6">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-semibold text-primary tracking-widest uppercase">
                        PRACTICE // {practice.num}
                      </span>
                      <span className="text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 rounded-xs bg-white/5 text-white/60 border border-white/10">
                        {practice.deliverables.length} Deliverables
                      </span>
                    </div>

                    <span className="w-2 h-2 rounded-full bg-primary/40 group-hover:bg-primary transition-colors duration-300" />
                  </div>

                  <h3 className="text-2xl md:text-3xl font-serif text-white group-hover:text-primary transition-colors duration-300 mb-2">
                    {practice.title}
                  </h3>

                  <p className="text-sm text-white/70 font-sans font-light mb-8 italic">
                    {practice.shortDesc}
                  </p>

                  {/* Bulleted Deliverables List */}
                  <div className="space-y-3 pt-2">
                    <span className="text-[11px] uppercase tracking-[0.2em] text-primary/80 font-mono font-semibold block mb-4">
                      Detailed Deliverables:
                    </span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                      {practice.deliverables.map((item, itemIdx) => (
                        <li
                          key={itemIdx}
                          className="flex items-start gap-2.5 text-xs md:text-sm text-white/80 font-sans font-light leading-snug group/item"
                        >
                          <span
                            className="text-primary font-bold text-base leading-none select-none shrink-0 group-hover/item:text-white transition-colors"
                            aria-hidden="true"
                          >
                            •
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom Card Footer with Subtle Contact Prompt */}
                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-xs text-white/40 font-mono">
                  <span>Advisory & Implementation</span>
                  <a
                    href="/contact"
                    className="text-primary/70 hover:text-primary transition-colors underline-offset-4 hover:underline uppercase tracking-wider"
                  >
                    Inquire About This Practice →
                  </a>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
