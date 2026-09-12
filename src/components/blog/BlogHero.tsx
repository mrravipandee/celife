"use client";

import React from "react";
import { motion } from "motion/react";
import { FeaturedArticle } from "@/components/blog/FeaturedArticle";
import type { BlogItem } from "@/lib/services/blogs";

interface BlogHeroProps {
  featuredBlog?: BlogItem;
}

export function BlogHero({ featuredBlog }: BlogHeroProps) {
  return (
    <section className="relative pt-24 pb-8 overflow-hidden bg-black text-white">
      {/* Background / ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Title & Subtitle Header */}
        <div className="text-center max-w-4xl mx-auto mb-8 sm:mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black font-serif tracking-tight text-white uppercase"
          >
            THE BLOG
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-3 text-sm sm:text-base md:text-lg text-neutral-400 font-sans font-normal max-w-2xl mx-auto leading-relaxed"
          >
            Actionable playbooks, revenue yield models, and turnaround audits for hotels, resorts, and restaurants.
          </motion.p>
        </div>

        {/* Hero Content Section: Left Note | Featured Card | Right Note */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Side Note */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="hidden lg:flex lg:col-span-3 flex-col justify-center items-end text-right text-amber-500 italic font-serif text-lg leading-snug pr-4"
          >
            <span>No SEO bait.</span>
            <span>No hot takes for clicks.</span>
          </motion.div>

          {/* Center: Featured Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-6"
          >
            {featuredBlog && <FeaturedArticle blog={featuredBlog} />}
          </motion.div>

          {/* Right Side Note */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="hidden lg:flex lg:col-span-3 flex-col justify-center items-start text-left text-amber-500 italic font-serif text-lg leading-snug pl-4"
          >
            <span>Written by operators,</span>
            <span>not copywriters.</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
