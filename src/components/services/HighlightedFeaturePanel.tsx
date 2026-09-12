"use client";

import React from "react";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { LineReveal } from "@/components/motion/LineReveal";

export function HighlightedFeaturePanel() {
  return (
    <section className="bg-black text-white py-20 md:py-28 border-b border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="relative p-10 md:p-16 border border-primary/40 bg-white/[0.015] rounded-sm overflow-hidden">
          {/* Subtle Corner Brackets Accent */}
          <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-primary/60" />
          <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-primary/60" />
          <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-primary/60" />
          <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-primary/60" />

          <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
            <Reveal>
              <span className="text-xs uppercase tracking-[0.3em] text-primary block font-semibold">
                OUR HANDS-ON COMMITMENT
              </span>
            </Reveal>

            <Reveal delay={0.1}>
              <h2 className="text-3xl md:text-5xl font-serif text-white tracking-tight uppercase leading-snug">
                THEDCO works alongside your team, not from a distance
              </h2>
            </Reveal>

            <LineReveal className="bg-primary/50 max-w-[120px] mx-auto" delay={0.25} />

            <Reveal delay={0.35}>
              <p className="text-base md:text-xl text-white/80 leading-relaxed font-sans font-light max-w-3xl mx-auto">
                Every plan is built on real operational data, sales reports, expense tracking and time spent on site, not templates borrowed from another business. We stay through implementation, adjusting as we go, until the results hold.
              </p>
            </Reveal>

            <Reveal delay={0.5} className="pt-4">
              <Link
                href="/contact"
                className="inline-block text-xs md:text-sm uppercase tracking-[0.25em] bg-primary text-black font-semibold hover:bg-white hover:text-black px-10 py-5 transition-all duration-300 rounded-sm cursor-pointer"
              >
                Book a Consultation →
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
