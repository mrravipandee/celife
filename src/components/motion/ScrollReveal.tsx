"use client";

import React, { useRef, useEffect, ElementType } from "react";
import { motion, useInView, useAnimation, Variants } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

// ─── Animation variant presets ────────────────────────────────────────────────

const VARIANTS: Record<string, Variants> = {
  fadeUp: {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  slideLeft: {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0 },
  },
  slideRight: {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0 },
  },
  scaleUp: {
    hidden: { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1 },
  },
  clipReveal: {
    hidden: { opacity: 0, clipPath: "inset(0 100% 0 0)" },
    visible: { opacity: 1, clipPath: "inset(0 0% 0 0)" },
  },
};

// ─── Types ────────────────────────────────────────────────────────────────────

type VariantKey = keyof typeof VARIANTS;

export interface ScrollRevealProps {
  variant?: VariantKey;
  delay?: number;
  duration?: number;
  threshold?: number;
  once?: boolean;
  className?: string;
  children: React.ReactNode;
}

// ─── ScrollReveal ─────────────────────────────────────────────────────────────

export function ScrollReveal({
  variant = "fadeUp",
  delay = 0,
  duration = 0.8,
  threshold = 0.15,
  once = true,
  className,
  children,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const preferReduced = useReducedMotion();
  const controls = useAnimation();
  const isInView = useInView(ref, { once, amount: threshold });

  useEffect(() => {
    if (isInView) {
      void controls.start("visible");
    } else if (!once) {
      void controls.start("hidden");
    }
  }, [isInView, controls, once]);

  if (preferReduced) {
    return <div className={className}>{children}</div>;
  }

  const selectedVariant = VARIANTS[variant] ?? VARIANTS.fadeUp;

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={selectedVariant}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1] as const,
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

// ─── WordStagger ──────────────────────────────────────────────────────────────

export interface WordStaggerProps {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  staggerDelay?: number;
  duration?: number;
  threshold?: number;
  once?: boolean;
  as?: ElementType;
}

export function WordStagger({
  text,
  className,
  wordClassName,
  delay = 0,
  staggerDelay = 0.06,
  duration = 0.75,
  threshold = 0.2,
  once = true,
}: WordStaggerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const preferReduced = useReducedMotion();
  const controls = useAnimation();
  const isInView = useInView(ref, { once, amount: threshold });

  useEffect(() => {
    if (isInView) {
      void controls.start("visible");
    } else if (!once) {
      void controls.start("hidden");
    }
  }, [isInView, controls, once]);

  const words = text.split(" ");

  if (preferReduced) {
    return <span className={className}>{text}</span>;
  }

  return (
    <motion.span
      ref={ref}
      className={cn("inline", className)}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: staggerDelay, delayChildren: delay },
        },
      }}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            className={cn("inline-block", wordClassName)}
            variants={{
              hidden: { y: "105%", opacity: 0 },
              visible: {
                y: 0,
                opacity: 1,
                transition: { duration, ease: [0.16, 1, 0.3, 1] },
              },
            }}
          >
            {word}
            {i < words.length - 1 ? "\u00a0" : ""}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
