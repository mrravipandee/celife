"use client";

import React from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ShieldCheck, GraduationCap, Award, Briefcase } from "lucide-react";

interface PillarItem {
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const PILLARS_DATA: PillarItem[] = [
  {
    title: "Third Generation Hospitality",
    subtitle: "Panchavati Group",
    icon: ShieldCheck,
    description:
      "Carrying forward the Panchavati Group of Hotels, Motels and Restaurants.",
  },
  {
    title: "SP Jain, Global Family Business",
    subtitle: "Academic Provenance",
    icon: GraduationCap,
    description:
      "Master’s degree in Global Family Managed Business.",
  },
  {
    title: "10+ Years Marketing and Branding",
    subtitle: "Agency Background",
    icon: Award,
    description:
      "Built and ran his own marketing agency before THEDCO.",
  },
  {
    title: "Founder, THEDCO",
    subtitle: "Advisory Practice",
    icon: Briefcase,
    description:
      "Bringing hospitality operations and business strategy together.",
  },
];

export function FounderPillars() {
  const preferReduced = useReducedMotion();

  return (
    <section id="pillars" className="bg-[#0e0e0e] text-white py-16 md:py-24 border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* 4-Column Grid with Hairline Dividers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-y border-white/15 divide-y sm:divide-y-0 lg:divide-x divide-white/15">
          {PILLARS_DATA.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={preferReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.6,
                  delay: preferReduced ? 0 : idx * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group p-8 sm:p-10 flex flex-col items-center text-center space-y-6 hover:bg-white/[0.02] transition-colors duration-300"
              >
                {/* Column Headline */}
                <div className="space-y-1">
                  <h3 className="text-xl sm:text-2xl font-serif text-white tracking-tight font-medium group-hover:text-primary transition-colors duration-300">
                    {pillar.title}
                  </h3>
                  <span className="text-[11px] uppercase tracking-[0.2em] font-mono text-white/50 block font-light pt-1">
                    {pillar.subtitle}
                  </span>
                </div>

                {/* Circular Dark Badge Icon */}
                <div className="w-16 h-16 rounded-full bg-black border border-white/20 flex items-center justify-center group-hover:border-primary group-hover:shadow-[0_0_20px_rgba(201,162,74,0.25)] transition-all duration-300">
                  <Icon className="w-7 h-7 text-white group-hover:text-primary transition-colors duration-300" />
                </div>

                {/* Paragraph Description */}
                <p className="text-xs sm:text-sm font-sans leading-relaxed text-white/70 font-light max-w-[240px]">
                  {pillar.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
