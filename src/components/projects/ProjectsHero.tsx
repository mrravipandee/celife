"use client";

import React from "react";
import { Reveal } from "@/components/motion/Reveal";
import { LineReveal } from "@/components/motion/LineReveal";
import { WordStagger } from "@/components/motion/ScrollReveal";

export function ProjectsHero() {
  return (
    <section className="relative pt-40 pb-12 border-b border-white/5 overflow-hidden bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-8 space-y-6">
            <Reveal>
              <span className="text-xs md:text-sm uppercase tracking-[0.25em] text-primary font-semibold">
                PORTFOLIO
              </span>
            </Reveal>

            <h1 className="text-4xl md:text-6xl font-serif text-white tracking-tight leading-tight select-text">
              <WordStagger
                text="Our Hospitality Case Studies"
                delay={0.2}
                staggerDelay={0.07}
                duration={0.8}
              />
            </h1>

            <LineReveal className="bg-primary max-w-[200px]" delay={0.4} />
          </div>

          <div className="lg:col-span-4 lg:pt-12">
            <Reveal delay={0.5}>
              <p className="text-sm md:text-base text-white/70 leading-relaxed font-sans">
                A selection of hotel launches, restaurant turnaround plans, branding developments, and operating systems we have delivered for advisory clients.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
