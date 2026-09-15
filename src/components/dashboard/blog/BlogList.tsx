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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-[#2F7D54] border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2F7D54]" />
            Published
          </span>
        );
      case "draft":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-700 border border-gray-200">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
            Draft
          </span>
        );
    }
  };

  return (
    <div className="w-full select-none">
      
      {/* ==========================================
          DESKTOP TABLE (visible on md screens up)
         ========================================== */}
      <div className="hidden md:block w-full overflow-hidden border border-[#E1E8E2] bg-white rounded-lg shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E1E8E2] text-[11px] uppercase tracking-[0.14em] text-[#123C2D] font-sans font-semibold bg-[#F0F4F0]">
              <th className="py-3.5 px-5">Article</th>
              <th className="py-3.5 px-5">Category</th>
              <th className="py-3.5 px-5">Author</th>
              <th className="py-3.5 px-5">Date</th>
              <th className="py-3.5 px-5">Status</th>
              <th className="py-3.5 px-5 text-right">Action</th>
            </tr>
          </thead>
          <motion.tbody
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-20px" }}
            className="divide-y divide-[#E1E8E2] font-sans"
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
                className="group cursor-pointer hover:bg-[#F6F8F5] transition-colors duration-200 outline-none"
              >
                {/* Article Info with Visual Thumbnail */}
                <td className="py-4 px-5 max-w-sm">
                  <div className="flex items-center gap-4">
                    {art.featuredImage ? (
                      <img
                        src={art.featuredImage}
                        alt={art.title}
                        className="hidden lg:block w-14 h-9 object-cover border border-[#E1E8E2] rounded-md"
                      />
                    ) : (
                      <div className="hidden lg:flex items-center justify-center w-14 h-9 bg-[#F0F4F0] border border-[#E1E8E2] text-[9px] font-sans font-bold tracking-wider text-[#123C2D] select-none text-center rounded-md">
                        CELIFE
                      </div>
                    )}
                    
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="text-xs font-sans font-semibold text-[#17201B] group-hover:text-[#123C2D] transition-colors duration-200 truncate">
                        {art.title}
                      </span>
                      <span className="text-[11px] text-[#68756D] font-sans truncate max-w-xs">
                        {art.excerpt}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Category tag */}
                <td className="py-4 px-5 text-xs text-[#68756D] font-sans">
                  {art.category}
                </td>

                {/* Author Name */}
                <td className="py-4 px-5 text-xs text-[#68756D] font-sans">
                  {art.author}
                </td>

                {/* Date */}
                <td className="py-4 px-5 text-xs text-[#68756D] font-sans">
                  {art.publishedAt || "— (Draft)"}
                </td>

                {/* Status indicator dot */}
                <td className="py-4 px-5">
                  {renderStatusDot(art.status)}
                </td>

                {/* Arrow indicator */}
                <td className="py-4 px-5 text-right">
                  <div className="flex justify-end">
                    <ArrowRight
                      size={14}
                      className="text-[#68756D]/40 group-hover:text-[#123C2D] group-hover:translate-x-1 transition-all duration-200"
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
        className="block md:hidden space-y-3 font-sans"
      >
        {articles.map((art) => (
          <motion.button
            key={art.id}
            variants={rowVariants}
            type="button"
            onClick={() => onSelectArticle(art)}
            className="w-full text-left p-4 bg-white border border-[#E1E8E2] rounded-lg transition-colors hover:border-[#123C2D]/40 shadow-xs group cursor-pointer outline-none relative overflow-hidden"
          >
            <div className="flex flex-col space-y-3">
              {/* Header row */}
              <div className="flex items-start justify-between gap-4">
                <h4 className="text-xs font-sans font-bold text-[#17201B] leading-snug truncate max-w-[70%]">
                  {art.title}
                </h4>
                {renderStatusDot(art.status)}
              </div>

              {/* Category & Author metadata block */}
              <div className="text-xs font-sans text-[#68756D] space-y-0.5 border-l-2 border-[#123C2D]/20 pl-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-[#68756D]/70 uppercase text-[10px]">Category:</span>
                  <span className="text-[#17201B] font-medium">{art.category}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[#68756D]/70 uppercase text-[10px]">Author:</span>
                  <span className="text-[#17201B] font-medium">{art.author}</span>
                </div>
              </div>

              {/* Bottom dates + arrows row */}
              <div className="flex items-center justify-between pt-2 border-t border-[#E1E8E2]">
                <span className="text-[11px] font-sans text-[#68756D]">
                  Updated {art.updatedAt}
                </span>
                <ArrowRight
                  size={13}
                  className="text-[#68756D] group-hover:text-[#123C2D] group-hover:translate-x-1 transition-all duration-200"
                />
              </div>
            </div>
          </motion.button>
        ))}
      </motion.div>

    </div>
  );
}
