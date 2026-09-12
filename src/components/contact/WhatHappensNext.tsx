"use client";

import React, { useRef } from "react";
import { motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Reveal } from "@/components/motion/Reveal";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Step {
  number: string;
  title: string;
  description: string;
}

const STEPS: Step[] = [
  {
    number: "01",
    title: "SHARE YOUR REQUIREMENTS",
    description: "Tell us about your hospitality business, property stage, target customer, or current operational challenge.",
  },
  {
    number: "02",
    title: "INITIAL STRATEGIC ALIGNMENT",
    description: "We review your requirements, cost models, and unit economics to assess the viability and scope of advisory support.",
  },
  {
    number: "03",
    title: "ACTION ROADMAP & EXECUTION",
    description: "We define measurable milestones, assign resources, and deploy on-site systems for sustained profitability.",
  },
];

export function WhatHappensNext() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const preferReduced = useReducedMotion();

  useGSAP(
    () => {
      if (preferReduced || !sectionRef.current || !lineRef.current) return;

      gsap.fromTo(
        lineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            end: "center 50%",
            scrub: 1,
          },
        }
      );
    },
    { scope: sectionRef, dependencies: [preferReduced] }
  );

  return (
    <section
      ref={sectionRef}
      className="bg-black text-white py-20 md:py-28 relative overflow-hidden border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Heading */}
        <div className="max-w-3xl mb-16 space-y-4">
          <Reveal>
            <span className="text-xs uppercase tracking-[0.35em] text-primary block font-semibold font-sans">
              THE ENGAGEMENT PROCESS
            </span>
            <h2 className="text-3xl md:text-5xl font-serif tracking-tight uppercase leading-tight mt-3">
              What Happens Next
            </h2>
            <p className="text-sm md:text-base text-white/70 leading-relaxed font-sans font-light mt-4">
              A transparent, step-by-step roadmap from initial consultation to on-site implementation.
            </p>
          </Reveal>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Horizontal Connecting Gold Line across the steps (Desktop) */}
          <div className="hidden md:block absolute top-[28px] left-[6%] right-[6%] h-[1.5px] bg-white/10 z-0 overflow-hidden">
            <div
              ref={lineRef}
              className="w-full h-full bg-primary origin-left"
              style={preferReduced ? { transform: "scaleX(1)" } : { transform: "scaleX(0)" }}
            />
          </div>

          {/* Steps 3-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-16 relative z-10">
            {STEPS.map((step, idx) => (
              <div
                key={idx}
                className="step-card flex flex-row md:flex-col items-start space-x-6 md:space-x-0 md:space-y-8 group"
              >
                {/* Scaled Number Badge on arrival */}
                <motion.div
                  initial={preferReduced ? { scale: 1 } : { scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{
                    type: "spring",
                    stiffness: 280,
                    damping: 20,
                    delay: preferReduced ? 0 : idx * 0.15,
                  }}
                  className="relative shrink-0"
                >
                  <div className="w-14 h-14 rounded-full bg-black border-2 border-primary/60 group-hover:border-primary flex items-center justify-center shadow-[0_0_16px_rgba(201,162,74,0.3)] transition-colors duration-300">
                    <span className="font-serif text-lg font-bold text-primary tabular-nums">
                      {step.number}
                    </span>
                  </div>
                </motion.div>

                {/* Step Content */}
                <div className="space-y-3 pt-2 md:pt-0">
                  <h3 className="text-sm uppercase tracking-[0.2em] font-sans font-bold text-white group-hover:text-primary transition-colors duration-300 leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-sm md:text-base text-white/70 leading-relaxed font-sans font-light">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
