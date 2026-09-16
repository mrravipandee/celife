"use client";

import React from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  yOffset?: number;
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  duration = 0.5,
  yOffset = 16,
}: ScrollRevealProps) {
  const preferReduced = useReducedMotion();

  if (preferReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration,
        delay,
        ease: [0.2, 0.8, 0.2, 1],
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
