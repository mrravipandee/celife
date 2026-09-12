"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Reveal } from "@/components/motion/Reveal";
import { LineReveal } from "@/components/motion/LineReveal";

interface Deliverable {
  num: string;
  title: string;
  category: string;
  desc: string;
}

const DELIVERABLES: Deliverable[] = [
  {
    num: "01",
    category: "DOCUMENTATION",
    title: "Comprehensive Audit Report",
    desc: "An exhaustive, evidence-backed evaluation document detailing department-level findings, photographic records, and operational gap assessments.",
  },
  {
    num: "02",
    category: "METRICS",
    title: "Department-Wise Performance Score",
    desc: "A structured benchmarking score per operational section (Kitchen, Housekeeping, Front Desk, F&B, Stores) quantifying performance against luxury benchmarks.",
  },
  {
    num: "03",
    category: "PRIORITIZATION",
    title: "Critical & Major Observations",
    desc: "Clear categorization of immediate operational risks, guest-impacting service failures, safety concerns, and urgent compliance items.",
  },
  {
    num: "04",
    category: "FINANCIAL DIAGNOSTICS",
    title: "Revenue and Cost Leakage Identification",
    desc: "Uncovering margin erosion, inventory shrinkage, recipe over-portioning, billing variances, and unmonitored vendor cost discrepancies.",
  },
  {
    num: "05",
    category: "OPERATIONAL STRATEGY",
    title: "Operational Improvement Recommendations",
    desc: "Action-oriented process optimizations to streamline kitchen line pacing, improve housekeeping room turnover, and enhance guest touchpoint quality.",
  },
  {
    num: "06",
    category: "ROADMAP",
    title: "30-90 Day Corrective Action Plan",
    desc: "A chronological, department-by-department execution calendar outlining weekly milestones, responsible personnel, and review checkpoints.",
  },
  {
    num: "07",
    category: "EXECUTIVE ALIGNMENT",
    title: "Management Review & Implementation Guidance",
    desc: "In-person or executive briefing with leadership and department heads to walk through findings, answer operational queries, and align execution.",
  },
];

export function AuditDeliverables() {
  const preferReduced = useReducedMotion();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section className="bg-black text-white py-20 md:py-28 border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <Reveal>
            <span className="text-xs uppercase tracking-[0.3em] text-primary font-semibold block">
              TANGIBLE OUTPUTS
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white tracking-tight uppercase mt-2">
              Audit Deliverables
            </h2>
          </Reveal>
          <LineReveal className="bg-primary/50 max-w-[180px]" delay={0.2} />
          <Reveal delay={0.3}>
            <p className="text-sm md:text-base text-white/70 font-sans leading-relaxed font-light">
              Every audit delivers structured, executive-ready documentation that converts operational observations into decisive management action.
            </p>
          </Reveal>
        </div>

        {/* Deliverables List (Editorial Rows / Cards) */}
        <div className="space-y-4">
          {DELIVERABLES.map((item, index) => {
            const isHovered = hoveredIdx === index;
            const isSibling = hoveredIdx !== null && !isHovered;

            return (
              <motion.div
                key={item.num}
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
                        opacity: isSibling ? 0.6 : 1,
                        x: isHovered ? 6 : 0,
                      }
                }
                onMouseEnter={() => setHoveredIdx(index)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="group relative p-6 md:p-8 border border-white/10 hover:border-primary/50 bg-white/[0.015] hover:bg-white/[0.035] transition-all duration-300 rounded-sm"
              >
                {/* Gold Left Border Highlight on Hover */}
                <div className="absolute top-0 left-0 w-[2px] h-full bg-transparent overflow-hidden">
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    style={{ transformOrigin: "top" }}
                    className="w-full h-full bg-primary"
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-start">
                  {/* Left Column: Number & Category */}
                  <div className="lg:col-span-3 flex items-center space-x-4">
                    <span className="font-serif text-3xl font-light text-primary/70 group-hover:text-primary transition-colors tabular-nums">
                      {item.num}
                    </span>
                    <span className="text-[11px] font-mono uppercase tracking-widest text-white/50 group-hover:text-primary/90 transition-colors">
                      {item.category}
                    </span>
                  </div>

                  {/* Middle Column: Title */}
                  <div className="lg:col-span-4">
                    <h3 className="text-xl font-serif text-white group-hover:text-primary transition-colors leading-snug">
                      {item.title}
                    </h3>
                  </div>

                  {/* Right Column: Description */}
                  <div className="lg:col-span-5">
                    <p className="text-xs md:text-sm text-white/70 font-sans leading-relaxed font-light">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
