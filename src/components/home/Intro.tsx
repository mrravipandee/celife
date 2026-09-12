"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Container } from "@/components/ui/Container";
import { useReducedMotion } from "@/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const HEADLINE_STATEMENT = "What We Do";

export function Intro() {
  const containerRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const preferReduced = useReducedMotion();

  // Ambient parallax on scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const yParallax = useTransform(scrollYProgress, [0, 1], ["6%", "-6%"]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.15, 0.8, 0.15]);

  useGSAP(
    () => {
      if (preferReduced) return;

      const words = headlineRef.current?.querySelectorAll(".intro-word");
      if (!words || words.length === 0) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
          end: "center 45%",
          scrub: 1,
        },
      });

      // Gold hairline draws in from 0% to 100%
      if (lineRef.current) {
        tl.fromTo(
          lineRef.current,
          { width: "0%", opacity: 0.2 },
          { width: "100%", opacity: 1, ease: "none" },
          0
        );
      }

      // Words resolve from dim blur to crisp 100% opacity
      tl.fromTo(
        words,
        { opacity: 0.18, y: 14, filter: "blur(3px)" },
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
      className="relative min-h-[100svh] bg-black flex flex-col items-center justify-center border-b border-white/5 overflow-hidden"
    >
      {/* Ambient Radial Gold Background Glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] rounded-full blur-[100px] md:blur-[140px] pointer-events-none"
        style={preferReduced ? {} : { opacity: bgOpacity }}
        animate={
          preferReduced
            ? {}
            : {
                background: [
                  "radial-gradient(circle, rgba(201,162,74,0.12) 0%, rgba(0,0,0,0) 65%)",
                  "radial-gradient(circle, rgba(201,162,74,0.06) 0%, rgba(0,0,0,0) 65%)",
                  "radial-gradient(circle, rgba(201,162,74,0.12) 0%, rgba(0,0,0,0) 65%)",
                ],
              }
        }
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Main Content Container */}
      <motion.div
        style={preferReduced ? {} : { y: yParallax }}
        className="relative z-10 w-full px-6 md:px-12"
      >
        <Container className="max-w-4xl mx-auto text-center flex flex-col items-center justify-center">
          {/* Top Decorative Icon */}
          <motion.div
            className="mb-8 md:mb-10 text-primary"
            animate={preferReduced ? {} : { rotate: 360 }}
            transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 0L13.2 9.6L24 12L13.2 14.4L12 24L10.8 14.4L0 12L10.8 9.6L12 0Z" fill="currentColor" />
            </svg>
          </motion.div>

          {/* Statement Headline with scrub mask reveal */}
          <h2
            ref={headlineRef}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-white/95 leading-[1.18] tracking-tight max-w-3xl mx-auto select-text"
          >
            {statementWords.map((word, i) => (
              <span
                key={i}
                className="intro-word inline-block mr-[0.28em]"
                style={preferReduced ? { opacity: 1, transform: "none", filter: "none" } : undefined}
              >
                {word}
              </span>
            ))}
          </h2>

          {/* Gold hairline drawing container */}
          <div className="w-24 md:w-32 mx-auto mt-10 md:mt-12 h-[1px] bg-white/10 relative overflow-hidden">
            <div
              ref={lineRef}
              className="h-full bg-primary"
              style={preferReduced ? { width: "100%", opacity: 1 } : { width: "0%" }}
            />
          </div>

          {/* Supporting Text */}
          <p className="mt-8 md:mt-10 text-white/80 text-base md:text-lg max-w-2xl mx-auto font-sans leading-relaxed">
            THEDCO is a hospitality advisory firm. We work with hotel and restaurant owners at every stage, from a first idea that hasn’t been built yet, to a business that’s open but not making the money it should. We handle strategy, operations, staffing, systems, branding and profitability, and we stay involved through execution, not just planning.
          </p>
        </Container>
      </motion.div>

      {/* Bottom Scroll Cue */}
      <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20 pointer-events-none">
        <span className="text-xs uppercase tracking-[0.25em] text-white/60 font-medium font-sans">
          Scroll
        </span>
        <div className="w-[1px] h-12 md:h-16 bg-white/10 relative overflow-hidden">
          <motion.div
            className="w-full h-[40%] bg-primary"
            animate={preferReduced ? {} : { y: ["-100%", "300%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </div>
    </section>
  );
}