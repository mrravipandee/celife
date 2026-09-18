"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useLenis } from "@/components/animations/SmoothScroll";
import { BrandLoader } from "@/components/ui/BrandLoader";

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const lenis = useLenis();

  // Reset scroll to top on route change
  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, lenis]);

  const isDashboardOrAuth = pathname?.startsWith("/dashboard") || pathname === "/login";

  return (
    <>
      {/* Brand loading screen on web load (2-3 seconds) */}
      {!isDashboardOrAuth && <BrandLoader />}

      {/* Fast Gold Sweep Line (Enter indicator across top on route change) */}
      {!isDashboardOrAuth && (
        <motion.div
          key={`sweep-${pathname}`}
          initial={{ scaleX: 0, opacity: 1 }}
          animate={{ scaleX: 1, opacity: [1, 1, 0] }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: "left" }}
          className="fixed top-0 left-0 right-0 h-[2px] bg-primary z-[60] pointer-events-none shadow-[0_0_10px_rgba(201,162,74,0.8)]"
        />
      )}

      {/* Route Content Transition */}
      {isDashboardOrAuth ? (
        children
      ) : (
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={pathname}
            initial={false}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
            }}
            exit={{
              opacity: 0,
              y: -10,
              transition: { duration: 0.15, ease: "easeIn" },
            }}
            className="w-full min-h-screen"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      )}
    </>
  );
}

