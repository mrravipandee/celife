"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Reveal } from "@/components/motion/Reveal";
import { LineReveal } from "@/components/motion/LineReveal";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

export function CTA() {
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

  // Scroll-driven entrance glow
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"],
  });
  const glowOpacity = useTransform(scrollYProgress, [0, 1], [0, 0.85]);
  const glowScale = useTransform(scrollYProgress, [0, 1], [0.6, 1.2]);

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative overflow-hidden bg-black text-white border-b border-white/5"
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

      {/* Scroll-driven center ambient glow */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.04] blur-[130px]"
        style={preferReduced ? {} : { opacity: glowOpacity, scale: glowScale }}
      />

      {/* Architectural grid hairline accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
      >
        <div className="absolute left-1/2 top-0 h-full w-px bg-white" />
        <div className="absolute left-0 top-1/2 h-px w-full bg-white" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-20 sm:px-8 md:py-24 lg:px-12">
        <div className="mx-auto max-w-5xl text-center">
          {/* Eyebrow */}
          <Reveal>
            <span className="mb-6 block text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              COLLABORATION
            </span>
          </Reveal>

          {/* Divider */}
          <LineReveal
            className="mx-auto mb-8 h-px w-16 bg-primary/70"
            delay={0.15}
          />

          {/* Main headline */}
          <ScrollReveal variant="clipReveal" delay={0.2} duration={0.9} threshold={0.2}>
            <h2 className="mx-auto max-w-4xl font-serif text-4xl uppercase leading-[1.05] tracking-[-0.02em] sm:text-5xl md:text-6xl lg:text-7xl">
              Let&apos;s Build a{" "}
              <span className="text-primary">More Profitable</span>{" "}
              Hospitality Business Together
            </h2>
          </ScrollReveal>

          {/* Description */}
          <Reveal delay={0.4}>
            <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-white/80 font-sans">
              THEDCO partners with hotel and restaurant owners, and the investors backing them, to build businesses that perform, financially and operationally.
            </p>
          </Reveal>

          {/* Primary Action with MagneticButton */}
          <Reveal delay={0.55}>
            <div className="mt-10 flex flex-col items-center gap-5">
              <MagneticButton strength={0.3}>
                <Link
                  href="/contact"
                  className="group relative inline-flex items-center justify-center overflow-hidden border border-white/70 bg-transparent px-9 py-4 text-xs md:text-sm font-medium uppercase tracking-[0.22em] text-white transition-all duration-500 hover:border-primary hover:text-black sm:px-11 sm:py-5"
                >
                  {/* Hover fill animation */}
                  <span className="absolute inset-0 origin-bottom scale-y-0 bg-primary transition-transform duration-500 ease-out group-hover:scale-y-100" />

                  <span className="relative z-10 font-semibold">
                    Book a Consultation
                  </span>

                  <span className="relative z-10 ml-4 transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </MagneticButton>

              <span className="text-xs uppercase tracking-[0.2em] text-white/60 font-medium font-sans">
                Start a conversation
              </span>
            </div>
          </Reveal>

          {/* Bottom metadata */}
          <Reveal delay={0.7}>
            <div className="mt-16 flex items-center justify-center gap-6 text-xs uppercase tracking-[0.2em] text-white/60 font-medium font-sans">
              <span>Hospitality</span>
              <span className="h-1 w-1 rounded-full bg-primary/60" />
              <span>Strategy</span>
              <span className="h-1 w-1 rounded-full bg-primary/60" />
              <span>Growth</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}