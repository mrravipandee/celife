"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ServiceHeader } from "./ServiceHeader";
import { ServiceStats } from "./ServiceStats";
import { ServiceToolbar } from "./ServiceToolbar";
import { ServiceList } from "./ServiceList";
import { LoadingState } from "@/components/ui/LoadingState";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Service } from "@/types/service";
import { getServices, createService, deleteService, updateService } from "@/lib/services/services";

export function ServicesDashboardClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefersReduced = useReducedMotion();

  // Local state for services loaded from the MongoDB backend
  const [services, setServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("order");

  // Loading and Error API states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Deletion modal target
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);

  // Toast feedback state
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Esc key listener ref for delete dialog focus trap
  const deleteConfirmBtnRef = useRef<HTMLButtonElement>(null);

  // Trigger toast banner helper
  const triggerToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
  };

  // Toast auto-dismiss timeout handler
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  // Retrieve services from MongoDB database
  const loadServices = async (showSkeleton = false) => {
    if (showSkeleton) {
      setIsLoading(true);
      setError(null);
    }
    try {
      const data = await getServices();
      setServices(data);
    } catch (err: unknown) {
      console.error("Failed to load services:", err);
      const msg = err instanceof Error ? err.message : "Unable to load services.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Load services on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      loadServices(false);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Monitor URL search parameter redirects for triggering toast banners
  useEffect(() => {
    const deleted = searchParams.get("deleted");
    const saved = searchParams.get("saved");
    const published = searchParams.get("published");

    if (deleted) {
      setTimeout(() => triggerToast("✓ Service deleted"), 0);
      router.replace("/dashboard/services");
    } else if (saved) {
      setTimeout(() => triggerToast("✓ Changes saved"), 0);
      router.replace("/dashboard/services");
    } else if (published) {
      setTimeout(() => triggerToast("✓ Service published successfully"), 0);
      router.replace("/dashboard/services");
    }
  }, [searchParams, router]);

  // Close delete dialog on Escape key press
  useEffect(() => {
    if (!serviceToDelete) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setServiceToDelete(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    if (deleteConfirmBtnRef.current) {
      deleteConfirmBtnRef.current.focus();
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [serviceToDelete]);

  // Check if any filter is currently active
  const isFilterActive = useMemo(() => {
    return (
      searchTerm.trim() !== "" ||
      statusFilter !== "all" ||
      categoryFilter !== "all" ||
      sortOrder !== "order"
    );
  }, [searchTerm, statusFilter, categoryFilter, sortOrder]);

  // Clear all filters handler
  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setCategoryFilter("all");
    setSortOrder("order");
  };

  // Open editor for creating a new service
  const handleNewServiceClick = () => {
    router.push("/dashboard/services/new");
  };

  // Open editor for modifying an existing service
  const handleSelectService = (service: Service) => {
    router.push(`/dashboard/services/${service.id}`);
  };

  // Duplicate service handler
  const handleDuplicateService = async (srv: Service) => {
    setIsLoading(true);
    try {
      const nextOrder = Math.max(...services.map((s) => s.displayOrder), 0) + 1;
      const duplicatedPayload: Partial<Service> = {
        name: `${srv.name} — Copy`,
        slug: `${srv.slug}-copy`,
        shortDescription: srv.shortDescription,
        category: srv.category,
        displayOrder: nextOrder,
        status: "draft",
        featured: false,
        heroLabel: srv.heroLabel,
        description: srv.description,
        keyPoints: srv.keyPoints || [],
      };
      await createService(duplicatedPayload);
      await loadServices();
      triggerToast("✓ Service duplicated");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unable to duplicate service.";
      triggerToast(message, "error");
      setIsLoading(false);
    }
  };

  // Request deletion confirmation
  const handleDeleteRequest = (srv: Service) => {
    setServiceToDelete(srv);
  };

  // Confirm delete handler
  const handleConfirmDelete = async () => {
    if (!serviceToDelete) return;
    setIsLoading(true);
    const targetId = serviceToDelete.id;
    setServiceToDelete(null);
    try {
      await deleteService(targetId);
      await loadServices();
      triggerToast("✓ Service deleted");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unable to delete service.";
      triggerToast(message, "error");
      setIsLoading(false);
    }
  };

  // Reorder list handler (Sequentially swaps and re-numbers displayOrder values)
  const handleReorderService = async (id: string, direction: "up" | "down") => {
    const sorted = [...services].sort((a, b) => a.displayOrder - b.displayOrder);
    const index = sorted.findIndex((s) => s.id === id);
    if (index === -1) return;

    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === sorted.length - 1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const currentItem = sorted[index];
    const targetItem = sorted[targetIndex];

    // Optimistic UI updates
    const prevServices = [...services];
    const swapped = [...services].map((s) => {
      if (s.id === currentItem.id) {
        return { ...s, displayOrder: targetItem.displayOrder };
      }
      if (s.id === targetItem.id) {
        return { ...s, displayOrder: currentItem.displayOrder };
      }
      return s;
    });
    setServices(swapped);

    try {
      // Swapping updates in MongoDB
      await Promise.all([
        updateService(currentItem.id, { displayOrder: targetItem.displayOrder }),
        updateService(targetItem.id, { displayOrder: currentItem.displayOrder }),
      ]);
      triggerToast("✓ Service reordered");
      // Load fresh sequential ordering from database
      const data = await getServices();
      setServices(data);
    } catch (err: unknown) {
      console.error("Failed to reorder service:", err);
      // Rollback on failure
      setServices(prevServices);
      triggerToast("Unable to complete this action.", "error");
    }
  };

  // Combined filters, search and sort matching
  const filteredServices = useMemo(() => {
    let result = [...services];

    // 1. Search term match
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (srv) =>
          srv.name.toLowerCase().includes(term) ||
          srv.shortDescription.toLowerCase().includes(term) ||
          srv.description.toLowerCase().includes(term) ||
          srv.category.toLowerCase().includes(term) ||
          srv.heroLabel.toLowerCase().includes(term) ||
          srv.keyPoints.some((pt) => pt.toLowerCase().includes(term))
      );
    }

    // 2. Status filter match
    if (statusFilter !== "all") {
      result = result.filter((srv) => srv.status === statusFilter);
    }

    // 3. Category filter match
    if (categoryFilter !== "all") {
      result = result.filter((srv) => srv.category.toLowerCase() === categoryFilter.toLowerCase());
    }

    // 4. Sort selection evaluation
    result.sort((a, b) => {
      if (sortOrder === "order") {
        return a.displayOrder - b.displayOrder;
      } else if (sortOrder === "newest") {
        const dateA = Date.parse(a.updatedAt) || 0;
        const dateB = Date.parse(b.updatedAt) || 0;
        return dateB - dateA;
      } else if (sortOrder === "oldest") {
        const dateA = Date.parse(a.updatedAt) || 0;
        const dateB = Date.parse(b.updatedAt) || 0;
        return dateA - dateB;
      } else if (sortOrder === "a-z") {
        return a.name.localeCompare(b.name);
      } else if (sortOrder === "z-a") {
        return b.name.localeCompare(a.name);
      }
      return 0;
    });

    return result;
  }, [services, searchTerm, statusFilter, categoryFilter, sortOrder]);

  // Statistics calculation for Stats boxes
  const activeCount = useMemo(() => services.filter((s) => s.status === "active").length, [services]);
  const draftCount = useMemo(() => services.filter((s) => s.status === "draft").length, [services]);

  // Render error message block

  if (error) {
    return (
      <ErrorState
        title="Unable to load services"
        description={
          error.includes("401") || error.includes("403")
            ? "You don't have permission to perform this action. Please sign in."
            : "A database error or connection issue occurred while retrieving services."
        }
        onRetry={() => loadServices(true)}
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
      {/* Header section */}
      <ServiceHeader onNewServiceClick={handleNewServiceClick} />

      {/* Services Stats boxes */}
      <ServiceStats activeCount={activeCount} draftCount={draftCount} totalCount={services.length} />

      {/* Toolbar filters */}
      <ServiceToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
        isFilterActive={isFilterActive}
        onClearFilters={handleClearFilters}
      />

      {/* Loader/Grid display */}
      {isLoading ? (
        <LoadingState variant="table" columnsCount={6} rowsCount={3} />
      ) : filteredServices.length > 0 ? (
        <ServiceList
          services={filteredServices}
          onSelectService={handleSelectService}
          onDuplicateService={handleDuplicateService}
          onDeleteService={handleDeleteRequest}
          onReorderService={handleReorderService}
        />
      ) : (
        <EmptyState
          title={isFilterActive ? "No Services Found" : "No Services Yet"}
          description={
            isFilterActive
              ? "Try adjusting your search or filters."
              : "Add your first THEDCO advisory service."
          }
          actionText={isFilterActive ? "Clear Filters" : "New Service"}
          onAction={isFilterActive ? handleClearFilters : handleNewServiceClick}
        />
      )}

      {/* Action Dialog: Delete Service Confirmation Modal */}
      <AnimatePresence>
        {serviceToDelete && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4" role="none">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setServiceToDelete(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-xs cursor-pointer"
              aria-hidden="true"
            />

            <motion.div
              initial={{ opacity: 0, scale: prefersReduced ? 1 : 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: prefersReduced ? 1 : 0.95 }}
              transition={{ duration: prefersReduced ? 0.05 : 0.3, ease: [0.16, 1, 0.3, 1] }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="deleteModalTitle"
              aria-describedby="deleteModalDescription"
              className="relative w-full max-w-sm bg-[#050505] border border-white/10 shadow-2xl p-6 rounded-xs space-y-6 focus:outline-none"
            >
              <div className="space-y-2">
                <h4 id="deleteModalTitle" className="text-sm font-serif font-medium tracking-wider text-white">
                  Delete Service?
                </h4>
                <p id="deleteModalDescription" className="text-xs text-white/40 font-sans leading-relaxed">
                  Are you sure you want to delete <span className="text-white/70">&quot;{serviceToDelete.name}&quot;</span>? This action cannot be undone.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 select-none">
                <button
                  type="button"
                  onClick={() => setServiceToDelete(null)}
                  className="px-4 py-2.5 text-[9px] uppercase tracking-widest font-sans font-semibold border border-transparent text-white/40 hover:text-white transition-colors duration-300 rounded-xs outline-none cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  ref={deleteConfirmBtnRef}
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-5 py-2.5 text-[9px] uppercase tracking-widest font-sans font-semibold bg-red-600 text-white hover:bg-red-500 transition-colors duration-300 rounded-xs outline-none cursor-pointer"
                >
                  Delete Service
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Action Toast Banner */}
      <AnimatePresence>
        {toast && (
          <div className="fixed bottom-6 right-6 z-50">
            <motion.div
              initial={{ opacity: 0, y: prefersReduced ? 0 : 20, scale: prefersReduced ? 1 : 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: prefersReduced ? 0 : 20, scale: prefersReduced ? 1 : 0.95 }}
              transition={{ duration: prefersReduced ? 0.05 : 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={`flex items-center gap-2.5 border shadow-2xl px-5 py-3 rounded-xs text-[10px] uppercase tracking-widest font-sans font-semibold text-white/95 select-none ${
                toast.type === "error"
                  ? "bg-red-950/90 border-red-900/50"
                  : "bg-[#0A0A0A] border-white/10"
              }`}
            >
              {toast.type === "error" ? (
                <span className="text-red-500 font-bold">✕</span>
              ) : (
                <span className="text-[#C9A24A] font-bold">✓</span>
              )}
              <span>{toast.message}</span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
