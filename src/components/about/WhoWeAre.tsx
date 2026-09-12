"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Reveal } from "@/components/motion/Reveal";
import { LineReveal } from "@/components/motion/LineReveal";
import { Stagger } from "@/components/motion/Stagger";

export function WhoWeAre() {
  const sectionRef = useRef<HTMLElement>(null);
  const preferReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Opposing Parallax: text shifts +30px -> -30px, image shifts -30px -> +30px
  const textParallax = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const imageParallax = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  return (
    <section
      ref={sectionRef}
      className="bg-black text-white py-20 md:py-28 border-b border-white/5 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-20">
        {/* Two-Column Layout with Opposing Parallax */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Heading & Narrative */}
          <motion.div
            style={preferReduced ? {} : { y: textParallax }}
            className="lg:col-span-6 space-y-8"
          >
            <Reveal>
              <span className="text-xs uppercase tracking-[0.3em] text-primary font-semibold block mb-3">
                MISSION & ORIGIN
              </span>
              <h2 className="text-3xl md:text-5xl font-serif text-white tracking-tight uppercase leading-tight">
                Who We Are
              </h2>
            </Reveal>

            <div className="space-y-6 text-white/80 text-base md:text-lg leading-relaxed font-sans font-light">
              <Reveal delay={0.1}>
                <p>
                  THEDCO is a hospitality advisory practice for restaurants and hotels that want more than advice. We support first time investors building a business from the ground up. We also support existing owners who need to audit and turn around their operations, rebuild cost structures, improve their menus and grow revenue.
                </p>
              </Reveal>
            </div>
          </motion.div>

          {/* Right Column: Editorial Image with Clip-Path Wipe from Bottom */}
          <motion.div
            style={preferReduced ? {} : { y: imageParallax }}
            className="lg:col-span-6"
          >
            <motion.div
              initial={preferReduced ? { clipPath: "inset(0% 0% 0% 0%)" } : { clipPath: "inset(100% 0% 0% 0%)" }}
              whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-[4/3] w-full overflow-hidden border border-white/10 bg-white/[0.02] rounded-sm"
            >
              <Image
                src="/images/hero/hotel-lobby.jpg"
                alt="THEDCO Advisory Operations"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
              
              {/* Corner Coordinate Tag */}
              <div className="absolute bottom-4 right-4 z-10 px-3 py-1 bg-black/80 backdrop-blur-md border border-white/10 text-xs font-mono uppercase tracking-widest text-primary font-medium">
                PRACTICE // EST. 1983
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Real Data Block */}
        <div className="max-w-4xl mx-auto pt-8">
          <Reveal className="text-center space-y-4">
            <span className="text-xs uppercase tracking-[0.3em] text-primary block font-semibold">
              EVIDENCE-BASED METHODOLOGY
            </span>
            <LineReveal className="bg-primary/45 w-full max-w-md mx-auto" delay={0.1} />
          </Reveal>

          <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 mt-8 text-center max-w-3xl mx-auto" staggerDelay={0.15}>
            <Reveal className="space-y-2 p-6 border border-white/5 bg-white/[0.01] rounded-sm">
              <span className="block text-primary text-xs uppercase tracking-widest font-mono font-semibold">01</span>
              <h4 className="text-lg md:text-xl font-serif text-white">Sales Reports</h4>
            </Reveal>
            <Reveal className="space-y-2 p-6 border border-white/5 bg-white/[0.01] rounded-sm" delay={0.15}>
              <span className="block text-primary text-xs uppercase tracking-widest font-mono font-semibold">02</span>
              <h4 className="text-lg md:text-xl font-serif text-white">Expense Tracking</h4>
            </Reveal>
            <Reveal className="space-y-2 p-6 border border-white/5 bg-white/[0.01] rounded-sm" delay={0.3}>
              <span className="block text-primary text-xs uppercase tracking-widest font-mono font-semibold">03</span>
              <h4 className="text-lg md:text-xl font-serif text-white">Direct Observation</h4>
            </Reveal>
          </Stagger>
        </div>

        {/* Final Statement Block */}
        <div className="max-w-4xl mx-auto text-center pt-6 space-y-6">
          <Reveal>
            <p className="text-base md:text-lg text-white/80 leading-relaxed max-w-2xl mx-auto font-sans font-light">
              Every recommendation we make is based on real data, sales reports, expense tracking and direct observation on site, not on templates. The result is a plan the client’s own team can actually follow.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
