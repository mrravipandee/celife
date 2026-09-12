"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Search, SlidersHorizontal, Plus } from "lucide-react";
import { Project } from "@/types/project";
import { getProjectsClient } from "@/lib/services/projects-client";
import { ProjectList } from "./ProjectList";
import { LoadingState } from "@/components/ui/LoadingState";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";

export function ProjectsDashboardClient() {
  const router = useRouter();
  const prefersReduced = useReducedMotion();

  // Local state for projects fetched from MongoDB
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  // API states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch projects from MongoDB
  const loadProjects = async (showSkeleton = false) => {
    if (showSkeleton) {
      setIsLoading(true);
      setError(null);
    }
    try {
      const data = await getProjectsClient();
      setProjects(data);
    } catch (err: unknown) {
      console.error("Failed to load projects:", err);
      const msg = err instanceof Error ? err.message : "Unable to load projects.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadProjects(false);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Extract unique categories from actual database projects
  const uniqueCategories = useMemo(() => {
    const cats = projects.map((p) => p.category).filter(Boolean);
    return Array.from(new Set(cats));
  }, [projects]);

  // Check if any filter is active
  const isFilterActive = useMemo(() => {
    return (
      searchTerm.trim() !== "" ||
      statusFilter !== "all" ||
      categoryFilter !== "all" ||
      sortOrder !== "newest"
    );
  }, [searchTerm, statusFilter, categoryFilter, sortOrder]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setCategoryFilter("all");
    setSortOrder("newest");
  };

  // Perform client-side filter and sorting matching
  const filteredProjects = useMemo(() => {
    let result = [...projects];

    // 1. Search term match (across title, category, location, services)
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term) ||
          p.location.toLowerCase().includes(term) ||
          p.services.some((s) => s.toLowerCase().includes(term))
      );
    }

    // 2. Status filter match (always "active" for now)
    if (statusFilter !== "all") {
      result = result.filter(() => "active" === statusFilter);
    }

    // 3. Category filter match
    if (categoryFilter !== "all") {
      result = result.filter((p) => p.category.toLowerCase() === categoryFilter.toLowerCase());
    }

    // 4. Sort match
    result.sort((a, b) => {
      if (sortOrder === "newest") {
        const dateA = Date.parse(a.createdAt || "") || 0;
        const dateB = Date.parse(b.createdAt || "") || 0;
        return dateB - dateA;
      } else if (sortOrder === "oldest") {
        const dateA = Date.parse(a.createdAt || "") || 0;
        const dateB = Date.parse(b.createdAt || "") || 0;
        return dateA - dateB;
      } else if (sortOrder === "a-z") {
        return a.title.localeCompare(b.title);
      } else if (sortOrder === "z-a") {
        return b.title.localeCompare(a.title);
      }
      return 0;
    });

    return result;
  }, [projects, searchTerm, statusFilter, categoryFilter, sortOrder]);

  // Statistics counts (Zero padded formatted helper)
  const padNum = (num: number) => (num < 10 ? `0${num}` : `${num}`);
  const totalCount = padNum(projects.length);
  const activeCount = padNum(projects.length); // since all loaded MongoDB projects are active
  const draftCount = "00";

  // Render error component

  if (error) {
    return (
      <ErrorState
        title="Unable to load projects"
        description={
          error.includes("401") || error.includes("403")
            ? "You don't have permission to perform this action. Please sign in."
            : "A database error or connection issue occurred while retrieving projects."
        }
        onRetry={() => loadProjects(true)}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: prefersReduced ? 0 : 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: prefersReduced ? 0.05 : 0.6,
        ease: [0.16, 1, 0.3, 1] as const,
      }}
      className="space-y-8 pb-12 select-none relative"
    >
      {/* 1. Header component */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-white/5 pb-6 select-none">
        <div className="space-y-2">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-white/40 font-sans">
            <span className="hover:text-white transition-colors cursor-pointer" onClick={() => router.push("/dashboard")}>
              Dashboard
            </span>
            <span>/</span>
            <span className="text-white/80">Projects</span>
          </nav>
          {/* Title and descriptions */}
          <h1 className="text-xl font-serif text-white tracking-wide">Projects</h1>
          <p className="text-xs text-white/50 leading-relaxed font-sans max-w-xl">
            Manage THEDCO&apos;s hospitality projects, engagements and public-facing project information.
          </p>
        </div>
        {/* Create button */}
        <button
          type="button"
          onClick={() => router.push("/dashboard/projects/new")}
          className="self-start md:self-auto flex items-center justify-center gap-2 bg-[#C9A24A] hover:bg-white text-black font-sans text-[9px] font-semibold uppercase tracking-[0.2em] px-5 py-3 transition-colors duration-300 rounded-xs outline-none cursor-pointer"
        >
          <Plus size={12} />
          <span>New Project</span>
        </button>
      </div>

      {/* 2. Projects stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 select-none">
        <div className="bg-[#050505] border border-white/5 p-6 rounded-xs space-y-2 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C9A24A]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <h4 className="text-[9px] uppercase tracking-[0.2em] text-white/40 font-sans font-medium">
            Total Projects
          </h4>
          <p className="text-2xl font-serif font-light text-white tracking-wide">
            {isLoading ? "—" : totalCount}
          </p>
        </div>
        <div className="bg-[#050505] border border-white/5 p-6 rounded-xs space-y-2 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C9A24A]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <h4 className="text-[9px] uppercase tracking-[0.2em] text-white/40 font-sans font-medium">
            Active
          </h4>
          <p className="text-2xl font-serif font-light text-white tracking-wide">
            {isLoading ? "—" : activeCount}
          </p>
        </div>
        <div className="bg-[#050505] border border-white/5 p-6 rounded-xs space-y-2 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C9A24A]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <h4 className="text-[9px] uppercase tracking-[0.2em] text-white/40 font-sans font-medium">
            Drafts
          </h4>
          <p className="text-2xl font-serif font-light text-white tracking-wide">
            {isLoading ? "—" : draftCount}
          </p>
        </div>
      </div>

      {/* 3. Toolbar filters */}
      <div className="flex flex-col gap-4 border border-white/5 bg-[#050505] p-4 rounded-xs md:flex-row md:items-center justify-between select-none">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search size={12} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black border border-white/10 text-xs text-white placeholder-white/20 pl-9 pr-4 py-2.5 rounded-xs outline-none focus:border-[#C9A24A]/40 transition-colors font-sans"
          />
        </div>
        {/* Filters and sorting */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status selector */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={10} className="text-white/30" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-black border border-white/10 text-[10px] text-white/80 py-2.5 pl-3 pr-8 rounded-xs outline-none focus:border-[#C9A24A]/40 transition-colors uppercase tracking-wider font-sans cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
            </select>
          </div>
          {/* Category selector */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-black border border-white/10 text-[10px] text-white/80 py-2.5 pl-3 pr-8 rounded-xs outline-none focus:border-[#C9A24A]/40 transition-colors uppercase tracking-wider font-sans cursor-pointer"
          >
            <option value="all">All Categories</option>
            {uniqueCategories.map((cat) => (
              <option key={cat} value={cat.toLowerCase()}>
                {cat}
              </option>
            ))}
          </select>
          {/* Sorting */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="bg-black border border-white/10 text-[10px] text-white/80 py-2.5 pl-3 pr-8 rounded-xs outline-none focus:border-[#C9A24A]/40 transition-colors uppercase tracking-wider font-sans cursor-pointer"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="a-z">A–Z</option>
            <option value="z-a">Z–A</option>
          </select>
          {/* Clear button */}
          {isFilterActive && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="px-3.5 py-2.5 text-[9px] uppercase tracking-widest font-sans font-semibold border border-white/10 text-white hover:text-primary hover:border-primary transition-colors duration-300 rounded-xs cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* 4. Display listing / skeletons */}
      {isLoading ? (
        <LoadingState variant="table" columnsCount={6} rowsCount={3} />
      ) : filteredProjects.length > 0 ? (
        <ProjectList projects={filteredProjects} />
      ) : (
        <EmptyState
          title={isFilterActive ? "No projects found" : "No projects yet"}
          description={
            isFilterActive
              ? "Try adjusting your search or filters."
              : "Add your first project to begin building the THEDCO project portfolio."
          }
          actionText={isFilterActive ? "Clear Filters" : "New Project"}
          onAction={isFilterActive ? handleClearFilters : () => router.push("/dashboard/projects/new")}
        />
      )}
    </motion.div>
  );
}
