"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { CaseStudyHeader } from "./CaseStudyHeader";
import { CaseStudyStats } from "./CaseStudyStats";
import { CaseStudyToolbar } from "./CaseStudyToolbar";
import { CaseStudyList } from "./CaseStudyList";
import { LoadingState } from "@/components/ui/LoadingState";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { CaseStudy, CaseStudyStatus } from "@/data/case-studies";
import { getCaseStudiesClient } from "@/lib/services/case-studies-client";
import { BackendCaseStudy } from "@/types/case-study";
import { useDebounce } from "@/hooks/useDebounce";

// Format helper utilities
const formatDateStr = (dateStr?: string | Date | null) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

interface StatsState {
  total: number;
  published: number;
  drafts: number;
}

interface SortedCaseStudy extends CaseStudy {
  rawUpdatedAt: string;
}

export function CaseStudiesDashboardClient() {
  const router = useRouter();
  const prefersReduced = useReducedMotion();

  // Local state for case studies collection
  const [caseStudies, setCaseStudies] = useState<SortedCaseStudy[]>([]);
  const [stats, setStats] = useState<StatsState | null>(null);

  // Filter toolbar states
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sectorFilter, setSectorFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12;

  // Reset page to 1 when filters change
  const [prevFilter, setPrevFilter] = useState({ search: debouncedSearch, status: statusFilter, sector: sectorFilter });
  if (prevFilter.search !== debouncedSearch || prevFilter.status !== statusFilter || prevFilter.sector !== sectorFilter) {
    setPrevFilter({ search: debouncedSearch, status: statusFilter, sector: sectorFilter });
    setPage(1);
  }

  // API loading / error states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Trigger to force refreshes
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Load case studies when filter or debounced search dependencies change
  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Map sectorFilter to propertyType
        let propertyTypeQuery: string | undefined = undefined;
        let searchExtra: string | undefined = debouncedSearch;

        if (sectorFilter !== "all") {
          if (sectorFilter === "Hotel" || sectorFilter === "Resort" || sectorFilter === "Restaurant") {
            propertyTypeQuery = sectorFilter;
          } else if (sectorFilter === "Café / QSR") {
            // For custom combined filters, search for 'Café' or 'QSR'
            searchExtra = debouncedSearch ? `${debouncedSearch} Café` : "Café";
          } else if (sectorFilter === "Hospitality Investment") {
            searchExtra = debouncedSearch ? `${debouncedSearch} Investment` : "Investment";
          }
        }

        // 1. Fetch main case studies list
        const response = await getCaseStudiesClient({
          page,
          limit,
          status: statusFilter,
          propertyType: propertyTypeQuery,
          search: searchExtra,
        });

        if (!active) return;

        // Map backend fields to the props structure expected by UI components
        const mappedData: SortedCaseStudy[] = response.data.map((doc: BackendCaseStudy) => ({
          id: doc.id || doc._id?.toString() || "",
          title: doc.title,
          slug: doc.slug,
          shortDescription: doc.projectType || doc.propertyType || "",
          sector: doc.propertyType || "Other",
          location: doc.location || "India",
          client: doc.client?.name || "THE DCO Client",
          status: doc.status as CaseStudyStatus,
          challenge: doc.challenge || "",
          approach: doc.solution || "",
          implementation: doc.solution || "",
          outcome: doc.overview || "",
          metrics: (doc.results || []).map((r) => ({
            label: r.metric,
            value: r.value,
            description: r.description,
          })),
          publishedAt: doc.publishedAt ? formatDateStr(doc.publishedAt) : null,
          updatedAt: formatDateStr(doc.updatedAt || doc.createdAt),
          featuredImage: doc.coverImage?.url || "",
          rawUpdatedAt: doc.updatedAt || doc.createdAt,
        }));

        setCaseStudies(mappedData);
        setTotalPages(response.pagination.totalPages);
      } catch (err: unknown) {
        console.error("Failed to load case studies:", err);
        if (active) {
          setError("Unable to load case studies.");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      active = false;
    };
  }, [page, statusFilter, sectorFilter, debouncedSearch, refreshTrigger]);

  // Load stats counts independently (only on mount & mutation refreshes)
  useEffect(() => {
    let active = true;

    const fetchStats = async () => {
      try {
        const [allRes, pubRes, draftRes] = await Promise.all([
          getCaseStudiesClient({ limit: 1 }),
          getCaseStudiesClient({ status: "published", limit: 1 }),
          getCaseStudiesClient({ status: "draft", limit: 1 }),
        ]);

        if (!active) return;

        setStats({
          total: allRes.pagination.total,
          published: pubRes.pagination.total,
          drafts: draftRes.pagination.total,
        });
      } catch (err: unknown) {
        console.error("Failed to load case study stats:", err);
      }
    };

    fetchStats();

    return () => {
      active = false;
    };
  }, [refreshTrigger]);


  // Apply client-side sorting
  const processedCaseStudies = useMemo(() => {
    const result = [...caseStudies];

    result.sort((a, b) => {
      const dateA = Date.parse(a.rawUpdatedAt) || 0;
      const dateB = Date.parse(b.rawUpdatedAt) || 0;
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [caseStudies, sortOrder]);

  const handleNewCaseStudyClick = () => {
    router.push("/dashboard/case-studies/new");
  };

  const handleSelectCaseStudy = (cs: CaseStudy) => {
    router.push(`/dashboard/case-studies/${cs.id}/edit`);
  };

  const handleSearchChange = (val: string) => {
    setIsLoading(true);
    setError(null);
    setSearchTerm(val);
    setPage(1);
  };

  const handleStatusChange = (val: string) => {
    setIsLoading(true);
    setError(null);
    setStatusFilter(val);
    setPage(1);
  };

  const handleSectorChange = (val: string) => {
    setIsLoading(true);
    setError(null);
    setSectorFilter(val);
    setPage(1);
  };

  const handlePageChange = (nextPage: number) => {
    setIsLoading(true);
    setError(null);
    setPage(nextPage);
  };

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    setRefreshTrigger((t) => t + 1);
  };

  // Render error card
  if (error) {
    return (
      <ErrorState
        title="Unable to load case studies"
        description="Something went wrong while loading the case study database. Please verify your connection or session."
        onRetry={handleRetry}
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
      className="space-y-8 pb-12 select-none"
    >
      {/* Header section */}
      <CaseStudyHeader onNewCaseStudyClick={handleNewCaseStudyClick} />

      {/* Case studies Stats total metrics */}
      <CaseStudyStats stats={stats} />

      {/* Filters toolbar */}
      <CaseStudyToolbar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusChange={handleStatusChange}
        sectorFilter={sectorFilter}
        onSectorChange={handleSectorChange}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
      />

      {/* Loader / Table list rows / empty states */}
      {isLoading ? (
        <LoadingState variant="table" columnsCount={6} rowsCount={3} />
      ) : processedCaseStudies.length > 0 ? (
        <div className="space-y-6">
          <CaseStudyList
            caseStudies={processedCaseStudies}
            onSelectCaseStudy={handleSelectCaseStudy}
          />

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 border-t border-white/5 font-sans text-[10px] select-none uppercase tracking-wider">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => handlePageChange(Math.max(page - 1, 1))}
                className="px-4 py-2 bg-transparent border border-white/10 text-white/80 hover:text-white hover:border-white/20 transition-all rounded-xs outline-none disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              >
                Previous
              </button>
              <span className="text-white/40">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                disabled={page === totalPages}
                onClick={() => handlePageChange(Math.min(page + 1, totalPages))}
                className="px-4 py-2 bg-transparent border border-white/10 text-white/80 hover:text-white hover:border-white/20 transition-all rounded-xs outline-none disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </div>
      ) : (
        <EmptyState
          title="No Case Studies Yet"
          description="Build your first hospitality case study."
          actionText="New Case Study"
          onAction={handleNewCaseStudyClick}
        />
      )}
    </motion.div>
  );
}
