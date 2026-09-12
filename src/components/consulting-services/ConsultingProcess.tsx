"use client";

import React from "react";
import { motion } from "motion/react";
import { Reveal } from "@/components/motion/Reveal";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Search, Compass, Rocket, BarChart3 } from "lucide-react";

interface ProcessStep {
  number: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  duration: string;
  description: string;
  outcomes: string[];
}

const PROCESS_STEPS: ProcessStep[] = [
  {
    number: "01",
    icon: Search,
    title: "On-Site Audit & Forensic Diagnostic",
    duration: "Weeks 1 - 2",
    description:
      "Deep-dive physical inspection, financial record auditing, staff operational interviews, and competitor benchmarking across all revenue departments.",
    outcomes: [
      "360° Property Diagnostic Report",
      "Cost Leakage & Payroll Audit",
      "Competitive Positioning Map",
    ],
  },
  {
    number: "02",
    icon: Compass,
    title: "Strategic Blueprint & Financial Modeling",
    duration: "Weeks 3 - 4",
    description:
      "Crafting tailor-made SOPs, revised organizational charts, menu re-engineering matrices, and 12-month GOP recovery budget models.",
    outcomes: [
      "Custom Operational Blueprint",
      "Recipe & Procurement Cost Sheets",
      "Revised Labor & Salary Structure",
    ],
  },
  {
    number: "03",
    icon: Rocket,
    title: "Implementation & On-Site Execution",
    duration: "Weeks 5 - 8",
    description:
      "Direct on-site leadership deployment, staff retraining, vendor renegotiations, and system integration to enforce new quality & cost standards.",
    outcomes: [
      "Hands-On Departmental Retraining",
      "Vendor Contract Renegotiation",
      "New Operating SOP Enforcement",
    ],
  },
  {
    number: "04",
    icon: BarChart3,
    title: "Performance Governance & Retainer Review",
    duration: "Ongoing / Retainer",
    description:
      "Monthly P&L reviews, unannounced mystery guest audits, executive coaching, and quarterly GOP growth assessments to maintain high margins.",
    outcomes: [
      "Monthly GOP Performance Reviews",
      "Unannounced Mystery Guest Audits",
      "Sustained Net Margin Expansion",
    ],
  },
];

export function ConsultingProcess() {
  const preferReduced = useReducedMotion();

  return (
    <section className="py-24 md:py-32 bg-[#050505] text-white relative border-b border-white/10 overflow-hidden">
      {/* Subtle Background Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "80px 100%",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 md:mb-24 space-y-4">
          <Reveal>
            <span className="text-xs uppercase tracking-[0.3em] text-primary font-semibold font-mono block">
              ADVISORY METHODOLOGY
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white tracking-tight leading-tight">
              The 4-Phase Advisory Roadmap
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-base md:text-lg text-white/70 font-sans leading-relaxed font-light">
              A structured, battle-tested execution process designed to move hospitality assets from operational friction to sustainable profitability.
            </p>
          </Reveal>
        </div>

        {/* Process Steps List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {PROCESS_STEPS.map((step, idx) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.number}
                initial={preferReduced ? { opacity: 1 } : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="group relative bg-black/60 border border-white/10 p-6 md:p-8 rounded-sm hover:border-primary/50 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Step Top Bar */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <span className="text-xs font-mono text-primary font-medium tracking-widest uppercase">
                      Phase {step.number}
                    </span>
                    <span className="text-[11px] font-mono text-white/50 tracking-wider">
                      {step.duration}
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-sm bg-primary/10 border border-primary/30 flex items-center justify-center text-primary group-hover:scale-105 transition-transform duration-300">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-serif text-white group-hover:text-primary transition-colors leading-snug">
                      {step.title}
                    </h3>
                  </div>

                  <p className="text-xs md:text-sm text-white/70 font-sans leading-relaxed font-light">
                    {step.description}
                  </p>

                  {/* Key Outcomes */}
                  <div className="pt-4 border-t border-white/5 space-y-2">
                    <span className="text-[11px] font-mono text-white/40 uppercase tracking-widest block mb-2">
                      Key Outcomes:
                    </span>
                    {step.outcomes.map((outcome, i) => (
                      <div key={i} className="flex items-center space-x-2 text-xs text-white/80 font-sans">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        <span>{outcome}</span>
                      </div>
                    ))}
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
