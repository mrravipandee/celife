"use client";

import React, { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { CaseStudy } from "@/data/case-studies";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface CaseStudyPreviewProps {
  caseStudy: CaseStudy | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CaseStudyPreview({ caseStudy, isOpen, onClose }: CaseStudyPreviewProps) {
  const prefersReduced = useReducedMotion();
  const modalRef = useRef<HTMLDivElement>(null);

  // Esc key closure and body scroll locking
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const backdropVariants = {
    closed: { opacity: 0 },
    open: {
      opacity: 1,
      transition: { duration: prefersReduced ? 0.05 : 0.3 }
    },
    exit: {
      opacity: 0,
      transition: { duration: prefersReduced ? 0.05 : 0.25 }
    }
  };

  const modalVariants = {
    closed: { opacity: 0, scale: prefersReduced ? 1 : 0.95 },
    open: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: prefersReduced ? 0.05 : 0.45,
        ease: [0.16, 1, 0.3, 1] as const
      }
    },
    exit: {
      opacity: 0,
      scale: prefersReduced ? 1 : 0.95,
      transition: {
        duration: prefersReduced ? 0.05 : 0.3,
        ease: [0.16, 1, 0.3, 1] as const
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && caseStudy && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 select-none" role="none">
          {/* Backdrop dimming */}
          <motion.div
            variants={backdropVariants}
            initial="closed"
            animate="open"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
            aria-hidden="true"
          />

          {/* Centered Preview Frame */}
          <motion.div
            ref={modalRef}
            variants={modalVariants}
            initial="closed"
            animate="open"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-label={`Case Study Preview: ${caseStudy.title}`}
            className="relative w-full max-w-4xl max-h-[90vh] bg-black border border-white/10 shadow-2xl flex flex-col focus:outline-none overflow-hidden"
          >
            {/* Close Button overlay */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close preview modal"
              className="absolute top-6 right-6 p-2 rounded-sm border border-white/5 bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-all outline-none focus-visible:ring-1 focus-visible:ring-primary/50 cursor-pointer z-50"
            >
              <X size={14} />
            </button>

            {/* Scrollable Layout Content */}
            <div className="flex-1 overflow-y-auto px-6 py-12 md:px-16 md:py-16 space-y-10 max-w-3xl mx-auto">
              
              {/* Header Title details */}
              <div className="space-y-3">
                <span className="text-[10px] uppercase tracking-[0.25em] text-primary/80 font-sans font-semibold">
                  CASE STUDY
                </span>
                <h1 className="text-3xl md:text-5xl font-serif text-white tracking-wide leading-tight">
                  {caseStudy.title}
                </h1>
                <div className="text-[10px] text-white/40 uppercase tracking-widest font-sans flex items-center gap-2 pt-1">
                  <span>{caseStudy.sector}</span>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <span>{caseStudy.location}</span>
                </div>
              </div>

              {/* Gold line accent */}
              <div className="w-16 h-[1.5px] bg-primary" />

              {/* Short Description */}
              {caseStudy.shortDescription && (
                <p className="text-sm text-white/70 italic font-serif leading-relaxed pl-4 border-l border-primary/20 max-w-2xl py-0.5">
                  {caseStudy.shortDescription}
                </p>
              )}

              {/* Case Study Grid Sections */}
              <div className="space-y-8 pt-4">
                
                {/* 1. Challenge */}
                {caseStudy.challenge && (
                  <div className="space-y-2">
                    <h4 className="text-[9px] uppercase tracking-[0.18em] text-white/40 font-sans font-semibold">
                      THE CHALLENGE
                    </h4>
                    <p className="text-xs text-white/60 font-sans leading-relaxed max-w-2xl">
                      {caseStudy.challenge}
                    </p>
                  </div>
                )}

                {/* 2. Approach */}
                {caseStudy.approach && (
                  <div className="space-y-2 border-t border-white/5 pt-6">
                    <h4 className="text-[9px] uppercase tracking-[0.18em] text-white/40 font-sans font-semibold">
                      THE THEDCO APPROACH
                    </h4>
                    <p className="text-xs text-white/60 font-sans leading-relaxed max-w-2xl">
                      {caseStudy.approach}
                    </p>
                  </div>
                )}

                {/* 3. Implementation */}
                {caseStudy.implementation && (
                  <div className="space-y-2 border-t border-white/5 pt-6">
                    <h4 className="text-[9px] uppercase tracking-[0.18em] text-white/40 font-sans font-semibold">
                      IMPLEMENTATION
                    </h4>
                    <p className="text-xs text-white/60 font-sans leading-relaxed max-w-2xl">
                      {caseStudy.implementation}
                    </p>
                  </div>
                )}

                {/* 4. Outcome */}
                {caseStudy.outcome && (
                  <div className="space-y-2 border-t border-white/5 pt-6">
                    <h4 className="text-[9px] uppercase tracking-[0.18em] text-white/40 font-sans font-semibold">
                      THE OUTCOME
                    </h4>
                    <p className="text-xs text-white/60 font-sans leading-relaxed max-w-2xl">
                      {caseStudy.outcome}
                    </p>
                  </div>
                )}

              </div>

              {/* Key Results Stats Section */}
              {caseStudy.metrics && caseStudy.metrics.length > 0 && (
                <div className="border-t border-white/5 pt-8 space-y-4">
                  <h4 className="text-[9px] uppercase tracking-[0.18em] text-white/40 font-sans font-semibold">
                    KEY RESULTS
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
                    {caseStudy.metrics.map((metric, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="text-2xl font-serif text-primary tracking-wide">
                          {metric.value}
                        </div>
                        <div className="text-[10px] text-white font-sans tracking-wide">
                          {metric.label}
                        </div>
                        {metric.description && (
                          <div className="text-[9px] text-white/40 font-sans">
                            {metric.description}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
