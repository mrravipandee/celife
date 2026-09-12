"use client";

import { useState } from "react";
import { useLenis } from "@/components/animations/SmoothScroll";

/**
 * useScrollProgress
 * Reads page scroll progress from the global Lenis smooth scroll instance.
 * Adheres strictly to MOTION.md Rule 1: Lenis owns scroll.
 */
export function useScrollProgress(): number {
  const [scrollProgress, setScrollProgress] = useState(0);

  useLenis((lenis) => {
    setScrollProgress(lenis.progress);
  });

  return scrollProgress;
}
