"use client";

import React from "react";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowUpRight, PhoneCall, ShieldCheck } from "lucide-react";

export function ConsultingCTA() {
  return (
    <section className="py-24 md:py-32 bg-[#050505] text-white relative overflow-hidden border-t border-white/10">
      {/* Radial Gold Lighting */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[450px] bg-primary/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 md:px-12 text-center relative z-10 space-y-8">
        <Reveal>
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs uppercase tracking-[0.25em] font-mono font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>Confidential Executive Advisory</span>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif text-white tracking-tight leading-tight">
            Ready to Optimize Your Hospitality Asset?
          </h2>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="text-base md:text-xl text-white/75 font-sans leading-relaxed font-light max-w-2xl mx-auto">
            Schedule an introductory consultation with Manav Chandak and THEDCO’s senior advisory team to evaluate your operational cost sheets, GOP recovery, or pre-opening strategy.
          </p>
        </Reveal>

        <Reveal delay={0.35}>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 text-xs md:text-sm uppercase tracking-[0.25em] font-semibold bg-primary text-black px-10 py-5 rounded-sm hover:bg-white hover:text-black transition-all duration-300 shadow-xl"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Book a Consultation</span>
            </Link>

            <Link
              href="/projects"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 text-xs md:text-sm uppercase tracking-[0.25em] font-medium border border-white/20 text-white px-10 py-5 rounded-sm hover:border-primary hover:text-primary transition-all duration-300"
            >
              <span>View Proven Projects</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
