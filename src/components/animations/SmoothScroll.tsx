"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import Lenis from "lenis";

interface LenisContextValue {
  lenis: Lenis | null;
}

const LenisContext = createContext<LenisContextValue>({ lenis: null });

export interface SmoothScrollProps {
  children: React.ReactNode;
}

/**
 * SmoothScroll
 * Lightweight Lenis smooth scrolling driven by native requestAnimationFrame.
 * Synchronizes with ScrollTrigger dynamically if registered on window.
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

    // Dynamic ScrollTrigger synchronization if available without static bundle bloat
    let handleScroll: (() => void) | null = null;
    const globalAny = window as unknown as { ScrollTrigger?: { update: () => void } };
    if (globalAny.ScrollTrigger) {
      handleScroll = () => {
        globalAny.ScrollTrigger?.update();
      };
      lenis.on("scroll", handleScroll);
    }

    // Drive Lenis from native requestAnimationFrame
    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      if (handleScroll) {
        lenis.off("scroll", handleScroll);
      }
      cancelAnimationFrame(rafId);
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
