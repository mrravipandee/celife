"use client";

import React from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

export interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
}

export function TextReveal({
  text,
  className,
  delay = 0,
  duration = 1.0,
  once = true,
}: TextRevealProps) {
  const preferReduced = useReducedMotion();

  // Split text by lines or render directly inside an overflow hidden mask
  return (
    <span className="inline-block overflow-hidden py-1">
      <motion.span
        initial={{ y: preferReduced ? 0 : "105%", opacity: preferReduced ? 1 : 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once, margin: "-10px" }}
        transition={{
          duration,
          delay,
          ease: [0.16, 1, 0.3, 1] as const
        }}
        className={cn("inline-block", className)}
      >
        {text}
      </motion.span>
    </span>
  );
}
