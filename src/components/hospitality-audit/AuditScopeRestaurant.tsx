"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Reveal } from "@/components/motion/Reveal";
import { LineReveal } from "@/components/motion/LineReveal";

const RESTAURANT_AUDIT_ITEMS = [
  { num: "01", title: "Kitchen Operations & Hygiene", desc: "Line flow, food prep discipline, station sanitation & equipment upkeep." },
  { num: "02", title: "Food Safety Practices", desc: "Cross-contamination prevention, temperature logs & storage protocols." },
  { num: "03", title: "Food Cost & Portion Control", desc: "Recipe standardization, plate yield tracking & portion consistency." },
  { num: "04", title: "Purchase & Inventory Management", desc: "Vendor receiving checks, stock turnover & par-level accuracy." },
  { num: "05", title: "Wastage & Leakage Control", desc: "Prep trim logs, spoilage reduction & unaccounted ingredient drain." },
  { num: "06", title: "Menu Performance & Pricing", desc: "Contribution margin matrix, item popularity & pricing elasticity." },
  { num: "07", title: "Service Standards", desc: "Guest greeting, table turn-times, upselling & order cadence." },
  { num: "08", title: "Staff Productivity & Grooming", desc: "Shift efficiency, team presentation & operational task completion." },
  { num: "09", title: "Billing & Cash Controls", desc: "POS reconciliation, void/discount audits & cashier security." },
  { num: "10", title: "Guest Experience", desc: "Atmosphere, service attentiveness, acoustic comfort & hospitality touchpoints." },
  { num: "11", title: "Sales Performance", desc: "Revenue per seat hour (RevPASH), average check size & day-part trends." },
  { num: "12", title: "SOP & Process Compliance", desc: "Adherence to daily opening, mid-shift & closing operational manuals." },
  { num: "13", title: "Cleanliness & Maintenance", desc: "Dining area upkeep, kitchen deep-cleaning routines & facility care." },
  { num: "14", title: "Online Ratings & Customer Feedback", desc: "Review platform sentiment, complaint patterns & guest retention." },
  { num: "15", title: "Profitability & Operational Efficiency", desc: "Direct gross margin optimization & prime cost rationalization." },
];

export function AuditScopeRestaurant() {
  const preferReduced = useReducedMotion();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section className="bg-black text-white py-20 md:py-28 border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <Reveal>
            <span className="text-xs uppercase tracking-[0.3em] text-primary font-semibold block">
              FOOD & BEVERAGE ADVISORY SCOPE
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white tracking-tight uppercase mt-2">
              Restaurant Audit Covers
            </h2>
          </Reveal>
          <LineReveal className="bg-primary/50 max-w-[180px]" delay={0.2} />
          <Reveal delay={0.3}>
            <p className="text-sm md:text-base text-white/70 font-sans leading-relaxed font-light">
              A comprehensive department-by-department evaluation engineered to eliminate wastage, enforce culinary standards, and maximize restaurant margins.
            </p>
          </Reveal>
        </div>

        {/* Editorial Checklist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {RESTAURANT_AUDIT_ITEMS.map((item, index) => {
            const isHovered = hoveredIdx === index;
            const isSibling = hoveredIdx !== null && !isHovered;

            return (
              <motion.div
                key={item.num}
                initial={preferReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{
                  duration: 0.6,
                  delay: preferReduced ? 0 : index * 0.04,
                  ease: [0.16, 1, 0.3, 1],
                }}
                animate={
                  preferReduced
                    ? { opacity: 1 }
                    : {
                        opacity: isSibling ? 0.5 : 1,
                        y: isHovered ? -3 : 0,
                      }
                }
                onMouseEnter={() => setHoveredIdx(index)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="group relative p-7 border border-white/10 hover:border-primary/50 bg-white/[0.015] hover:bg-white/[0.035] transition-all duration-300 rounded-sm flex flex-col justify-between"
              >
                {/* Gold Top Hairline on Hover */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-transparent overflow-hidden">
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    style={{ transformOrigin: "left" }}
                    className="w-full h-full bg-primary"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-2xl font-light text-primary/70 group-hover:text-primary transition-colors tabular-nums">
                      {item.num}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-primary transition-colors duration-300" />
                  </div>

                  <h3 className="text-lg md:text-xl font-serif text-white group-hover:text-primary transition-colors duration-300 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs md:text-sm text-white/65 font-sans leading-relaxed font-light">
                    {item.desc}
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
