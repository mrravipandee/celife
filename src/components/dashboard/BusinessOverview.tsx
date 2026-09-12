"use client";

import React, { useState } from "react";
import { mockTrendPoints } from "@/data/dashboard";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function BusinessOverview() {
  const prefersReduced = useReducedMotion();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // SVG grid config (500 width, 160 height)
  const width = 500;
  const height = 160;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Map values onto the coordinates
  const points = mockTrendPoints.map((pt, idx) => {
    const x = paddingLeft + (idx / (mockTrendPoints.length - 1)) * chartWidth;
    // Map value 0-100 to vertical height (invert because SVG coordinates start at top)
    const y = height - paddingBottom - (pt.value / 100) * chartHeight;
    return { x, y, label: pt.label, value: pt.value };
  });

  // Construct SVG Bezier curve path string (cubic bezier control points)
  let pathD = "";
  let areaD = "";
  if (points.length > 0) {
    pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cpX1 = p0.x + chartWidth / 10;
      const cpY1 = p0.y;
      const cpX2 = p1.x - chartWidth / 10;
      const cpY2 = p1.y;
      pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }
    // Close the area path at the bottom boundary
    areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingBottom} L ${points[0].x} ${height - paddingBottom} Z`;
  }

  // Animation variants
  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: prefersReduced ? 0.05 : 1.2,
        ease: "easeInOut" as const,
      },
    },
  };

  return (
    <div className="bg-[#050505] border border-white/5 p-6 rounded-xs space-y-6 select-none">
      {/* Header labels */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="space-y-0.5">
          <h3 className="text-sm font-serif font-medium tracking-wider text-white">
            Business Overview
          </h3>
          <span className="text-xs text-white/60 font-sans tracking-wide block">
            Revenue / Engagement Trend
          </span>
        </div>
        <span className="text-xs uppercase tracking-widest text-primary font-sans font-semibold border border-primary/30 px-2.5 py-0.5 rounded-sm">
          Last 6 months
        </span>
      </div>

      {/* Visual SVG Chart Shell */}
      <div className="relative pt-2">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width="100%"
          height="100%"
          className="overflow-visible"
        >
          <defs>
            {/* Soft gold area gradient */}
            <linearGradient id="goldAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C9A24A" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#C9A24A" stopOpacity="0.00" />
            </linearGradient>
          </defs>

          {/* Grid lines (horizontal) */}
          {[25, 50, 75, 100].map((level) => {
            const gridY = height - paddingBottom - (level / 100) * chartHeight;
            return (
              <line
                key={level}
                x1={paddingLeft}
                y1={gridY}
                x2={width - paddingRight}
                y2={gridY}
                stroke="currentColor"
                className="text-white/5"
                strokeWidth={1}
                strokeDasharray="4 4"
              />
            );
          })}

          {/* Render Area fill */}
          {areaD && (
            <path
              d={areaD}
              fill="url(#goldAreaGradient)"
              className="transition-opacity duration-300"
            />
          )}

          {/* Render Path line */}
          {pathD && (
            <motion.path
              d={pathD}
              fill="none"
              stroke="#C9A24A"
              strokeWidth={1.8}
              variants={pathVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            />
          )}

          {/* Interactive Node Coordinates */}
          {points.map((pt, idx) => (
            <g key={idx}>
              {/* Highlight interactive target bounds */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={16}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
              {/* Actual gold node point */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={hoveredIndex === idx ? 4 : 2}
                fill="#C9A24A"
                className="transition-all duration-200 pointer-events-none"
              />
              {/* Tooltip detail (value popover indicator inside SVG) */}
              {hoveredIndex === idx && (
                <g className="pointer-events-none">
                  <rect
                    x={pt.x - 20}
                    y={pt.y - 24}
                    width={40}
                    height={16}
                    rx={2}
                    fill="#0A0A0A"
                    stroke="#C9A24A"
                    strokeWidth={0.5}
                  />
                  <text
                    x={pt.x}
                    y={pt.y - 13}
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize={8}
                    fontFamily="sans-serif"
                    fontWeight="semibold"
                  >
                    {pt.value}%
                  </text>
                </g>
              )}
              {/* Axis Label */}
              <text
                x={pt.x}
                y={height - 8}
                textAnchor="middle"
                fill="currentColor"
                className="text-white/30 text-[9px] font-sans tracking-widest uppercase"
              >
                {pt.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
