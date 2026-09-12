"use client";

import React from "react";
import { Reveal } from "@/components/motion/Reveal";
import { LineReveal } from "@/components/motion/LineReveal";

const AUDIT_DIMENSIONS = [
  {
    code: "DIM-01",
    name: "Operational Discipline",
    scope: "SOP Adherence • Shift Readiness • Service Flow",
    status: "ASSESSED",
  },
  {
    code: "DIM-02",
    name: "Cost & Revenue Integrity",
    scope: "Recipe Yields • Shrinkage • Billing Checks",
    status: "ASSESSED",
  },
  {
    code: "DIM-03",
    name: "Guest & Quality Standards",
    scope: "Touchpoints • Speed of Service • Product Presentation",
    status: "ASSESSED",
  },
  {
    code: "DIM-04",
    name: "Compliance & Safety",
    scope: "Hygiene Logs • Storage Integrity • Risk Prevention",
    status: "ASSESSED",
  },
];

const IMPACT_TIERS = [
  {
    tier: "PRIORITY I",
    label: "Critical Interventions",
    desc: "Immediate vulnerabilities affecting guest safety, cash slippage, or gross margin leakages requiring prompt 1–14 day resolution.",
    accent: "text-primary border-primary/50",
  },
  {
    tier: "PRIORITY II",
    label: "Operational Calibration",
    desc: "Process bottlenecks, team productivity friction, and menu re-engineering items scheduled for 15–45 day corrective cycles.",
    accent: "text-white/80 border-white/20",
  },
  {
    tier: "PRIORITY III",
    label: "Strategic Compounding",
    desc: "Long-term SOP stabilization, supplier renegotiation, and loyalty refinement driving 60–90 day structural gains.",
    accent: "text-white/60 border-white/10",
  },
];

export function AuditScoreInsight() {
  return (
    <section className="bg-black text-white py-20 md:py-28 border-b border-white/5 relative overflow-hidden">
      {/* Subtle background ambient radial */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-primary/[0.03] rounded-full blur-[150px]"
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <Reveal>
            <span className="text-xs uppercase tracking-[0.3em] text-primary font-semibold block">
              DIAGNOSTIC MATRIX
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white tracking-tight uppercase mt-2">
              See the Business Behind the Numbers.
            </h2>
          </Reveal>
          <LineReveal className="bg-primary/50 max-w-[180px]" delay={0.2} />
          <Reveal delay={0.3}>
            <p className="text-base md:text-lg text-white/80 font-sans leading-relaxed font-light">
              &ldquo;From department-level observations to an overall property performance view, the audit gives management a clear understanding of where attention is required first.&rdquo;
            </p>
          </Reveal>
        </div>

        {/* Visual Typography / Score-Style Architectural Composition */}
        <div className="border border-white/15 bg-white/[0.015] rounded-sm p-8 md:p-12 space-y-12">
          {/* Top Bar: Diagnostic Framework Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 border-b border-white/10 gap-4">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-[0.25em] text-primary font-mono font-medium">
                THE DCO AUDIT FRAMEWORK
              </span>
              <h3 className="text-2xl font-serif text-white">
                Holistic Property Evaluation Architecture
              </h3>
            </div>
            <div className="flex items-center space-x-6 text-xs font-mono tracking-widest text-white/50">
              <span className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-primary mr-2" />
                OBJECTIVE DIAGNOSIS
              </span>
              <span className="hidden sm:inline">|</span>
              <span className="hidden sm:inline">ZERO ESTIMATES</span>
            </div>
          </div>

          {/* Middle: 4 Diagnostic Dimensions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {AUDIT_DIMENSIONS.map((dim, idx) => (
              <Reveal key={dim.code} delay={idx * 0.1}>
                <div className="p-6 border border-white/10 bg-white/[0.01] rounded-sm space-y-4 h-full flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono text-primary/70">
                      <span>{dim.code}</span>
                      <span className="text-[10px] tracking-widest text-white/40 border border-white/10 px-1.5 py-0.5 rounded-xs">
                        {dim.status}
                      </span>
                    </div>
                    <h4 className="text-lg font-serif text-white">
                      {dim.name}
                    </h4>
                  </div>
                  <p className="text-xs text-white/60 font-sans leading-relaxed pt-2 border-t border-white/5 font-light">
                    {dim.scope}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Bottom: Action Prioritization Matrix */}
          <div className="pt-8 border-t border-white/10 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.2em] text-white/60 font-mono">
                CORRECTIVE ACTION PRIORITY DISCIPLINE
              </span>
              <span className="text-xs font-mono text-primary">
                30–90 DAY RESOLUTION
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {IMPACT_TIERS.map((tier, idx) => (
                <Reveal key={tier.tier} delay={0.2 + idx * 0.1}>
                  <div className="p-6 border border-white/10 bg-white/[0.01] rounded-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-primary font-semibold tracking-wider">
                        {tier.tier}
                      </span>
                      <span className="text-xs uppercase tracking-wider text-white/50 font-sans">
                        {tier.label}
                      </span>
                    </div>
                    <p className="text-xs md:text-sm text-white/70 font-sans leading-relaxed font-light">
                      {tier.desc}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
