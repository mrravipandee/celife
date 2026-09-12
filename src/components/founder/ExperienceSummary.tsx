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

interface MilestoneItem {
  number: string;
  year?: string;
  title: string;
  description: string;
}

const MILESTONES: MilestoneItem[] = [
  {
    number: "01",
    year: "",
    title: "Family Hospitality Heritage",
    description:
      "Panchavati Group of Hotels, Motels and Restaurants — third-generation foundation with early operational immersion across Maharashtra.",
  },
  {
    number: "02",
    year: "2012+",
    title: "12+ Years Hospitality Operations",
    description:
      "Direct, hands-on leadership across hotel front office, food service costing, restaurant kitchens, and departmental performance audits.",
  },
  {
    number: "03",
    year: "SP Jain",
    title: "Global Family Business Master's",
    description:
      "Postgraduate Master's degree in Global Family Managed Business from SP Jain School of Global Management, specialising in strategy & succession.",
  },
  {
    number: "04",
    year: "10+ Yrs",
    title: "Brand Strategy & Digital Agency",
    description:
      "Over a decade building and directing digital marketing and brand identity agencies tailored to customer acquisition and revenue growth.",
  },
];

export function ExperienceSummary() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const preferReduced = useReducedMotion();

  useGSAP(
    () => {
      if (preferReduced || !sectionRef.current || !lineRef.current) return;

      gsap.fromTo(
        lineRef.current,
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
      id="heritage"
      ref={sectionRef}
      className="bg-[#0a0a0a] text-white py-20 md:py-28 border-b border-white/10 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="mb-16 md:mb-24 text-center max-w-3xl mx-auto space-y-4">
          <Reveal>
            <span className="text-xs uppercase tracking-[0.3em] text-primary block font-semibold">
              CAREER TIMELINE
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-white tracking-tight uppercase mt-3">
              Experience & Provenance
            </h2>
            <p className="text-sm md:text-base text-white/70 leading-relaxed font-sans font-light mt-4">
              Over a decade combining academic rigor with hands-on operational leadership.
            </p>
          </Reveal>
        </div>

        {/* Vertical Timeline Structure */}
        <div className="relative max-w-5xl mx-auto">
          {/* Central Vertical Rail (Centered on Desktop, Left-aligned on Mobile) */}
          <div className="absolute top-0 bottom-0 left-6 md:left-1/2 w-[1.5px] bg-white/10 -translate-x-1/2">
            <div
              ref={lineRef}
              className="w-full bg-primary"
              style={{ height: preferReduced ? "100%" : "0%" }}
            />
          </div>

          {/* Milestone Items */}
          <div className="space-y-12 md:space-y-20 relative z-10">
            {MILESTONES.map((item, idx) => {
              const isEven = idx % 2 === 1; // Left or Right side on desktop
              return (
                <div
                  key={item.number}
                  className={`flex flex-col md:flex-row items-start md:items-center ${isEven ? "md:flex-row-reverse" : ""
                    }`}
                >
                  {/* Content Column (5/12 width) */}
                  <motion.div
                    initial={
                      preferReduced
                        ? { opacity: 1, x: 0 }
                        : { opacity: 0, x: isEven ? 40 : -40 }
                    }
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className={`pl-14 md:pl-0 w-full md:w-[45%] ${isEven ? "md:pl-10 md:text-left" : "md:pr-10 md:text-right"
                      }`}
                  >
                    <div className="p-6 md:p-8 border border-white/10 bg-white/[0.015] hover:border-primary/40 transition-colors duration-300 rounded-sm space-y-3">
                      <div
                        className={`flex items-center space-x-3 text-xs font-mono text-primary font-semibold ${isEven ? "md:justify-start" : "md:justify-end"
                          }`}
                      >
                        <span>{item.number}</span>
                        <span className="text-white/40">/ {item.year}</span>
                      </div>

                      <h3 className="text-xl md:text-2xl font-serif text-white uppercase tracking-wide">
                        {item.title}
                      </h3>

                      <p className="text-sm text-white/70 leading-relaxed font-sans font-light">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>

                  {/* Central Node Dot (Pops in with spring) */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 flex items-center justify-center">
                    <motion.div
                      initial={preferReduced ? { scale: 1 } : { scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 18,
                        delay: preferReduced ? 0 : 0.1,
                      }}
                      className="w-5 h-5 rounded-full bg-black border-2 border-primary flex items-center justify-center shadow-[0_0_12px_rgba(201,162,74,0.6)]"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    </motion.div>
                  </div>

                  {/* Spacer Column for Opposite Side (5/12 width) */}
                  <div className="hidden md:block w-[45%]" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
