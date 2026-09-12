"use client";

import React from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export interface StaggerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  delay?: number;
  once?: boolean;
}

export function Stagger({
  children,
  className,
  staggerDelay = 0.1,
  delay = 0,
  once = true,
}: StaggerProps) {
  const preferReduced = useReducedMotion();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: preferReduced ? 0 : staggerDelay,
        delayChildren: delay,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-10px" }}
      variants={containerVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
