"use client";

import React from "react";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { LineReveal } from "@/components/motion/LineReveal";
import { WordStagger } from "@/components/motion/ScrollReveal";
import { MagneticButton } from "@/components/ui/MagneticButton";

export function AuditHero() {
  return (
    <section className="relative pt-36 md:pt-44 pb-20 md:pb-28 border-b border-white/5 overflow-hidden bg-black text-white">
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/[0.04] rounded-full blur-[140px]"
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-8 space-y-8">
            <Reveal>
              <div className="flex items-center space-x-3">
                <span className="text-xs uppercase tracking-[0.28em] text-primary font-semibold">
                  HOSPITALITY AUDIT SERVICES
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                <span className="text-xs uppercase tracking-[0.2em] text-white/50 font-mono">
                  DIAGNOSTIC ADVISORY
                </span>
              </div>
            </Reveal>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif leading-[1.12] text-white tracking-tight select-text">
              <WordStagger
                text="Audit. Identify. Improve. Perform."
                delay={0.15}
                staggerDelay={0.06}
                duration={0.8}
              />
            </h1>

            <LineReveal className="bg-primary max-w-[240px]" delay={0.35} />

            <Reveal delay={0.45}>
              <div className="space-y-4 max-w-2xl text-base md:text-lg text-white/80 leading-relaxed font-sans font-light">
                <p>
                  Our Hospitality Audit Services give restaurant and hotel owners an unbiased view of how their property is actually performing.
                </p>
                <p className="text-sm md:text-base text-white/70">
                  We assess operations department-by-department, identify service gaps, revenue leakages, compliance risks and efficiency issues, and convert the findings into a practical corrective action plan.
                </p>
              </div>
            </Reveal>

            {/* CTAs */}
            <Reveal delay={0.6}>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
                <MagneticButton strength={0.25}>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center text-xs md:text-sm uppercase tracking-[0.22em] bg-primary text-black font-semibold hover:bg-white hover:text-black px-8 py-4.5 transition-all duration-300 rounded-sm text-center"
                  >
                    Book a Hospitality Audit
                    <span className="ml-2.5">→</span>
                  </Link>
                </MagneticButton>

                <MagneticButton strength={0.2}>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center text-xs md:text-sm uppercase tracking-[0.22em] border border-white/30 text-white/90 hover:border-primary hover:text-primary px-8 py-4.5 transition-all duration-300 rounded-sm text-center"
                  >
                    Discuss Your Property
                  </Link>
                </MagneticButton>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-4 lg:pt-16 space-y-6">
            <Reveal delay={0.5}>
              <div className="p-6 md:p-8 border border-white/10 bg-white/[0.015] rounded-sm space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs uppercase tracking-widest text-primary font-mono font-medium">
                    ADVISORY SCOPE
                  </span>
                  <span className="text-xs uppercase tracking-widest text-white/50 font-mono">
                    PAN-INDIA
                  </span>
                </div>
                <p className="text-xs md:text-sm text-white/70 font-sans leading-relaxed font-light">
                  On-site audits conducted with zero operational disruption. Uncovering root causes behind margin compression, service inconsistency, and departmental friction.
                </p>
                <div className="pt-2 flex items-center gap-4 text-xs font-mono tracking-wider text-white/50">
                  <span>360° INSPECTION</span>
                  <span className="w-1 h-1 rounded-full bg-primary" />
                  <span>ACTIONABLE ROI</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
