"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Reveal } from "@/components/motion/Reveal";
import { LineReveal } from "@/components/motion/LineReveal";

const HOTEL_AUDIT_ITEMS = [
  { num: "01", title: "Front Office & Reservations", desc: "Check-in/out speed, lobby welcome, concierge standards & booking capture." },
  { num: "02", title: "Housekeeping & Room Standards", desc: "Turnaround cleanliness, linen maintenance, amenities & room inspection checklist." },
  { num: "03", title: "Food & Beverage Operations", desc: "All-day dining, in-room dining efficiency, bar service & guest satisfaction." },
  { num: "04", title: "Kitchen & Food Safety", desc: "Culinary production hygiene, cold chain compliance & HACCP standards." },
  { num: "05", title: "Banquets & Events", desc: "Function setup execution, banquet food service & event billing accuracy." },
  { num: "06", title: "Purchase & Stores", desc: "Central store inventory, PO approvals, perishable management & par-stock controls." },
  { num: "07", title: "Revenue Management & Room Pricing", desc: "Dynamic rate tiers, length-of-stay controls & channel yield management." },
  { num: "08", title: "OTA Performance", desc: "Online Travel Agency rank, content scoring, commission optimization & parity." },
  { num: "09", title: "Sales & Corporate Business", desc: "Corporate contracting, RFP response efficiency & direct sales pipeline." },
  { num: "10", title: "Staff Productivity & Training", desc: "Departmental staffing ratios, grooming standards & cross-training efficacy." },
  { num: "11", title: "Engineering & Maintenance", desc: "Preventative upkeep schedules, HVAC energy efficiency & asset lifecycle." },
  { num: "12", title: "Guest Experience", desc: "Property sensory impression, guest feedback loops & loyalty touchpoints." },
  { num: "13", title: "Safety & Operational Compliance", desc: "Fire safety, emergency readiness, licensing & statutory protocols." },
  { num: "14", title: "SOP Implementation", desc: "Cross-departmental standard operating procedures & daily execution rigor." },
  { num: "15", title: "Financial & Revenue Leakages", desc: "Night audit controls, room upgrade reconciliations & billing slippage." },
  { num: "16", title: "Overall Property Performance", desc: "Holistic asset productivity, operational profitability & RevPAR growth." },
];

export function AuditScopeHotel() {
  const preferReduced = useReducedMotion();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section className="bg-black text-white py-20 md:py-28 border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <Reveal>
            <span className="text-xs uppercase tracking-[0.3em] text-primary font-semibold block">
              ACCOMMODATION & RESORT SCOPE
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white tracking-tight uppercase mt-2">
              Hotel & Resort Audit Covers
            </h2>
          </Reveal>
          <LineReveal className="bg-primary/50 max-w-[180px]" delay={0.2} />
          <Reveal delay={0.3}>
            <p className="text-sm md:text-base text-white/70 font-sans leading-relaxed font-light">
              Full-spectrum property diagnostics across room division, food & beverage, revenue distribution, and engineering systems.
            </p>
          </Reveal>
        </div>

        {/* Editorial Checklist Grid (4 Columns on large desktop, 2 on tablet, 1 on mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {HOTEL_AUDIT_ITEMS.map((item, index) => {
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
                  delay: preferReduced ? 0 : index * 0.035,
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
                className="group relative p-6 border border-white/10 hover:border-primary/50 bg-white/[0.015] hover:bg-white/[0.035] transition-all duration-300 rounded-sm flex flex-col justify-between"
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

                  <h3 className="text-base md:text-lg font-serif text-white group-hover:text-primary transition-colors duration-300 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-white/65 font-sans leading-relaxed font-light">
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
