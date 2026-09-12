"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { CaseStudy, CaseStudyStatus } from "@/data/case-studies";

interface CaseStudyListProps {
  caseStudies: CaseStudy[];
  onSelectCaseStudy: (caseStudy: CaseStudy) => void;
}

export function CaseStudyList({ caseStudies, onSelectCaseStudy }: CaseStudyListProps) {
  const prefersReduced = useReducedMotion();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.04,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReduced ? 0.05 : 0.35,
        ease: "easeOut" as const,
      },
    },
  };

  const renderStatusDot = (status: CaseStudyStatus) => {
    switch (status) {
      case "published":
        return (
          <div className="flex items-center gap-1.5 font-semibold text-primary">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="text-[9px] uppercase tracking-wider">Published</span>
          </div>
        );
      case "draft":
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white/40">
            <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
            <span className="text-[9px] uppercase tracking-wider">Draft</span>
          </div>
        );
    }
  };

  return (
    <div className="w-full select-none">
      
      {/* ==========================================
          DESKTOP TABLE (visible on md screens up)
         ========================================== */}
      <div className="hidden md:block w-full overflow-hidden border border-white/5 bg-[#050505] rounded-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 text-[9px] uppercase tracking-[0.2em] text-white/40">
              <th className="py-4 px-6 font-semibold">Case Study</th>
              <th className="py-4 px-6 font-semibold">Client</th>
              <th className="py-4 px-6 font-semibold">Category</th>
              <th className="py-4 px-6 font-semibold">Updated</th>
              <th className="py-4 px-6 font-semibold">Status</th>
              <th className="py-4 px-6 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <motion.tbody
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-20px" }}
            className="divide-y divide-white/5"
          >
            {caseStudies.map((cs) => (
              <motion.tr
                key={cs.id}
                variants={rowVariants}
                onClick={() => onSelectCaseStudy(cs)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelectCaseStudy(cs);
                  }
                }}
                className="group cursor-pointer hover:bg-white/[0.025] transition-colors duration-300 outline-none focus-visible:bg-white/[0.05]"
              >
                {/* Project title and brief summary */}
                <td className="py-4 px-6 max-w-sm">
                  <div className="flex items-center gap-4">
                    {cs.featuredImage ? (
                      <img
                        src={cs.featuredImage}
                        alt={cs.title}
                        className="hidden lg:block w-14 h-9 object-cover border border-white/5 rounded-xs"
                      />
                    ) : (
                      <div className="hidden lg:flex items-center justify-center w-14 h-9 bg-black border border-white/5 text-[7px] font-serif tracking-widest text-[#C9A24A]/60 select-none text-center rounded-xs">
                        THE DCO
                      </div>
                    )}
                    
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="text-xs font-sans font-medium text-white/70 group-hover:text-white transition-colors duration-300 truncate">
                        {cs.title}
                      </span>
                      <span className="text-[9px] text-white/30 font-sans tracking-wide truncate max-w-xs">
                        {cs.shortDescription}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Client name */}
                <td className="py-4 px-6 text-xs text-white/60 font-sans tracking-wide">
                  {cs.client}
                </td>

                {/* Category/Sector classification */}
                <td className="py-4 px-6 text-xs text-white/60 font-sans tracking-wide">
                  {cs.sector}
                </td>

                {/* Date */}
                <td className="py-4 px-6 text-xs text-white/50 font-sans tracking-wide">
                  {cs.updatedAt}
                </td>

                {/* Status indicator */}
                <td className="py-4 px-6">
                  {renderStatusDot(cs.status)}
                </td>

                {/* Arrow icon hover */}
                <td className="py-4 px-6 text-right">
                  <div className="flex justify-end">
                    <ArrowRight
                      size={14}
                      className="text-white/20 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300"
                    />
                  </div>
                </td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </div>

      {/* ==========================================
          MOBILE LIST CARD GRID (visible below md screens)
         ========================================== */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="block md:hidden space-y-4"
      >
        {caseStudies.map((cs) => (
          <motion.button
            key={cs.id}
            variants={rowVariants}
            type="button"
            onClick={() => onSelectCaseStudy(cs)}
            className="w-full text-left p-5 bg-[#050505] border border-white/5 rounded-xs transition-colors duration-300 hover:border-white/10 group cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-primary/50 relative overflow-hidden"
          >
            {/* Soft hover glow top line */}
            <span className="absolute top-0 left-0 right-0 h-[1px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

            <div className="flex flex-col space-y-3">
              {/* Title & Status row */}
              <div className="flex items-start justify-between gap-4">
                <h4 className="text-xs font-sans font-semibold text-white/70 group-hover:text-white leading-snug transition-colors truncate max-w-[70%]">
                  {cs.title}
                </h4>
                {renderStatusDot(cs.status)}
              </div>

              {/* Client & Category metadata block */}
              <div className="text-[10px] font-sans text-white/50 space-y-0.5 border-l border-white/5 pl-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-white/30 uppercase text-[9px]">Client:</span>
                  <span className="text-white/60">{cs.client}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-white/30 uppercase text-[9px]">Category:</span>
                  <span className="text-white/60">{cs.sector}</span>
                </div>
              </div>

              {/* Bottom metadata */}
              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <span className="text-[10px] font-sans text-white/30 tracking-wider">
                  Updated {cs.updatedAt}
                </span>
                <ArrowRight
                  size={12}
                  className="text-white/20 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300"
                />
              </div>
            </div>
          </motion.button>
        ))}
      </motion.div>

    </div>
  );
}
