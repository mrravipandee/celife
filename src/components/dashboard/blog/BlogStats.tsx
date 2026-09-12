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
          className="flex flex-col p-4 bg-[#050505] border border-white/5 rounded-xs transition-colors duration-300 hover:border-white/10 group relative overflow-hidden"
        >
          {/* Top edge gold highlight line on hover */}
          <span className="absolute top-0 left-0 right-0 h-[1px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

          <span className="text-[9px] uppercase tracking-[0.18em] text-white/40 font-sans font-semibold mb-1 block">
            {stat.label}
          </span>
          <h4 className="text-xl font-serif text-white tracking-wide font-light">
            {stat.value}
          </h4>
        </motion.div>
      ))}
    </div>
  );
}
