"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Reveal } from "@/components/motion/Reveal";

const WHY_POINTS = [
  {
    num: "01",
    title: "Practical Over Theoretical",
    desc: "We implement solutions, not just deliver reports.",
  },
  {
    num: "02",
    title: "Single Point of Contact",
    desc: "One team across audit, finance, menu and marketing.",
  },
  {
    num: "03",
    title: "Hospitality Specific Standards",
    desc: "Industry correct terminology, SOPs and benchmarks.",
  },
  {
    num: "04",
    title: "Hands On Implementation",
    desc: "We work on the floor with your team, not from a distance.",
  },
  {
    num: "05",
    title: "Data Backed Recommendations",
    desc: "Every decision is traced back to real operational numbers.",
  },
  {
    num: "06",
    title: "Transparent Monitoring",
    desc: "Regular reviews track progress against agreed KPIs.",
  },
];

function WhyCard({
  item,
  preferReduced,
}: {
  item: typeof WHY_POINTS[0];
  preferReduced: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(150);
  const mouseY = useMotionValue(80);
  const springX = useSpring(mouseX, { damping: 24, stiffness: 200 });
  const springY = useSpring(mouseY, { damping: 24, stiffness: 200 });

  const glowBackground = useTransform(
    [springX, springY],
    ([x, y]) =>
      `radial-gradient(320px circle at ${x}px ${y}px, rgba(201, 162, 74, 0.12) 0%, rgba(201, 162, 74, 0.02) 50%, transparent 80%)`
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (preferReduced || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative p-8 md:p-10 bg-white/[0.015] flex flex-col justify-between min-h-[220px] rounded-sm overflow-hidden transition-colors duration-300 border border-white/10"
    >
      {/* Cursor-tracking Gold Glow */}
      {!preferReduced && (
        <motion.div
          aria-hidden="true"
          style={{ background: glowBackground }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="pointer-events-none absolute inset-0 z-0"
        />
      )}

      {/* Card Header (Number) */}
      <div className="relative z-10 flex items-center justify-between">
        <span className="text-xs font-mono text-primary font-semibold tracking-wider">
          {item.num}
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors duration-300" />
      </div>

      {/* Card Content */}
      <div className="relative z-10 space-y-3 pt-6">
        <h3 className="text-xl md:text-2xl font-serif text-white group-hover:text-primary transition-colors duration-300">
          {item.title}
        </h3>
        <p className="text-sm text-white/75 leading-relaxed font-sans font-light">
          {item.desc}
        </p>
      </div>

      {/* Bottom accent draw */}
      <div className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-primary transition-all duration-500 group-hover:w-full z-20" />
    </div>
  );
}

export function WhyChooseHome() {
  const preferReduced = useReducedMotion();

  return (
    <section className="bg-black text-white py-20 md:py-28 border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <Reveal className="max-w-3xl mb-16 space-y-4">
          <span className="text-xs uppercase tracking-[0.3em] text-primary block font-semibold">
            WHY CHOOSE US
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-white tracking-tight leading-tight">
            Why Choose THEDCO
          </h2>
        </Reveal>

        {/* 2x3 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHY_POINTS.map((item) => (
            <WhyCard
              key={item.num}
              item={item}
              preferReduced={preferReduced}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
