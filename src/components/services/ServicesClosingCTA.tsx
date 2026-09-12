"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Reveal } from "@/components/motion/Reveal";
import { LineReveal } from "@/components/motion/LineReveal";

export function ServicesClosingCTA() {
  const preferReduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // Mouse coordinate motion values for interactive cursor-following ambient gold glow
  const mouseX = useMotionValue(400);
  const mouseY = useMotionValue(250);
  const springGlowX = useSpring(mouseX, { damping: 28, stiffness: 160, mass: 0.5 });
  const springGlowY = useSpring(mouseY, { damping: 28, stiffness: 160, mass: 0.5 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (preferReduced || !sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  // Scroll entrance glow
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"],
  });
  const glowOpacity = useTransform(scrollYProgress, [0, 1], [0, 0.9]);
  const glowScale = useTransform(scrollYProgress, [0, 1], [0.8, 1.2]);

  return (
    <section
      id="closing-cta"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative overflow-hidden bg-[#060606] text-white border-b border-white/10 py-24 md:py-36"
    >
      {/* Interactive Cursor-Tracking Gold Radial Glow */}
      {!preferReduced && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[140px]"
          style={{
            left: springGlowX,
            top: springGlowY,
            background:
              "radial-gradient(circle, rgba(201,162,74,0.12) 0%, rgba(201,162,74,0.03) 50%, transparent 70%)",
          }}
        />
      )}

      {/* Static Center Ambient Glow */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[450px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.05] blur-[120px]"
        style={preferReduced ? {} : { opacity: glowOpacity, scale: glowScale }}
      />

      <div className="relative mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-3xl text-center space-y-8">
          {/* Eyebrow */}
          <Reveal>
            <span className="block text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              START THE CONVERSATION
            </span>
          </Reveal>

          {/* Gold Accent Divider */}
          <LineReveal
            className="mx-auto h-px w-20 bg-primary/70"
            delay={0.15}
          />

          {/* Main Requested Headline */}
          <Reveal delay={0.25}>
            <h2 className="mx-auto font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-tight leading-tight">
              Whichever service fits your situation, the first conversation is free.
            </h2>
          </Reveal>

          {/* Requested Button */}
          <Reveal delay={0.4}>
            <div className="pt-6 flex flex-col items-center gap-4">
              <Link
                href="/contact"
                className="group relative inline-flex items-center justify-center overflow-hidden border border-white/70 bg-transparent px-10 py-4 text-xs md:text-sm font-medium uppercase tracking-[0.25em] text-white transition-all duration-500 hover:border-primary hover:text-black sm:px-12 sm:py-5"
              >
                <span className="absolute inset-0 origin-bottom scale-y-0 bg-primary transition-transform duration-500 ease-out group-hover:scale-y-100" />
                <span className="relative z-10 font-semibold">
                  Book a Consultation
                </span>
                <span className="relative z-10 ml-4 transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>

              <span className="text-xs uppercase tracking-[0.2em] text-white/40 font-mono pt-2">
                Confidential • Direct with Advisory Team
              </span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
