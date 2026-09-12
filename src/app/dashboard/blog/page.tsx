"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { BlogHeader } from "@/components/dashboard/blog/BlogHeader";
import { BlogStats } from "@/components/dashboard/blog/BlogStats";
import { BlogToolbar } from "@/components/dashboard/blog/BlogToolbar";
import { BlogList } from "@/components/dashboard/blog/BlogList";
import { LoadingState } from "@/components/ui/LoadingState";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { BlogPost, BlogStatus } from "@/data/blog";
import { BackendBlog } from "@/types/blog";
import { getBlogsClient } from "@/lib/services/blogs-client";
import { useDebounce } from "@/hooks/useDebounce";

// Format helper utilities
const formatDateStr = (dateStr?: string | null) => {
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

interface SortedBlogPost extends BlogPost {
  rawUpdatedAt: string;
}

export default function BlogDashboardPage() {
  const router = useRouter();
  const prefersReduced = useReducedMotion();

  // Local state for blog articles
  const [articles, setArticles] = useState<SortedBlogPost[]>([]);
  const [stats, setStats] = useState<StatsState | null>(null);

  // Filter toolbar states
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12;

  // Reset page to 1 when filters change
  const [prevFilter, setPrevFilter] = useState({ search: debouncedSearch, status: statusFilter, category: categoryFilter });
  if (prevFilter.search !== debouncedSearch || prevFilter.status !== statusFilter || prevFilter.category !== categoryFilter) {
    setPrevFilter({ search: debouncedSearch, status: statusFilter, category: categoryFilter });
    setPage(1);
  }

  // API loading / error states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Trigger to force background updates
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Load blog articles when filter or debounced search dependencies change
  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await getBlogsClient({
          page,
          limit,
          status: statusFilter,
          category: categoryFilter,
          search: debouncedSearch,
        });

        if (!active) return;

        // Map backend fields to the props structure expected by UI components
        const mappedData: SortedBlogPost[] = response.data.map((blog: BackendBlog) => ({
          id: blog.id || blog._id?.toString() || "",
          title: blog.title,
          slug: blog.slug,
          excerpt: blog.excerpt || "",
          category: blog.category,
          author: blog.author?.name || "THE DCO Team",
          status: blog.status as BlogStatus,
          publishedAt: blog.publishedAt ? formatDateStr(blog.publishedAt) : null,
          updatedAt: formatDateStr(blog.updatedAt || blog.createdAt),
          content: "",
          featuredImage: blog.coverImage?.url || "",
          rawUpdatedAt: blog.updatedAt || blog.createdAt,
        }));

        setArticles(mappedData);
        setTotalPages(response.pagination.totalPages);
      } catch (err: unknown) {
        console.error("Failed to load blog posts:", err);
        if (active) {
          setError("Unable to load blog posts.");
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
  }, [page, statusFilter, categoryFilter, debouncedSearch, refreshTrigger]);

  // Load stats counts independently (only on mount & mutation refreshes)
  useEffect(() => {
    let active = true;

    const fetchStats = async () => {
      try {
        const [allRes, pubRes, draftRes] = await Promise.all([
          getBlogsClient({ limit: 1 }),
          getBlogsClient({ status: "published", limit: 1 }),
          getBlogsClient({ status: "draft", limit: 1 }),
        ]);

        if (!active) return;

        setStats({
          total: allRes.pagination.total,
          published: pubRes.pagination.total,
          drafts: draftRes.pagination.total,
        });
      } catch (err: unknown) {
        console.error("Failed to load blog stats:", err);
      }
    };

    fetchStats();

    return () => {
      active = false;
    };
  }, [refreshTrigger]);


  // Apply client-side sorting
  const processedArticles = useMemo(() => {
    const result = [...articles];

    result.sort((a, b) => {
      const dateA = Date.parse(a.rawUpdatedAt) || 0;
      const dateB = Date.parse(b.rawUpdatedAt) || 0;
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [articles, sortOrder]);

  const handleNewArticleClick = () => {
    router.push("/dashboard/blog/new");
  };

  const handleSelectArticle = (article: BlogPost) => {
    router.push(`/dashboard/blog/${article.id}/edit`);
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

  const handleCategoryChange = (val: string) => {
    setIsLoading(true);
    setError(null);
    setCategoryFilter(val);
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
        title="Unable to load blog posts"
        description="Something went wrong while loading the blog database. Please verify your internet connection or session."
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
      {/* CMS Page Header */}
      <BlogHeader onNewArticleClick={handleNewArticleClick} />

      {/* Blog Metrics stats panels */}
      <BlogStats stats={stats} />

      {/* Toolbar filters */}
      <BlogToolbar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusChange={handleStatusChange}
        categoryFilter={categoryFilter}
        onCategoryChange={handleCategoryChange}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
      />

      {/* Loader / Article List / Empty States */}
      {isLoading ? (
        <LoadingState variant="table" columnsCount={6} rowsCount={3} />
      ) : processedArticles.length > 0 ? (
        <div className="space-y-6">
          <BlogList
            articles={processedArticles}
            onSelectArticle={handleSelectArticle}
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
          title="No Articles Yet"
          description="Create your first THEDCO insight or hospitality article."
          actionText="New Article"
          onAction={handleNewArticleClick}
        />
      )}
    </motion.div>
  );
}
