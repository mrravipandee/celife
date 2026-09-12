"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useIsDesktop } from "@/lib/hooks/use-is-desktop";
import { Reveal } from "@/components/motion/Reveal";

interface VentureItem {
  id: string;
  key: "panchavati" | "xlar" | "tbk" | "central";
  title: string;
  subtitle: string;
  role: string;
  xPercent: number;
  yPercent: number;
}

const VENTURES_DATA: VentureItem[] = [
  {
    id: "00",
    key: "central",
    title: "THEDCO",
    subtitle: "Hospitality Advisory Nexus",
    role: "Founder & Lead Advisor",
    xPercent: 50,
    yPercent: 48,
  },
  {
    id: "01",
    key: "panchavati",
    title: "Panchavati Group",
    subtitle: "Hotels, Motels & Restaurants",
    role: "3rd Generation Leadership",
    xPercent: 20,
    yPercent: 26,
  },
  {
    id: "02",
    key: "xlar",
    title: "XLAR Media",
    subtitle: "Digital Strategy & Media Production",
    role: "Founder & Director",
    xPercent: 80,
    yPercent: 30,
  },
  {
    id: "03",
    key: "tbk",
    title: "The Brand Klinik",
    subtitle: "Hospitality Brand Reputation Management",
    role: "Service Co-founder / Partner",
    xPercent: 50,
    yPercent: 82,
  },
];

const CONNECTIONS = [
  { from: "central", to: "panchavati" },
  { from: "central", to: "xlar" },
  { from: "central", to: "tbk" },
  { from: "panchavati", to: "xlar" },
  { from: "panchavati", to: "tbk" },
  { from: "xlar", to: "tbk" },
];

export function AssociatedVentures() {
  const isDesktop = useIsDesktop();
  const preferReduced = useReducedMotion();
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // ─── Desktop 2D SVG Constellation Graphic ───────────────────────────────────

  return (
    <section className="bg-black text-white py-20 md:py-28 border-b border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="mb-14 space-y-4 max-w-3xl">
          <Reveal>
            <span className="text-xs uppercase tracking-[0.3em] text-primary block font-semibold">
              VENTURE ECOSYSTEM
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-white tracking-tight uppercase mt-3">
              Associated Ventures & Leadership
            </h2>
            <p className="text-sm md:text-base text-white/70 leading-relaxed font-sans font-light mt-4">
              An integrated network spanning multi-property hotel operations, media production, and digital reputation.
            </p>
          </Reveal>
        </div>

        {/* Mobile View: Static Clean 2-Column List */}
        {!isDesktop ? (
          <div className="space-y-4">
            {VENTURES_DATA.filter((v) => v.key !== "central").map((venture) => (
              <div
                key={venture.id}
                className="p-6 border border-white/10 bg-white/[0.015] rounded-sm space-y-2"
              >
                <div className="flex justify-between items-center text-xs font-mono text-primary">
                  <span>{venture.id}</span>
                  <span className="text-white/50">{venture.role}</span>
                </div>
                <h3 className="text-xl font-serif text-white">{venture.title}</h3>
                <p className="text-xs text-white/70 font-sans">{venture.subtitle}</p>
              </div>
            ))}
          </div>
        ) : (
          /* Desktop View: Interactive Constellation Graph */
          <div className="relative w-full h-[520px] rounded-lg border border-white/10 bg-[#060606] p-8 overflow-hidden select-none">
            {/* Background Grid Elements */}
            <div
              className="absolute inset-0 opacity-[0.06] pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(#c9a24a 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />

            {/* SVG Connecting Lines Canvas */}
            <svg
              viewBox="0 0 1000 520"
              className="absolute inset-0 w-full h-full pointer-events-none z-0"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {CONNECTIONS.map((conn, idx) => {
                const nodeA = VENTURES_DATA.find((v) => v.key === conn.from)!;
                const nodeB = VENTURES_DATA.find((v) => v.key === conn.to)!;

                const x1 = (nodeA.xPercent / 100) * 1000;
                const y1 = (nodeA.yPercent / 100) * 520;
                const x2 = (nodeB.xPercent / 100) * 1000;
                const y2 = (nodeB.yPercent / 100) * 520;

                const isConnected =
                  hoveredNode === null ||
                  hoveredNode === conn.from ||
                  hoveredNode === conn.to;

                return (
                  <motion.line
                    key={idx}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#c9a24a"
                    strokeWidth={hoveredNode && isConnected ? 1.8 : 0.8}
                    strokeDasharray={conn.from === "central" || conn.to === "central" ? "none" : "4 4"}
                    initial={preferReduced ? { pathLength: 1 } : { pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.0, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    animate={{
                      opacity: hoveredNode === null ? 0.35 : isConnected ? 0.9 : 0.08,
                    }}
                  />
                );
              })}
            </svg>

            {/* Real HTML Nodes absolutely positioned with independent float */}
            {VENTURES_DATA.map((node, i) => {
              const isCenter = node.key === "central";
              const isDimmed = hoveredNode !== null && hoveredNode !== node.key;
              const floatDurations = [5.5, 6.8, 7.2, 5.0];

              return (
                <motion.div
                  key={node.key}
                  style={{
                    left: `${node.xPercent}%`,
                    top: `${node.yPercent}%`,
                  }}
                  animate={
                    preferReduced
                      ? {}
                      : {
                        y: isCenter ? [0, -4, 0] : [-5, 5, -5],
                      }
                  }
                  transition={{
                    duration: floatDurations[i % floatDurations.length],
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  onMouseEnter={() => setHoveredNode(node.key)}
                  onMouseLeave={() => setHoveredNode(null)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer transition-opacity duration-300 ${isDimmed ? "opacity-35" : "opacity-100"
                    }`}
                >
                  <div
                    className={`relative p-5 rounded-md border backdrop-blur-md transition-all duration-500 max-w-[280px] text-center ${isCenter
                        ? "bg-black/90 border-primary shadow-[0_0_24px_rgba(201,162,74,0.35)] ring-1 ring-primary/40"
                        : "bg-black/85 border-white/15 hover:border-primary/60 hover:shadow-[0_0_18px_rgba(201,162,74,0.2)]"
                      }`}
                  >
                    {/* Node Dot Beacon */}
                    <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary ring-4 ring-black" />

                    <span className="text-[10px] uppercase font-mono tracking-widest text-primary font-semibold block mb-1">
                      {node.role}
                    </span>

                    <h4 className="text-lg md:text-xl font-serif text-white font-medium leading-snug">
                      {node.title}
                    </h4>

                    <p className="text-[11px] text-white/60 font-sans mt-1 leading-normal font-light">
                      {node.subtitle}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
