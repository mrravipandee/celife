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

const CHALLENGES = [
  { num: "01", text: "High operating costs" },
  { num: "02", text: "Staff turnover" },
  { num: "03", text: "Food wastage" },
  { num: "04", text: "Inconsistent service" },
  { num: "05", text: "Low occupancy" },
  { num: "06", text: "Weak restaurant sales" },
  { num: "07", text: "Poor cost control" },
  { num: "08", text: "Delayed openings" },
  { num: "09", text: "Vendor coordination" },
  { num: "10", text: "Licensing complexity" },
  { num: "11", text: "Marketing without measurable results" },
  { num: "12", text: "Difficulty recovering the initial investment" },
];

export function WhatWeUnderstand() {
  const sectionRef = useRef<HTMLElement>(null);
  const verticalLineRef = useRef<HTMLDivElement>(null);
  const preferReduced = useReducedMotion();

  useGSAP(
    () => {
      if (preferReduced || !sectionRef.current || !verticalLineRef.current) return;

      gsap.fromTo(
        verticalLineRef.current,
        { height: "0%" },
        {
          height: "100%",
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "bottom 70%",
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
      className="bg-black text-white py-20 md:py-28 border-b border-white/5 relative"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Heading, Subtext & Vertical Scrub Line */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 self-start space-y-8">
            <Reveal>
              <span className="text-xs uppercase tracking-[0.3em] text-primary block font-semibold">
                WHAT WE UNDERSTAND
              </span>
              <h2 className="text-3xl md:text-5xl font-serif text-white tracking-tight leading-tight uppercase mt-3">
                We Understand Hospitality From an Owner’s Point of View
              </h2>
              <p className="text-sm md:text-base text-white/70 leading-relaxed font-sans font-light mt-4 max-w-md">
                These are the challenges we see most often, and the ones we are built to solve.
              </p>
            </Reveal>

            {/* Vertical Scrub Line Tracker (Desktop) */}
            <div className="hidden lg:flex items-center space-x-4 pt-4">
              <div className="h-44 w-[1.5px] bg-white/10 relative overflow-hidden">
                <div
                  ref={verticalLineRef}
                  className="w-full bg-primary"
                  style={{ height: preferReduced ? "100%" : "0%" }}
                />
              </div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-primary/70">
                12 CRITICAL VECTORS
              </span>
            </div>
          </div>

          {/* Right Column: Numbered Cards Sequence */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {CHALLENGES.map((item, idx) => (
              <motion.div
                key={item.num}
                initial={preferReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{
                  duration: 0.6,
                  delay: preferReduced ? 0 : (idx % 2) * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={
                  preferReduced
                    ? {}
                    : {
                        y: -4,
                        borderColor: "rgba(201, 162, 74, 0.45)",
                        backgroundColor: "rgba(255, 255, 255, 0.02)",
                      }
                }
                className="group p-6 border border-white/10 bg-white/[0.015] transition-colors duration-300 flex flex-col justify-between min-h-[140px] relative cursor-pointer rounded-sm"
              >
                {/* Gold Corner Accent lines */}
                <div className="absolute top-0 left-0 w-3 h-[1.5px] bg-primary/20 group-hover:bg-primary transition-colors duration-300" />
                <div className="absolute top-0 left-0 w-[1.5px] h-3 bg-primary/20 group-hover:bg-primary transition-colors duration-300" />

                <div className="flex justify-between items-start">
                  <span className="text-xs font-mono text-primary font-semibold">
                    {item.num}
                  </span>
                  <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-sans font-medium">
                    DIAGNOSTIC
                  </span>
                </div>

                <h3 className="text-sm md:text-base font-serif text-white/90 group-hover:text-white transition-colors duration-300 uppercase tracking-wider leading-snug pt-6">
                  {item.text}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
