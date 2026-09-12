"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useIsDesktop } from "@/lib/hooks/use-is-desktop";
import { Reveal } from "@/components/motion/Reveal";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface ProjectGalleryProps {
  images: string[];
}

export function ProjectGallery({ images }: ProjectGalleryProps) {
  const isDesktop = useIsDesktop();
  const preferReduced = useReducedMotion();

  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);

  // ─── Desktop Horizontal Scroll & Curved Arc ─────────────────────────────────

  useGSAP(
    () => {
      if (!isDesktop || preferReduced || !sectionRef.current || !trackRef.current) return;

      const track = trackRef.current;
      const totalWidth = track.scrollWidth;
      const windowWidth = window.innerWidth;
      const travelDistance = Math.max(0, totalWidth - windowWidth + 120);

      if (travelDistance <= 0) return;

      const trigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: () => `+=${travelDistance}`,
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          gsap.set(track, { x: -self.progress * travelDistance });

          // Compute 3D arc rotateY for each card relative to viewport center
          const cards = track.querySelectorAll<HTMLElement>(".gallery-arc-card");
          const centerX = windowWidth / 2;

          cards.forEach((card) => {
            const rect = card.getBoundingClientRect();
            const cardCenter = rect.left + rect.width / 2;
            const diffRatio = (cardCenter - centerX) / (windowWidth / 2);
            // Clamp rotateY between -10deg and +10deg
            const angle = Math.max(-10, Math.min(10, -diffRatio * 10));
            gsap.set(card, { rotateY: angle });
          });
        },
      });

      return () => trigger.kill();
    },
    { scope: sectionRef, dependencies: [isDesktop, preferReduced, images] }
  );

  // ─── Lightbox Keyboard Navigation & Focus Trap ───────────────────────────────

  const handleNext = useCallback(() => {
    if (activeIndex === null) return;
    setActiveIndex((prev) => (prev !== null && prev < images.length - 1 ? prev + 1 : 0));
  }, [activeIndex, images.length]);

  const handlePrev = useCallback(() => {
    if (activeIndex === null) return;
    setActiveIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : images.length - 1));
  }, [activeIndex, images.length]);

  const handleClose = useCallback(() => {
    setActiveIndex(null);
  }, []);

  useEffect(() => {
    if (activeIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, handleClose, handleNext, handlePrev]);

  if (!images || images.length === 0) return null;

  // ─── Fallback: Mobile (<768px) and Reduced Motion (Native Vertical Stack) ────

  if (!isDesktop || preferReduced) {
    return (
      <div className="space-y-8 pt-8">
        <Reveal>
          <div className="flex items-center justify-between">
            <h3 className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">
              Project Gallery
            </h3>
            <span className="text-xs text-white/40">{images.length} Photographs</span>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {images.map((image, index) => (
            <div
              key={image + index}
              onClick={() => setActiveIndex(index)}
              className="relative aspect-[4/3] w-full overflow-hidden border border-white/10 bg-white/[0.02] cursor-pointer rounded-sm"
            >
              <Image
                src={image}
                alt={`Project Gallery ${index + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* Mobile Lightbox */}
        <AnimatePresence>
          {activeIndex !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            >
              <div className="relative w-full h-[70vh]" onClick={(e) => e.stopPropagation()}>
                <Image
                  src={images[activeIndex]}
                  alt="Gallery Preview"
                  fill
                  sizes="100vw"
                  className="object-contain"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ─── Desktop 3D Curved Arc Horizontal Gallery ────────────────────────────────

  return (
    <div className="relative pt-12">
      <div ref={sectionRef} className="h-screen flex flex-col justify-center overflow-hidden">
        {/* Header Bar */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full mb-8 flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.3em] text-primary font-semibold">
              SPATIAL SHOWCASE
            </span>
            <h3 className="text-2xl md:text-3xl font-serif text-white">Project Gallery</h3>
          </div>
          <div className="flex items-center space-x-3 text-xs uppercase tracking-widest text-white/50 font-sans">
            <span>Scroll or Drag</span>
            <span className="text-primary font-semibold">→</span>
          </div>
        </div>

        {/* Horizontal Track with 3D Arc Perspective */}
        <div
          style={{ perspective: 1200 }}
          className="w-full flex items-center overflow-visible"
        >
          <motion.div
            ref={trackRef}
            drag="x"
            dragConstraints={{ right: 0, left: -(images.length * 480 - 600) }}
            dragElastic={0.08}
            style={{ transformStyle: "preserve-3d" }}
            className="flex items-center space-x-8 md:space-x-10 pl-6 md:pl-16 cursor-grab active:cursor-grabbing"
          >
            {images.map((image, index) => (
              <div
                key={image + index}
                onClick={() => setActiveIndex(index)}
                style={{ transformStyle: "preserve-3d" }}
                className="gallery-arc-card shrink-0 w-[380px] md:w-[460px] aspect-[4/3] relative rounded-sm overflow-hidden border border-white/10 hover:border-primary/50 bg-white/[0.02] group transition-colors duration-300"
              >
                <Image
                  src={image}
                  alt={`Project photograph ${index + 1}`}
                  fill
                  sizes="480px"
                  className="object-cover group-hover:scale-104 transition-transform duration-700 pointer-events-none"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500 pointer-events-none" />
                
                {/* Index tag */}
                <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/80 backdrop-blur-md border border-white/10 text-xs font-sans text-white/70">
                  {String(index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ─── Shared-Element Style Lightbox Modal ─────────────────────────────── */}
      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div
            ref={lightboxRef}
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-6 md:p-12 cursor-zoom-out backdrop-blur-md"
          >
            {/* Top Toolbar */}
            <div className="absolute top-6 left-8 right-8 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-white/60 pointer-events-none">
              <span className="text-primary font-semibold">
                Photo {activeIndex + 1} of {images.length}
              </span>
              <button
                onClick={handleClose}
                className="pointer-events-auto hover:text-white transition-colors cursor-pointer border border-white/20 px-3 py-1.5 rounded-sm"
              >
                Close [Esc]
              </button>
            </div>

            {/* Left / Right Nav Controls */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-6 md:left-10 text-2xl text-white/60 hover:text-primary transition-colors p-4 rounded-full bg-black/50 border border-white/10 z-20 cursor-pointer"
            >
              ←
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-6 md:right-10 text-2xl text-white/60 hover:text-primary transition-colors p-4 rounded-full bg-black/50 border border-white/10 z-20 cursor-pointer"
            >
              →
            </button>

            {/* Main Lightbox Image Frame */}
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-6xl max-h-[82vh] w-full h-full cursor-default"
            >
              <Image
                src={images[activeIndex]}
                alt="Enlarged Project Photograph"
                fill
                sizes="100vw"
                priority
                className="object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
