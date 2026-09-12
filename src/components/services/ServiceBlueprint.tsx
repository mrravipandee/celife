"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export interface ServiceBlueprintProps {
  activeServiceNum: string | null;
}

export function ServiceBlueprint({ activeServiceNum }: ServiceBlueprintProps) {
  const preferReduced = useReducedMotion();

  return (
    <div className="relative w-full aspect-square max-w-[520px] rounded-lg border border-white/10 bg-[#070707] p-6 overflow-hidden flex flex-col justify-between shadow-2xl shadow-black/80">
      {/* Background Architectural Coordinate Accents */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        {/* Fine background dot matrix */}
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: "radial-gradient(#c9a24a 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
        {/* Outer Corner Caliper Marks */}
        <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-primary/40" />
        <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-primary/40" />
        <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-primary/40" />
        <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-primary/40" />
      </div>

      {/* Blueprint Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] uppercase tracking-[0.25em] text-primary font-mono font-semibold">
            ARCHITECTURAL SPEC // ISOMETRIC VIEW
          </span>
        </div>
        <span className="text-[10px] font-mono text-white/40 tracking-wider">
          ZONE_{activeServiceNum || "00"}
        </span>
      </div>

      {/* Main Isometric SVG Canvas */}
      <div className="relative flex-1 w-full flex items-center justify-center my-2">
        {/* Base Persistent Isometric 30-deg Floor Grid */}
        <svg
          viewBox="0 0 400 300"
          className="absolute inset-0 w-full h-full pointer-events-none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Isometric Diamond Grid */}
          <g stroke="rgba(201, 162, 74, 0.12)" strokeWidth="0.8">
            <line x1="200" y1="30" x2="380" y2="135" />
            <line x1="200" y1="30" x2="20" y2="135" />
            <line x1="20" y1="135" x2="200" y2="240" />
            <line x1="380" y1="135" x2="200" y2="240" />

            {/* Inner Grid Lines */}
            <line x1="155" y1="56" x2="335" y2="161" />
            <line x1="110" y1="82" x2="290" y2="187" />
            <line x1="65" y1="108" x2="245" y2="213" />

            <line x1="245" y1="56" x2="65" y2="161" />
            <line x1="290" y1="82" x2="110" y2="187" />
            <line x1="335" y1="108" x2="155" y2="213" />
          </g>

          {/* Central Datum Circle */}
          <ellipse
            cx="200"
            cy="135"
            rx="110"
            ry="60"
            stroke="rgba(201, 162, 74, 0.2)"
            strokeWidth="0.8"
            strokeDasharray="4 4"
          />
        </svg>

        {/* Dynamic Zone SVG Overlay */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeServiceNum || "default"}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full flex items-center justify-center"
          >
            <BlueprintZoneGraphic serviceNum={activeServiceNum} preferReduced={preferReduced} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Blueprint Footer Status Bar */}
      <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-3 text-[10px] font-mono text-white/50">
        <span>SCALE: 1:50 METRIC</span>
        <span className="text-primary/80">STATUS: OPERATIONAL AUDIT</span>
      </div>
    </div>
  );
}

