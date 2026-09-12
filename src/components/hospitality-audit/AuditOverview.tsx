"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Reveal } from "@/components/motion/Reveal";
import { LineReveal } from "@/components/motion/LineReveal";

const AUDIT_PILLARS = [
  {
    num: "01",
    title: "Unbiased Ground Inspection",
    description:
      "Direct on-site observation across front-of-house service, kitchen prep lines, storage, billing, and back-office management.",
  },
  {
    num: "02",
    title: "Revenue & Wastage Diagnosis",
    description:
      "Deep scrutiny into food cost variance, inventory shrinkage, cashier integrity, and unnoticed financial leakages.",
  },
  {
    num: "03",
    title: "Actionable Turnaround Roadmap",
    description:
      "Converting complex operational findings into an explicit 30 to 90-day corrective plan tailored to your team's capability.",
  },
];

export function AuditOverview() {
  const sectionRef = useRef<HTMLElement>(null);
  const preferReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const textParallax = useTransform(scrollYProgress, [0, 1], [20, -20]);
  const imageParallax = useTransform(scrollYProgress, [0, 1], [-20, 20]);

  return (
    <section
      ref={sectionRef}
      id="overview"
      className="bg-black text-white py-20 md:py-28 border-b border-white/5 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-20">
        {/* Top Editorial Narrative & Image Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Headline & Narrative */}
          <motion.div
            style={preferReduced ? {} : { y: textParallax }}
            className="lg:col-span-6 space-y-8"
          >
            <Reveal>
              <span className="text-xs uppercase tracking-[0.3em] text-primary font-semibold block mb-3">
                AUDIT OVERVIEW
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white tracking-tight leading-tight">
                &ldquo;An independent view of what is really happening inside your hospitality business.&rdquo;
              </h2>
            </Reveal>

            <LineReveal className="bg-primary/50 max-w-[160px]" delay={0.2} />

            <Reveal delay={0.3}>
              <p className="text-base md:text-lg text-white/80 leading-relaxed font-sans font-light">
                We examine the operation beyond surface-level performance — identifying the gaps, leakages, inefficiencies and compliance risks that directly affect profitability and guest experience.
              </p>
            </Reveal>

            <Reveal delay={0.4}>
              <p className="text-sm md:text-base text-white/65 leading-relaxed font-sans font-light">
                Hospitality owners are often too close to daily fires to diagnose why margins fluctuate or why standards slip. Our audit provides an uncompromising, objective perspective that protects your capital and brand reputation.
              </p>
            </Reveal>
          </motion.div>

          {/* Right Column: Editorial Hospitality Asset */}
          <motion.div
            style={preferReduced ? {} : { y: imageParallax }}
            className="lg:col-span-6"
          >
            <motion.div
              initial={
                preferReduced
                  ? { clipPath: "inset(0% 0% 0% 0%)" }
                  : { clipPath: "inset(100% 0% 0% 0%)" }
              }
              whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-[4/3] w-full overflow-hidden border border-white/10 bg-white/[0.02] rounded-sm"
            >
              <Image
                src="/images/services/fine-dining.jpg"
                alt="Hospitality Audit Inspection and Evaluation"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />

              {/* Editorial Coordinate Tag */}
              <div className="absolute bottom-4 right-4 z-10 px-3.5 py-1.5 bg-black/85 backdrop-blur-md border border-white/10 text-xs font-mono uppercase tracking-widest text-primary font-medium">
                AUDIT DIAGNOSTICS // RIGOR
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* 3 Core Pillars */}
        <div className="pt-6 border-t border-white/5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {AUDIT_PILLARS.map((pillar, idx) => (
              <Reveal key={pillar.num} delay={idx * 0.15}>
                <div className="p-8 border border-white/10 bg-white/[0.015] hover:border-primary/40 hover:bg-white/[0.03] transition-colors duration-300 rounded-sm space-y-4 group">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-primary font-semibold tracking-wider">
                      {pillar.num}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                  </div>
                  <h3 className="text-xl font-serif text-white group-hover:text-primary transition-colors leading-snug">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-white/70 font-sans leading-relaxed font-light">
                    {pillar.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
