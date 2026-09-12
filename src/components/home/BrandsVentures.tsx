"use client";

import React, { useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useLenis } from "@/components/animations/SmoothScroll";
import { Reveal } from "@/components/motion/Reveal";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

const BRANDS = [
  "Panchavati Group of Hotels, Motels and Restaurants",
  "XLAR Media",
  "The Brand Klinik",
];

export function BrandsVentures() {
  const [isPaused, setIsPaused] = useState(false);
  const preferReduced = useReducedMotion();

  // Motion value for scroll velocity skew coupling (capped at 4deg)
  const skewMotion = useMotionValue(0);
  const smoothSkew = useSpring(skewMotion, { damping: 24, stiffness: 220, mass: 0.4 });

  useLenis((lenis) => {
    if (preferReduced) return;
    // Map scroll velocity to subtle horizontal skew
    const vel = lenis.velocity || 0;
    const clamped = Math.max(-4, Math.min(4, vel * 0.18));
    skewMotion.set(clamped);
  });

  return (
    <section className="bg-black text-white py-20 md:py-24 border-b border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-12">
        <Reveal>
          <span className="text-xs uppercase tracking-[0.3em] text-primary font-semibold block mb-4">
            BRANDS AND VENTURES
          </span>
          <h2 className="text-3xl md:text-5xl font-serif tracking-tight leading-tight max-w-xl">
            Brands and Ventures We&apos;ve Worked With
          </h2>
        </Reveal>
      </div>

      {/* TYPOGRAPHY MARQUEE with Lenis velocity skew coupling */}
      <ScrollReveal variant="scaleUp" delay={0.1} duration={0.9} threshold={0.1}>
        <div className="relative w-screen overflow-hidden py-10 bg-white/[0.02] border-y border-white/5">
          <motion.div
            style={preferReduced ? {} : { skewX: smoothSkew }}
            className="flex whitespace-nowrap space-x-16 md:space-x-32 animate-[marquee_35s_linear_infinite]"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Duplicate items for seamless continuous looping */}
            {[...BRANDS, ...BRANDS, ...BRANDS, ...BRANDS].map((brand, idx) => (
              <span
                key={idx}
                style={{ animationPlayState: isPaused ? "paused" : "running" }}
                className="text-4xl md:text-6xl lg:text-7xl font-serif uppercase tracking-widest text-white/55 hover:text-primary transition-colors duration-500 cursor-pointer inline-block select-none"
              >
                {brand}
              </span>
            ))}
          </motion.div>
        </div>
      </ScrollReveal>
    </section>
  );
}
