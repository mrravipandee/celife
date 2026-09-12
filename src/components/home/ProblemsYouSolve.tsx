"use client";

import React from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Reveal } from "@/components/motion/Reveal";

const CHALLENGES = [
  "Restaurant sales are low",
  "Food cost is too high",
  "Staff performance is inconsistent",
  "Hotel occupancy is poor",
  "The business depends on discounts to get customers in",
  "Busy on most days but still not profitable",
  "Inventory and purchase systems are weak",
  "The opening keeps getting delayed",
  "The concept was never clearly positioned",
  "Customers aren’t returning",
  "Online reviews are weak",
  "Banquet revenue is underperforming",
  "There’s no reliable reporting",
  "There are no SOPs in place",
  "Expansion is planned but the systems aren’t ready",
];

export function ProblemsYouSolve() {
  const preferReduced = useReducedMotion();

  return (
    <section className="bg-black text-white py-20 md:py-28 border-b border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header Block */}
        <Reveal className="max-w-3xl mb-16 space-y-4">
          <span className="text-xs uppercase tracking-[0.3em] text-primary block font-semibold">
            PROBLEMS YOU SOLVE
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-white tracking-tight leading-tight">
            Facing Any of These Challenges?
          </h2>
        </Reveal>

        {/* 3-Column Interactive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CHALLENGES.map((challenge, idx) => (
            <motion.div
              key={challenge + idx}
              initial={preferReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{
                duration: 0.55,
                delay: preferReduced ? 0 : (idx % 6) * 0.05,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group relative p-6 md:p-8 bg-white/[0.015] border border-white/10 hover:border-primary/50 transition-all duration-300 rounded-sm flex items-start space-x-4 cursor-default"
            >
              {/* Number Badge */}
              <span className="text-xs font-mono text-primary/70 group-hover:text-primary font-semibold tracking-wider pt-0.5 transition-colors duration-300">
                {String(idx + 1).padStart(2, "0")}
              </span>

              {/* Challenge Text */}
              <p className="text-base md:text-lg font-serif text-white/85 group-hover:text-white transition-colors duration-300 leading-snug">
                {challenge}
              </p>

              {/* Bottom Subtle Gold Hairline draw on hover */}
              <div className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-primary transition-all duration-500 group-hover:w-full" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
