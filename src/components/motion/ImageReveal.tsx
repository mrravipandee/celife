"use client";

import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

export interface ImageRevealProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
  priority?: boolean;
}

export function ImageReveal({
  src,
  alt,
  className,
  containerClassName,
  delay = 0,
  duration = 1.4,
  once = true,
  priority = false,
}: ImageRevealProps) {
  const preferReduced = useReducedMotion();

  return (
    <div className={cn("relative overflow-hidden w-full h-full", containerClassName)}>
      <motion.div
        initial={{ 
          opacity: 0, 
          scale: preferReduced ? 1 : 1.05 
        }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once, margin: "-10px" }}
        transition={{ 
          duration, 
          delay, 
          ease: [0.16, 1, 0.3, 1] as const 
        }}
        className="w-full h-full relative"
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={cn("object-cover", className)}
          priority={priority}
        />
      </motion.div>
    </div>
  );
}
