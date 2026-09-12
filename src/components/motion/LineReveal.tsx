"use client";

import React from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

export interface LineRevealProps {
  className?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
}

export function LineReveal({
  className,
  delay = 0,
  duration = 1.2,
  once = true,
}: LineRevealProps) {
  const preferReduced = useReducedMotion();

  return (
    <div className={cn("relative w-full h-px overflow-hidden", className)}>
      <motion.div
        initial={{ scaleX: preferReduced ? 1 : 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once, margin: "-10px" }}
        transition={{ 
          duration, 
          delay, 
          ease: [0.16, 1, 0.3, 1] as const 
        }}
        className="absolute inset-0 bg-primary origin-left w-full h-full"
      />
    </div>
  );
}
