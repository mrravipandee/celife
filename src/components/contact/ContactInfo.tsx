"use client";

import React from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Reveal } from "@/components/motion/Reveal";
import { LineReveal } from "@/components/motion/LineReveal";

export function ContactInfo() {
  const preferReduced = useReducedMotion();
  const email = "hello@thedco.in";
  const location = "Based in Maharashtra. Advising hospitality businesses across India.";
  const hours = "By Appointment Only";
  const phone = ""; // Optional

  const categories = [
    "New Hospitality Projects",
    "Existing Businesses Requiring Improvement",
    "Hotel Projects",
    "Restaurant Projects",
    "Resorts",
    "Hospitality Investments",
    "Operations Improvement",
    "Profitability Improvement",
    "Branding & Marketing Support",
  ];

  return (
    <div className="space-y-12 select-text">
      <div className="space-y-8">
        <Reveal>
          <span className="text-xs uppercase tracking-[0.35em] text-primary block font-semibold font-sans">
            DIRECT COORDINATES
          </span>
        </Reveal>

        <div className="space-y-8">
          {/* Email Block */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-primary shrink-0">
                <motion.path
                  d="M3 8L10.89 13.26C11.56 13.71 12.44 13.71 13.11 13.26L21 8M5 19H19C20.1 19 21 18.1 21 17V7C21 5.9 20.1 5 19 5H5C3.9 5 3 5.9 3 7V17C3 18.1 3.9 19 5 19Z"
                  stroke="#c9a24a"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={preferReduced ? { pathLength: 1 } : { pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </svg>
              <span className="text-xs uppercase tracking-[0.2em] text-white/60 font-sans font-medium">
                EMAIL
              </span>
            </div>

            <LineReveal className="bg-primary/30 max-w-[60px]" delay={0.1} />

            <div className="relative inline-block group pt-1">
              <a
                href={`mailto:${email}`}
                className="text-lg md:text-xl font-serif text-white group-hover:text-primary transition-colors duration-300 block"
              >
                {email}
              </a>
              {/* Wipe-in gold underline on hover */}
              <div className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-primary transition-all duration-300 group-hover:w-full" />
            </div>
          </div>

          {/* Location Block */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-primary shrink-0">
                <motion.path
                  d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z"
                  stroke="#c9a24a"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={preferReduced ? { pathLength: 1 } : { pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
                />
              </svg>
              <span className="text-xs uppercase tracking-[0.2em] text-white/60 font-sans font-medium">
                LOCATION
              </span>
            </div>

            <LineReveal className="bg-primary/30 max-w-[60px]" delay={0.2} />

            <p className="text-sm text-white/80 leading-relaxed font-sans font-light">
              {location}
            </p>
          </div>

          {/* Hours Block */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-primary shrink-0">
                <motion.path
                  d="M12 6V12L16 14M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                  stroke="#c9a24a"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={preferReduced ? { pathLength: 1 } : { pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                />
              </svg>
              <span className="text-xs uppercase tracking-[0.2em] text-white/60 font-sans font-medium">
                BUSINESS HOURS
              </span>
            </div>

            <LineReveal className="bg-primary/30 max-w-[60px]" delay={0.3} />

            <p className="text-sm text-white/80 leading-relaxed font-sans font-light">
              {hours}
            </p>
          </div>

          {phone && (
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-[0.2em] text-white/60 font-sans font-medium">
                PHONE
              </span>
              <div className="relative inline-block group">
                <a
                  href={`tel:${phone}`}
                  className="text-lg md:text-xl font-serif text-white hover:text-primary transition-colors duration-300 block"
                >
                  {phone}
                </a>
                <div className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-primary transition-all duration-300 group-hover:w-full" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Areas of Engagement Cloud */}
      <div className="space-y-6 pt-6 border-t border-white/10">
        <Reveal>
          <span className="text-xs uppercase tracking-[0.35em] text-primary block font-semibold font-sans">
            AREAS OF ENGAGEMENT
          </span>
        </Reveal>

        <div className="flex flex-wrap gap-x-3 gap-y-3">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              initial={preferReduced ? { opacity: 1 } : { opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: preferReduced ? 0 : index * 0.04 }}
              className="flex items-center space-x-2 text-xs uppercase tracking-[0.15em] bg-white/[0.02] border border-white/5 hover:border-primary/40 px-3 py-1.5 font-medium transition-colors duration-300"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="text-white/80 font-sans">{category}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
