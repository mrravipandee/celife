"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useIsDesktop } from "@/lib/hooks/use-is-desktop";
import { ServiceBlueprint } from "./ServiceBlueprint";

export interface ServiceItem {
  num: string;
  title: string;
  description: string;
  points: string[];
}

export interface ServiceListProps {
  services: ServiceItem[];
}

export function ServiceList({ services }: ServiceListProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(0); // Default to first service on desktop
  const [expandedIndices, setExpandedIndices] = useState<number[]>([0]); // For mobile accordion tap
  const preferReduced = useReducedMotion();
  const isDesktop = useIsDesktop();

  const handleRowClick = (index: number) => {
    if (!isDesktop) {
      setExpandedIndices((prev) =>
        prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
      );
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
      {/* Left Column: Interactive 9 Rows */}
      <div className="lg:col-span-7 space-y-0 relative">
        {services.map((service, index) => {
          const isHovered = hoveredIndex === index;
          const isExpandedMobile = expandedIndices.includes(index);
          const isExpanded = isDesktop ? isHovered : isExpandedMobile;

          return (
            <div
              key={service.num}
              onMouseEnter={() => isDesktop && setHoveredIndex(index)}
              onClick={() => handleRowClick(index)}
              className="group relative py-8 md:py-10 border-t border-white/10 cursor-pointer select-none transition-colors duration-300"
            >
              {/* Gold Hairline that draws from 0 to 100% width on hover, origin left */}
              <div className="absolute bottom-0 left-0 w-full h-[1.5px] bg-transparent overflow-hidden">
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: isHovered || isExpanded ? 1 : 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  style={{ transformOrigin: "left" }}
                  className="w-full h-full bg-primary"
                />
              </div>

              <div className="flex items-start space-x-6 md:space-x-8">
                {/* Large Cormorant Index Number */}
                <motion.span
                  animate={
                    preferReduced
                      ? { opacity: 0.35 }
                      : {
                          opacity: isHovered || isExpanded ? 0.38 : 0.15,
                          scale: isHovered || isExpanded ? 1.08 : 1,
                          color: isHovered || isExpanded ? "#c9a24a" : "#ffffff",
                        }
                  }
                  transition={{ duration: 0.4 }}
                  className="font-serif text-3xl md:text-5xl font-light tracking-wide shrink-0 tabular-nums select-none origin-left"
                >
                  {service.num}
                </motion.span>

                {/* Title and Collapsible Deliverables */}
                <div className="flex-1 space-y-3">
                  {/* Title that slides right by 24px on hover */}
                  <motion.h3
                    animate={
                      preferReduced
                        ? { x: 0 }
                        : {
                            x: isHovered || isExpanded ? 24 : 0,
                            color: isHovered || isExpanded ? "#c9a24a" : "#ffffff",
                          }
                    }
                    transition={{ type: "spring", stiffness: 260, damping: 22 }}
                    className="text-2xl md:text-3xl font-serif leading-snug tracking-tight font-normal"
                  >
                    {service.title}
                  </motion.h3>

                  {/* Summary Narrative */}
                  <p className="text-sm md:text-base text-white/70 leading-relaxed font-sans font-light max-w-xl">
                    {service.description}
                  </p>

                  {/* Collapsible Deliverable Bullets (Expand on hover/tap with height auto) */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden pt-4"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/5">
                          {service.points.map((point, pIdx) => (
                            <motion.div
                              key={point + pIdx}
                              initial={preferReduced ? { opacity: 1 } : { opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{
                                duration: 0.35,
                                delay: preferReduced ? 0 : pIdx * 0.05,
                              }}
                              className="flex items-center space-x-2.5"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                              <span className="text-xs md:text-sm text-white/80 font-sans tracking-wide">
                                {point}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Mobile Accordion Indicator */}
                {!isDesktop && (
                  <span className="text-primary text-xl font-light shrink-0">
                    {isExpandedMobile ? "−" : "+"}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Right Column: Sticky Isometric SVG Blueprint Panel (Desktop Only >= 1024px) */}
      {isDesktop && (
        <div className="hidden lg:block lg:col-span-5 sticky top-28 pl-4">
          <ServiceBlueprint
            activeServiceNum={
              hoveredIndex !== null ? services[hoveredIndex]?.num || null : null
            }
          />
        </div>
      )}
    </div>
  );
}
