"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, Image as ImageIcon, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import {
  BackendCaseStudy,
  PROPERTY_TYPES,
  CASE_STUDY_PROJECT_TYPES,
  CASE_STUDY_SERVICES,
  PropertyType,
  CaseStudyProjectType,
  CaseStudyStatus,
  ICaseStudyResult,
  CaseStudyService,
} from "@/types/case-study";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface CaseStudyFormProps {
  mode: "create" | "edit";
  initialCaseStudy?: BackendCaseStudy;
  onSave: (data: Partial<BackendCaseStudy>) => Promise<void>;
  onCancel: () => void;
}

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function CaseStudyForm({ mode, initialCaseStudy, onSave, onCancel }: CaseStudyFormProps) {
  const prefersReduced = useReducedMotion();

  // Left Column Fields
  const [title, setTitle] = useState(initialCaseStudy?.title || "");
  const [slug, setSlug] = useState(initialCaseStudy?.slug || "");
  const [clientName, setClientName] = useState(initialCaseStudy?.client?.name || "");
  const [clientIndustry, setClientIndustry] = useState(initialCaseStudy?.client?.industry || "");
  const [location, setLocation] = useState(initialCaseStudy?.location || "");
  const [overview, setOverview] = useState(initialCaseStudy?.overview || "");
  const [challenge, setChallenge] = useState(initialCaseStudy?.challenge || "");
  const [solution, setSolution] = useState(initialCaseStudy?.solution || "");

  // Cover Image
  const [coverImageUrl, setCoverImageUrl] = useState(initialCaseStudy?.coverImage?.url || "");
  const [coverImageAlt, setCoverImageAlt] = useState(initialCaseStudy?.coverImage?.alt || "");

  // Interactive Results Metrics List
  const [results, setResults] = useState<ICaseStudyResult[]>(
    initialCaseStudy?.results || []
  );
  const [newMetric, setNewMetric] = useState("");
  const [newValue, setNewValue] = useState("");
  const [newDesc, setNewDesc] = useState("");

  // Services Checklist Multi-select
  const [selectedServices, setSelectedServices] = useState<CaseStudyService[]>(
    (initialCaseStudy?.services as CaseStudyService[]) || []
  );

  // Right Column Sidebar Settings
  const [propertyType, setPropertyType] = useState<PropertyType>(
    initialCaseStudy?.propertyType || "Hotel"
  );
  const [projectType, setProjectType] = useState<CaseStudyProjectType>(
    initialCaseStudy?.projectType || "Concept Development"
  );

  // SEO Settings
  const [metaTitle, setMetaTitle] = useState(initialCaseStudy?.seo?.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(initialCaseStudy?.seo?.metaDescription || "");

  // Auto-slug tracking state
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

  // Form handling state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [toast, setToast] = useState<{ message: string; type?: "success" | "error" } | null>(null);

  // Toast automatic dismiss
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  // Dirty state tracking for leaving warning
  const isDirty = useMemo(() => {
    return (
      title !== (initialCaseStudy?.title || "") ||
      slug !== (initialCaseStudy?.slug || "") ||
      clientName !== (initialCaseStudy?.client?.name || "") ||
      clientIndustry !== (initialCaseStudy?.client?.industry || "") ||
      location !== (initialCaseStudy?.location || "") ||
      overview !== (initialCaseStudy?.overview || "") ||
      challenge !== (initialCaseStudy?.challenge || "") ||
      solution !== (initialCaseStudy?.solution || "") ||
      coverImageUrl !== (initialCaseStudy?.coverImage?.url || "") ||
      coverImageAlt !== (initialCaseStudy?.coverImage?.alt || "") ||
      JSON.stringify(results) !== JSON.stringify(initialCaseStudy?.results || []) ||
      JSON.stringify(selectedServices) !== JSON.stringify(initialCaseStudy?.services || []) ||
      propertyType !== (initialCaseStudy?.propertyType || "Hotel") ||
      projectType !== (initialCaseStudy?.projectType || "Concept Development") ||
      metaTitle !== (initialCaseStudy?.seo?.metaTitle || "") ||
      metaDescription !== (initialCaseStudy?.seo?.metaDescription || "")
    );
  }, [
    title,
    slug,
    clientName,
    clientIndustry,
    location,
    overview,
    challenge,
    solution,
    coverImageUrl,
    coverImageAlt,
    results,
    selectedServices,
    propertyType,
    projectType,
    metaTitle,
    metaDescription,
    initialCaseStudy,
  ]);

  // Warn on page unload/navigation if dirty
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

  // Generate slug dynamically from title unless manually edited
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isSlugManuallyEdited) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      setSlug(generated);
    }
  };

  const handleSlugChange = (val: string) => {
    setSlug(val);
    setIsSlugManuallyEdited(true);
  };

  // Add a result metric
  const handleAddResultMetric = () => {
    if (!newMetric.trim() || !newValue.trim()) {
      setErrors({ ...errors, results: "Metric label and value are required." });
      return;
    }
    const updated: ICaseStudyResult = {
      metric: newMetric.trim(),
      value: newValue.trim(),
      description: newDesc.trim() || undefined,
    };
    setResults([...results, updated]);
    setNewMetric("");
    setNewValue("");
    setNewDesc("");
    setErrors({ ...errors, results: "" });
  };

  // Remove a result metric
  const handleRemoveResultMetric = (index: number) => {
    setResults(results.filter((_, idx) => idx !== index));
  };

  // Toggle selected services
  const handleToggleService = (service: CaseStudyService) => {
    if (selectedServices.includes(service)) {
      setSelectedServices(selectedServices.filter((s) => s !== service));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  // Perform form submission
  const handleSubmit = async (targetStatus: CaseStudyStatus) => {
    if (saveStatus === "saving") return;

    // Client-side validations
    const newErrors: Record<string, string> = {};
    if (!title.trim() || title.length < 5 || title.length > 200) {
      newErrors.title = "Title is required and must be between 5 and 200 characters.";
    }
    if (!slug.trim() || slug.length > 220 || !slugRegex.test(slug)) {
      newErrors.slug = "Slug must be URL-safe (lowercase letters, numbers, and hyphens only, no spaces).";
    }
    if (!clientName.trim() || clientName.length > 150) {
      newErrors.clientName = "Client name is required and cannot exceed 150 characters.";
    }
    if (clientIndustry.trim() && clientIndustry.length > 100) {
      newErrors.clientIndustry = "Client industry description cannot exceed 100 characters.";
    }
    if (!location.trim() || location.length > 150) {
      newErrors.location = "Location is required and cannot exceed 150 characters.";
    }
    if (!overview.trim() || overview.length < 50 || overview.length > 5000) {
      newErrors.overview = "Overview is required and must be between 50 and 5000 characters.";
    }
    if (!challenge.trim() || challenge.length < 30 || challenge.length > 5000) {
      newErrors.challenge = "Challenge is required and must be between 30 and 5000 characters.";
    }
    if (!solution.trim() || solution.length < 30 || solution.length > 10000) {
      newErrors.solution = "Solution description is required and must be between 30 and 10,000 characters.";
    }
    if (selectedServices.length === 0) {
      newErrors.services = "Please select at least 1 service provided.";
    }
    if (!coverImageUrl.trim() || !coverImageUrl.startsWith("/")) {
      if (!coverImageUrl.startsWith("http://") && !coverImageUrl.startsWith("https://")) {
        newErrors.coverImage = "Cover image must be a valid URL path (e.g. /images/case-studies/img.jpg or external url).";
      }
    }
    if (!coverImageAlt.trim()) {
      newErrors.coverImageAlt = "Alt text is required for the cover image.";
    }
    if (metaTitle.trim() && metaTitle.length > 60) {
      newErrors.metaTitle = "Meta title cannot exceed 60 characters.";
    }
    if (metaDescription.trim() && metaDescription.length > 160) {
      newErrors.metaDescription = "Meta description cannot exceed 160 characters.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setToast({ message: "Please correct the form errors.", type: "error" });
      return;
    }

    setErrors({});
    setSaveStatus("saving");

    try {
      const payload: Partial<BackendCaseStudy> = {
        title: title.trim(),
        slug: slug.trim(),
        client: {
          name: clientName.trim(),
          industry: clientIndustry.trim() || undefined,
        },
        location: location.trim(),
        propertyType,
        projectType,
        overview: overview.trim(),
        challenge: challenge.trim(),
        solution: solution.trim(),
        results,
        services: selectedServices,
        coverImage: {
          url: coverImageUrl.trim(),
          alt: coverImageAlt.trim(),
        },
        status: mode === "create" ? targetStatus : (initialCaseStudy?.status || targetStatus),
        seo: {
          metaTitle: metaTitle.trim() || undefined,
          metaDescription: metaDescription.trim() || undefined,
        },
      };

      await onSave(payload);
      setSaveStatus("success");
      setToast({ message: mode === "create" ? "✓ Case study created successfully" : "✓ Changes saved successfully" });
    } catch (err: unknown) {
      console.error(err);
      setSaveStatus("error");
      const msg = err instanceof Error ? err.message : "Failed to save case study.";
      setErrors({ server: msg });
      setToast({ message: msg, type: "error" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: prefersReduced ? 0 : 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: prefersReduced ? 0.05 : 0.6,
        ease: [0.16, 1, 0.3, 1] as const,
      }}
      className="space-y-6 select-none relative"
    >
      {/* 1. Header with Breadcrumbs & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.2em] text-white/40 font-sans">
            <Link href="/dashboard" className="hover:text-white transition-colors">DASHBOARD</Link>
            <span>/</span>
            <Link href="/dashboard/case-studies" className="hover:text-white transition-colors">CASE STUDIES</Link>
            <span>/</span>
            <span className="text-white/60">{mode === "create" ? "NEW" : "EDIT"}</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-serif text-white tracking-wide">
            {mode === "create" ? "Create Case Study" : "Edit Case Study"}
          </h2>
          <p className="text-xs text-white/50 font-sans tracking-wide">
            {mode === "create" ? "Create a new THE DCO hospitality case study." : "Update and manage this case study."}
          </p>
        </div>

        {/* Action Triggers */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={saveStatus === "saving"}
            className="px-4 py-2.5 text-[9px] uppercase tracking-widest font-sans font-semibold border border-transparent text-white/40 hover:text-white disabled:opacity-30 transition-colors rounded-xs outline-none cursor-pointer"
          >
            Cancel
          </button>

          {mode === "create" ? (
            <>
              <button
                type="button"
                onClick={() => handleSubmit("draft")}
                disabled={saveStatus === "saving"}
                className="flex items-center gap-1.5 px-4 py-2.5 text-[9px] uppercase tracking-widest font-sans font-semibold border border-white/10 text-white/85 hover:text-white disabled:opacity-30 transition-all rounded-xs outline-none cursor-pointer"
              >
                {saveStatus === "saving" && <Loader2 className="animate-spin mr-1" size={10} />}
                Save Draft
              </button>
              <button
                type="button"
                onClick={() => handleSubmit("published")}
                disabled={saveStatus === "saving"}
                className="flex items-center gap-1.5 px-5 py-2.5 text-[9px] uppercase tracking-widest font-sans font-semibold bg-primary text-black hover:bg-white disabled:opacity-30 transition-all rounded-xs outline-none cursor-pointer"
              >
                {saveStatus === "saving" && <Loader2 className="animate-spin mr-1" size={10} />}
                Publish
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => handleSubmit((initialCaseStudy?.status as CaseStudyStatus) || "draft")}
              disabled={saveStatus === "saving"}
              className="flex items-center gap-1.5 px-5 py-2.5 text-[9px] uppercase tracking-widest font-sans font-semibold bg-primary text-black hover:bg-white disabled:opacity-30 transition-all rounded-xs outline-none cursor-pointer"
            >
              {saveStatus === "saving" && <Loader2 className="animate-spin mr-1" size={10} />}
              Save Changes
            </button>
          )}
        </div>
      </div>

      {/* 2. Reusable Layout Content Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Editor fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main sections */}
          <div className="bg-[#050505] border border-white/5 p-6 rounded-xs space-y-6">
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-white/80 font-sans font-semibold border-b border-white/5 pb-3">
              Case Study Overview
            </h4>

            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-[9px] uppercase tracking-[0.18em] text-white/40 font-sans font-semibold block">
                Case Study Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Panchavati Hospitality Restructuring..."
                className={`w-full bg-black border ${errors.title ? "border-red-500/50" : "border-white/10"} text-xs text-white px-4 py-3 rounded-xs outline-none focus:border-primary/45 transition-colors font-sans`}
              />
              {errors.title && <p className="text-[10px] text-red-500 font-sans">{errors.title}</p>}
            </div>

            {/* Short Summary Overview */}
            <div className="space-y-1.5">
              <label className="text-[9px] uppercase tracking-[0.18em] text-white/40 font-sans font-semibold block">
                Overview / Summary Description
              </label>
              <textarea
                rows={3}
                value={overview}
                onChange={(e) => setOverview(e.target.value)}
                placeholder="Provide a comprehensive operational summary of the case study (50-5000 characters)..."
                className={`w-full bg-black border ${errors.overview ? "border-red-500/50" : "border-white/10"} text-xs text-white px-4 py-3 rounded-xs outline-none focus:border-primary/45 resize-none transition-colors font-sans leading-relaxed`}
              />
              {errors.overview && <p className="text-[10px] text-red-500 font-sans">{errors.overview}</p>}
            </div>
          </div>

          <div className="bg-[#050505] border border-white/5 p-6 rounded-xs space-y-6">
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-white/80 font-sans font-semibold border-b border-white/5 pb-3">
              Project Details
            </h4>

            {/* Grid Row: Client Name & Client Industry */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[9px] uppercase tracking-[0.18em] text-white/40 font-sans font-semibold block">
                  Client Name
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Mandawa Resorts Group..."
                  className={`w-full bg-black border ${errors.clientName ? "border-red-500/50" : "border-white/10"} text-xs text-white px-4 py-3 rounded-xs outline-none focus:border-primary/45 transition-colors font-sans`}
                />
                {errors.clientName && <p className="text-[10px] text-red-500 font-sans">{errors.clientName}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] uppercase tracking-[0.18em] text-white/40 font-sans font-semibold block">
                  Client Industry
                </label>
                <input
                  type="text"
                  value={clientIndustry}
                  onChange={(e) => setClientIndustry(e.target.value)}
                  placeholder="Luxury Hospitality..."
                  className={`w-full bg-black border ${errors.clientIndustry ? "border-red-500/50" : "border-white/10"} text-xs text-white px-4 py-3 rounded-xs outline-none focus:border-primary/45 transition-colors font-sans`}
                />
                {errors.clientIndustry && <p className="text-[10px] text-red-500 font-sans">{errors.clientIndustry}</p>}
              </div>
            </div>

            {/* Location */}
            <div className="space-y-1.5">
              <label className="text-[9px] uppercase tracking-[0.18em] text-white/40 font-sans font-semibold block">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Maharashtra, India..."
                className={`w-full bg-black border ${errors.location ? "border-red-500/50" : "border-white/10"} text-xs text-white px-4 py-3 rounded-xs outline-none focus:border-primary/45 transition-colors font-sans`}
              />
              {errors.location && <p className="text-[10px] text-red-500 font-sans">{errors.location}</p>}
            </div>

            {/* Cover Image Input Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[9px] uppercase tracking-[0.18em] text-white/40 font-sans font-semibold block">
                  Cover Image URL
                </label>
                <input
                  type="text"
                  value={coverImageUrl}
                  onChange={(e) => setCoverImageUrl(e.target.value)}
                  placeholder="/images/case-studies/resort.jpg"
                  className={`w-full bg-black border ${errors.coverImage ? "border-red-500/50" : "border-white/10"} text-xs text-white px-4 py-3 rounded-xs outline-none focus:border-primary/45 transition-colors font-sans`}
                />
                {errors.coverImage && <p className="text-[10px] text-red-500 font-sans">{errors.coverImage}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] uppercase tracking-[0.18em] text-white/40 font-sans font-semibold block">
                  Cover Image Alt Text
                </label>
                <input
                  type="text"
                  value={coverImageAlt}
                  onChange={(e) => setCoverImageAlt(e.target.value)}
                  placeholder="Boutique resort view..."
                  className={`w-full bg-black border ${errors.coverImageAlt ? "border-red-500/50" : "border-white/10"} text-xs text-white px-4 py-3 rounded-xs outline-none focus:border-primary/45 transition-colors font-sans`}
                />
                {errors.coverImageAlt && <p className="text-[10px] text-red-500 font-sans">{errors.coverImageAlt}</p>}
              </div>
            </div>

            {/* Cover Image Preview */}
            {coverImageUrl.trim() && (
              <div className="space-y-1.5">
                <label className="text-[9px] uppercase tracking-[0.18em] text-white/40 font-sans font-semibold block">
                  Cover Preview
                </label>
                <div className="relative w-full h-44 bg-black border border-white/5 overflow-hidden flex items-center justify-center rounded-xs">
                  <img
                    src={coverImageUrl}
                    alt={coverImageAlt || "Cover preview"}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                  <ImageIcon size={20} className="absolute text-white/10 z-0 pointer-events-none" />
                </div>
              </div>
            )}
          </div>

          <div className="bg-[#050505] border border-white/5 p-6 rounded-xs space-y-6">
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-white/80 font-sans font-semibold border-b border-white/5 pb-3">
              Case Study Content
            </h4>

            {/* Challenge */}
            <div className="space-y-1.5">
              <label className="text-[9px] uppercase tracking-[0.18em] text-white/40 font-sans font-semibold block">
                The Challenge
              </label>
              <textarea
                rows={5}
                value={challenge}
                onChange={(e) => setChallenge(e.target.value)}
                placeholder="What was the primary operational/financial challenge? (30-5000 characters)..."
                className={`w-full bg-black border ${errors.challenge ? "border-red-500/50" : "border-white/10"} text-xs text-white px-4 py-3 rounded-xs outline-none focus:border-primary/45 transition-colors font-sans leading-relaxed`}
              />
              {errors.challenge && <p className="text-[10px] text-red-500 font-sans">{errors.challenge}</p>}
            </div>

            {/* Solution */}
            <div className="space-y-1.5">
              <label className="text-[9px] uppercase tracking-[0.18em] text-white/40 font-sans font-semibold block">
                The Solution / Approach
              </label>
              <textarea
                rows={7}
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                placeholder="Detail the THEDCO intervention and solution approach (30-10000 characters)..."
                className={`w-full bg-black border ${errors.solution ? "border-red-500/50" : "border-white/10"} text-xs text-white px-4 py-3 rounded-xs outline-none focus:border-primary/45 transition-colors font-sans leading-relaxed`}
              />
              {errors.solution && <p className="text-[10px] text-red-500 font-sans">{errors.solution}</p>}
            </div>

            {/* Services Checklist */}
            <div className="space-y-2 border-t border-white/5 pt-4">
              <label className="text-[9px] uppercase tracking-[0.18em] text-white/40 font-sans font-semibold block">
                Services Provided (Min 1)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {CASE_STUDY_SERVICES.map((srv) => (
                  <label key={srv} className="flex items-center gap-2 cursor-pointer font-sans text-xs text-white/70 hover:text-white transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedServices.includes(srv)}
                      onChange={() => handleToggleService(srv)}
                      className="rounded-xs bg-black border border-white/10 text-primary focus:ring-0 focus:ring-offset-0 cursor-pointer"
                    />
                    <span>{srv}</span>
                  </label>
                ))}
              </div>
              {errors.services && <p className="text-[10px] text-red-500 font-sans">{errors.services}</p>}
            </div>

            {/* Results Metrics */}
            <div className="space-y-4 border-t border-white/5 pt-4">
              <label className="text-[9px] uppercase tracking-[0.18em] text-white/40 font-sans font-semibold block">
                Results Metrics (Max 10)
              </label>

              {/* Add metric item form */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-black border border-white/5 p-3 rounded-xs">
                <div className="space-y-1">
                  <span className="text-[8px] uppercase text-white/30 font-sans">Metric Label</span>
                  <input
                    type="text"
                    value={newMetric}
                    onChange={(e) => setNewMetric(e.target.value)}
                    placeholder="e.g. F&B COGS Reduction"
                    className="w-full bg-[#050505] border border-white/10 text-xs text-white px-3 py-2 rounded-xs outline-none focus:border-primary/30 font-sans"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[8px] uppercase text-white/30 font-sans">Value</span>
                  <input
                    type="text"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    placeholder="e.g. -6.5%"
                    className="w-full bg-[#050505] border border-white/10 text-xs text-white px-3 py-2 rounded-xs outline-none focus:border-primary/30 font-sans"
                  />
                </div>
                <div className="space-y-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[8px] uppercase text-white/30 font-sans block">Short Description</span>
                    <input
                      type="text"
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      placeholder="e.g. Centralized buying"
                      className="w-full bg-[#050505] border border-white/10 text-xs text-white px-3 py-2 rounded-xs outline-none focus:border-primary/30 font-sans mb-1"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddResultMetric}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 text-[9px] uppercase tracking-widest font-sans font-semibold bg-white/5 border border-white/10 text-white/80 hover:bg-white hover:text-black transition-colors rounded-xs cursor-pointer outline-none"
                  >
                    <Plus size={10} /> Add
                  </button>
                </div>
              </div>
              {errors.results && <p className="text-[10px] text-red-500 font-sans">{errors.results}</p>}

              {/* Render results list */}
              {results.length > 0 && (
                <div className="space-y-2 border border-white/5 rounded-xs p-3">
                  {results.map((res, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-3 text-xs border-b border-white/5 pb-2 last:border-b-0 last:pb-0 font-sans">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4">
                        <span className="font-semibold text-white/90">{res.metric}</span>
                        <span className="text-primary font-bold">{res.value}</span>
                        {res.description && <span className="text-white/40 text-[10px]">{res.description}</span>}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveResultMetric(idx)}
                        className="text-white/30 hover:text-red-400 transition-colors p-1"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Settings */}
        <div className="space-y-6">
          <div className="bg-[#050505] border border-white/5 p-6 rounded-xs space-y-6">
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-white/80 font-sans font-semibold border-b border-white/5 pb-3">
              Settings
            </h4>

            {/* Property Type select */}
            <div className="space-y-1.5">
              <label className="text-[9px] uppercase tracking-[0.18em] text-white/40 font-sans font-semibold block">
                Property Type
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                className="w-full bg-black border border-white/10 text-xs text-white/80 px-4 py-3 rounded-xs outline-none focus:border-primary/45 cursor-pointer font-sans"
              >
                {PROPERTY_TYPES.map((pt) => (
                  <option key={pt} value={pt}>{pt}</option>
                ))}
              </select>
            </div>

            {/* Project Type select */}
            <div className="space-y-1.5">
              <label className="text-[9px] uppercase tracking-[0.18em] text-white/40 font-sans font-semibold block">
                Project Type
              </label>
              <select
                value={projectType}
                onChange={(e) => setProjectType(e.target.value as CaseStudyProjectType)}
                className="w-full bg-black border border-white/10 text-xs text-white/80 px-4 py-3 rounded-xs outline-none focus:border-primary/45 cursor-pointer font-sans"
              >
                {CASE_STUDY_PROJECT_TYPES.map((pj) => (
                  <option key={pj} value={pj}>{pj}</option>
                ))}
              </select>
            </div>

            {/* Slug path */}
            <div className="space-y-1.5">
              <label className="text-[9px] uppercase tracking-[0.18em] text-white/40 font-sans font-semibold block">
                Slug Path
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="boutique-resort-audit-2026"
                className={`w-full bg-black border ${errors.slug ? "border-red-500/50" : "border-white/10"} text-xs text-white px-4 py-3 rounded-xs outline-none focus:border-primary/45 transition-colors font-sans`}
              />
              {errors.slug && <p className="text-[10px] text-red-500 font-sans">{errors.slug}</p>}
            </div>
          </div>

          {/* SEO Options */}
          <div className="bg-[#050505] border border-white/5 p-6 rounded-xs space-y-6">
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-white/80 font-sans font-semibold border-b border-white/5 pb-3">
              SEO Metadata
            </h4>

            {/* Meta Title */}
            <div className="space-y-1.5">
              <label className="text-[9px] uppercase tracking-[0.18em] text-white/40 font-sans font-semibold block">
                Meta Title
              </label>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="SEO title optimized..."
                className={`w-full bg-black border ${errors.metaTitle ? "border-red-500/50" : "border-white/10"} text-xs text-white px-4 py-3 rounded-xs outline-none focus:border-primary/45 transition-colors font-sans`}
              />
              {errors.metaTitle && <p className="text-[10px] text-red-500 font-sans">{errors.metaTitle}</p>}
            </div>

            {/* Meta Description */}
            <div className="space-y-1.5">
              <label className="text-[9px] uppercase tracking-[0.18em] text-white/40 font-sans font-semibold block">
                Meta Description
              </label>
              <textarea
                rows={3}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="Meta optimized summary..."
                className={`w-full bg-black border ${errors.metaDescription ? "border-red-500/50" : "border-white/10"} text-xs text-white px-4 py-3 rounded-xs outline-none focus:border-primary/45 resize-none transition-colors font-sans leading-relaxed`}
              />
              {errors.metaDescription && <p className="text-[10px] text-red-500 font-sans">{errors.metaDescription}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Toast Banner */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-6 right-6 z-50 flex items-center justify-center pointer-events-auto"
          >
            <div
              className={`flex items-center gap-2.5 border shadow-2xl px-5 py-3 rounded-xs text-[10px] uppercase tracking-widest font-sans font-semibold text-white select-none ${toast.type === "error" ? "bg-red-950/90 border-red-900/50" : "bg-[#0A0A0A] border-white/10"}`}
            >
              {toast.type === "error" ? (
                <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
              ) : (
                <span className="h-1.5 w-1.5 rounded-full bg-[#C9A24A]" />
              )}
              <span>{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
