"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export interface ParallaxProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

export function Parallax({ children, speed = -0.15, className }: ParallaxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const preferReduced = useReducedMotion();

  useEffect(() => {
    if (preferReduced) return;

    const el = containerRef.current;
    if (!el) return;

    const anim = gsap.fromTo(
      el,
      { y: 0 },
      {
        y: () => el.offsetHeight * speed,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    );

    return () => {
      anim.kill();
    };
  }, [speed, preferReduced]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
