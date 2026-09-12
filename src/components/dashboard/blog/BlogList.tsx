"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { BlogPost, BlogStatus } from "@/data/blog";

interface BlogListProps {
  articles: BlogPost[];
  onSelectArticle: (article: BlogPost) => void;
}

export function BlogList({ articles, onSelectArticle }: BlogListProps) {
  const prefersReduced = useReducedMotion();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.04,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReduced ? 0.05 : 0.35,
        ease: "easeOut" as const,
      },
    },
  };

  const renderStatusDot = (status: BlogStatus) => {
    switch (status) {
      case "published":
        return (
          <div className="flex items-center gap-1.5 font-semibold text-primary">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="text-[9px] uppercase tracking-wider">Published</span>
          </div>
        );
      case "draft":
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white/40">
            <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
            <span className="text-[9px] uppercase tracking-wider">Draft</span>
          </div>
        );
    }
  };

  return (
    <div className="w-full select-none">
      
      {/* ==========================================
          DESKTOP TABLE (visible on md screens up)
         ========================================== */}
      <div className="hidden md:block w-full overflow-hidden border border-white/5 bg-[#050505] rounded-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 text-[9px] uppercase tracking-[0.2em] text-white/40">
              <th className="py-4 px-6 font-semibold">Article</th>
              <th className="py-4 px-6 font-semibold">Category</th>
              <th className="py-4 px-6 font-semibold">Author</th>
              <th className="py-4 px-6 font-semibold">Date</th>
              <th className="py-4 px-6 font-semibold">Status</th>
              <th className="py-4 px-6 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <motion.tbody
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-20px" }}
            className="divide-y divide-white/5"
          >
            {articles.map((art) => (
              <motion.tr
                key={art.id}
                variants={rowVariants}
                onClick={() => onSelectArticle(art)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelectArticle(art);
                  }
                }}
                className="group cursor-pointer hover:bg-white/[0.025] transition-colors duration-300 outline-none focus-visible:bg-white/[0.05]"
              >
                {/* Article Info with Visual Thumbnail */}
                <td className="py-4 px-6 max-w-sm">
                  <div className="flex items-center gap-4">
                    {art.featuredImage ? (
                      <img
                        src={art.featuredImage}
                        alt={art.title}
                        className="hidden lg:block w-14 h-9 object-cover border border-white/5 rounded-xs"
                      />
                    ) : (
                      <div className="hidden lg:flex items-center justify-center w-14 h-9 bg-black border border-white/5 text-[7px] font-serif tracking-widest text-[#C9A24A]/60 select-none text-center rounded-xs">
                        THE DCO
                      </div>
                    )}
                    
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="text-xs font-sans font-medium text-white/70 group-hover:text-white transition-colors duration-300 truncate">
                        {art.title}
                      </span>
                      <span className="text-[9px] text-white/30 font-sans tracking-wide truncate max-w-xs">
                        {art.excerpt}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Category tag */}
                <td className="py-4 px-6 text-xs text-white/60 font-sans tracking-wide">
                  {art.category}
                </td>

                {/* Author Name */}
                <td className="py-4 px-6 text-xs text-white/60 font-sans tracking-wide">
                  {art.author}
                </td>

                {/* Date */}
                <td className="py-4 px-6 text-xs text-white/50 font-sans tracking-wide">
                  {art.publishedAt || "— (Draft)"}
                </td>

                {/* Status indicator dot */}
                <td className="py-4 px-6">
                  {renderStatusDot(art.status)}
                </td>

                {/* Arrow indicator */}
                <td className="py-4 px-6 text-right">
                  <div className="flex justify-end">
                    <ArrowRight
                      size={14}
                      className="text-white/20 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300"
                    />
                  </div>
                </td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </div>

      {/* ==========================================
          MOBILE LIST CARD GRID (visible below md screens)
         ========================================== */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="block md:hidden space-y-4"
      >
        {articles.map((art) => (
          <motion.button
            key={art.id}
            variants={rowVariants}
            type="button"
            onClick={() => onSelectArticle(art)}
            className="w-full text-left p-5 bg-[#050505] border border-white/5 rounded-xs transition-colors duration-300 hover:border-white/10 group cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-primary/50 relative overflow-hidden"
          >
            {/* Soft hover glow top line */}
            <span className="absolute top-0 left-0 right-0 h-[1px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

            <div className="flex flex-col space-y-3">
              {/* Header row */}
              <div className="flex items-start justify-between gap-4">
                <h4 className="text-xs font-sans font-semibold text-white/70 group-hover:text-white leading-snug transition-colors truncate max-w-[70%]">
                  {art.title}
                </h4>
                {renderStatusDot(art.status)}
              </div>

              {/* Category & Author metadata block */}
              <div className="text-[10px] font-sans text-white/50 space-y-0.5 border-l border-white/5 pl-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-white/30 uppercase text-[9px]">Category:</span>
                  <span className="text-white/60">{art.category}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-white/30 uppercase text-[9px]">Author:</span>
                  <span className="text-white/60">{art.author}</span>
                </div>
              </div>

              {/* Bottom dates + arrows row */}
              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <span className="text-[10px] font-sans text-white/30 tracking-wider">
                  Updated {art.updatedAt}
                </span>
                <ArrowRight
                  size={12}
                  className="text-white/20 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300"
                />
              </div>
            </div>
          </motion.button>
        ))}
      </motion.div>

    </div>
  );
}
