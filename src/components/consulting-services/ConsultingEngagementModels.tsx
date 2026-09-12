"use client";

import React from "react";
import { motion } from "motion/react";
import { Reveal } from "@/components/motion/Reveal";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

interface ModelItem {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  recommendedFor: string;
  features: string[];
  isPopular?: boolean;
}

const ENGAGEMENT_MODELS: ModelItem[] = [
  {
    id: "project-based",
    badge: "Specialized Scope",
    title: "Project-Based Advisory",
    subtitle: "Pre-Opening & Specific Turnarounds",
    recommendedFor: "New hotel launches, concept rebranding, or single-department audits.",
    features: [
      "Full diagnostic property audit",
      "Custom SOP & training manual delivery",
      "Financial cost-sheet & yield matrix",
      "4 to 12-week focused execution phase",
      "Handover & executive coaching session",
    ],
  },
  {
    id: "retainer",
    badge: "Most Popular",
    title: "Monthly Advisory Retainer",
    subtitle: "Continuous Governance & GOP Oversight",
    recommendedFor: "Property owners requiring ongoing operator governance & monthly P&L reviews.",
    isPopular: true,
    features: [
      "Monthly P&L & GOP performance audit",
      "Quarterly unannounced mystery guest audits",
      "Direct C-Suite advisory access for owners",
      "Ongoing staff training & service checks",
      "Vendor price negotiations & margin control",
      "Quarterly strategic growth roadmap",
    ],
  },
  {
    id: "turnaround-mandate",
    badge: "Full Intervention",
    title: "Complete Turnaround Mandate",
    subtitle: "Interim Management & Asset Recovery",
    recommendedFor: "Distressed assets requiring complete hands-on operational oversight.",
    features: [
      "Full interim operational control",
      "Complete labor & cost restructuring",
      "Executive chef & GM recruitment",
      "Emergency cash flow & GOP recovery plan",
      "Weekly owner reporting & KPI tracking",
    ],
  },
];

export function ConsultingEngagementModels() {
  const preferReduced = useReducedMotion();

  return (
    <section className="py-24 md:py-32 bg-black text-white relative border-b border-white/10 overflow-hidden">
      {/* Glow Center Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-primary/5 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 md:mb-24 space-y-4">
          <Reveal>
            <span className="text-xs uppercase tracking-[0.3em] text-primary font-semibold font-mono block">
              ENGAGEMENT STRUCTURES
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white tracking-tight leading-tight">
              Advisory Engagement Models
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-base md:text-lg text-white/70 font-sans leading-relaxed font-light">
              Flexible advisory structures tailored to your property’s lifecycle stage, operational scale, and investment goals.
            </p>
          </Reveal>
        </div>

        {/* Pricing / Engagement Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {ENGAGEMENT_MODELS.map((model, idx) => {
            return (
              <motion.div
                key={model.id}
                initial={preferReduced ? { opacity: 1 } : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className={`relative p-8 md:p-10 rounded-sm border flex flex-col justify-between transition-all duration-500 ${
                  model.isPopular
                    ? "bg-white/[0.04] border-primary shadow-[0_0_35px_rgba(201,162,74,0.18)]"
                    : "bg-black/60 border-white/10 hover:border-white/25"
                }`}
              >
                {/* Popular Badge */}
                {model.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-black text-[11px] uppercase tracking-[0.2em] font-mono font-bold px-4 py-1 rounded-full flex items-center space-x-1.5 shadow-lg">
                    <Sparkles className="w-3 h-3" />
                    <span>{model.badge}</span>
                  </div>
                )}

                <div className="space-y-6">
                  {/* Badge */}
                  {!model.isPopular && (
                    <span className="text-[11px] font-mono text-primary uppercase tracking-widest block">
                      {model.badge}
                    </span>
                  )}

                  {/* Title & Subtitle */}
                  <div>
                    <h3 className="text-2xl font-serif text-white">{model.title}</h3>
                    <p className="text-xs uppercase tracking-wider text-white/50 font-sans mt-1 font-medium">
                      {model.subtitle}
                    </p>
                  </div>

                  {/* Recommended For */}
                  <div className="p-4 rounded-sm bg-white/[0.02] border border-white/5 space-y-1">
                    <span className="text-[11px] uppercase font-mono text-white/40 tracking-wider block">
                      Ideal For:
                    </span>
                    <p className="text-xs md:text-sm text-white/80 font-sans font-light leading-relaxed">
                      {model.recommendedFor}
                    </p>
                  </div>

                  {/* Feature Checklist */}
                  <div className="pt-4 border-t border-white/10 space-y-3">
                    <span className="text-xs uppercase tracking-wider font-mono text-white/50 block mb-3">
                      Scope Includes:
                    </span>
                    {model.features.map((feat, i) => (
                      <div key={i} className="flex items-start space-x-3 text-xs md:text-sm text-white/85 font-sans">
                        <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span className="leading-tight">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <div className="pt-8 mt-8 border-t border-white/10">
                  <Link
                    href="/contact"
                    className={`w-full py-4 rounded-sm text-xs md:text-sm uppercase tracking-[0.2em] font-semibold flex items-center justify-center space-x-2 transition-all duration-300 ${
                      model.isPopular
                        ? "bg-primary text-black hover:bg-white"
                        : "bg-transparent border border-white/20 text-white hover:border-primary hover:text-primary"
                    }`}
                  >
                    <span>Discuss Engagement</span>
                    <ArrowRight className="w-4 h-4" />
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
