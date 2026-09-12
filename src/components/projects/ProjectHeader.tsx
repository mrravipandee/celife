"use client";

import React from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { LineReveal } from "@/components/motion/LineReveal";

export interface ProjectHeaderProps {
  title: string;
  category: string;
  location: string;
  year: string | number;
}

export function ProjectHeader({
  title,
  category,
  location,
  year,
}: ProjectHeaderProps) {
  const preferReduced = useReducedMotion();

  const specs = [
    { label: "Category", value: category },
    { label: "Location", value: location },
    { label: "Year", value: year },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 relative">
      {/* Bottom Separator Line */}
      <LineReveal className="absolute bottom-0 left-0 bg-white/10 w-full" delay={0.2} />

      {/* Main Title & Category Eyebrow */}
      <div className="lg:col-span-8 space-y-4">
        {/* Category with drawing hairline */}
        <div className="flex items-center space-x-3">
          <motion.div
            initial={preferReduced ? { width: 24 } : { width: 0 }}
            whileInView={{ width: 24 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="h-px bg-primary"
          />
          <motion.span
            initial={preferReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="text-xs uppercase tracking-[0.3em] text-primary font-semibold"
          >
            {category}
          </motion.span>
        </div>

        {/* Title */}
        <motion.h1
          initial={preferReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl md:text-5xl lg:text-6xl font-serif text-white tracking-tight leading-tight select-text"
        >
          {title}
        </motion.h1>
      </div>

      {/* Metadata Specs Column (Location, Year) */}
      <div className="lg:col-span-4 flex flex-col justify-end space-y-4 text-sm text-white/70 pt-4 lg:pt-0">
        {specs.slice(1).map((spec, i) => (
          <motion.div
            key={spec.label}
            initial={preferReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              delay: 0.18 + i * 0.06,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="flex items-center space-x-3 border-b lg:border-none border-white/5 pb-2 lg:pb-0"
          >
            {/* Drawing hairline before spec */}
            <motion.div
              initial={preferReduced ? { width: 14 } : { width: 0 }}
              whileInView={{ width: 14 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.18 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="h-px bg-primary/70 shrink-0"
            />
            <span className="uppercase tracking-wider font-semibold text-white/60 font-sans text-xs">
              {spec.label}:
            </span>
            <span className="text-white/90 font-medium font-sans">{spec.value}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
