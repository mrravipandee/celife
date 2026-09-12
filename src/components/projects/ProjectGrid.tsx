"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Project } from "@/types/project";
import { ProjectCard } from "./ProjectCard";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useIsDesktop } from "@/lib/hooks/use-is-desktop";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface ProjectGridProps {
  projects: Project[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const preferReduced = useReducedMotion();
  const isDesktop = useIsDesktop();

  useGSAP(
    () => {
      if (preferReduced || !containerRef.current) return;

      const cardItems = containerRef.current.querySelectorAll(".spatial-card-wrapper");
      if (!cardItems || cardItems.length === 0) return;

      // 1. Grid "stands up" entrance: rotateX(12deg) -> 0, translateY(60px) -> 0 scrubbed to scroll
      cardItems.forEach((card, idx) => {
        gsap.fromTo(
          card,
          {
            rotateX: 12,
            y: 60,
            opacity: 0.35,
          },
          {
            rotateX: 0,
            y: 0,
            opacity: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 95%",
              end: "top 65%",
              scrub: 0.8,
            },
          }
        );

        // 2. Responsive column parallax scrub: alternate columns on 2-column desktop layouts
        if (isDesktop) {
          const isOddCol = idx % 2 === 1;
          const parallaxRange = isOddCol ? 40 : -40;

          gsap.fromTo(
            card,
            { y: parallaxRange * 0.6 },
            {
              y: -parallaxRange * 0.6,
              ease: "none",
              scrollTrigger: {
                trigger: containerRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.2,
              },
            }
          );
        }
      });
    },
    { scope: containerRef, dependencies: [preferReduced, isDesktop, projects] }
  );

  return (
    <div
      ref={containerRef}
      style={{ perspective: 1400, transformStyle: "preserve-3d" }}
      className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 relative"
    >
      {projects.map((project) => (
        <div
          key={project._id || project.slug}
          className="spatial-card-wrapper w-full"
          style={{ transformStyle: "preserve-3d" }}
        >
          <ProjectCard project={project} />
        </div>
      ))}
    </div>
  );
}
