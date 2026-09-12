"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Reveal } from "@/components/motion/Reveal";

const SERVICES = [
  {
    num: "01",
    title: "Hotel Advisory",
    description: "Concept, positioning, pricing, front office systems and guest service standards.",
  },
  {
    num: "02",
    title: "Restaurant Advisory",
    description: "Menu engineering, kitchen planning, food cost control and profitability.",
  },
  {
    num: "03",
    title: "Pre-Opening and Launch Advisory",
    description: "Staffing, vendors, SOPs and opening day execution.",
  },
  {
    num: "04",
    title: "Operations Advisory",
    description: "Audits, cost control, reporting systems and performance review.",
  },
  {
    num: "05",
    title: "Staff Recruitment and Training",
    description: "Hiring, structure, departmental training and standards.",
  },
  {
    num: "06",
    title: "SOP and Documentation",
    description: "Checklists, logs, reporting formats and daily systems.",
  },
  {
    num: "07",
    title: "Branding and Marketing",
    description: "Positioning, digital presence, campaigns and reputation management.",
  },
  {
    num: "08",
    title: "Revenue and Profitability Advisory",
    description: "Pricing, margin analysis and ROI planning.",
  },
  {
    num: "09",
    title: "Banquet, Event and Expansion Advisory",
    description: "Event operations, banquet packages and franchise readiness.",
  },
];

function ServiceCard({
  service,
  index,
  hoveredIdx,
  setHoveredIdx,
  preferReduced,
}: {
  service: typeof SERVICES[0];
  index: number;
  hoveredIdx: number | null;
  setHoveredIdx: (idx: number | null) => void;
  preferReduced: boolean;
}) {
  const isHovered = hoveredIdx === index;
  const isSibling = hoveredIdx !== null && !isHovered;

  return (
    <motion.div
      initial={preferReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{
        duration: 0.7,
        delay: preferReduced ? 0 : index * 0.06,
        ease: [0.16, 1, 0.3, 1],
      }}
      animate={
        preferReduced
          ? { opacity: 1, scale: 1 }
          : {
              opacity: isSibling ? 0.4 : 1,
              scale: isSibling ? 0.98 : 1,
            }
      }
      onMouseEnter={() => setHoveredIdx(index)}
      onMouseLeave={() => setHoveredIdx(null)}
      className="group relative p-8 md:p-10 bg-white/[0.015] border border-white/10 hover:border-transparent flex flex-col justify-between min-h-[260px] transition-colors duration-300 cursor-pointer overflow-hidden rounded-sm"
    >
      {/* Tracing Gold Border on Hover (Top-Left to Bottom-Right) */}
      {!preferReduced && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="0.5"
            y="0.5"
            width="99%"
            height="99%"
            fill="none"
            stroke="#c9a24a"
            strokeWidth="1.5"
            strokeDasharray="1600"
            className="transition-all duration-700 ease-out"
            style={{
              strokeDashoffset: isHovered ? "0" : "1600",
              opacity: isHovered ? 1 : 0,
            }}
          />
        </svg>
      )}

      {/* Top Meta */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-sans tracking-widest text-primary font-semibold">
          {service.num}
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors duration-300" />
      </div>

      {/* Title & Description */}
      <div className="space-y-3 pt-6">
        <h3 className="text-xl md:text-2xl font-serif text-white group-hover:text-primary transition-colors duration-300">
          {service.title}
        </h3>
        <p className="text-xs md:text-sm text-white/70 font-sans leading-relaxed">
          {service.description}
        </p>
      </div>

      {/* Bottom Link indicator */}
      <div className="pt-6 flex items-center text-xs uppercase tracking-widest text-white/40 group-hover:text-white transition-colors duration-300">
        <span>Explore Practice</span>
        <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
      </div>
    </motion.div>
  );
}

export function ServicesPreview() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const preferReduced = useReducedMotion();

  return (
    <section className="bg-black text-white py-20 md:py-28 border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header Block */}
        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-end">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs uppercase tracking-[0.3em] text-primary font-semibold">
                MAIN SERVICES
              </span>
              <h2 className="text-3xl md:text-5xl font-serif tracking-tight leading-tight">
                What We Offer
              </h2>
              <p className="text-sm md:text-base text-white/70 leading-relaxed font-sans font-light">
                Nine advisory practices, one team, one point of contact through the whole engagement.
              </p>
            </div>
            <div className="lg:col-span-4 flex lg:justify-end">
              <Link
                href="/services/consulting-services"
                className="inline-block text-xs uppercase tracking-[0.22em] text-primary font-semibold border border-primary/40 hover:border-primary hover:bg-primary/10 px-6 py-3 transition-all duration-300"
              >
                View Full Service List →
              </Link>
            </div>
          </div>
        </Reveal>

        {/* 3x3 Staggered Grid with Sibling Hover Dimming */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service, idx) => (
            <ServiceCard
              key={service.num}
              service={service}
              index={idx}
              hoveredIdx={hoveredIdx}
              setHoveredIdx={setHoveredIdx}
              preferReduced={preferReduced}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
