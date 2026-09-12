"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Reveal } from "@/components/motion/Reveal";

const POINTS = [
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
    title: "Transparent Monitoring",
    desc: "Regular reviews track progress against agreed KPIs.",
  },
  {
    num: "05",
    title: "Owner Focused Approach",
    desc: "Every plan is built around the owner’s goals, not a fixed template.",
  },
  {
    num: "06",
    title: "Strong Focus on Profitability",
    desc: "Every recommendation is judged by its effect on the bottom line.",
  },
  {
    num: "07",
    title: "Experience in Tier 2 and Emerging Markets",
    desc: "We understand hospitality outside the metro cities as well as within them.",
  },
  {
    num: "08",
    title: "Access to Branding and Media Capabilities",
    desc: "Advisory, branding and marketing support under one roof.",
  },
];

function WhyCard({
  item,
  index,
  preferReduced,
}: {
  item: typeof POINTS[0];
  index: number;
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
      className="group relative p-8 md:p-10 bg-white/[0.015] flex flex-col justify-between min-h-[220px] rounded-sm overflow-hidden transition-colors duration-300"
    >
      {/* Self-drawing SVG border with stroke-dashoffset */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.rect
          x="0.5"
          y="0.5"
          width="99%"
          height="99%"
          fill="none"
          stroke={isHovered ? "#c9a24a" : "rgba(255, 255, 255, 0.12)"}
          strokeWidth="1.2"
          strokeDasharray="1400"
          initial={preferReduced ? { strokeDashoffset: 0 } : { strokeDashoffset: 1400 }}
          whileInView={{ strokeDashoffset: 0 }}
          viewport={{ once: true, margin: "-20px" }}
          transition={{
            duration: 0.9,
            delay: preferReduced ? 0 : (index % 2) * 0.1,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
      </svg>

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
        <h3 className="text-xl md:text-2xl font-serif text-white group-hover:text-primary transition-colors duration-300 uppercase tracking-wide">
          {item.title}
        </h3>
        <p className="text-sm text-white/75 leading-relaxed font-sans font-light">
          {item.desc}
        </p>
      </div>
    </div>
  );
}

export function WhyChoose() {
  const preferReduced = useReducedMotion();

  return (
    <section className="bg-black text-white py-20 md:py-28 border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <Reveal className="max-w-3xl mb-16 space-y-4">
          <span className="text-xs uppercase tracking-[0.3em] text-primary block font-semibold">
            CREDIBILITY & COMMITMENT
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-white tracking-tight uppercase leading-tight">
            Why Choose THEDCO
          </h2>
          <p className="text-sm md:text-base text-white/70 leading-relaxed font-sans font-light max-w-xl">
            Eight operational distinctions that define our advisory methodology.
          </p>
        </Reveal>

        {/* 2x4 Drawing Grid with Cursor Glow */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {POINTS.map((item, index) => (
            <WhyCard
              key={item.num}
              item={item}
              index={index}
              preferReduced={preferReduced}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
