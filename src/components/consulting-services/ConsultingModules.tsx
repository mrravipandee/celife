"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { Reveal } from "@/components/motion/Reveal";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  Building2,
  TrendingUp,
  UtensilsCrossed,
  ShieldCheck,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

interface ConsultingModule {
  id: string;
  number: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  description: string;
  deliverables: string[];
  tag: string;
}

const CONSULTING_MODULES: ConsultingModule[] = [
  {
    id: "pre-opening",
    number: "01",
    icon: Building2,
    title: "Pre-Opening & Hotel Concept Advisory",
    subtitle: "From Feasibility to Launch",
    description:
      "Comprehensive advisory for greenfield hotel and resort projects. We define property positioning, operator negotiations, architectural flow, and pre-opening operating budgets.",
    deliverables: [
      "Market Feasibility & Financial Projections",
      "Architectural Layout & Back-of-House SOPs",
      "Brand Positioning & Guest Journey Design",
      "Operator Selection & Lease Contract Advisory",
    ],
    tag: "Feasibility & Launch",
  },
  {
    id: "turnaround",
    number: "02",
    icon: TrendingUp,
    title: "Operational Turnarounds & Margin Recovery",
    subtitle: "Profitability & Cost Restructuring",
    description:
      "Underperforming hospitality assets require rapid, data-backed operational interventions. We audit cost structures, restructure labor models, and drive GOP expansion.",
    deliverables: [
      "Deep-Dive Financial & Payroll Audit",
      "Food Cost & Waste Elimination Strategy",
      "Staffing Optimization & Productivity KPIs",
      "GOP & Net Margin Acceleration Plan",
    ],
    tag: "Turnaround & GOP",
  },
  {
    id: "fb-engineering",
    number: "03",
    icon: UtensilsCrossed,
    title: "F&B Advisory & Menu Engineering",
    subtitle: "Culinary & Beverage Profit Systems",
    description:
      "Transforming hotel and standalone restaurant dining into high-margin profit centers through scientific menu design, recipe costing, and kitchen procurement controls.",
    deliverables: [
      "Recipe Costing & Yield Management Manuals",
      "Kitchen Ergonomics & Procurement Audit",
      "Beverage Program & Bar Profit Controls",
      "Staff Training & Service Standards Manual",
    ],
    tag: "F&B Profitability",
  },
  {
    id: "asset-management",
    number: "04",
    icon: ShieldCheck,
    title: "Asset Management & Mystery Audits",
    subtitle: "Sustained Operational Excellence",
    description:
      "Independent asset monitoring for hotel owners and investors. We perform unannounced mystery audits, property condition assessments, and monthly performance reviews.",
    deliverables: [
      "360° Unannounced Mystery Guest Audits",
      "Property Condition & Maintenance Checks",
      "Monthly Owner Representation Reports",
      "Quality Assurance & Brand Standard Audits",
    ],
    tag: "Asset Governance",
  },
];

export function ConsultingModules() {
  const preferReduced = useReducedMotion();
  const [activeModule, setActiveModule] = useState<string>(CONSULTING_MODULES[0].id);

  return (
    <section id="consulting-modules" className="py-24 md:py-32 bg-black text-white relative border-b border-white/10">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 md:mb-24 space-y-4">
          <Reveal>
            <span className="text-xs uppercase tracking-[0.3em] text-primary font-semibold font-mono block">
              ADVISORY VERTICALS
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white tracking-tight leading-tight">
              Strategic Consulting Core Modules
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-base md:text-lg text-white/70 font-sans leading-relaxed font-light">
              Tailored advisory programs built to protect capital, elevate guest experience, and optimize gross operating profit across Indian hospitality assets.
            </p>
          </Reveal>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {CONSULTING_MODULES.map((module, idx) => {
            const Icon = module.icon;
            const isActive = activeModule === module.id;

            return (
              <motion.div
                key={module.id}
                initial={preferReduced ? { opacity: 1 } : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                onMouseEnter={() => setActiveModule(module.id)}
                className={`group relative p-8 md:p-10 rounded-sm border backdrop-blur-md transition-all duration-500 flex flex-col justify-between ${
                  isActive
                    ? "bg-white/[0.03] border-primary/60 shadow-[0_0_30px_rgba(201,162,74,0.12)]"
                    : "bg-white/[0.01] border-white/10 hover:border-white/25 hover:bg-white/[0.02]"
                }`}
              >
                {/* Top Accent Line */}
                <div
                  className={`absolute top-0 left-0 right-0 h-[2px] transition-all duration-500 ${
                    isActive ? "bg-primary" : "bg-transparent group-hover:bg-primary/40"
                  }`}
                />

                <div className="space-y-6">
                  {/* Module Header Badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-sm bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-mono text-primary uppercase tracking-widest">
                        {module.tag}
                      </span>
                    </div>
                    <span className="text-2xl font-serif text-white/30 font-light group-hover:text-primary transition-colors">
                      {module.number}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-2xl md:text-3xl font-serif text-white group-hover:text-primary transition-colors duration-300">
                      {module.title}
                    </h3>
                    <p className="text-xs uppercase tracking-wider text-white/50 font-sans mt-1 font-medium">
                      {module.subtitle}
                    </p>
                  </div>

                  <p className="text-sm md:text-base text-white/75 font-sans leading-relaxed font-light">
                    {module.description}
                  </p>

                  {/* Key Deliverables List */}
                  <div className="pt-4 border-t border-white/10 space-y-2.5">
                    <span className="text-xs uppercase tracking-wider font-mono text-white/50 block mb-3">
                      Core Deliverables:
                    </span>
                    {module.deliverables.map((item, i) => (
                      <div key={i} className="flex items-start space-x-3 text-xs md:text-sm text-white/85 font-sans">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span className="leading-tight">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom CTA Action Link */}
                <div className="pt-8 mt-8 border-t border-white/5 flex items-center justify-between text-xs uppercase tracking-[0.2em] font-sans font-medium">
                  <Link
                    href="/contact"
                    className="inline-flex items-center space-x-2 text-primary hover:text-white transition-colors"
                  >
                    <span>Request Advisory Briefing</span>
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
