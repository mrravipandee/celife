"use client";

import React, { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { Service } from "@/data/services";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface ServicePreviewProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ServicePreview({ service, isOpen, onClose }: ServicePreviewProps) {
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
      {isOpen && service && (
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
            aria-label={`Service Preview: ${service.name}`}
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
            <div className="flex-1 overflow-y-auto px-6 py-12 md:px-16 md:py-16 space-y-8 max-w-3xl mx-auto">
              
              {/* Header Title details */}
              <div className="space-y-3">
                {service.heroLabel && (
                  <span className="text-[10px] uppercase tracking-[0.25em] text-primary/80 font-sans font-semibold">
                    {service.heroLabel}
                  </span>
                )}
                <h1 className="text-3xl md:text-5xl font-serif text-white tracking-wide leading-tight">
                  {service.name}
                </h1>
              </div>

              {/* Short Description */}
              {service.shortDescription && (
                <p className="text-sm text-white/70 italic font-serif leading-relaxed pl-4 border-l border-primary/20 max-w-2xl py-0.5">
                  {service.shortDescription}
                </p>
              )}

              {/* Divider */}
              <div className="w-full h-[1px] bg-white/5" />

              {/* Main Description */}
              {service.description && (
                <div className="space-y-4">
                  <p className="text-xs md:text-sm text-white/60 font-sans leading-relaxed max-w-2xl">
                    {service.description}
                  </p>
                </div>
              )}

              {/* Divider */}
              {service.keyPoints && service.keyPoints.length > 0 && (
                <div className="w-full h-[1px] bg-white/5" />
              )}

              {/* Key Points block */}
              {service.keyPoints && service.keyPoints.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-[10px] uppercase tracking-[0.18em] text-white/40 font-sans font-semibold">
                    WHAT WE HELP WITH
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-white/70 font-sans tracking-wide">
                    {service.keyPoints.map((point, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
