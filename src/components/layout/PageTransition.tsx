"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useLenis } from "@/components/animations/SmoothScroll";

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const preferReduced = useReducedMotion();
  const lenis = useLenis();

  // Reset scroll to top on route change
  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, lenis]);

  if (preferReduced) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Fast Gold Sweep Line (Enter indicator across top) */}
      <motion.div
        key={`sweep-${pathname}`}
        initial={{ scaleX: 0, opacity: 1 }}
        animate={{ scaleX: 1, opacity: [1, 1, 0] }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: "left" }}
        className="fixed top-0 left-0 right-0 h-[2px] bg-primary z-[60] pointer-events-none shadow-[0_0_10px_rgba(201,162,74,0.8)]"
      />

      {/* Route Content Transition (<500ms total) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 15 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
          }}
          exit={{
            opacity: 0,
            y: -20,
            transition: { duration: 0.2, ease: "easeIn" },
          }}
          className="w-full min-h-screen"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
