"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, animate, useInView } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Reveal } from "@/components/motion/Reveal";
import { LineReveal } from "@/components/motion/LineReveal";

const EXPERIENCE_POINTS = [
  { target: 1, text: "Panchavati Group of Hotels, Motels and Restaurants", note: "1983 Heritage" },
  { target: 2, text: "Hotel and restaurant operations across Maharashtra", note: "End-to-End" },
  { target: 3, text: "Hospitality advisory & financial turnaround projects", note: "Strategy" },
  { target: 4, text: "Pre-opening consulting & restaurant launches", note: "Execution" },
  { target: 5, text: "Food service branding, positioning and digital marketing", note: "Identity" },
  { target: 6, text: "XLAR Media Service advisory collaboration", note: "Ventures" },
  { target: 7, text: "The Brand Klinik growth & reputation management", note: "Ecosystem" },
];

function CountUpNumber({ target, preferReduced }: { target: number; preferReduced: boolean }) {
  const [displayValue, setDisplayValue] = useState(preferReduced ? target : 0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });

  useEffect(() => {
    if (preferReduced || !isInView) return;

    const count = { val: 0 };
    const controls = animate(count, { val: target }, {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: () => {
        setDisplayValue(Math.round(count.val));
      },
    });

    return () => controls.stop();
  }, [isInView, target, preferReduced]);

  const formatted = String(displayValue).padStart(2, "0");

  return (
    <span ref={ref} className="tabular-nums">
      {formatted}
    </span>
  );
}

function StatCard({
  item,
  index,
  preferReduced,
}: {
  item: typeof EXPERIENCE_POINTS[0];
  index: number;
  preferReduced: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for 3D tilt
  const springConfig = { damping: 22, stiffness: 260, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Map mouse (-0.5 to 0.5) to tilt (max 6deg)
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-6, 6]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (preferReduced || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div style={{ perspective: 1000 }} className="w-full">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={
          preferReduced
            ? {}
            : {
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
              }
        }
        className="group relative py-7 px-6 md:px-8 flex items-center justify-between border-t border-white/10 hover:border-primary/40 bg-white/[0.01] hover:bg-white/[0.03] transition-colors duration-300 cursor-pointer overflow-hidden rounded-sm"
      >
        <LineReveal className="absolute top-0 left-0 h-px bg-white/10 w-full" delay={index * 0.05} />

        {/* Card Content with 3D Depth */}
        <div
          className="flex items-center space-x-6 md:space-x-12"
          style={preferReduced ? {} : { transform: "translateZ(14px)" }}
        >
          <span className="text-sm font-sans tracking-widest text-primary font-semibold">
            <CountUpNumber target={item.target} preferReduced={preferReduced} />
          </span>
          <span className="text-lg md:text-xl font-serif text-white/90 group-hover:text-white transition-colors duration-300">
            {item.text}
          </span>
        </div>

        <div
          className="flex items-center space-x-4"
          style={preferReduced ? {} : { transform: "translateZ(18px)" }}
        >
          <span className="text-xs uppercase tracking-widest text-white/40 group-hover:text-primary transition-colors duration-300 hidden sm:inline-block font-sans">
            {item.note}
          </span>
          <span className="w-2 h-2 rounded-full bg-white/20 group-hover:bg-primary transition-colors duration-300" />
        </div>
      </motion.div>
    </div>
  );
}

export function QuickCredibility() {
  const preferReduced = useReducedMotion();

  return (
    <section className="bg-black text-white py-20 md:py-28 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header Block */}
        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs uppercase tracking-[0.3em] text-primary">
                QUICK CREDIBILITY
              </span>
              <h2 className="text-3xl md:text-5xl font-serif tracking-tight leading-tight">
                Grounded in Real Hospitality Experience
              </h2>
            </div>
            <div className="lg:col-span-4 flex items-end">
              <p className="text-sm text-white/70 leading-relaxed font-sans">
                THEDCO is built on direct hospitality operating experience, not general business theory.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Experience List Block */}
        <div className="space-y-0">
          {EXPERIENCE_POINTS.map((item, index) => (
            <StatCard
              key={item.text}
              item={item}
              index={index}
              preferReduced={preferReduced}
            />
          ))}
          <div className="h-px bg-white/10 w-full" />
        </div>
      </div>
    </section>
  );
}