function BlueprintZoneGraphic({
  serviceNum,
  preferReduced,
}: {
  serviceNum: string | null;
  preferReduced: boolean;
}) {
  const animProps = {
    initial: preferReduced ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0.2 },
    animate: { pathLength: 1, opacity: 1 },
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  };

  switch (serviceNum) {
    case "01": // Hotel Advisory - Front Office & Master Core
      return (
        <svg viewBox="0 0 400 300" className="w-full h-full" fill="none">
          {/* Main Reception Counter */}
          <motion.polygon
            points="140,160 210,120 260,150 190,190"
            stroke="#c9a24a"
            strokeWidth="1.5"
            fill="rgba(201,162,74,0.06)"
            {...animProps}
          />
          <motion.line x1="140" y1="160" x2="140" y2="185" stroke="#c9a24a" strokeWidth="1.5" {...animProps} />
          <motion.line x1="190" y1="190" x2="190" y2="215" stroke="#c9a24a" strokeWidth="1.5" {...animProps} />
          <motion.line x1="260" y1="150" x2="260" y2="175" stroke="#c9a24a" strokeWidth="1.5" {...animProps} />
          <motion.polygon points="140,185 190,215 260,175 210,145" stroke="#c9a24a" strokeWidth="1.2" fill="none" {...animProps} />
          
          {/* Back Wall Core Shaft */}
          <rect x="185" y="60" width="30" height="45" stroke="rgba(255,255,255,0.6)" strokeWidth="1" strokeDasharray="3 3" />
          <text x="200" y="50" fill="#c9a24a" fontSize="9" fontFamily="monospace" textAnchor="middle">CORE // LOBBY</text>
        </svg>
      );

    case "02": // Restaurant Advisory - Kitchen Stations & Cookline
      return (
        <svg viewBox="0 0 400 300" className="w-full h-full" fill="none">
          {/* Prep Island */}
          <motion.polygon points="120,140 180,105 230,135 170,170" stroke="#c9a24a" strokeWidth="1.5" fill="rgba(201,162,74,0.08)" {...animProps} />
          {/* Cookline Station */}
          <motion.polygon points="210,90 270,55 310,80 250,115" stroke="#c9a24a" strokeWidth="1.5" fill="rgba(201,162,74,0.05)" {...animProps} />
          {/* Workflow vectors */}
          <motion.path d="M170,170 Q210,150 250,115" stroke="#ffffff" strokeWidth="1" strokeDasharray="4 4" {...animProps} />
          <text x="175" y="195" fill="#c9a24a" fontSize="9" fontFamily="monospace" textAnchor="middle">COOKLINE // PASS</text>
        </svg>
      );

    case "03": // Pre-Opening - Launch Gate & Timeline
      return (
        <svg viewBox="0 0 400 300" className="w-full h-full" fill="none">
          {/* Launch Arch Gateway */}
          <motion.polygon points="170,80 200,62 230,80 200,98" stroke="#c9a24a" strokeWidth="1.5" fill="rgba(201,162,74,0.1)" {...animProps} />
          <motion.line x1="170" y1="80" x2="170" y2="200" stroke="#c9a24a" strokeWidth="1.5" {...animProps} />
          <motion.line x1="230" y1="80" x2="230" y2="200" stroke="#c9a24a" strokeWidth="1.5" {...animProps} />
          <motion.line x1="200" y1="98" x2="200" y2="218" stroke="#c9a24a" strokeWidth="1.5" {...animProps} />
          <text x="200" y="240" fill="#c9a24a" fontSize="9" fontFamily="monospace" textAnchor="middle">COUNTDOWN T-0</text>
        </svg>
      );

    case "04": // Operations - Audit Matrix Nodes
      return (
        <svg viewBox="0 0 400 300" className="w-full h-full" fill="none">
          {/* Hexagonal Audit Hub */}
          <motion.polygon points="200,80 250,110 250,170 200,200 150,170 150,110" stroke="#c9a24a" strokeWidth="1.5" fill="rgba(201,162,74,0.06)" {...animProps} />
          <motion.circle cx="200" cy="140" r="18" stroke="#ffffff" strokeWidth="1.2" {...animProps} />
          <text x="200" y="143" fill="#c9a24a" fontSize="8" fontFamily="monospace" textAnchor="middle">SOP AUDIT</text>
        </svg>
      );

    case "05": // Staff Recruitment - Org Hierarchy Nodes
      return (
        <svg viewBox="0 0 400 300" className="w-full h-full" fill="none">
          {/* Executive Apex Node */}
          <motion.circle cx="200" cy="70" r="14" stroke="#c9a24a" strokeWidth="1.5" fill="rgba(201,162,74,0.15)" {...animProps} />
          {/* Departmental Tier Nodes */}
          <motion.circle cx="130" cy="150" r="10" stroke="#ffffff" strokeWidth="1.2" {...animProps} />
          <motion.circle cx="200" cy="165" r="10" stroke="#ffffff" strokeWidth="1.2" {...animProps} />
          <motion.circle cx="270" cy="150" r="10" stroke="#ffffff" strokeWidth="1.2" {...animProps} />
          {/* Hierarchy Links */}
          <motion.line x1="200" y1="84" x2="130" y2="140" stroke="#c9a24a" strokeWidth="1" {...animProps} />
          <motion.line x1="200" y1="84" x2="200" y2="155" stroke="#c9a24a" strokeWidth="1" {...animProps} />
          <motion.line x1="200" y1="84" x2="270" y2="140" stroke="#c9a24a" strokeWidth="1" {...animProps} />
          <text x="200" y="210" fill="#c9a24a" fontSize="9" fontFamily="monospace" textAnchor="middle">TALENT STRUCTURE</text>
        </svg>
      );

    case "06": // SOP & Documentation - Layered Process Sheets
      return (
        <svg viewBox="0 0 400 300" className="w-full h-full" fill="none">
          {/* Layered Isometric Sheets */}
          <motion.polygon points="140,110 210,70 270,105 200,145" stroke="rgba(255,255,255,0.4)" strokeWidth="1" fill="none" {...animProps} />
          <motion.polygon points="140,130 210,90 270,125 200,165" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" fill="none" {...animProps} />
          <motion.polygon points="140,150 210,110 270,145 200,185" stroke="#c9a24a" strokeWidth="1.6" fill="rgba(201,162,74,0.08)" {...animProps} />
          <text x="200" y="215" fill="#c9a24a" fontSize="9" fontFamily="monospace" textAnchor="middle">OPERATING MANUALS</text>
        </svg>
      );

    case "07": // Branding - Identity Projection Geometry
      return (
        <svg viewBox="0 0 400 300" className="w-full h-full" fill="none">
          {/* Isometric Diamond Monogram Prism */}
          <motion.polygon points="200,60 260,110 200,160 140,110" stroke="#c9a24a" strokeWidth="1.6" fill="rgba(201,162,74,0.12)" {...animProps} />
          <line x1="200" y1="60" x2="200" y2="160" stroke="#c9a24a" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="140" y1="110" x2="260" y2="110" stroke="#c9a24a" strokeWidth="1" strokeDasharray="3 3" />
          <motion.circle cx="200" cy="110" r="35" stroke="rgba(255,255,255,0.5)" strokeWidth="1" {...animProps} />
          <text x="200" y="200" fill="#c9a24a" fontSize="9" fontFamily="monospace" textAnchor="middle">BRAND ARCHITECTURE</text>
        </svg>
      );

    case "08": // Revenue & Profitability - 3D Yield Pillars
      return (
        <svg viewBox="0 0 400 300" className="w-full h-full" fill="none">
          {/* Tier 1 Pillar */}
          <motion.polygon points="110,170 140,152 165,167 135,185" stroke="#c9a24a" strokeWidth="1.2" {...animProps} />
          <line x1="110" y1="170" x2="110" y2="200" stroke="#c9a24a" strokeWidth="1.2" />
          <line x1="135" y1="185" x2="135" y2="215" stroke="#c9a24a" strokeWidth="1.2" />
          <line x1="165" y1="167" x2="165" y2="197" stroke="#c9a24a" strokeWidth="1.2" />

          {/* Tier 2 Pillar */}
          <motion.polygon points="175,130 205,112 230,127 200,145" stroke="#c9a24a" strokeWidth="1.4" fill="rgba(201,162,74,0.06)" {...animProps} />
          <line x1="175" y1="130" x2="175" y2="200" stroke="#c9a24a" strokeWidth="1.4" />
          <line x1="200" y1="145" x2="200" y2="215" stroke="#c9a24a" strokeWidth="1.4" />
          <line x1="230" y1="127" x2="230" y2="197" stroke="#c9a24a" strokeWidth="1.4" />

          {/* Tier 3 Pillar */}
          <motion.polygon points="240,90 270,72 295,87 265,105" stroke="#c9a24a" strokeWidth="1.6" fill="rgba(201,162,74,0.14)" {...animProps} />
          <line x1="240" y1="90" x2="240" y2="200" stroke="#c9a24a" strokeWidth="1.6" />
          <line x1="265" y1="105" x2="265" y2="215" stroke="#c9a24a" strokeWidth="1.6" />
          <line x1="295" y1="87" x2="295" y2="197" stroke="#c9a24a" strokeWidth="1.6" />

          {/* Growth Vector */}
          <motion.path d="M135,185 L200,145 L265,105" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="4 4" {...animProps} />
          <text x="200" y="240" fill="#c9a24a" fontSize="9" fontFamily="monospace" textAnchor="middle">YIELD DYNAMICS</text>
        </svg>
      );

    case "09": // Banquet & Expansion - Master Corridor
      return (
        <svg viewBox="0 0 400 300" className="w-full h-full" fill="none">
          {/* Main Ballroom Platform */}
          <motion.polygon points="120,130 200,85 280,130 200,175" stroke="#c9a24a" strokeWidth="1.6" fill="rgba(201,162,74,0.08)" {...animProps} />
          {/* Stage Platform */}
          <motion.polygon points="175,90 200,75 225,90 200,105" stroke="#ffffff" strokeWidth="1.2" fill="rgba(255,255,255,0.1)" {...animProps} />
          {/* Expansion radiating corridors */}
          <line x1="120" y1="130" x2="60" y2="165" stroke="#c9a24a" strokeWidth="1.2" strokeDasharray="3 3" />
          <line x1="280" y1="130" x2="340" y2="165" stroke="#c9a24a" strokeWidth="1.2" strokeDasharray="3 3" />
          <text x="200" y="210" fill="#c9a24a" fontSize="9" fontFamily="monospace" textAnchor="middle">EXPANSION FRAMEWORK</text>
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 400 300" className="w-full h-full" fill="none">
          <circle cx="200" cy="135" r="4" fill="#c9a24a" />
          <text x="200" y="165" fill="#c9a24a" fontSize="9" fontFamily="monospace" textAnchor="middle">HOVER A PRACTICE TO VIEW BLUEPRINT</text>
        </svg>
      );
  }
}
