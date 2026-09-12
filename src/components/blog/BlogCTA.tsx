"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { LineReveal } from "@/components/motion/LineReveal";

export function BlogCTA() {
  const preferReduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(200);
  const mouseY = useMotionValue(100);
  const springX = useSpring(mouseX, { damping: 24, stiffness: 200 });
  const springY = useSpring(mouseY, { damping: 24, stiffness: 200 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (preferReduced || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative pt-12 mt-12 overflow-hidden"
    >
      <LineReveal className="absolute top-0 left-0 bg-white/10 w-full" />

      {/* Post-Article Shared CTA Card */}
      <div className="relative p-8 md:p-12 border border-white/10 bg-white/[0.015] rounded-sm overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 mt-8">
        {/* Subtle Cursor Ambient Glow */}
        {!preferReduced && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute w-[400px] h-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]"
            style={{
              left: springX,
              top: springY,
              background:
                "radial-gradient(circle, rgba(201,162,74,0.08) 0%, transparent 70%)",
            }}
          />
        )}

        <div className="space-y-3 text-center md:text-left">
          <span className="text-xs uppercase tracking-[0.25em] text-primary font-semibold font-mono">
            HOSPITALITY ADVISORY
          </span>
          <h3 className="text-2xl md:text-3xl font-serif text-white uppercase tracking-tight">
            Need Expert Strategy For Your Venue?
          </h3>
          <p className="text-sm text-white/70 font-sans font-light max-w-md">
            Schedule an exploratory discussion with our lead hospitality advisors.
          </p>
        </div>

        <div className="shrink-0 flex flex-col sm:flex-row items-center gap-4">
          <MagneticButton strength={0.3}>
            <Link
              href="/contact"
              className="group relative inline-flex items-center justify-center overflow-hidden border border-white/70 bg-transparent px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:border-primary hover:text-black rounded-sm"
            >
              <span className="absolute inset-0 origin-bottom scale-y-0 bg-primary transition-transform duration-500 ease-out group-hover:scale-y-100" />
              <span className="relative z-10">Request Consultation →</span>
            </Link>
          </MagneticButton>

          <Link
            href="/blog"
            className="text-xs uppercase tracking-[0.2em] text-white/60 hover:text-primary transition-colors py-2"
          >
            ← All Articles
          </Link>
        </div>
      </div>
    </div>
  );
}
