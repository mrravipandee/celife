"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Guarded global ScrollTrigger registration to ensure it runs once in browser environment
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface LenisContextValue {
  lenis: Lenis | null;
}

const LenisContext = createContext<LenisContextValue>({ lenis: null });

export interface SmoothScrollProps {
  children: React.ReactNode;
}

/**
 * SmoothScroll
 * Integrates Lenis smooth scrolling with GSAP ticker and ScrollTrigger.
 * Drives Lenis updates through GSAP's ticker and notifies ScrollTrigger on scroll.
 */
export function SmoothScroll({ children }: SmoothScrollProps) {
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);

  useEffect(() => {
    // Instantiate Lenis smooth scroll engine
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
    });

    queueMicrotask(() => {
      setLenisInstance(lenis);
    });

    // Call ScrollTrigger.update on every Lenis scroll event
    const handleScroll = () => {
      ScrollTrigger.update();
    };
    lenis.on("scroll", handleScroll);

    // Drive Lenis from gsap.ticker instead of its own requestAnimationFrame loop
    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateTicker);

    // Set lagSmoothing(0) to prevent jumpy catches after heavy tasks
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", handleScroll);
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      setLenisInstance(null);
    };
  }, []);

  return (
    <LenisContext.Provider value={{ lenis: lenisInstance }}>
      {children}
    </LenisContext.Provider>
  );
}

/**
 * useLenis
 * Context hook for accessing the active Lenis instance or subscribing to scroll events
 * without attaching uncoordinated window scroll event listeners.
 */
export function useLenis(callback?: (lenis: Lenis) => void): Lenis | null {
  const { lenis } = useContext(LenisContext);

  useEffect(() => {
    if (!lenis || !callback) return;
    lenis.on("scroll", callback);
    return () => {
      lenis.off("scroll", callback);
    };
  }, [lenis, callback]);

  return lenis;
}
