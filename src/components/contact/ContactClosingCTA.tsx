"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Reveal } from "@/components/motion/Reveal";
import { LineReveal } from "@/components/motion/LineReveal";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

export function ContactClosingCTA() {
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

  const scrollToForm = () => {
    const formEl = document.getElementById("contact-form");
    if (formEl) {
      formEl.scrollIntoView({
        behavior: preferReduced ? "auto" : "smooth",
        block: "start",
      });
    }
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="bg-black text-white relative overflow-hidden border-b border-white/5 py-24 md:py-32"
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

      <div className="max-w-6xl mx-auto px-6 md:px-12 text-center relative z-10 space-y-8">
        {/* Eyebrow */}
        <Reveal>
          <span className="text-xs uppercase tracking-[0.3em] text-primary font-semibold block">
            READY TO TRANSFORM YOUR OPERATION?
          </span>
        </Reveal>

        {/* Divider */}
        <LineReveal className="mx-auto h-px w-20 bg-primary/70" delay={0.15} />

        {/* Main Heading */}
        <ScrollReveal variant="clipReveal" delay={0.2} duration={0.9} threshold={0.2}>
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-serif uppercase tracking-tight leading-[1.05] max-w-4xl mx-auto">
            Let&apos;s Build a <span className="text-primary">More Profitable</span> Hospitality Business
          </h2>
        </ScrollReveal>

        {/* Description */}
        <Reveal delay={0.4}>
          <p className="text-sm md:text-base text-white/75 leading-relaxed font-sans font-light max-w-2xl mx-auto">
            THEDCO partners with hotel and restaurant owners, and the investors backing them, to build businesses that perform financially and operationally.
          </p>
        </Reveal>

        {/* Primary Action Button */}
        <Reveal delay={0.55}>
          <div className="pt-6 flex flex-col items-center gap-4">
            <MagneticButton strength={0.3}>
              <button
                type="button"
                onClick={scrollToForm}
                className="group relative inline-flex items-center justify-center overflow-hidden border border-white/70 bg-transparent px-10 py-4 text-xs md:text-sm font-medium uppercase tracking-[0.25em] text-white transition-all duration-500 hover:border-primary hover:text-black sm:px-12 sm:py-5 cursor-pointer rounded-sm"
              >
                <span className="absolute inset-0 origin-bottom scale-y-0 bg-primary transition-transform duration-500 ease-out group-hover:scale-y-100" />
                <span className="relative z-10 font-semibold">
                  Complete Project Brief
                </span>
                <span className="relative z-10 ml-4 transition-transform duration-300 group-hover:-translate-y-1">
                  ↑
                </span>
              </button>
            </MagneticButton>

            <span className="text-xs uppercase tracking-[0.2em] text-white/50 font-medium font-sans">
              Scroll back to inquiry form
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}