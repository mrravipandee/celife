"use client";

import React from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Reveal } from "@/components/motion/Reveal";
import { LineReveal } from "@/components/motion/LineReveal";

const GUIDING_ITEMS = [
  {
    id: "01",
    title: "Hospitality Operations",
    desc: "12+ years inside a family run hotel, motel and restaurant group, covering guest service, operations and financial management learned first hand.",
  },
  {
    id: "02",
    title: "Business Strategy and Family Enterprise",
    desc: "Master’s in Global Family Managed Business from SP Jain, covering strategy, succession planning and scaling family owned hospitality businesses.",
  },
];

export function AdvisoryApproach() {
  const preferReduced = useReducedMotion();

  return (
    <section className="bg-black text-white py-20 md:py-28 border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-16">
        {/* Section Header */}
        <Reveal className="space-y-4 max-w-3xl">
          <span className="text-xs uppercase tracking-[0.3em] text-primary block font-semibold">
            ADVISORY PHILOSOPHY
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-white tracking-tight uppercase mt-3">
            What Guides the Approach
          </h2>
        </Reveal>

        {/* 2-Column Guiding Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {GUIDING_ITEMS.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={preferReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{
                duration: 0.6,
                delay: preferReduced ? 0 : idx * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="p-8 md:p-10 border border-white/10 bg-white/[0.015] hover:border-primary/40 transition-colors duration-300 rounded-sm space-y-4"
            >
              <div className="flex items-center space-x-3">
                <span className="text-xs font-mono text-primary font-semibold tracking-wider">
                  {item.id}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
              </div>
              <h3 className="text-xl md:text-2xl font-serif text-white uppercase tracking-wide">
                {item.title}
              </h3>
              <p className="text-sm md:text-base text-white/75 leading-relaxed font-sans font-light">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Quote Block */}
        <div className="pt-8 border-t border-white/10 max-w-4xl mx-auto space-y-6 text-center">
          <Reveal>
            <span className="text-7xl font-serif text-primary/20 block select-none">
              &ldquo;
            </span>
          </Reveal>

          <Reveal delay={0.1}>
            <blockquote className="text-2xl md:text-4xl font-serif italic text-white/95 leading-relaxed font-light">
              &ldquo;Exceptional hospitality is created through operational excellence, financial discipline, continuous innovation, and a consistent commitment to the guest experience.&rdquo;
            </blockquote>
          </Reveal>

          <LineReveal className="bg-primary/45 w-16 mx-auto" delay={0.25} />

          <Reveal delay={0.3}>
            <div className="space-y-1">
              <span className="block text-lg font-serif text-primary font-medium">
                Manav Chandak
              </span>
              <span className="block text-xs uppercase tracking-[0.2em] text-white/60 font-sans font-medium">
                Founder, THEDCO
              </span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
