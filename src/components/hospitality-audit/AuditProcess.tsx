"use client";

import React from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Reveal } from "@/components/motion/Reveal";
import { LineReveal } from "@/components/motion/LineReveal";

interface ProcessStep {
  step: string;
  title: string;
  desc: string;
}

const AUDIT_STEPS: ProcessStep[] = [
  {
    step: "01",
    title: "Property Assessment",
    desc: "Preliminary baseline review of property structure, capacity, financial statements & key operating metrics.",
  },
  {
    step: "02",
    title: "Department-Wise Audit",
    desc: "On-site physical inspection across kitchen, front desk, housekeeping, inventory, billing & F&B service.",
  },
  {
    step: "03",
    title: "Gap Identification",
    desc: "Pinpointing cost leakages, compliance shortfalls, service bottlenecks, and margin inefficiencies.",
  },
  {
    step: "04",
    title: "Audit Score",
    desc: "Formulating a weighted diagnostic rating per operational department and overall property performance.",
  },
  {
    step: "05",
    title: "Detailed Report",
    desc: "Delivering an evidence-backed documentation dossier with photographic records and departmental breakdowns.",
  },
  {
    step: "06",
    title: "Corrective Action Plan",
    desc: "Structuring a prioritized 30 to 90-day execution roadmap addressing high-impact leakages first.",
  },
  {
    step: "07",
    title: "Management Review",
    desc: "Executive debrief with property owners, General Managers, and department heads for implementation alignment.",
  },
];

export function AuditProcess() {
  const preferReduced = useReducedMotion();

  return (
    <section className="bg-black text-white py-20 md:py-28 border-b border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <Reveal>
            <span className="text-xs uppercase tracking-[0.3em] text-primary font-semibold block">
              EXECUTION BLUEPRINT
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white tracking-tight uppercase mt-2">
              Our Audit Process
            </h2>
          </Reveal>
          <LineReveal className="bg-primary/50 max-w-[180px]" delay={0.2} />
          <Reveal delay={0.3}>
            <p className="text-sm md:text-base text-white/70 font-sans leading-relaxed font-light">
              A seven-phase structured diagnostic methodology designed to yield clear, measurable, and implementable operational outcomes.
            </p>
          </Reveal>
        </div>

        {/* Desktop View: Horizontal Editorial Progressive Flow (7 steps) */}
        <div className="hidden lg:block relative pt-6">
          {/* Connecting Hairline */}
          <div className="absolute top-12 left-0 right-0 h-px bg-white/10 overflow-hidden">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: "left" }}
              className="w-full h-full bg-gradient-to-r from-primary/30 via-primary to-primary/30"
            />
          </div>

          <div className="grid grid-cols-7 gap-4 relative z-10">
            {AUDIT_STEPS.map((step, idx) => (
              <motion.div
                key={step.step}
                initial={preferReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{
                  duration: 0.7,
                  delay: preferReduced ? 0 : idx * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group relative flex flex-col pt-10"
              >
                {/* Node on the timeline */}
                <div className="absolute top-3 left-0 flex items-center">
                  <div className="w-6 h-6 rounded-full border border-primary/50 bg-black flex items-center justify-center group-hover:border-primary group-hover:bg-primary/20 transition-all duration-300">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  {idx < AUDIT_STEPS.length - 1 && (
                    <span className="hidden xl:inline-block ml-3 text-[10px] font-mono text-primary/40">
                      →
                    </span>
                  )}
                </div>

                <span className="font-serif text-3xl text-primary/80 font-light tabular-nums mb-2">
                  {step.step}
                </span>

                <h3 className="text-base font-serif text-white group-hover:text-primary transition-colors leading-snug mb-2 font-normal">
                  {step.title}
                </h3>

                <p className="text-xs text-white/60 font-sans leading-relaxed font-light">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile & Tablet View: Vertical Editorial Timeline */}
        <div className="lg:hidden relative pl-6 sm:pl-8 border-l border-white/15 space-y-10">
          {AUDIT_STEPS.map((step, idx) => (
            <motion.div
              key={step.step}
              initial={preferReduced ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{
                duration: 0.6,
                delay: preferReduced ? 0 : idx * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative group space-y-2"
            >
              {/* Timeline Bullet */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full border border-primary bg-black flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              </div>

              <div className="flex items-center space-x-3">
                <span className="font-serif text-2xl text-primary font-light tabular-nums">
                  {step.step}
                </span>
                <h3 className="text-lg font-serif text-white group-hover:text-primary transition-colors">
                  {step.title}
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-white/70 font-sans leading-relaxed font-light pl-9">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
