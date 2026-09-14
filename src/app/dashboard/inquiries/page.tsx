"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useRouter } from "next/navigation";
import { InquiryHeader } from "@/components/dashboard/inquiries/InquiryHeader";
import { InquiryStats } from "@/components/dashboard/inquiries/InquiryStats";
import { InquiryToolbar } from "@/components/dashboard/inquiries/InquiryToolbar";
import { InquiryTable } from "@/components/dashboard/inquiries/InquiryTable";
import { InquiryDrawer } from "@/components/dashboard/inquiries/InquiryDrawer";
import { LoadingState } from "@/components/ui/LoadingState";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Inquiry, EnquiryStatus, ProjectType } from "@/types/enquiry";
import { getEnquiriesClient, updateEnquiryStatusClient, deleteEnquiryClient } from "@/lib/services/enquiries-client";
import { useDebounce } from "@/hooks/useDebounce";

// Format helper utilities
const formatDateStr = (dateStr?: string) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTimeStr = (dateStr?: string) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

interface StatsState {
  total: number;
  new: number;
  inProgress: number;
  closed: number;
}

interface BackendInquiry {
  id?: string;
  _id?: { toString(): string };
  name: string;
  email: string;
  phone: string;
  product?: string;
  company?: string;
  projectType: string;
  message: string;
  status: EnquiryStatus;
  createdAt: string;
  updatedAt: string;
}

