"use client";

import React, { useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { Project } from "@/types/project";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// SSR-Safe pointer:fine query to distinguish mouse vs touch devices
function useIsFinePointer(): boolean {
  return useSyncExternalStore(
    (callback) => {
      if (typeof window === "undefined" || !window.matchMedia) return () => {};
      const mq = window.matchMedia("(pointer: fine)");
      mq.addEventListener("change", callback);
      return () => mq.removeEventListener("change", callback);
    },
    () => typeof window !== "undefined" && Boolean(window.matchMedia?.("(pointer: fine)").matches),
    () => false
  );
}

export interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const preferReduced = useReducedMotion();
  const isFinePointer = useIsFinePointer();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse tilt coordinates
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rawCursorX = useMotionValue(150);
  const rawCursorY = useMotionValue(100);

  // Damped springs for 3D card tilt
  const springConfig = { damping: 20, stiffness: 220, mass: 0.4 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Clamped 8deg tilt range
  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-8, 8]);

  // Fresnel rim radial gradient string
  const fresnelBackground = useTransform(
    [rawCursorX, rawCursorY],
    ([x, y]) =>
      `radial-gradient(420px circle at ${x}px ${y}px, rgba(201, 162, 74, 0.45) 0%, rgba(201, 162, 74, 0.08) 45%, transparent 75%)`
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (preferReduced || !isFinePointer || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    rawCursorX.set(x);
    rawCursorY.set(y);
    mouseX.set(x / rect.width - 0.5);
    mouseY.set(y / rect.height - 0.5);
  };

  const handleMouseEnter = () => {
    if (isFinePointer) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const canTilt = isFinePointer && !preferReduced;

  return (
    <Link href={`/projects/${project.slug}`} className="group block space-y-4">
      <div style={{ perspective: 1200 }} className="w-full">
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={
            canTilt
              ? {
                  rotateX,
                  rotateY,
                  transformStyle: "preserve-3d",
                }
              : {}
          }
          className="relative aspect-[3/2] w-full overflow-hidden border border-white/10 hover:border-primary/40 bg-white/[0.02] rounded-sm transition-colors duration-500"
        >
          {/* Cover Image with extended duration scale */}
          <motion.div
            animate={
              preferReduced || !isFinePointer
                ? { scale: 1 }
                : { scale: isHovered ? 1.06 : 1 }
            }
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full h-full"
          >
            <Image
              src={project.coverImage || "/images/hero/hotel-lobby.jpg"}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors duration-700" />
          </motion.div>

          {/* Gold Fresnel-Style Rim Lighting Overlay */}
          {canTilt && (
            <motion.div
              aria-hidden="true"
              style={{ background: fresnelBackground }}
              animate={{ opacity: isHovered ? 0.35 : 0 }}
              transition={{ duration: 0.3 }}
              className="pointer-events-none absolute inset-0 z-10 mix-blend-overlay"
            />
          )}

          {/* Year & Category Tag */}
          <div
            style={canTilt ? { transform: "translateZ(18px)" } : {}}
            className="absolute bottom-4 right-4 z-20 px-3 py-1 bg-black/85 backdrop-blur-md border border-white/15 text-xs uppercase tracking-widest text-white/90 font-medium font-sans"
          >
            {project.year}
          </div>
        </motion.div>
      </div>

      {/* Meta Content */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between text-xs md:text-sm">
          <span className="uppercase tracking-[0.2em] text-primary font-semibold">
            {project.category}
          </span>
          <span className="text-white/70 tracking-wider font-sans">
            {project.location}
          </span>
        </div>

        {/* Title with slide-up mask swap on hover */}
        <div className="relative h-8 md:h-9 overflow-hidden">
          {/* Main project title */}
          <motion.h3
            animate={
              preferReduced || !isFinePointer
                ? { y: "0%" }
                : { y: isHovered ? "-100%" : "0%" }
            }
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="text-xl md:text-2xl font-serif text-white group-hover:text-primary leading-tight absolute inset-0 truncate"
          >
            {project.title}
          </motion.h3>

          {/* Replacement hover label */}
          {!preferReduced && isFinePointer && (
            <motion.span
              animate={{ y: isHovered ? "0%" : "100%" }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="text-sm md:text-base font-sans uppercase tracking-[0.2em] text-primary font-semibold flex items-center absolute inset-0 leading-tight"
            >
              <span>View Case Study</span>
              <span className="ml-2">→</span>
            </motion.span>
          )}
        </div>

        <p className="text-sm text-white/70 line-clamp-2 leading-relaxed font-sans font-light">
          {project.description}
        </p>
      </div>
    </Link>
  );
}
