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
      className="flex flex-col justify-between p-5 bg-[#FFFFFF] border border-[#E1E8E2] rounded-xs transition-all duration-200 hover:border-[#123C2D]/30 hover:shadow-xs group relative overflow-hidden select-none"
    >
      {/* Subtle green accent top border line appearing on card hover */}
      <span className="absolute top-0 left-0 right-0 h-[2px] bg-[#123C2D] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
      
      <span className="text-[11px] uppercase tracking-[0.14em] text-[#68756D] font-sans font-semibold mb-2 block">
        {label}
      </span>
      
      <div className="space-y-1 mt-auto">
        <h4 className="text-3xl font-serif text-[#17201B] tracking-tight font-bold">
          {value}
        </h4>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-[#6F8F80] font-sans">
            {change}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
