"use client";

import React, { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { BlogPost } from "@/data/blog";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface BlogPreviewProps {
  article: BlogPost | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BlogPreview({ article, isOpen, onClose }: BlogPreviewProps) {
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
        duration: prefersReduced ? 0.05 : 0.4,
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
      {isOpen && article && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 select-none" role="none">
          {/* Backdrop overlay */}
          <motion.div
            variants={backdropVariants}
            initial="closed"
            animate="open"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
            aria-hidden="true"
          />

          {/* Centered preview panel */}
          <motion.div
            ref={modalRef}
            variants={modalVariants}
            initial="closed"
            animate="open"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-label={`Editorial Preview: ${article.title}`}
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

            {/* Scrollable Article Area */}
            <div className="flex-1 overflow-y-auto px-8 py-16 md:px-16 md:py-20 space-y-8 max-w-3xl mx-auto">
              
              {/* Category tag */}
              <div className="space-y-3">
                <span className="text-[10px] uppercase tracking-[0.25em] text-primary/80 font-sans font-semibold">
                  {article.category}
                </span>
                
                {/* Large Serif Title */}
                <h1 className="text-3xl md:text-5xl font-serif text-white tracking-wide leading-tight">
                  {article.title}
                </h1>
              </div>

              {/* Gold accent line */}
              <div className="w-16 h-[1.5px] bg-primary" />

              {/* Muted Metadata */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] text-white/40 uppercase tracking-widest font-sans border-b border-white/5 pb-4">
                <span>By {article.author}</span>
                <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-white/20" />
                <span>Published: {article.publishedAt || "Draft State"}</span>
                {article.updatedAt !== article.publishedAt && (
                  <>
                    <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-white/20" />
                    <span>Updated: {article.updatedAt}</span>
                  </>
                )}
              </div>

              {/* Featured Cover Image */}
              {article.featuredImage && (
                <div className="relative w-full aspect-[16/9] border border-white/10 rounded-xs overflow-hidden bg-black/40">
                  <img
                    src={article.featuredImage}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Excerpt section */}
              {article.excerpt && (
                <p className="text-sm text-white/70 italic font-serif leading-relaxed pl-4 border-l border-primary/20 max-w-2xl py-0.5">
                  {article.excerpt}
                </p>
              )}

              {/* Body Content */}
              <div className="text-sm text-white/55 font-sans leading-loose max-w-2xl whitespace-pre-line pt-2 space-y-4">
                {article.content}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
