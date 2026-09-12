"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight, MoreHorizontal, Edit, Copy, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Service, ServiceStatus } from "@/types/service";

interface ServiceListProps {
  services: Service[];
  onSelectService: (service: Service) => void;
  onDuplicateService: (service: Service) => void;
  onDeleteService: (service: Service) => void;
  onReorderService: (id: string, direction: "up" | "down") => void;
}

export function ServiceList({
  services,
  onSelectService,
  onDuplicateService,
  onDeleteService,
  onReorderService,
}: ServiceListProps) {
  const prefersReduced = useReducedMotion();

  // Active action menu row id
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Esc key closure for action menus
  useEffect(() => {
    if (!activeMenuId) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveMenuId(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeMenuId]);

  // Click outside closure for action menus
  useEffect(() => {
    if (!activeMenuId) return;

    const handleOutsideClick = () => {
      setActiveMenuId(null);
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, [activeMenuId]);

  const padZero = (num: number) => {
    return num < 10 ? `0${num}` : `${num}`;
  };

  const renderStatusDot = (status: ServiceStatus) => {
    switch (status) {
      case "active":
        return (
          <div className="flex items-center gap-1.5 font-semibold text-primary">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="text-xs uppercase tracking-wider font-semibold">Active</span>
          </div>
        );
      case "draft":
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white/60">
            <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
            <span className="text-xs uppercase tracking-wider font-semibold">Draft</span>
          </div>
        );
      case "hidden":
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white/40">
            <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
            <span className="text-xs uppercase tracking-wider font-semibold">Archived</span>
          </div>
        );
    }
  };

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

  return (
    <div className="w-full select-none">
      
      {/* Desktop Editorial Table View */}
      <div className="hidden md:block w-full overflow-hidden border border-white/5 bg-[#050505] rounded-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 text-xs uppercase tracking-[0.18em] text-white/60 font-semibold">
              <th className="py-4 px-6 font-semibold">Service</th>
              <th className="py-4 px-6 font-semibold">Category</th>
              <th className="py-4 px-6 font-semibold">Order</th>
              <th className="py-4 px-6 font-semibold">Status</th>
              <th className="py-4 px-6 font-semibold">Updated</th>
              <th className="py-4 px-6 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <motion.tbody
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-20px" }}
            className="divide-y divide-white/5"
          >
            {services.map((srv, idx) => {
              const isFirst = idx === 0;
              const isLast = idx === services.length - 1;

              return (
                <motion.tr
                  key={srv.id}
                  variants={rowVariants}
                  onClick={() => onSelectService(srv)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelectService(srv);
                    }
                  }}
                  className="group cursor-pointer hover:bg-white/[0.025] transition-colors duration-300 outline-none focus-visible:bg-white/[0.05]"
                >
                  {/* Service Title */}
                  <td className="py-4 px-6 max-w-sm">
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="text-sm font-sans font-semibold text-white/80 group-hover:text-white transition-colors duration-300 truncate">
                        {srv.name}
                      </span>
                      <span className="text-xs text-white/50 font-sans tracking-wide truncate max-w-xs">
                        {srv.shortDescription}
                      </span>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-4 px-6 text-sm text-white/70 font-sans tracking-wide">
                    {srv.category}
                  </td>

                  {/* Display Order & Reordering control */}
                  <td className="py-4 px-6 text-sm text-white/70 font-mono tracking-wide">
                    <div className="flex items-center gap-3">
                      <span className="w-4 font-semibold">{padZero(srv.displayOrder)}</span>
                      <div
                        className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 select-none"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          disabled={isFirst}
                          onClick={() => onReorderService(srv.id, "up")}
                          aria-label="Move service up"
                          className="text-xs text-white/40 hover:text-primary transition-colors disabled:opacity-5 cursor-pointer p-0.5 font-bold"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          disabled={isLast}
                          onClick={() => onReorderService(srv.id, "down")}
                          aria-label="Move service down"
                          className="text-xs text-white/40 hover:text-primary transition-colors disabled:opacity-5 cursor-pointer p-0.5 font-bold"
                        >
                          ↓
                        </button>
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-6">
                    {renderStatusDot(srv.status)}
                  </td>

                  {/* Updated Date */}
                  <td className="py-4 px-6 text-sm text-white/60 font-sans tracking-wide">
                    {srv.updatedAt}
                  </td>

                  {/* Action Menu (⋯ Dropdown) */}
                  <td className="py-4 px-6 text-right relative">
                    <div className="flex justify-end items-center gap-4" onClick={(e) => e.stopPropagation()}>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(activeMenuId === srv.id ? null : srv.id);
                          }}
                          aria-haspopup="true"
                          aria-expanded={activeMenuId === srv.id}
                          aria-label="More actions"
                          className="p-1 rounded-sm border border-transparent hover:border-white/5 text-white/40 hover:text-white transition-all duration-300 outline-none cursor-pointer"
                        >
                          <MoreHorizontal size={15} />
                        </button>

                        {/* Dropdown popup frame */}
                        <AnimatePresence>
                          {activeMenuId === srv.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: prefersReduced ? 1 : 0.95, y: prefersReduced ? 0 : -2 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: prefersReduced ? 1 : 0.95, y: prefersReduced ? 0 : -2 }}
                              transition={{ duration: prefersReduced ? 0.05 : 0.18, ease: "easeOut" }}
                              role="menu"
                              className="absolute right-0 mt-1.5 w-32 bg-[#0A0A0A] border border-white/10 rounded-xs shadow-2xl py-1 z-30 outline-none text-left"
                            >
                              <button
                                role="menuitem"
                                onClick={() => {
                                  setActiveMenuId(null);
                                  onSelectService(srv);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs uppercase tracking-wider font-sans font-semibold text-white/70 hover:text-white hover:bg-white/[0.04] transition-colors outline-none cursor-pointer"
                              >
                                <Edit size={12} className="text-white/50" />
                                <span>Edit</span>
                              </button>
                              <button
                                role="menuitem"
                                onClick={() => {
                                  setActiveMenuId(null);
                                  onDuplicateService(srv);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs uppercase tracking-wider font-sans font-semibold text-white/70 hover:text-white hover:bg-white/[0.04] transition-colors outline-none cursor-pointer"
                              >
                                <Copy size={12} className="text-white/50" />
                                <span>Duplicate</span>
                              </button>
                              <div className="h-[1px] bg-white/5 my-0.5" />
                              <button
                                role="menuitem"
                                onClick={() => {
                                  setActiveMenuId(null);
                                  onDeleteService(srv);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs uppercase tracking-wider font-sans font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors outline-none cursor-pointer"
                              >
                                <Trash2 size={12} className="text-red-500/50" />
                                <span>Delete</span>
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <ArrowRight
                        size={13}
                        className="text-white/20 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300"
                      />
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </motion.tbody>
        </table>
      </div>

      {/* Mobile Stack Cards Layout */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="block md:hidden space-y-4"
      >
        {services.map((srv, idx) => {
          const isFirst = idx === 0;
          const isLast = idx === services.length - 1;

          return (
            <motion.div
              key={srv.id}
              variants={rowVariants}
              onClick={() => onSelectService(srv)}
              className="w-full text-left p-5 bg-[#050505] border border-white/5 rounded-xs transition-all duration-300 hover:border-white/10 group cursor-pointer outline-none relative overflow-visible"
            >
              <div className="flex flex-col space-y-3 relative">
                
                {/* Header row: Name and Action button */}
                <div className="flex items-start justify-between gap-4">
                  <h4 className="text-sm font-sans font-bold uppercase tracking-wider text-white/85 group-hover:text-white leading-snug transition-colors pr-6">
                    {srv.name}
                  </h4>
                  
                  {/* Context menu overlay block */}
                  <div className="absolute right-0 top-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(activeMenuId === srv.id ? null : srv.id);
                      }}
                      aria-haspopup="true"
                      aria-expanded={activeMenuId === srv.id}
                      aria-label="More actions"
                      className="p-1 rounded-sm border border-transparent hover:border-white/5 text-white/40 hover:text-white transition-all duration-300 outline-none cursor-pointer"
                    >
                      <MoreHorizontal size={15} />
                    </button>

                    <AnimatePresence>
                      {activeMenuId === srv.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: prefersReduced ? 1 : 0.95, y: prefersReduced ? 0 : -2 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: prefersReduced ? 1 : 0.95, y: prefersReduced ? 0 : -2 }}
                          transition={{ duration: prefersReduced ? 0.05 : 0.18 }}
                          role="menu"
                          className="absolute right-0 mt-1 w-32 bg-[#0A0A0A] border border-white/10 rounded-xs shadow-2xl py-1 z-30 outline-none text-left"
                        >
                          <button
                            role="menuitem"
                            onClick={() => {
                              setActiveMenuId(null);
                              onSelectService(srv);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs uppercase tracking-wider font-sans font-semibold text-white/70 hover:text-white hover:bg-white/[0.04] transition-colors outline-none cursor-pointer"
                          >
                            <Edit size={12} className="text-white/50" />
                            <span>Edit</span>
                          </button>
                          <button
                            role="menuitem"
                            onClick={() => {
                              setActiveMenuId(null);
                              onDuplicateService(srv);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs uppercase tracking-wider font-sans font-semibold text-white/70 hover:text-white hover:bg-white/[0.04] transition-colors outline-none cursor-pointer"
                          >
                            <Copy size={12} className="text-white/50" />
                            <span>Duplicate</span>
                          </button>
                          <div className="h-[1px] bg-white/5 my-0.5" />
                          <button
                            role="menuitem"
                            onClick={() => {
                              setActiveMenuId(null);
                              onDeleteService(srv);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs uppercase tracking-wider font-sans font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors outline-none cursor-pointer"
                          >
                            <Trash2 size={12} className="text-red-500/50" />
                            <span>Delete</span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Category & Order Details */}
                <div className="text-xs font-sans text-white/60 space-y-1 border-l border-white/10 pl-3 pr-2 select-none">
                  <div className="flex items-center gap-1.5">
                    <span className="text-white/40 uppercase text-xs">Category:</span>
                    <span className="text-white/80 font-medium">{srv.category}</span>
                  </div>
                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <span className="text-white/40 uppercase text-xs">Order:</span>
                    <span className="text-white/80 font-mono pr-2 font-semibold">{padZero(srv.displayOrder)}</span>
                    
                    {/* Reordering Controls */}
                    <div className="flex items-center gap-2 ml-1">
                      <button
                        type="button"
                        disabled={isFirst}
                        onClick={() => onReorderService(srv.id, "up")}
                        aria-label="Move service up"
                        className="text-xs text-white/40 hover:text-primary transition-colors disabled:opacity-5 cursor-pointer font-bold"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        disabled={isLast}
                        onClick={() => onReorderService(srv.id, "down")}
                        aria-label="Move service down"
                        className="text-xs text-white/40 hover:text-primary transition-colors disabled:opacity-5 cursor-pointer font-bold"
                      >
                        ↓
                      </button>
                    </div>
                  </div>
                </div>

                {/* Status and Footer Info */}
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <div className="flex items-center gap-4">
                    {renderStatusDot(srv.status)}
                    <span className="text-xs font-sans text-white/50">
                      Updated {srv.updatedAt}
                    </span>
                  </div>
                  <ArrowRight
                    size={13}
                    className="text-white/30 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300"
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
