"use client";

import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Reveal } from "@/components/motion/Reveal";

export function FounderBackground() {
  const preferReduced = useReducedMotion();

  return (
    <section className="bg-black text-white py-20 md:py-28 border-b border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Heading & Body Copy */}
          <div className="lg:col-span-7 space-y-8">
            <Reveal>
              <span className="text-xs uppercase tracking-[0.3em] text-primary block font-semibold">
                FOUNDER BACKGROUND
              </span>
              <h2 className="text-3xl md:text-5xl font-serif text-white tracking-tight uppercase leading-tight mt-3">
                A Foundation Built on Real Experience
              </h2>
            </Reveal>

            <div className="space-y-6 text-base md:text-lg text-white/80 leading-relaxed font-sans font-light">
              <Reveal delay={0.1}>
                <p>
                  Manav Chandak is a third generation hospitality entrepreneur, associated with the Panchavati Group of Hotels, Motels and Restaurants, a family business established. Growing up inside a working hotel and restaurant business gave him early, hands-on exposure to guest service, daily operations, financial management and long term strategy, well before it became his profession.
                </p>
              </Reveal>
              <Reveal delay={0.25}>
                <p>
                  He holds a Master’s degree in Global Family Managed Business from SP Jain School of Global Management, with specialisation in business strategy, entrepreneurship, leadership, succession planning and scaling family owned enterprises.
                </p>
              </Reveal>
            </div>
          </div>

          {/* Right Column: Editorial Image */}
          <div className="lg:col-span-5">
            <motion.div
              initial={preferReduced ? { opacity: 1 } : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-[4/5] w-full overflow-hidden border border-white/15 rounded-sm"
            >
              <Image
                src="/images/founder/founder_candid_portrait.png"
                alt="Manav Chandak - Founder & Lead Advisor"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover filter grayscale contrast-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 z-10 px-3 py-1.5 bg-black/80 backdrop-blur-md border border-white/10 text-xs font-mono uppercase tracking-widest text-primary">
                MANAV CHANDAK // THEDCO
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
