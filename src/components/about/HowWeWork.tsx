"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/Reveal";

const PRINCIPLES = [
  {
    num: "01",
    title: "End to End Delivery",
    desc: "From concept to execution.",
  },
  {
    num: "02",
    title: "Hospitality Only Focus",
    desc: "We work only with restaurants, hotels and resorts.",
  },
  {
    num: "03",
    title: "Hands On Implementation",
    desc: "We work alongside your team, not from a distance.",
  },
  {
    num: "04",
    title: "Data Driven Approach",
    desc: "Every decision is backed by real numbers.",
  },
];

export function HowWeWork() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const preferReduced = useReducedMotion();

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-45% 0px -45% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = Number(entry.target.getAttribute("data-index"));
          setActiveIndex(index);
        }
      });
    }, observerOptions);

    const items = containerRef.current?.querySelectorAll(".work-item");
    if (items) {
      items.forEach((item) => observer.observe(item));
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="bg-black text-white relative border-b border-white/5 py-20 md:py-28 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Heading & Tracker (Sticky on Desktop) */}
          <div className="col-span-12 lg:col-span-5 lg:sticky lg:top-32 self-start h-fit space-y-8 pb-12 lg:pb-0">
            <Reveal className="space-y-6">
              <span className="text-xs uppercase tracking-[0.3em] text-primary block font-semibold">
                OUR PHILOSOPHY
              </span>
              <h2 className="text-3xl md:text-5xl font-serif text-white tracking-tight uppercase leading-tight">
                How We Work
              </h2>
            </Reveal>

            {/* Vertical Progress indicator (Desktop only) */}
            <div className="hidden lg:flex items-center space-x-6 pt-4">
              <span className="text-xs font-mono tracking-widest text-primary/70">01</span>
              <div className="h-32 w-[1px] bg-white/10 relative">
                <div
                  className="absolute top-0 left-0 w-[2px] bg-primary transition-all duration-500 ease-out"
                  style={{ height: `${(activeIndex / (PRINCIPLES.length - 1)) * 100}%` }}
                />
              </div>
              <span className="text-xs font-mono tracking-widest text-primary/70">04</span>
            </div>
          </div>

          {/* Right Column: Step Cards with 3D rotateX stagger under shared perspective */}
          <div
            style={{ perspective: 1200, transformStyle: "preserve-3d" }}
            className="col-span-12 lg:col-span-7 space-y-10 lg:space-y-16"
          >
            {PRINCIPLES.map((item, idx) => {
              const isActive = activeIndex === idx;
              return (
                <motion.div
                  key={item.num}
                  data-index={idx}
                  initial={preferReduced ? { opacity: 1, rotateX: 0, y: 0 } : { opacity: 0, rotateX: 15, y: 35 }}
                  whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{
                    duration: 0.7,
                    delay: preferReduced ? 0 : idx * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{ transformStyle: "preserve-3d" }}
                  className={cn(
                    "work-item border-b border-white/10 pb-12 transition-all duration-500 ease-out",
                    isActive ? "opacity-100 scale-100" : "lg:opacity-30 lg:scale-[0.98]"
                  )}
                >
                  <div className="flex items-start space-x-6 md:space-x-8">
                    {/* Principle number */}
                    <span
                      className={cn(
                        "text-2xl md:text-3xl font-serif transition-colors duration-500 tabular-nums shrink-0",
                        isActive ? "text-primary font-medium" : "text-white/40"
                      )}
                    >
                      {item.num}
                    </span>

                    {/* Content details */}
                    <div className="space-y-3 flex-grow">
                      <h3
                        className={cn(
                          "text-xl md:text-2xl font-serif uppercase tracking-wider transition-colors duration-500",
                          isActive ? "text-white font-medium" : "text-white/60"
                        )}
                      >
                        {item.title}
                      </h3>
                      <p className="text-sm md:text-base text-white/75 font-sans font-light leading-relaxed max-w-xl">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
