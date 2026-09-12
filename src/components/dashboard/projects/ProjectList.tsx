"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Edit, ExternalLink, ArrowRight } from "lucide-react";
import { Project } from "@/types/project";

interface ProjectListProps {
  projects: Project[];
}

{/* Format date utility */}
const formatDateStr = (dateStr?: string) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export function ProjectList({ projects }: ProjectListProps) {
  const router = useRouter();
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menus on click outside or escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveMenuId(null);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const toggleMenu = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  return (
    <div className="space-y-4 select-none relative">
      {/* 1. Desktop Table */}
      <div className="hidden md:block w-full overflow-visible border border-white/5 bg-[#050505] rounded-xs select-none">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 text-[9px] uppercase tracking-[0.2em] text-white/40">
              <th className="py-4 px-6 font-semibold">Project</th>
              <th className="py-4 px-6 font-semibold">Client</th>
              <th className="py-4 px-6 font-semibold">Category</th>
              <th className="py-4 px-6 font-semibold">Status</th>
              <th className="py-4 px-6 font-semibold">Updated</th>
              <th className="py-4 px-6 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {projects.map((project) => {
              const projectId = project._id || "";
              return (
                <tr
                  key={projectId}
                  onClick={() => router.push(`/dashboard/projects/${projectId}`)}
                  className="group hover:bg-white/[0.02] border-b border-white/5 transition-all duration-300 cursor-pointer select-none"
                >
                  {/* Thumbnail & Title */}
                  <td className="py-4 px-6 max-w-sm">
                    <div className="flex items-center gap-3">
                      {project.coverImage ? (
                        <img
                          src={project.coverImage}
                          alt={project.title}
                          className="w-10 h-7 object-cover border border-white/5 rounded-xs"
                        />
                      ) : (
                        <div className="w-10 h-7 bg-white/5 border border-white/10 rounded-xs flex items-center justify-center">
                          <span className="text-[7px] tracking-widest text-white/30 font-sans uppercase font-bold">DCO</span>
                        </div>
                      )}
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-sans font-medium text-white group-hover:text-primary transition-colors truncate">
                          {project.title}
                        </span>
                        <span className="text-[10px] text-white/30 font-sans tracking-wide truncate">
                          {project.location} ({project.year})
                        </span>
                      </div>
                    </div>
                  </td>
                  {/* Client */}
                  <td className="py-4 px-6 text-xs text-white/60 font-sans">
                    Private Client
                  </td>
                  {/* Category */}
                  <td className="py-4 px-6 text-xs text-white/60 font-sans">
                    {project.category}
                  </td>
                  {/* Status */}
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-wider font-semibold font-sans text-primary">
                      <span className="h-1 w-1 rounded-full bg-primary" />
                      <span>Active</span>
                    </span>
                  </td>
                  {/* Updated date */}
                  <td className="py-4 px-6 text-xs text-white/40 font-sans">
                    {formatDateStr(project.updatedAt)}
                  </td>
                  {/* Dropdown Options */}
                  <td className="py-4 px-6 text-right overflow-visible relative">
                    <div className="flex justify-end items-center gap-3">
                      <ArrowRight
                        size={14}
                        className="text-white/20 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:text-primary transition-all duration-300"
                      />
                      <button
                        type="button"
                        onClick={(e) => toggleMenu(e, projectId)}
                        className="p-1.5 hover:bg-white/5 rounded-xs text-white/50 hover:text-white transition-colors cursor-pointer outline-none"
                      >
                        <MoreHorizontal size={14} />
                      </button>
                    </div>

                    {/* Context menu box */}
                    {activeMenuId === projectId && (
                      <div
                        ref={menuRef}
                        className="absolute right-6 top-12 z-50 w-36 bg-[#0B0B0B] border border-white/10 rounded-xs shadow-2xl py-1.5 select-none"
                      >
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(null);
                            router.push(`/dashboard/projects/${projectId}`);
                          }}
                          className="w-full text-left px-4 py-2 text-[10px] uppercase tracking-wider font-sans font-semibold text-white/65 hover:text-white hover:bg-white/[0.03] transition-colors flex items-center gap-2 cursor-pointer"
                        >
                          <Edit size={10} />
                          <span>Edit</span>
                        </button>
                        <a
                          href={`/projects/${project.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(null);
                          }}
                          className="w-full text-left px-4 py-2 text-[10px] uppercase tracking-wider font-sans font-semibold text-white/65 hover:text-white hover:bg-white/[0.03] transition-colors flex items-center gap-2 cursor-pointer"
                        >
                          <ExternalLink size={10} />
                          <span>View Public</span>
                        </a>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 2. Mobile Stack Cards */}
      <div className="block md:hidden space-y-4 select-none">
        {projects.map((project) => {
          const projectId = project._id || "";
          return (
            <div
              key={projectId}
              onClick={() => router.push(`/dashboard/projects/${projectId}`)}
              className="bg-[#050505] border border-white/5 p-5 rounded-xs space-y-3 hover:border-white/10 transition-colors cursor-pointer select-none relative"
            >
              {/* Header Info */}
              <div className="flex items-center justify-between min-w-0 gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {project.coverImage ? (
                    <img
                      src={project.coverImage}
                      alt={project.title}
                      className="w-10 h-7 object-cover border border-white/5 rounded-xs flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-7 bg-white/5 border border-white/10 rounded-xs flex items-center justify-center flex-shrink-0">
                      <span className="text-[7px] tracking-widest text-white/30 font-sans uppercase font-bold">DCO</span>
                    </div>
                  )}
                  <h4 className="text-xs font-sans font-medium text-white tracking-wide truncate group-hover:text-primary transition-colors">
                    {project.title}
                  </h4>
                </div>

                <div className="flex-shrink-0 relative">
                  <button
                    type="button"
                    onClick={(e) => toggleMenu(e, projectId)}
                    className="p-1 hover:bg-white/5 rounded-xs text-white/40 hover:text-white transition-colors cursor-pointer"
                  >
                    <MoreHorizontal size={14} />
                  </button>

                  {/* Context menu box for mobile */}
                  {activeMenuId === projectId && (
                    <div
                      ref={menuRef}
                      className="absolute right-0 top-6 z-50 w-36 bg-[#0B0B0B] border border-white/10 rounded-xs shadow-2xl py-1.5 select-none"
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(null);
                          router.push(`/dashboard/projects/${projectId}`);
                        }}
                        className="w-full text-left px-4 py-2 text-[10px] uppercase tracking-wider font-sans font-semibold text-white/65 hover:text-white hover:bg-white/[0.03] transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        <Edit size={10} />
                        <span>Edit</span>
                      </button>
                      <a
                        href={`/projects/${project.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(null);
                        }}
                        className="w-full text-left px-4 py-2 text-[10px] uppercase tracking-wider font-sans font-semibold text-white/65 hover:text-white hover:bg-white/[0.03] transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        <ExternalLink size={10} />
                        <span>View Public</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Middle client / category metadata details */}
              <div className="border-l border-white/5 pl-3 space-y-1">
                <p className="text-[10px] text-white/30 font-sans tracking-wide">
                  Private Client
                </p>
                <p className="text-[10px] text-white/40 font-sans tracking-wide uppercase">
                  {project.category}
                </p>
              </div>

              {/* Status and dates bar */}
              <div className="pt-2.5 border-t border-white/5 flex justify-between items-center text-[10px] font-sans">
                <span className="inline-flex items-center gap-1.5 uppercase tracking-wider font-semibold text-primary">
                  <span className="h-1 w-1 rounded-full bg-primary" />
                  <span>Active</span>
                </span>
                <span className="text-white/30">
                  {formatDateStr(project.updatedAt)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
