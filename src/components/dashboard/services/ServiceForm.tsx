"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Trash2, Plus, X, Check, Loader2 } from "lucide-react";
import { Service } from "@/types/service";
import { cn } from "@/lib/utils";

interface ServiceFormProps {
  mode: "create" | "edit";
  initialService?: Service | null;
  /** Suggested display order for new services — derived from live API data by the parent */
  nextOrder?: number;
  onSave: (service: Service, status: "draft" | "active") => Promise<void> | void;
  onCancel?: () => void;
  onDelete?: () => void;
}

export function ServiceForm({ mode, initialService, nextOrder, onSave, onCancel, onDelete }: ServiceFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefersReduced = useReducedMotion();

  // URL redirect success toast state
  const [toast, setToast] = useState<{ message: string; type?: "success" | "error" } | null>(null);

  // Auto-dismiss toast timer
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  // Monitor query parameters for redirect feedback toasts
  useEffect(() => {
    const saved = searchParams.get("saved");
    const published = searchParams.get("published");
    if (saved) {
      setTimeout(() => setToast({ message: "✓ Draft saved" }), 0);
      router.replace(window.location.pathname);
    } else if (published) {
      setTimeout(() => setToast({ message: "✓ Service published successfully" }), 0);
      router.replace(window.location.pathname);
    }
  }, [searchParams, router]);

  // Next available display order for create mode — provided by parent from live API data
  const nextAvailableOrder = nextOrder ?? 1;

  // Form local state fields
  const [name, setName] = useState(initialService?.name || "");
  const [slug, setSlug] = useState(initialService?.slug || "");
  const [shortDescription, setShortDescription] = useState(initialService?.shortDescription || "");
  const [description, setDescription] = useState(initialService?.description || "");
  const [keyPoints, setKeyPoints] = useState<string[]>(initialService?.keyPoints || []);
  const [status, setStatus] = useState<string>(initialService?.status || "draft");
  const [category, setCategory] = useState(initialService?.category || "Operations");
  const [displayOrder, setDisplayOrder] = useState<number>(initialService?.displayOrder || nextAvailableOrder);
  const [featured, setFeatured] = useState<boolean>(initialService?.featured || false);
  const [heroLabel, setHeroLabel] = useState(initialService?.heroLabel || "");
  const [updatedAt] = useState(initialService?.updatedAt || "22 Aug 2026");

  // Errors state for inline validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Interaction states
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "publishing" | "saved" | "published">("idle");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUnsavedModalOpen, setIsUnsavedModalOpen] = useState(false);

  // Focus trap refs
  const deleteConfirmButtonRef = useRef<HTMLButtonElement>(null);
  const unsavedConfirmButtonRef = useRef<HTMLButtonElement>(null);

  // Auto-slug generation from name
  const handleNameChange = (val: string) => {
    setName(val);
    // Auto-update slug if it was empty or matches the previous auto-generated slug
    const generated = val
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
    
    const prevGenerated = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

    if (!slug || slug === prevGenerated) {
      setSlug(generated);
    }
  };

  // Determine dirtiness of form dynamically
  const isDirty = useMemo(() => {
    const origName = initialService?.name || "";
    const origSlug = initialService?.slug || "";
    const origShortDesc = initialService?.shortDescription || "";
    const origDesc = initialService?.description || "";
    const origCategory = initialService?.category || "Operations";
    const origOrder = initialService?.displayOrder ?? nextAvailableOrder;
    const origFeatured = initialService?.featured || false;
    const origHeroLabel = initialService?.heroLabel || "";
    const origKeyPoints = initialService?.keyPoints || [];

    return (
      name !== origName ||
      slug !== origSlug ||
      shortDescription !== origShortDesc ||
      description !== origDesc ||
      category !== origCategory ||
      displayOrder !== origOrder ||
      featured !== origFeatured ||
      heroLabel !== origHeroLabel ||
      JSON.stringify(keyPoints) !== JSON.stringify(origKeyPoints)
    );
  }, [name, slug, shortDescription, description, category, displayOrder, featured, heroLabel, keyPoints, initialService, nextAvailableOrder]);

  // Prevent accidental navigation leaving tab
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "You have unsaved changes.";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // Esc key closure for modal dialogues
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isDeleteModalOpen) setIsDeleteModalOpen(false);
        if (isUnsavedModalOpen) setIsUnsavedModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDeleteModalOpen, isUnsavedModalOpen]);

  // Key Points list adjustments
  const handleAddFeature = () => {
    setKeyPoints([...keyPoints, ""]);
  };

  const handleUpdateFeature = (index: number, val: string) => {
    const updated = [...keyPoints];
    updated[index] = val;
    setKeyPoints(updated);
  };

  const handleRemoveFeature = (index: number) => {
    setKeyPoints(keyPoints.filter((_, idx) => idx !== index));
  };

  // Perform save / publish validations
  const handleFormAction = async (targetStatus: "draft" | "active") => {
    if (saveStatus !== "idle") return;

    const newErrors: Record<string, string> = {};

    // Validate always necessary fields
    if (!name.trim()) {
      newErrors.name = "Service Name is required.";
    }

    // Publish mode strictly validates category, short and main description
    if (targetStatus === "active") {
      if (!category) {
        newErrors.category = "Category is required.";
      }
      if (!shortDescription.trim()) {
        newErrors.shortDescription = "Short Description is required.";
      }
      if (!description.trim()) {
        newErrors.description = "Full Description is required.";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clear previous errors
    setErrors({});
    setSaveStatus(targetStatus === "draft" ? "saving" : "publishing");

    try {
      const today = new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      });

      const servicePayload: Service = {
        id: initialService?.id || `srv-${Date.now()}`,
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-"),
        shortDescription,
        category,
        displayOrder: Number(displayOrder) || 1,
        status: targetStatus === "draft" ? "draft" : "active",
        featured,
        heroLabel,
        description,
        keyPoints: keyPoints.filter((pt) => pt.trim() !== ""),
        updatedAt: today,
      };

      // Call dynamic saving API callback
      await onSave(servicePayload, targetStatus);

      setSaveStatus(targetStatus === "draft" ? "saved" : "published");
      setTimeout(() => {
        setSaveStatus("idle");
      }, 2000);
    } catch (err: unknown) {
      console.error("Failed to commit service save action:", err);
      setSaveStatus("idle");
      const message = err instanceof Error ? err.message : "Unable to complete this action.";
      setToast({ message, type: "error" });
    }
  };

  // Safe cancel trigger
  const handleCancelClick = () => {
    if (isDirty) {
      setIsUnsavedModalOpen(true);
    } else if (onCancel) {
      onCancel();
    } else {
      router.push("/dashboard/services");
    }
  };

  // Confirm leave route
  const handleConfirmLeave = () => {
    setIsUnsavedModalOpen(false);
    if (onCancel) {
      onCancel();
    } else {
      router.push("/dashboard/services");
    }
  };

  // Motion animation presets
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
        duration: prefersReduced ? 0.05 : 0.45,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <div className="relative">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Breadcrumb section */}
        <motion.div variants={itemVariants} className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.25em] text-white/40 font-sans">
          <Link href="/dashboard" className="hover:text-white transition-colors duration-300">
            DASHBOARD
          </Link>
          <span>/</span>
          <Link href="/dashboard/services" className="hover:text-white transition-colors duration-300">
            SERVICES
          </Link>
          <span>/</span>
          <span className="text-primary font-semibold">{mode === "create" ? "NEW" : "EDIT"}</span>
        </motion.div>

        {/* Page Header section */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-6">
          <div className="space-y-1">
            <h2 className="text-2xl md:text-3xl font-serif text-white tracking-wide leading-tight">
              {mode === "create" ? "Create New Service" : (name || "Edit Service")}
            </h2>
            <p className="text-xs text-white/50 font-sans tracking-wide">
              {mode === "create"
                ? "Add a new hospitality advisory service and configure how it appears across the THEDCO website."
                : "Manage service information and public-facing content."}
            </p>
          </div>

          {/* Action triggers top right */}
          <div className="flex items-center gap-2 select-none">
            <button
              type="button"
              onClick={() => handleFormAction("draft")}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2.5 text-[10px] uppercase tracking-[0.2em] font-sans font-semibold border rounded-xs transition-all duration-300 outline-none cursor-pointer",
                saveStatus === "idle" && "bg-transparent text-white border-white/10 hover:border-white/30",
                saveStatus === "saving" && "bg-transparent text-white/40 border-white/5 cursor-not-allowed",
                saveStatus === "saved" && "bg-transparent text-primary border-primary",
                saveStatus === "publishing" && "hidden",
                saveStatus === "published" && "hidden"
              )}
            >
              {saveStatus === "saving" && <Loader2 size={12} className="animate-spin" />}
              {saveStatus === "saved" && <Check size={12} />}
              <span>
                {saveStatus === "idle" && "Save Draft"}
                {saveStatus === "saving" && "Saving..."}
                {saveStatus === "saved" && "Draft Saved"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleFormAction("active")}
              className={cn(
                "flex items-center gap-1.5 px-5 py-2.5 text-[10px] uppercase tracking-[0.2em] font-sans font-semibold border rounded-xs transition-all duration-300 outline-none cursor-pointer",
                saveStatus === "idle" && "bg-primary text-black border-transparent hover:bg-white hover:text-black",
                saveStatus === "publishing" && "bg-transparent text-white/40 border-white/10 cursor-not-allowed",
                saveStatus === "published" && "bg-transparent text-primary border-primary cursor-default",
                saveStatus === "saving" && "hidden",
                saveStatus === "saved" && "hidden"
              )}
            >
              {saveStatus === "publishing" && <Loader2 size={12} className="animate-spin" />}
              {saveStatus === "published" && <Check size={12} />}
              <span>
                {saveStatus === "idle" && "Publish Service"}
                {saveStatus === "publishing" && "Publishing..."}
                {saveStatus === "published" && "Published"}
              </span>
            </button>
          </div>
        </motion.div>

        {/* Responsive Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Main Form Area (Spans 2 columns) */}
          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
            
            {/* 01 — Service Content */}
            <div className="bg-[#050505] border border-white/5 p-6 space-y-5 rounded-xs">
              <div className="border-b border-white/5 pb-2">
                <h4 className="text-[10px] uppercase tracking-[0.2em] text-primary font-sans font-semibold">
                  01 — Service Details
                </h4>
              </div>

              {/* Service Name Input */}
              <div className="space-y-1.5">
                <label className="text-[9px] uppercase tracking-wider text-white/40 font-sans font-semibold block">
                  Service Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className={cn(
                    "w-full px-3 py-2.5 text-xs font-sans bg-black border rounded-xs text-white placeholder-white/20 outline-none transition-all duration-300",
                    errors.name ? "border-red-500/40 focus:border-red-500/60" : "border-white/5 focus:border-primary/30"
                  )}
                  placeholder="e.g. Hospitality Operations Advisory"
                />
                {errors.name && (
                  <span className="text-red-400 font-sans text-[10px] block pt-0.5">{errors.name}</span>
                )}
              </div>

              {/* Hero Label Input */}
              <div className="space-y-1.5">
                <label className="text-[9px] uppercase tracking-wider text-white/40 font-sans font-semibold block">
                  Hero Label
                </label>
                <input
                  type="text"
                  value={heroLabel}
                  onChange={(e) => setHeroLabel(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs font-sans bg-black border border-white/5 rounded-xs text-white placeholder-white/20 outline-none focus:border-primary/30 transition-all duration-300"
                  placeholder="OPERATIONS / STRATEGY"
                />
              </div>

              {/* Short Description Textarea */}
              <div className="space-y-1.5">
                <label className="text-[9px] uppercase tracking-wider text-white/40 font-sans font-semibold block">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className={cn(
                    "w-full px-3 py-2.5 text-xs font-sans bg-black border rounded-xs text-white placeholder-white/20 outline-none transition-all duration-300 resize-none",
                    errors.shortDescription ? "border-red-500/40 focus:border-red-500/60" : "border-white/5 focus:border-primary/30"
                  )}
                  placeholder="Briefly describe this service..."
                />
                {errors.shortDescription && (
                  <span className="text-red-400 font-sans text-[10px] block pt-0.5">{errors.shortDescription}</span>
                )}
              </div>

              {/* Full Description Textarea */}
              <div className="space-y-1.5">
                <label className="text-[9px] uppercase tracking-wider text-white/40 font-sans font-semibold block">
                  Full Description
                </label>
                <textarea
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={cn(
                    "w-full px-3 py-2.5 text-xs font-sans bg-black border rounded-xs text-white placeholder-white/20 outline-none transition-all duration-300 font-sans leading-relaxed",
                    errors.description ? "border-red-500/40 focus:border-red-500/60" : "border-white/5 focus:border-primary/30"
                  )}
                  placeholder="Describe the service, approach, scope and expected business outcomes..."
                />
                {errors.description && (
                  <span className="text-red-400 font-sans text-[10px] block pt-0.5">{errors.description}</span>
                )}
              </div>
            </div>

            {/* 02 — Features / Key Deliverables */}
            <div className="bg-[#050505] border border-white/5 p-6 space-y-4 rounded-xs">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <h4 className="text-[10px] uppercase tracking-[0.2em] text-primary font-sans font-semibold">
                  02 — Deliverables &amp; Features
                </h4>
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="flex items-center gap-1 text-[9px] uppercase tracking-widest text-primary hover:text-white transition-colors duration-300 cursor-pointer outline-none"
                >
                  <Plus size={10} />
                  <span>Add Feature</span>
                </button>
              </div>

              {keyPoints.length === 0 ? (
                <div className="py-6 text-center border border-dashed border-white/5 rounded-xs text-[10px] text-white/20 font-sans">
                  No features added yet.
                </div>
              ) : (
                <div className="space-y-2">
                  <AnimatePresence initial={false}>
                    {keyPoints.map((point, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, height: 0, y: prefersReduced ? 0 : -4 }}
                        animate={{ opacity: 1, height: "auto", y: 0 }}
                        exit={{ opacity: 0, height: 0, y: prefersReduced ? 0 : -4 }}
                        transition={{ duration: prefersReduced ? 0.05 : 0.25 }}
                        className="flex gap-2 items-center overflow-hidden"
                      >
                        <input
                          type="text"
                          value={point}
                          onChange={(e) => handleUpdateFeature(idx, e.target.value)}
                          placeholder="e.g. Operational Audit"
                          className="flex-1 px-3 py-2 text-xs font-sans bg-black border border-white/5 rounded-xs text-white placeholder-white/20 outline-none focus:border-primary/20 transition-all duration-300"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(idx)}
                          aria-label={`Remove feature ${idx + 1}`}
                          className="p-2 rounded-sm border border-white/5 bg-white/5 text-white/45 hover:text-red-400 hover:bg-white/10 transition-all duration-300 outline-none cursor-pointer"
                        >
                          <X size={12} />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

          </motion.div>

          {/* Settings Sidebar Area (Spans 1 column) */}
          <motion.div variants={itemVariants} className="space-y-6">
            
            {/* Settings Card */}
            <div className="bg-[#050505] border border-white/5 p-6 space-y-5 rounded-xs">
              <div className="border-b border-white/5 pb-2">
                <h4 className="text-[10px] uppercase tracking-[0.2em] text-primary font-sans font-semibold">
                  Settings
                </h4>
              </div>

              {/* Status Selector */}
              <div className="space-y-1.5">
                <label className="text-[9px] uppercase tracking-wider text-white/40 font-sans font-semibold block">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs font-sans bg-black border border-white/5 rounded-xs text-white/80 outline-none cursor-pointer focus:border-primary/30 transition-all duration-300"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="hidden">Archived</option>
                </select>
              </div>

              {/* Category Selector */}
              <div className="space-y-1.5">
                <label className="text-[9px] uppercase tracking-wider text-white/40 font-sans font-semibold block">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={cn(
                    "w-full px-3 py-2.5 text-xs font-sans bg-black border rounded-xs text-white/80 outline-none cursor-pointer transition-all duration-300",
                    errors.category ? "border-red-500/40 focus:border-red-500/60" : "border-white/5 focus:border-primary/30"
                  )}
                >
                  <option value="Operations">Operations</option>
                  <option value="Finance">Finance</option>
                  <option value="Restaurant Advisory">Restaurant Advisory</option>
                  <option value="Development">Development</option>
                  <option value="Brand & Marketing">Brand & Marketing</option>
                  <option value="People & Operations">People & Operations</option>
                  <option value="Business Strategy">Business Strategy</option>
                </select>
                {errors.category && (
                  <span className="text-red-400 font-sans text-[10px] block pt-0.5">{errors.category}</span>
                )}
              </div>

              {/* Display Order input */}
              <div className="space-y-1.5">
                <label className="text-[9px] uppercase tracking-wider text-white/40 font-sans font-semibold block">
                  Display Order
                </label>
                <input
                  type="number"
                  min={1}
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2.5 text-xs font-mono bg-black border border-white/5 rounded-xs text-white placeholder-white/20 outline-none focus:border-primary/30 transition-all duration-300"
                  placeholder="01"
                />
              </div>

              {/* Visibility Switch (Toggle) */}
              <div className="flex items-center justify-between bg-black border border-white/5 p-3 rounded-xs">
                <span className="text-[10px] uppercase tracking-wider text-white/60 font-sans font-semibold">
                  Show on Website
                </span>
                <button
                  type="button"
                  onClick={() => setFeatured(!featured)}
                  aria-label="Toggle service visibility on website"
                  className={cn(
                    "w-8 h-4 rounded-full transition-colors duration-300 relative outline-none focus-visible:ring-1 focus-visible:ring-primary/50 cursor-pointer",
                    featured ? "bg-primary" : "bg-white/10"
                  )}
                >
                  <span
                    className={cn(
                      "w-3.5 h-3.5 rounded-full bg-black absolute top-[1px] transition-transform duration-300",
                      featured ? "translate-x-[15px]" : "translate-x-[1px]"
                    )}
                  />
                </button>
              </div>
            </div>

            {/* Quick reference slug view */}
            <div className="bg-[#050505]/50 border border-white/5 p-4 rounded-xs text-[10px] font-sans text-white/40 space-y-1">
              <span className="block uppercase text-[8px] tracking-widest">Slug Preview</span>
              <span className="block font-mono text-white/60 truncate">
                {slug || name.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-") || "pending-slug"}
              </span>
            </div>

          </motion.div>

        </div>

        {/* Bottom Action Footer Bar */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#050505] border border-white/5 p-4 rounded-xs select-none"
        >
          {/* Metadata timestamp */}
          <span className="text-[10px] text-white/40 font-sans tracking-wide">
            {mode === "create" ? "New Service Record Draft" : `Last updated ${updatedAt}`}
          </span>

          {/* Operations controls */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <div>
              {mode === "edit" && onDelete && (
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2.5 text-[9px] uppercase tracking-widest font-sans font-semibold border border-red-500/10 text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all duration-300 rounded-xs outline-none cursor-pointer"
                >
                  <Trash2 size={12} />
                  <span>Delete Service</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCancelClick}
                className="px-4 py-2.5 text-[9px] uppercase tracking-widest font-sans font-semibold border border-transparent text-white/40 hover:text-white transition-colors duration-300 rounded-xs outline-none cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => handleFormAction("draft")}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2.5 text-[9px] uppercase tracking-widest font-sans font-semibold border rounded-xs transition-all duration-300 outline-none cursor-pointer",
                  saveStatus === "idle" && "bg-transparent text-white border-white/10 hover:border-white/30",
                  saveStatus === "saving" && "bg-transparent text-white/40 border-white/5 cursor-not-allowed",
                  saveStatus === "saved" && "bg-transparent text-primary border-primary cursor-default",
                  saveStatus === "publishing" && "hidden",
                  saveStatus === "published" && "hidden"
                )}
              >
                {saveStatus === "saving" && <Loader2 size={10} className="animate-spin" />}
                {saveStatus === "saved" && <Check size={10} />}
                <span>
                  {saveStatus === "idle" && "Save Draft"}
                  {saveStatus === "saving" && "Saving..."}
                  {saveStatus === "saved" && "Draft Saved"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleFormAction("active")}
                className={cn(
                  "flex items-center gap-1.5 px-5 py-2.5 text-[9px] uppercase tracking-widest font-sans font-semibold border rounded-xs transition-all duration-300 outline-none cursor-pointer",
                  saveStatus === "idle" && "bg-primary text-black border-transparent hover:bg-white hover:text-black",
                  saveStatus === "publishing" && "bg-transparent text-white/40 border-white/10 cursor-not-allowed",
                  saveStatus === "published" && "bg-transparent text-primary border-primary cursor-default",
                  saveStatus === "saving" && "hidden",
                  saveStatus === "saved" && "hidden"
                )}
              >
                {saveStatus === "publishing" && <Loader2 size={10} className="animate-spin" />}
                {saveStatus === "published" && <Check size={10} />}
                <span>
                  {saveStatus === "idle" && (mode === "create" ? "Publish Service" : "Publish Changes")}
                  {saveStatus === "publishing" && "Publishing..."}
                  {saveStatus === "published" && "Published"}
                </span>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Delete Confirmation Modal Overlay */}
      {mode === "edit" && onDelete && (
        <AnimatePresence>
          {isDeleteModalOpen && (
            <div className="fixed inset-0 z-55 flex items-center justify-center p-4" role="none">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsDeleteModalOpen(false)}
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
                className="relative w-full max-w-md bg-[#050505] border border-white/10 shadow-2xl p-6 rounded-xs space-y-6 focus:outline-none"
              >
                <div className="space-y-2">
                  <h4 id="deleteModalTitle" className="text-sm font-serif font-medium tracking-wider text-white">
                    Delete Advisory Service
                  </h4>
                  <p id="deleteModalDescription" className="text-xs text-white/40 font-sans leading-relaxed">
                    Are you sure you want to delete this service record? This operational advisory item will be permanently removed. This action cannot be undone.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-3 select-none">
                  <button
                    type="button"
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="px-4 py-2.5 text-[9px] uppercase tracking-widest font-sans font-semibold border border-transparent text-white/40 hover:text-white transition-colors duration-300 rounded-xs outline-none cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    ref={deleteConfirmButtonRef}
                    type="button"
                    onClick={() => {
                      setIsDeleteModalOpen(false);
                      onDelete();
                    }}
                    className="px-5 py-2.5 text-[9px] uppercase tracking-widest font-sans font-semibold bg-red-600 text-white hover:bg-red-500 transition-colors duration-300 rounded-xs outline-none cursor-pointer"
                  >
                    Confirm Delete
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      )}

      {/* Unsaved Changes Confirmation Modal Overlay */}
      <AnimatePresence>
        {isUnsavedModalOpen && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4" role="none">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsUnsavedModalOpen(false)}
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
              aria-labelledby="unsavedModalTitle"
              aria-describedby="unsavedModalDescription"
              className="relative w-full max-w-md bg-[#050505] border border-white/10 shadow-2xl p-6 rounded-xs space-y-6 focus:outline-none"
            >
              <div className="space-y-2">
                <h4 id="unsavedModalTitle" className="text-sm font-serif font-medium tracking-wider text-white">
                  Unsaved Changes
                </h4>
                <p id="unsavedModalDescription" className="text-xs text-white/40 font-sans leading-relaxed">
                  You have modified this hospitality service form and have unsaved configurations. Leaving will discard all changes.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 select-none">
                <button
                  type="button"
                  onClick={() => setIsUnsavedModalOpen(false)}
                  className="px-4 py-2.5 text-[9px] uppercase tracking-widest font-sans font-semibold border border-transparent text-white/40 hover:text-white transition-colors duration-300 rounded-xs outline-none cursor-pointer"
                >
                  Continue Editing
                </button>
                <button
                  ref={unsavedConfirmButtonRef}
                  type="button"
                  onClick={handleConfirmLeave}
                  className="px-5 py-2.5 text-[9px] uppercase tracking-widest font-sans font-semibold bg-primary text-black hover:bg-white hover:text-black transition-colors duration-300 rounded-xs outline-none cursor-pointer"
                >
                  Leave
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
                  ? "bg-red-955/95 border-red-900/50"
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
    </div>
  );
}
