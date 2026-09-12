"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Reveal } from "@/components/motion/Reveal";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const HEADLINE_STATEMENT = "A hospitality advisory firm built on real operating experience.";

export function AboutIntro() {
  const containerRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const preferReduced = useReducedMotion();

  useGSAP(
    () => {
      if (preferReduced || !containerRef.current) return;

      const words = headlineRef.current?.querySelectorAll(".intro-word");
      if (!words || words.length === 0) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
          end: "center 40%",
          scrub: 1,
        },
      });

      // Gold hairline draws from 0% to 100%
      if (lineRef.current) {
        tl.fromTo(
          lineRef.current,
          { width: "0%", opacity: 0.2 },
          { width: "100%", opacity: 1, ease: "none" },
          0
        );
      }

      // Word-by-word mask reveal resolving sequentially
      tl.fromTo(
        words,
        { opacity: 0.15, y: 16, filter: "blur(4px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          stagger: 0.06,
          ease: "power2.out",
        },
        0
      );
    },
    { scope: containerRef, dependencies: [preferReduced] }
  );

  const statementWords = HEADLINE_STATEMENT.split(" ");

  return (
    <section
      ref={containerRef}
      className="relative bg-black text-white pt-40 pb-20 md:pb-24 border-b border-white/5 overflow-hidden flex items-center"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Eyebrow, Scrubbed Statement Headline, Divider */}
          <div className="lg:col-span-7 space-y-8">
            <Reveal>
              <h1 className="text-3xl md:text-5xl font-serif text-white tracking-tight uppercase leading-tight">
                About THEDCO
              </h1>
            </Reveal>

            {/* Word-by-word scrub mask headline */}
            <h2
              ref={headlineRef}
              className="text-3xl md:text-5xl font-serif leading-[1.15] text-white/90 tracking-tight select-text mt-4"
            >
              {statementWords.map((word, i) => (
                <span
                  key={i}
                  className="intro-word inline-block mr-[0.28em]"
                  style={
                    preferReduced
                      ? { opacity: 1, transform: "none", filter: "none" }
                      : undefined
                  }
                >
                  {word}
                </span>
              ))}
            </h2>

            {/* Accent Divider */}
            <div className="w-32 h-[1px] bg-white/10 relative overflow-hidden">
              <div
                ref={lineRef}
                className="h-full bg-primary"
                style={preferReduced ? { width: "100%", opacity: 1 } : { width: "0%" }}
              />
            </div>
          </div>

          {/* Right Column: Body paragraphs */}
          <div className="lg:col-span-5 space-y-6 lg:pt-16">
            <Reveal delay={0.3}>
              <p className="text-base md:text-lg text-white/80 leading-relaxed font-sans font-light">
                THEDCO exists to help hotel and restaurant owners turn ideas into organised, sustainable and profitable businesses. We combine hands-on hospitality experience with business strategy, operations, branding, staffing and financial planning.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
