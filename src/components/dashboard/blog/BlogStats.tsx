"use client";

import React from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface BlogStatsProps {
  stats: {
    total: number;
    published: number;
    drafts: number;
  } | null;
}

export function BlogStats({ stats }: BlogStatsProps) {
  const prefersReduced = useReducedMotion();

  const formatVal = (val: number) => {
    return val < 10 ? `0${val}` : `${val}`;
  };

  const statsList = [
    { label: "Total Articles", value: stats ? formatVal(stats.total) : "—" },
    { label: "Published", value: stats ? formatVal(stats.published) : "—" },
    { label: "Drafts", value: stats ? formatVal(stats.drafts) : "—" },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 12 },
    visible: (idx: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: idx * 0.05,
        duration: prefersReduced ? 0.05 : 0.4,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    }),
  };

  return (
    <div className="grid grid-cols-3 gap-4 select-none">
      {statsList.map((stat, idx) => (
        <motion.div
          key={stat.label}
          variants={cardVariants}
          custom={idx}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col p-5 bg-white border border-[#E1E8E2] rounded-lg transition-all duration-300 hover:border-[#123C2D]/40 group relative overflow-hidden shadow-xs"
        >
          {/* Top edge green highlight line on hover */}
          <span className="absolute top-0 left-0 right-0 h-[2px] bg-[#123C2D] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

          <span className="text-[11px] uppercase tracking-[0.14em] text-[#68756D] font-sans font-semibold mb-1 block">
            {stat.label}
          </span>
          <h4 className="text-2xl font-serif font-bold text-[#17201B] tracking-tight">
            {stat.value}
          </h4>
        </motion.div>
      ))}
    </div>
  );
}
