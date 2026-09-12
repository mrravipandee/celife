"use client";

import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { LineReveal } from "@/components/motion/LineReveal";
import { WordStagger } from "@/components/motion/ScrollReveal";

export function ServicesHero() {
  return (
    <section className="relative pt-40 pb-20 border-b border-white/5 overflow-hidden bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-8 space-y-8">
            <Reveal>
              <span className="text-xs md:text-sm uppercase tracking-[0.25em] text-primary font-semibold">
                THEDCO ADVISORY
              </span>
            </Reveal>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif leading-[1.15] text-white tracking-tight select-text">
              <WordStagger
                text="Hospitality Advisory Services"
                delay={0.2}
                staggerDelay={0.08}
                duration={0.8}
              />
            </h1>

            <LineReveal className="bg-primary max-w-[200px]" delay={0.4} />

            <Reveal delay={0.5}>
              <p className="text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed font-sans font-light">
                THEDCO works with hotel and restaurant owners on strategy, operations, staffing and profitability, from the earliest planning stage through daily execution.
              </p>
            </Reveal>

            <Reveal delay={0.65} className="pt-2">
              <Link
                href="/contact"
                className="inline-block text-xs uppercase tracking-[0.22em] bg-primary text-black font-semibold hover:bg-white hover:text-black px-8 py-4 transition-all duration-300 rounded-sm"
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
