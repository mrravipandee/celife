"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { BlogItem } from "@/lib/services/blogs";

interface BlogGridProps {
  blogs: BlogItem[];
}

export function BlogGrid({ blogs }: BlogGridProps) {
  const preferReduced = useReducedMotion();
  const [activeCategory, setActiveCategory] = useState<string>("All");

  //Extract unique categories from_blogs
  const categories = useMemo(() => {
    const set = new Set<string>();
    blogs.forEach((blog) => {
      if (blog.category) set.add(blog.category);
    });
    return ["All", ...Array.from(set)];
  }, [blogs]);

  // Filtered blogs
  const filteredBlogs = useMemo(() => {
    if (activeCategory === "All") return blogs;
    return blogs.filter((b) => b.category === activeCategory);
  }, [blogs, activeCategory]);

  return (
    <section className="py-12 md:py-16 bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. Category Filter Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mb-6">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-sm md:text-base font-medium transition-colors cursor-pointer py-1 px-3 rounded-full ${
                  isActive
                    ? "bg-white text-black font-semibold shadow-sm"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-800/60"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* 2. Dotted Separator Line from Reference Image */}
        <div className="w-full flex items-center justify-center overflow-hidden my-8 opacity-20 text-xs tracking-[0.5em] font-mono select-none">
          ••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
        </div>

        {/* 3. Grid of Articles (3-column layout) */}
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-16 text-neutral-400 font-sans">
            No articles found in <span className="text-white font-semibold">{activeCategory}</span> category.
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
          >
            <AnimatePresence>
              {filteredBlogs.map((blog, idx) => {
                const formattedDate = blog.publishedAt
                  ? new Date(blog.publishedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "";

                return (
                  <motion.div
                    key={blog.slug || idx}
                    layout
                    initial={preferReduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    className="flex flex-col h-full group"
                  >
                    {/* Top Metadata Badges */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-neutral-800 text-neutral-300 text-[11px] font-medium font-mono px-2.5 py-1 rounded-md">
                        {blog.category}
                      </span>
                      {formattedDate && (
                        <span className="bg-neutral-900 text-neutral-400 text-[11px] font-medium font-mono px-2.5 py-1 rounded-md border border-neutral-800">
                          {formattedDate}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <Link href={`/blog/${blog.slug}`} className="group-hover:text-amber-400">
                      <h3 className="text-lg md:text-xl font-serif font-bold uppercase tracking-tight text-white leading-snug mb-2 line-clamp-2 transition-colors">
                        {blog.title}
                      </h3>
                    </Link>

                    {/* Excerpt */}
                    <p className="text-xs md:text-sm text-neutral-400 font-sans line-clamp-3 mb-4 flex-grow leading-relaxed">
                      {blog.excerpt}
                    </p>

                    {/* Image Container with "READ MORE" Badge */}
                    <Link href={`/blog/${blog.slug}`} className="block overflow-hidden rounded-2xl relative aspect-[16/10] bg-neutral-900 border border-neutral-800">
                      <Image
                        src={blog.coverImage.url}
                        alt={blog.coverImage.alt || blog.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      {/* Floating READ MORE Badge on Image */}
                      <div className="absolute top-3 left-3 bg-white text-neutral-950 font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-sm shadow-md transition-all group-hover:bg-amber-400">
                        READ MORE
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}
