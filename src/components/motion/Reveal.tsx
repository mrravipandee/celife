"use client";

import React from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
  x?: number;
  scale?: number;
  once?: boolean;
}

export function Reveal({
  children,
  className,
  delay = 0,
  duration = 0.8,
  y = 30,
  x = 0,
  scale = 1,
  once = true,
}: RevealProps) {
  const preferReduced = useReducedMotion();

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        y: preferReduced ? 0 : y, 
        x: preferReduced ? 0 : x, 
        scale: preferReduced ? 1 : scale 
      }}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      viewport={{ once, margin: "-10px" }}
      transition={{ 
        duration, 
        delay, 
        ease: [0.16, 1, 0.3, 1] as const 
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
