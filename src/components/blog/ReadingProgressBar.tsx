"use client";

import React from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function ReadingProgressBar() {
  const preferReduced = useReducedMotion();
  const { scrollYProgress } = useScroll();

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 300,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{
        scaleX: preferReduced ? scrollYProgress : smoothProgress,
        transformOrigin: "left",
      }}
      className="fixed top-0 left-0 right-0 h-[2px] bg-primary z-50 pointer-events-none shadow-[0_0_8px_rgba(201,162,74,0.7)]"
    />
  );
}
