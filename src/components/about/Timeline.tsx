"use client";

import React from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Reveal } from "@/components/motion/Reveal";

const MILESTONES = [
  {
    step: "01",
    tag: "1983 — HERITAGE FOUNDATION",
    title: "Panchavati Group Opens",
    desc: "Panchavati Group of Hotels, Motels and Restaurants opens, a family hospitality business built from the ground up.",
  },
  {
    step: "02",
    tag: "OPERATIONAL MASTERY",
    title: "Direct Floor Experience",
    desc: "Years of direct, hands-on involvement in hotel and restaurant operations, guest service, daily management and financial discipline, learned inside a working business rather than a classroom.",
  },
  {
    step: "03",
    tag: "BRAND STRATEGY",
    title: "The Brand Klinik Founded",
    desc: "The Brand Klinik is founded, bringing branding and marketing expertise into the hospitality world.",
  },
  {
    step: "04",
    tag: "DIGITAL ECOSYSTEM",
    title: "XLAR Media Service",
    desc: "XLAR Media Service follows, extending that experience into wider digital marketing and advertising work.",
  },
  {
    step: "05",
    tag: "ADVISORY PRACTICE",
    title: "THEDCO Founded",
    desc: "THEDCO is founded, bringing hospitality operations, branding and business strategy together under one advisory practice.",
  },
];

export function Timeline() {
  const preferReduced = useReducedMotion();

  return (
    <section className="bg-black text-white py-20 md:py-28 border-b border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header Block */}
        <Reveal className="max-w-3xl mb-16 space-y-4">
          <span className="text-xs uppercase tracking-[0.3em] text-primary block font-semibold">
            TIMELINE
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-white tracking-tight uppercase leading-tight">
            Three Generations in Hospitality
          </h2>
        </Reveal>

        {/* Timeline Items Grid */}
        <div className="relative space-y-12 md:space-y-16">
          {/* Vertical progress line */}
          <div className="hidden md:block absolute left-8 top-4 bottom-4 w-[1px] bg-white/10" />

          {MILESTONES.map((item, idx) => (
            <motion.div
              key={item.step}
              initial={preferReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{
                duration: 0.6,
                delay: preferReduced ? 0 : idx * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-12 group"
            >
              {/* Timeline Marker Bead */}
              <div className="flex items-center space-x-4 md:space-x-8 shrink-0">
                <span className="w-16 h-16 rounded-full border border-primary/40 group-hover:border-primary bg-black flex items-center justify-center text-primary font-mono text-sm font-semibold tracking-wider transition-colors duration-300 z-10">
                  {item.step}
                </span>
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-primary/70 block md:hidden">
                  {item.tag}
                </span>
              </div>

              {/* Content Card */}
              <div className="flex-1 p-6 md:p-8 bg-white/[0.015] border border-white/10 group-hover:border-primary/40 transition-colors duration-300 rounded-sm relative overflow-hidden">
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-primary/70 hidden md:block mb-2">
                  {item.tag}
                </span>
                <p className="text-base md:text-lg text-white/85 group-hover:text-white leading-relaxed font-sans font-light transition-colors duration-300">
                  {item.desc}
                </p>

                {/* Bottom accent draw */}
                <div className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-primary transition-all duration-500 group-hover:w-full" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
