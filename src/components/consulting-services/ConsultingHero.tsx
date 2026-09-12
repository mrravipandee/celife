"use client";

import React from "react";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { WordStagger } from "@/components/motion/ScrollReveal";

export function ConsultingHero() {
  return (
    <section className="relative pt-40 pb-20 md:pt-48 md:pb-28 bg-black text-white border-b border-white/10 overflow-hidden">
      {/* Background Architectural Grid & Subtle Radial Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: "radial-gradient(#c9a24a 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/10 rounded-full blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="max-w-3xl space-y-6">
          <Reveal>
            <span className="text-xs md:text-sm uppercase tracking-[0.3em] text-primary font-semibold font-mono block">
              ADVISORY &bull; STRATEGY &bull; OPERATIONS
            </span>
          </Reveal>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white tracking-tight leading-[1.1] select-text">
            <WordStagger
              text="Hospitality Consulting Services"
              delay={0.15}
              staggerDelay={0.06}
              duration={0.75}
            />
          </h1>

          <Reveal delay={0.3}>
            <p className="text-base md:text-xl text-white/80 leading-relaxed font-sans font-light max-w-2xl">
              End-to-end strategic advisory, operational turnarounds, kitchen cost controls, and revenue growth frameworks engineered for hotels, restaurants, and resorts across India.
            </p>
          </Reveal>

          <Reveal delay={0.45}>
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href="/contact"
                className="inline-block text-xs md:text-sm uppercase tracking-[0.2em] font-semibold bg-primary text-black px-8 py-4 rounded-sm hover:bg-primary/90 transition-colors duration-300"
              >
                Schedule Consultation
              </Link>
              <Link
                href="/services"
                className="inline-block text-xs md:text-sm uppercase tracking-[0.2em] font-medium border border-white/20 text-white px-8 py-4 rounded-sm hover:border-primary hover:text-primary transition-colors duration-300"
              >
                All Services &rarr;
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
