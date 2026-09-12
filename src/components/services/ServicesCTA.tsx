"use client";

import React from "react";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { WordStagger } from "@/components/motion/ScrollReveal";
import { MagneticButton } from "@/components/ui/MagneticButton";

export function ServicesCTA() {
  return (
    <section className="bg-black py-20 md:py-28 text-center border-t border-white/5 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 space-y-8 relative z-10">
        <h2 className="text-3xl md:text-5xl font-serif text-white tracking-tight uppercase leading-snug select-text">
          <WordStagger
            text="Need Advisory Support for Your Project?"
            delay={0.1}
            staggerDelay={0.06}
            duration={0.8}
          />
        </h2>

        <Reveal delay={0.2}>
          <p className="text-sm md:text-base text-white/70 leading-relaxed font-sans max-w-xl mx-auto">
            Schedule a consultation call to discuss your property layout, cost sheet, recruitment timeline, or brand concept with the THEDCO advisory team.
          </p>
        </Reveal>

        <Reveal delay={0.35} className="pt-4">
          <MagneticButton strength={0.3}>
            <Link
              href="/contact"
              className="inline-block text-xs md:text-sm uppercase tracking-[0.25em] bg-primary text-black font-semibold hover:bg-white hover:text-black px-10 py-5 transition-all duration-300 cursor-pointer rounded-sm"
            >
              Book a Consultation
            </Link>
          </MagneticButton>
        </Reveal>
      </div>
    </section>
  );
}
