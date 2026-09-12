"use client";

import React from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Reveal } from "@/components/motion/Reveal";
import { mockServices } from "@/data/services";

export function ConsultingPractices() {
  const preferReduced = useReducedMotion();

  return (
    <section id="practices" className="bg-black text-white py-24 md:py-32 border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <Reveal className="max-w-3xl mb-16 space-y-4">
          <span className="text-xs uppercase tracking-[0.3em] text-primary block font-mono font-semibold">
            CORE PRACTICES
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-white tracking-tight leading-tight">
            Comprehensive Consulting Services
          </h2>
          <p className="text-base md:text-lg text-white/75 leading-relaxed font-sans font-light">
            We partner directly with hospitality asset owners, operators, and developers to eliminate operational friction, expand profit margins, and deliver resilient customer experiences.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {mockServices.map((service, idx) => {
            const formattedNum = (idx + 1).toString().padStart(2, "0");

            return (
              <motion.div
                key={service.id}
                initial={preferReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{
                  duration: 0.6,
                  delay: preferReduced ? 0 : idx * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group relative p-8 md:p-10 bg-white/[0.02] border border-white/10 flex flex-col justify-between rounded-sm overflow-hidden transition-all duration-300 hover:border-primary/50 hover:bg-white/[0.035]"
              >
                {/* Top Accent Line */}
                <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-6">
                  <span className="text-sm font-mono text-primary font-semibold tracking-widest">
                    PRACTICE // {formattedNum}
                  </span>
                  <span className="text-xs uppercase tracking-widest font-mono text-white/40">
                    {service.category}
                  </span>
                </div>

                <div className="space-y-4">
                  <h3 className="text-2xl md:text-3xl font-serif text-white group-hover:text-primary transition-colors duration-300">
                    {service.name}
                  </h3>
                  <p className="text-sm md:text-base text-white/75 leading-relaxed font-sans font-light">
                    {service.description}
                  </p>

                  <div className="pt-4 space-y-2">
                    <span className="text-xs uppercase tracking-widest text-primary/80 font-mono font-semibold block mb-2">
                      Key Deliverables:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {service.keyPoints.map((point) => (
                        <div key={point} className="flex items-center space-x-2 text-xs text-white/70 font-sans">
                          <span className="w-1 h-1 rounded-full bg-primary shrink-0" />
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
