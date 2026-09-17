"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Reveal } from "@/components/motion/Reveal";
import { LineReveal } from "@/components/motion/LineReveal";
import { ScrollReveal, WordStagger } from "@/components/motion/ScrollReveal";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Philosophy() {
  const containerRef = useRef<HTMLDivElement>(null);
  const preferReduced = useReducedMotion();

  useGSAP(
    () => {
      if (preferReduced || !containerRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          end: "bottom 15%",
          scrub: true,
        },
      });

      tl.fromTo(
        containerRef.current,
        { "--philosophy-bg": "#000000" },
        { "--philosophy-bg": "#0a0806", duration: 1, ease: "none" }
      ).to(
        containerRef.current,
        { "--philosophy-bg": "#000000", duration: 1, ease: "none" }
      );
    },
    { scope: containerRef, dependencies: [preferReduced] }
  );

  return (
    <div
      ref={containerRef}
      style={{
        backgroundColor: preferReduced ? "#000000" : "var(--philosophy-bg, #000000)",
      }}
      className="text-white space-y-0"
    >
      {/* SECTION 5: FOUNDER'S NOTE */}
      <section className="py-20 md:py-28 border-b border-white/5 relative overflow-hidden">
        {/* Subtle large background branding */}
        <ScrollReveal variant="fadeIn" delay={0.2} duration={2.0} threshold={0.1}>
          <div className="absolute right-[-2%] bottom-[-5%] select-none pointer-events-none font-serif text-[15vw] leading-none text-white/[0.012] z-0 font-bold">
            THEDCO
          </div>
        </ScrollReveal>

        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 relative z-10">
          {/* Eyebrow and heading */}
          <div className="lg:col-span-4">
            <Reveal className="space-y-4">
              <span className="text-xs uppercase tracking-[0.3em] text-primary font-semibold">
                FOUNDER PROFILE
              </span>
              <h2 className="text-3xl md:text-4xl font-serif tracking-tight leading-tight">
                Meet the Founder
              </h2>
            </Reveal>
          </div>

          {/* Quote & details */}
          <div className="lg:col-span-8 space-y-12">
            <Reveal className="relative" delay={0.1}>
              <span className="absolute -top-10 -left-6 text-8xl font-serif text-primary/10 select-none">
                &ldquo;
              </span>
              {/* Word-by-word stagger on the main founder quote */}
              <blockquote className="quote relative z-10">
                <p className="text-2xl md:text-4xl font-serif text-white/95 leading-relaxed italic">
                  <WordStagger
                    text="Exceptional hospitality is created through operational excellence, financial discipline, continuous innovation, and a consistent commitment to the guest experience."
                    delay={0.1}
                    staggerDelay={0.04}
                    duration={0.7}
                    threshold={0.15}
                  />
                </p>
              </blockquote>
            </Reveal>

            {/* Split layout block */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-6 relative">
              <LineReveal className="absolute top-0 left-0 bg-white/10 w-full" delay={0.2} />

              <div className="md:col-span-7 pt-4">
                <Reveal delay={0.3} className="space-y-4 text-sm text-white/70 leading-relaxed font-sans">
                  <p>
                    Manav Chandak grew up inside a working hotel and restaurant business, three generations deep in the Panchavati Group of Hotels, Motels and Restaurants, founded in 1983. He later built and ran his own marketing agency, then added a Master’s in Global Family Managed Business from SP Jain to the operating experience he already had.
                  </p>
                </Reveal>
              </div>

              <div className="md:col-span-5 flex flex-col justify-between space-y-6 pt-4">
                <Reveal delay={0.4} className="space-y-2">
                  <span className="block text-lg font-serif text-primary font-medium">
                    Manav Chandak
                  </span>
                  <span className="block text-xs md:text-sm uppercase tracking-[0.18em] text-white/70 font-sans font-medium">
                    Founder, THEDCO
                  </span>
                </Reveal>

                <Reveal delay={0.5}>
                  <motion.div whileHover={preferReduced ? {} : { x: 4 }}>
                    <Link
                      href="/founder"
                      className="inline-block text-xs md:text-sm uppercase tracking-[0.2em] text-primary font-medium border-b border-primary/40 hover:border-primary pb-1 transition-all duration-300 w-fit cursor-pointer"
                    >
                      Read Founder&apos;s Full Profile
                    </Link>
                  </motion.div>
                </Reveal>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: TESTIMONIALS */}
      <section className="py-20 md:py-28 border-b border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-4">
            <Reveal className="space-y-4">
              <span className="text-xs uppercase tracking-[0.3em] text-primary font-semibold">
                TESTIMONIALS
              </span>
              <h2 className="text-3xl md:text-4xl font-serif tracking-tight leading-tight">
                What Our Clients Say
              </h2>
            </Reveal>
          </div>

          {/* Testimonial quote */}
          <div className="lg:col-span-8 flex flex-col justify-center space-y-8 relative">
            <ScrollReveal variant="slideLeft" delay={0.15} duration={0.85} threshold={0.2}>
              <div className="relative">
                <span className="absolute -top-12 -left-6 text-9xl font-serif text-primary/10 select-none">
                  &ldquo;
                </span>
                <blockquote className="quote relative z-10">
                  <p className="text-2xl md:text-3xl font-serif text-white/80 leading-relaxed italic max-w-3xl">
                    THEDCO helped us structure our restaurant operations, recruit the team and prepare the systems required for opening. Their practical involvement made the launch process much more organised.
                  </p>
                </blockquote>
              </div>
            </ScrollReveal>
            <LineReveal className="bg-primary/45 w-12" delay={0.3} />
          </div>
        </div>
      </section>
    </div>
  );
}
