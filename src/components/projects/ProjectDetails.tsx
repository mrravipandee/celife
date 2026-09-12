"use client";

import React from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Reveal } from "@/components/motion/Reveal";

export interface ProjectDetailsProps {
  description: string;
  services: string[];
}

function CheckmarkIcon({ delay, preferReduced }: { delay: number; preferReduced: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 text-primary"
    >
      <circle
        cx="9"
        cy="9"
        r="8"
        stroke="rgba(201, 162, 74, 0.3)"
        strokeWidth="1.2"
      />
      <motion.path
        d="M5.5 9.2L7.8 11.5L12.5 6.5"
        stroke="#c9a24a"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={preferReduced ? { pathLength: 1 } : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.5,
          delay: preferReduced ? 0 : delay,
          ease: [0.16, 1, 0.3, 1],
        }}
      />
    </svg>
  );
}

export function ProjectDetails({ description, services }: ProjectDetailsProps) {
  const preferReduced = useReducedMotion();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-4">
      {/* Narrative Body */}
      <div className="lg:col-span-8">
        <Reveal delay={0.2}>
          <p className="text-base md:text-lg text-white/80 leading-relaxed font-sans font-light select-text">
            {description}
          </p>
        </Reveal>
      </div>

      {/* Deliverables Checklist Column */}
      <div className="lg:col-span-4 space-y-6 lg:border-l lg:border-white/5 lg:pl-10">
        <Reveal delay={0.3}>
          <h3 className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">
            Services Delivered
          </h3>
        </Reveal>

        <ul className="space-y-4 text-sm text-white/80 font-sans">
          {services.map((srv, index) => {
            const itemDelay = 0.35 + index * 0.08;
            return (
              <motion.li
                key={srv}
                initial={preferReduced ? { opacity: 1, x: 0 } : { opacity: 0, x: 15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: preferReduced ? 0 : itemDelay,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex items-center space-x-3.5"
              >
                <CheckmarkIcon delay={itemDelay + 0.15} preferReduced={preferReduced} />
                <span className="text-white/85">{srv}</span>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
