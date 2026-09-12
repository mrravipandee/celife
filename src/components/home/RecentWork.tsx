"use client";

import React from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Reveal } from "@/components/motion/Reveal";

const CATEGORIES = [
  "New Gujarati thali restaurant launch",
  "Restaurant staffing and operations",
  "SOP and documentation development",
  "Hotel revenue and room strategy",
  "Restaurant menu engineering",
  "Hospitality branding project",
  "Digital advertising for a hospitality business",
  "Banquet or catering planning",
];

export function RecentWork() {
  const preferReduced = useReducedMotion();

  return (
    <section className="bg-black text-white py-20 md:py-28 border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <Reveal className="max-w-3xl mb-12 space-y-4">
          <span className="text-xs uppercase tracking-[0.3em] text-primary block font-semibold">
            SELECTED PROJECTS
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-white tracking-tight leading-tight">
            Recent Work
          </h2>
          <p className="text-sm md:text-base text-white/70 leading-relaxed font-sans font-light">
            A sample of the kind of engagements we take on.
          </p>
        </Reveal>

        {/* Note / Disclaimer Banner */}
        <Reveal delay={0.1} className="mb-12">
          <div className="p-4 md:p-5 bg-white/[0.02] border border-primary/30 rounded-sm">
            <p className="text-xs md:text-sm text-primary/90 font-mono tracking-wide">
              [Full case studies with outcomes and photographs to be added once client approvals are confirmed]
            </p>
          </div>
        </Reveal>

        {/* 2-Column Grid of Project Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CATEGORIES.map((item, idx) => (
            <motion.div
              key={item + idx}
              initial={preferReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{
                duration: 0.55,
                delay: preferReduced ? 0 : (idx % 4) * 0.06,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group relative p-6 md:p-8 bg-white/[0.015] border border-white/10 hover:border-primary/50 transition-colors duration-300 rounded-sm flex items-center justify-between overflow-hidden cursor-default"
            >
              <div className="flex items-center space-x-5">
                <span className="text-xs font-mono text-primary font-semibold tracking-wider">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span className="text-base md:text-lg font-serif text-white/90 group-hover:text-white transition-colors duration-300">
                  {item}
                </span>
              </div>
              <span className="text-xs uppercase tracking-widest text-white/30 group-hover:text-primary transition-colors duration-300 font-sans">
                Advisory
              </span>

              {/* Bottom Draw Line */}
              <div className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-primary transition-all duration-500 group-hover:w-full" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
