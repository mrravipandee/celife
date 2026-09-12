"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Reveal } from "@/components/motion/Reveal";
import { TEN_ADVISORY_PRACTICES } from "@/data/practicesData";

export function WhatWeOfferServices() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const preferReduced = useReducedMotion();

  const handleScrollToFullList = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById("consultancy-services");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="what-we-offer" className="bg-black text-white py-20 md:py-28 border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <Reveal className="max-w-3xl space-y-4">
            <span className="text-xs uppercase tracking-[0.3em] text-primary block font-semibold">
              WHAT WE OFFER
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-white tracking-tight leading-tight">
              What We Offer
            </h2>
            <p className="text-base md:text-xl text-white/80 leading-relaxed font-sans font-light">
              Ten advisory practices, one team, one point of contact through the whole engagement.
            </p>
          </Reveal>

          {/* Quick Jump CTA Button */}
          <Reveal delay={0.2} className="shrink-0">
            <a
              href="#consultancy-services"
              onClick={handleScrollToFullList}
              className="inline-flex items-center gap-3 px-6 py-3.5 border border-primary/50 text-primary text-xs uppercase tracking-[0.2em] font-semibold hover:bg-primary hover:text-black transition-all duration-300 rounded-sm group cursor-pointer"
            >
              <span>View Full Service List</span>
              <span className="transition-transform duration-300 group-hover:translate-y-0.5">
                ↓
              </span>
            </a>
          </Reveal>
        </div>

        {/* 10-Item Practices Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEN_ADVISORY_PRACTICES.map((item, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <motion.div
                key={item.num}
                initial={preferReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{
                  duration: 0.5,
                  delay: preferReduced ? 0 : idx * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="group relative p-8 bg-white/[0.015] border border-white/10 flex flex-col justify-between min-h-[220px] transition-colors duration-300 rounded-sm overflow-hidden cursor-default hover:border-white/20"
              >
                {/* Gold Tracing Border on Hover */}
                {!preferReduced && (
                  <svg
                    className="absolute inset-0 w-full h-full pointer-events-none z-10"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="0.5"
                      y="0.5"
                      width="99%"
                      height="99%"
                      fill="none"
                      stroke="#c9a24a"
                      strokeWidth="1.5"
                      strokeDasharray="1400"
                      className="transition-all duration-700 ease-out"
                      style={{
                        strokeDashoffset: isHovered ? "0" : "1400",
                        opacity: isHovered ? 1 : 0,
                      }}
                    />
                  </svg>
                )}

                {/* Card Top: Number Indicator */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-primary font-semibold tracking-wider">
                    {item.num}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors duration-300" />
                </div>

                {/* Content */}
                <div className="space-y-3 pt-6">
                  <h3 className="text-xl md:text-2xl font-serif text-white group-hover:text-primary transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-sm text-white/75 leading-relaxed font-sans font-light">
                    {item.shortDesc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Centered Bottom Anchor Button */}
        <div className="mt-14 text-center">
          <a
            href="#consultancy-services"
            onClick={handleScrollToFullList}
            className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-black text-xs uppercase tracking-[0.22em] font-semibold hover:bg-white hover:text-black transition-all duration-300 rounded-sm group cursor-pointer shadow-lg shadow-primary/10"
          >
            <span>View Full Service List</span>
            <span className="transition-transform duration-300 group-hover:translate-y-0.5">
              ↓
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
