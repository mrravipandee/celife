"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { BlogItem } from "@/lib/services/blogs";

interface FeaturedArticleProps {
  blog: BlogItem;
}

export function FeaturedArticle({ blog }: FeaturedArticleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const preferReduced = useReducedMotion();

  // 3D tilt effect on hover
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-6, 6]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (preferReduced || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Format date -> e.g. "Dec 20, 2025"
  const formattedDate = blog.publishedAt
    ? new Date(blog.publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Dec 20, 2025";

  return (
    <div ref={containerRef} className="w-full max-w-xl mx-auto my-6 px-4">
      <div style={{ perspective: 1000 }}>
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={
            preferReduced
              ? {}
              : {
                  rotateX,
                  rotateY,
                  transformStyle: "preserve-3d",
                }
          }
          className="group bg-white rounded-3xl p-4 sm:p-5 shadow-2xl transition-all duration-300 hover:shadow-[0_20px_50px_rgba(201,162,74,0.25)] border border-neutral-200"
        >
          {/* Card Image Container with Badges */}
          <Link href={`/blog/${blog.slug}`} className="block">
            <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-neutral-100">
              <Image
                src={blog.coverImage.url}
                alt={blog.coverImage.alt || blog.title}
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                priority
              />
              {/* Badges on top of image */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                <span className="bg-white/90 backdrop-blur-md text-neutral-900 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm tracking-wide">
                  {blog.category}
                </span>
                <span className="bg-white/90 backdrop-blur-md text-neutral-800 text-xs font-medium px-3 py-1.5 rounded-lg shadow-sm">
                  {formattedDate}
                </span>
              </div>
            </div>
          </Link>

          {/* Card Body */}
          <div className="px-2 pt-5 pb-2">
            <Link href={`/blog/${blog.slug}`} className="block group-hover:text-amber-800">
              <h2 className="text-xl sm:text-2xl font-bold font-sans uppercase tracking-tight text-neutral-900 leading-snug line-clamp-2 transition-colors duration-200">
                {blog.title}
              </h2>
            </Link>

            <p className="mt-2.5 text-neutral-600 text-sm leading-relaxed line-clamp-2 font-sans">
              {blog.excerpt}
            </p>

            {/* Read More Button */}
            <Link
              href={`/blog/${blog.slug}`}
              className="mt-5 block w-full py-3.5 px-4 bg-[#FFC700] hover:bg-[#ebd034] text-neutral-950 font-bold text-center text-xs tracking-wider rounded-xl transition-all duration-300 hover:shadow-lg active:scale-[0.99] uppercase"
            >
              Read more
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

