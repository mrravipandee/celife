"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface BlogBannerProps {
  url: string;
  alt: string;
}

export function BlogBanner({ url, alt }: BlogBannerProps) {
  const containerRef = useRef<HTMLElement>(null);
  const preferReduced = useReducedMotion();

  // Parallax-out on scroll: scale 1.15 -> 1.0, translateY 0% -> 15%
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1.15, 1.0]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  return (
    <section
      ref={containerRef}
      className="relative h-[45vh] md:h-[55vh] w-full overflow-hidden opacity-90 border-b border-white/5 bg-black"
    >
      <motion.div
        style={preferReduced ? {} : { scale, y }}
        className="relative w-full h-full"
      >
        <Image
          src={url}
          alt={alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60 pointer-events-none" />
      </motion.div>
    </section>
  );
}
