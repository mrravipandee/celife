"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export interface ProjectBannerProps {
  src: string;
  alt: string;
}

export function ProjectBanner({ src, alt }: ProjectBannerProps) {
  const containerRef = useRef<HTMLElement>(null);
  const preferReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1.15, 1]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  return (
    <section
      ref={containerRef}
      className="relative h-[55vh] md:h-[65vh] w-full overflow-hidden opacity-90 border-b border-white/5 bg-black"
    >
      <motion.div
        style={preferReduced ? {} : { scale, y }}
        className="relative w-full h-full"
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/60 z-10 pointer-events-none" />
    </section>
  );
}
