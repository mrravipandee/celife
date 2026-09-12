"use client";

import React from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface StatCardProps {
  label: string;
  value: string;
  change: string;
  index: number;
}

export function StatCard({ label, value, change, index }: StatCardProps) {
  const prefersReduced = useReducedMotion();

  const cardVariants = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.08,
        duration: prefersReduced ? 0.05 : 0.5,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-20px" }}
      className="flex flex-col justify-between p-6 bg-[#050505] border border-white/5 rounded-xs transition-all duration-300 hover:border-white/10 group relative overflow-hidden select-none"
    >
      {/* Subtle gold accent top border line appearing on card hover */}
      <span className="absolute top-0 left-0 right-0 h-[1.5px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
      
      <span className="text-xs uppercase tracking-[0.16em] text-white/60 font-sans font-semibold mb-3 block">
        {label}
      </span>
      
      <div className="space-y-1.5 mt-auto">
        <h4 className="text-2xl font-serif text-white tracking-wide font-medium">
          {value}
        </h4>
        <div className="flex items-center gap-1.5">
          <span className="text-sm text-primary/80 font-sans tracking-wide">
            {change}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
