"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, FolderKanban } from "lucide-react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { mockProjects } from "@/data/dashboard";

export interface DashboardProject {
  id: string;
  index: string;
  name: string;
  category: string;
  status: string;
}

interface ActiveProjectsProps {
  projects?: DashboardProject[];
}

export function ActiveProjects({ projects }: ActiveProjectsProps) {
  const prefersReduced = useReducedMotion();
  const displayProjects = projects && projects.length > 0 ? projects : (projects ? [] : mockProjects);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReduced ? 0.05 : 0.4,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  const renderStatusColor = (status: string) => {
    const s = status.toUpperCase();
    switch (s) {
      case "ACTIVE":
        return "text-primary/90";
      case "IN PROGRESS":
        return "text-white/70";
      case "PLANNING":
      case "DRAFT":
        return "text-white/40";
      default:
        return "text-white/55";
    }
  };

  return (
    <div className="bg-[#050505] border border-white/5 p-6 rounded-xs space-y-6 select-none flex flex-col justify-between">
      {/* Header section */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <h3 className="text-sm font-serif font-medium tracking-wider text-white">
          Active Projects
        </h3>
        <Link
          href="/dashboard/projects"
          className="text-xs uppercase tracking-[0.15em] text-white/60 hover:text-primary transition-colors flex items-center gap-1 font-medium"
        >
          <span>View all</span>
          <ArrowRight size={11} />
        </Link>
      </div>

      {/* Row list or Empty State */}
      {displayProjects.length === 0 ? (
        <div className="py-8 text-center space-y-2">
          <FolderKanban size={24} className="mx-auto text-white/20" />
          <p className="text-sm text-white/60 font-sans">No active client projects currently listed.</p>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-20px" }}
          className="divide-y divide-white/5"
        >
          {displayProjects.map((project) => (
            <motion.div
              key={project.id}
              variants={itemVariants}
            >
              <Link
                href="/dashboard/projects"
                className="flex items-center gap-4 py-3.5 group cursor-pointer px-2 -mx-2 hover:bg-white/[0.02] rounded-xs transition-colors duration-300 block"
              >
                {/* Number Index */}
                <span className="text-xs font-serif text-white/50 tracking-wider w-6 font-medium">
                  {project.index}
                </span>

                {/* Middle Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-sans font-semibold text-white tracking-wide truncate group-hover:text-primary transition-colors">
                    {project.name}
                  </h4>
                  <span className="text-xs text-white/60 font-sans tracking-wide">
                    {project.category}
                  </span>
                </div>

                {/* Status and Action */}
                <div className="flex items-center gap-4">
                  <span
                    className={`text-xs uppercase tracking-[0.15em] font-sans font-semibold ${renderStatusColor(
                      project.status
                    )}`}
                  >
                    {project.status}
                  </span>
                  <ArrowRight
                    size={13}
                    className="text-white/30 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300"
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

