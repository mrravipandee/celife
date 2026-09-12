"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Reveal } from "@/components/motion/Reveal";
import { LineReveal } from "@/components/motion/LineReveal";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

export function FounderCTA() {
  const preferReduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // Mouse coordinate motion values for interactive cursor-following ambient gold glow
  const mouseX = useMotionValue(400);
  const mouseY = useMotionValue(300);
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
  const glowOpacity = useTransform(scrollYProgress, [0, 1], [0, 0.85]);
  const glowScale = useTransform(scrollYProgress, [0, 1], [0.6, 1.2]);

  return (
    <section
      id="contact"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative overflow-hidden bg-[#0a0a0a] text-white border-b border-white/10 py-24 md:py-32"
    >
      {/* Interactive Cursor-Tracking Gold Radial Glow */}
      {!preferReduced && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute w-[650px] h-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[140px]"
          style={{
            left: springGlowX,
            top: springGlowY,
            background:
              "radial-gradient(circle, rgba(201,162,74,0.09) 0%, rgba(201,162,74,0.02) 50%, transparent 70%)",
          }}
        />
      )}

      {/* Center Ambient Glow */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.04] blur-[130px]"
        style={preferReduced ? {} : { opacity: glowOpacity, scale: glowScale }}
      />

      <div className="relative mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl text-center space-y-8">
          {/* Eyebrow */}
          <Reveal>
            <span className="block text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              COLLABORATION & ADVISORY
            </span>
          </Reveal>

          {/* Divider */}
          <LineReveal
            className="mx-auto h-px w-20 bg-primary/70"
            delay={0.15}
          />

          {/* Main Headline */}
          <ScrollReveal variant="clipReveal" delay={0.2} duration={0.9} threshold={0.2}>
            <h2 className="mx-auto max-w-3xl font-serif text-4xl uppercase leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
              Work With Manav and the THEDCO Team
            </h2>
          </ScrollReveal>

          {/* Description */}
          <Reveal delay={0.4}>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-white/75 font-sans font-light">
              Every engagement is led with the same discipline and operational precision he brought to his own family&apos;s hospitality business.
            </p>
          </Reveal>

          {/* Primary Action with MagneticButton */}
          <Reveal delay={0.55}>
            <div className="pt-6 flex flex-col items-center gap-4">
              <MagneticButton strength={0.3}>
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
              </MagneticButton>

              <span className="text-xs uppercase tracking-[0.2em] text-white/50 font-medium font-sans">
                Start a direct conversation
              </span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
