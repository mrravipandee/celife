"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Reveal } from "@/components/motion/Reveal";
import { LineReveal } from "@/components/motion/LineReveal";

interface AudienceCategory {
  id: string;
  name: string;
  focus: string;
}

const AUDIENCE_CATEGORIES: AudienceCategory[] = [
  { id: "01", name: "Restaurants", focus: "Fine dining, casual dining & experiential bistro operations." },
  { id: "02", name: "Cafes", focus: "Specialty coffee shops, bakery cafes & high-traffic brunch spots." },
  { id: "03", name: "QSRs", focus: "Quick-service chains, speed-of-service lines & franchise outlets." },
  { id: "04", name: "Hotels", focus: "Boutique hotels, business hotels & independent properties." },
  { id: "05", name: "Resorts", focus: "Destination retreats, leisure estates & wellness properties." },
  { id: "06", name: "Motels", focus: "Highway transit lodgings & select-service accommodation units." },
  { id: "07", name: "Banquet Properties", focus: "Convention halls, wedding venues & large-scale event facilities." },
  { id: "08", name: "Cloud Kitchens", focus: "Multi-brand delivery hubs, dark kitchens & central production units." },
  { id: "09", name: "Hospitality Groups", focus: "Multi-outlet portfolios, enterprise holding companies & regional chains." },
];

export function AuditWhoIsItFor() {
  const preferReduced = useReducedMotion();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section className="bg-black text-white py-20 md:py-28 border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <Reveal>
            <span className="text-xs uppercase tracking-[0.3em] text-primary font-semibold block">
              TARGET ASSET CLASSES
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white tracking-tight uppercase mt-2">
              Who Is It For?
            </h2>
          </Reveal>
          <LineReveal className="bg-primary/50 max-w-[180px]" delay={0.2} />
          <Reveal delay={0.3}>
            <p className="text-sm md:text-base text-white/70 font-sans leading-relaxed font-light">
              Tailored audit frameworks designed for diverse hospitality models — whether an independent boutique restaurant or a multi-property hospitality group.
            </p>
          </Reveal>
        </div>

        {/* 3x3 Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {AUDIENCE_CATEGORIES.map((cat, index) => {
            const isHovered = hoveredIdx === index;
            const isSibling = hoveredIdx !== null && !isHovered;

            return (
              <motion.div
                key={cat.id}
                initial={preferReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{
                  duration: 0.5,
                  delay: preferReduced ? 0 : index * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
                animate={
                  preferReduced
                    ? { opacity: 1 }
                    : {
                        opacity: isSibling ? 0.5 : 1,
                        y: isHovered ? -4 : 0,
                      }
                }
                onMouseEnter={() => setHoveredIdx(index)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="group relative p-8 border border-white/10 hover:border-primary/50 bg-white/[0.015] hover:bg-white/[0.035] transition-all duration-300 rounded-sm flex flex-col justify-between min-h-[190px]"
              >
                {/* Tracing Gold Hairline Top */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-transparent overflow-hidden">
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    style={{ transformOrigin: "left" }}
                    className="w-full h-full bg-primary"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-serif text-xl text-primary/70 group-hover:text-primary transition-colors tabular-nums">
                    {cat.id}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors duration-300" />
                </div>

                <div className="space-y-2 pt-4">
                  <h3 className="text-2xl font-serif text-white group-hover:text-primary transition-colors duration-300">
                    {cat.name}
                  </h3>
                  <p className="text-xs md:text-sm text-white/65 font-sans leading-relaxed font-light">
                    {cat.focus}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
