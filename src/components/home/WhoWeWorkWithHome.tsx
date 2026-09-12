"use client";

import React from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Reveal } from "@/components/motion/Reveal";

const AUDIENCES = [
  "Hotels",
  "Resorts",
  "Motels",
  "Boutique Hotels",
  "Business Hotels",
  "Restaurants",
  "Thali Restaurants",
  "Cafés and QSRs",
  "Cloud Kitchens",
  "Bars and Lounges",
  "Bakeries and Confectionery",
  "Banquet Halls",
  "Caterers",
  "Highway Hospitality Businesses",
  "Pilgrimage Location Hotels and Restaurants",
  "New Hospitality Entrepreneurs",
  "Existing Businesses Requiring Improvement",
  "Investors Planning Hospitality Projects",
];

export function WhoWeWorkWithHome() {
  const preferReduced = useReducedMotion();

  return (
    <section className="bg-black text-white py-20 md:py-28 border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Heading */}
          <div className="lg:col-span-4 lg:sticky lg:top-32 self-start space-y-4">
            <Reveal>
              <span className="text-xs uppercase tracking-[0.3em] text-primary block font-semibold">
                BUSINESSES YOU SERVE
              </span>
              <h2 className="text-3xl md:text-5xl font-serif text-white tracking-tight leading-tight mt-3">
                Who We Work With
              </h2>
            </Reveal>
          </div>

          {/* Right Column: 2-Column grid of slide-up masked items */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            {AUDIENCES.map((item, idx) => (
              <div
                key={item + idx}
                className="group relative py-4 border-b border-white/10 cursor-pointer overflow-hidden"
              >
                {/* Masked Slide-up Container */}
                <div className="overflow-hidden">
                  <motion.div
                    initial={preferReduced ? { y: "0%", opacity: 1 } : { y: "100%", opacity: 0 }}
                    whileInView={{ y: "0%", opacity: 1 }}
                    viewport={{ once: true, margin: "-20px" }}
                    transition={{
                      duration: 0.6,
                      delay: preferReduced ? 0 : (idx % 6) * 0.04,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="flex items-center justify-between"
                  >
                    {/* Category Name */}
                    <span className="text-base md:text-lg font-serif text-white/80 group-hover:text-primary transition-all duration-300 transform group-hover:translate-x-2 leading-snug">
                      {item}
                    </span>

                    {/* Subtle brand tag */}
                    <span className="text-[10px] text-white/40 group-hover:text-primary transition-colors duration-300 font-mono tracking-widest uppercase">
                      / DCO
                    </span>
                  </motion.div>
                </div>

                {/* Underline draw animation on hover */}
                <div className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-primary transition-all duration-500 group-hover:w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