export default function InquiriesDashboardPage() {
  const router = useRouter();
  const prefersReduced = useReducedMotion();


  // Local state for api records
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [stats, setStats] = useState<StatsState | null>(null);

  // Filter toolbar states
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12;

  // Reset page to 1 when filters change
  const [prevFilter, setPrevFilter] = useState({ search: debouncedSearch, status: statusFilter });
  if (prevFilter.search !== debouncedSearch || prevFilter.status !== statusFilter) {
    setPrevFilter({ search: debouncedSearch, status: statusFilter });
    setPage(1);
  }

  // API loading / error states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Trigger to force background refreshes
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Selected drawer inquiry details
  const [selectedInquiryId, setSelectedInquiryId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Load inquiries list when page, filter, or debounced search changes
  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await getEnquiriesClient({
          page,
          limit,
          status: statusFilter,
          search: debouncedSearch,
        });

        if (!active) return;

        // Map backend fields to the props structure expected by UI components
        const mappedData: Inquiry[] = response.data.map((inq: BackendInquiry) => ({
          id: inq.id || inq._id?.toString() || "",
          name: inq.name,
          email: inq.email,
          phone: inq.phone,
          product: inq.product,
          company: inq.company || "—",
          projectType: inq.projectType as ProjectType,
          type: inq.projectType || "—",
          message: inq.message,
          status: inq.status,
          date: formatDateStr(inq.createdAt),
          time: formatTimeStr(inq.createdAt),
          createdAt: inq.createdAt,
          updatedAt: inq.updatedAt,
        }));

        setInquiries(mappedData);
        setTotalPages(response.pagination.totalPages);
      } catch (err: unknown) {
        console.error("Failed to load inquiries:", err);
        if (active) {
          setError("Unable to load inquiries.");
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
  }, [page, statusFilter, debouncedSearch, refreshTrigger]);

  // Load stats counts independently (only on mount & mutation refreshes)
  useEffect(() => {
    let active = true;

    const fetchStats = async () => {
      try {
        const [allRes, newRes, progressRes, closedRes] = await Promise.all([
          getEnquiriesClient({ limit: 1 }),
          getEnquiriesClient({ status: "new", limit: 1 }),
          getEnquiriesClient({ status: "in-progress", limit: 1 }),
          getEnquiriesClient({ status: "closed", limit: 1 }),
        ]);

        if (!active) return;

        setStats({
          total: allRes.pagination.total,
          new: newRes.pagination.total,
          inProgress: progressRes.pagination.total,
          closed: closedRes.pagination.total,
        });
      } catch (err: unknown) {
        console.error("Failed to load inquiry stats:", err);
      }
    };

    fetchStats();

    return () => {
      active = false;
    };
  }, [refreshTrigger]);


  // Handle live status mutations
  const handleStatusUpdate = async (id: string, newStatus: EnquiryStatus) => {
    try {
      await updateEnquiryStatusClient(id, newStatus);
      
      // Update local state item immediately for rapid visual feedback
      setInquiries((prev) =>
        prev.map((inq) => (inq.id === id ? { ...inq, status: newStatus } : inq))
      );
      
      // Refresh stats in background
      setRefreshTrigger((t) => t + 1);
    } catch (err) {
      console.error("Failed to update inquiry status:", err);
      alert("Failed to update status. Please try again.");
    }
  };

  // Handle live inquiry deletion
  const handleDeleteInquiry = async (id: string) => {
    try {
      await deleteEnquiryClient(id);
      setInquiries((prev) => prev.filter((inq) => inq.id !== id));
      setRefreshTrigger((t) => t + 1);
    } catch (err) {
      console.error("Failed to delete inquiry:", err);
      alert("Failed to delete inquiry. Please try again.");
      throw err;
    }
  };

  // Drawer select handler
  const handleSelectInquiry = (inquiry: Inquiry) => {
    setSelectedInquiryId(inquiry.id);
    setIsDrawerOpen(true);
  };

  // Currently selected inquiry details from state
  const selectedInquiry = useMemo(() => {
    return inquiries.find((inq) => inq.id === selectedInquiryId) || null;
  }, [inquiries, selectedInquiryId]);

  // Apply client-side sorting and secondary date filters on fetched dataset
  const processedInquiries = useMemo(() => {
    let result = [...inquiries];

    // Client-side Date filter (if selected)
    if (dateFilter !== "all") {
      const now = new Date();
      result = result.filter((inq) => {
        const createdDate = new Date(inq.createdAt);
        const diffTime = Math.abs(now.getTime() - createdDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (dateFilter === "today") {
          return createdDate.toDateString() === now.toDateString();
        }
        if (dateFilter === "7days") {
          return diffDays <= 7;
        }
        if (dateFilter === "30days") {
          return diffDays <= 30;
        }
        return true;
      });
    }

    // Client-side Sort order
    result.sort((a, b) => {
      const dateA = Date.parse(a.createdAt) || 0;
      const dateB = Date.parse(b.createdAt) || 0;
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [inquiries, dateFilter, sortOrder]);

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
    const isAuthError = error.includes("401") || error.includes("Unauthorized") || error.includes("unauthenticated");
    return (
      <ErrorState
        title={isAuthError ? "Authentication Required" : "Unable to load inquiries"}
        description={
          isAuthError
            ? "Your operator session has expired or is unauthorized. Please sign in to access consultation inquiries."
            : "Could not retrieve consultation requests from database. Please check connection and retry."
        }
        onRetry={isAuthError ? () => router.push("/login") : handleRetry}
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
      {/* Page Header */}
      <InquiryHeader />

      {/* Metrics strip */}
      <InquiryStats stats={stats} />

      {/* Filter toolbar */}
      <InquiryToolbar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusChange={handleStatusChange}
        dateFilter={dateFilter}
        onDateChange={setDateFilter}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
      />

      {/* Loader / Table / Empty States */}
      {isLoading ? (
        <LoadingState variant="table" columnsCount={6} rowsCount={3} />
      ) : processedInquiries.length > 0 ? (
        <div className="space-y-6">
          <InquiryTable
            inquiries={processedInquiries}
            onSelectInquiry={handleSelectInquiry}
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
          title="No Inquiries Found"
          description="New consultation requests or search matches will appear here."
        />
      )}

      {/* Details drawer panel */}
      <InquiryDrawer
        inquiry={selectedInquiry}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onStatusUpdate={handleStatusUpdate}
        onDelete={handleDeleteInquiry}
      />
    </motion.div>
  );
}

