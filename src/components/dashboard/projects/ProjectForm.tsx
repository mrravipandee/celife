"use client";

import React, { useState, useEffect } from "react";
import { Trash2, AlertCircle, Plus, X, Globe, Calendar, Briefcase, Award, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Project } from "@/types/project";
import { Service } from "@/data/services";
import { getServices } from "@/lib/services/services";

interface ProjectFormProps {
  mode: "create" | "edit";
  initialProject?: Project | null;
  onSave: (project: Project) => Promise<void> | void;
  onCancel?: () => void;
  onDelete?: () => void;
}

export function ProjectForm({
  mode,
  initialProject,
  onSave,
  onCancel,
  onDelete,
}: ProjectFormProps) {
  const prefersReduced = useReducedMotion();

  // Load services for the multi-select relationship checks
  const [advisoryServices, setAdvisoryServices] = useState<Service[]>([]);
  useEffect(() => {
    getServices()
      .then((data) => setAdvisoryServices(data))
      .catch((err) => console.error("Failed to load services in project form:", err));
  }, []);

  // Form field states initialized from MongoDB values
  const [title, setTitle] = useState(initialProject?.title || "");
  const [slug, setSlug] = useState(initialProject?.slug || "");
  const [description, setDescription] = useState(initialProject?.description || "");
  const [category, setCategory] = useState(initialProject?.category || "");
  const [location, setLocation] = useState(initialProject?.location || "");
  const [coverImage, setCoverImage] = useState(initialProject?.coverImage || "");
  const [gallery, setGallery] = useState<string[]>(initialProject?.gallery || []);
  const [year, setYear] = useState<number>(initialProject?.year || new Date().getFullYear());
  const [selectedServices, setSelectedServices] = useState<string[]>(initialProject?.services || []);
  const [featured, setFeatured] = useState<boolean>(initialProject?.featured || false);

  // Gallery input helpers
  const [newGalleryUrl, setNewGalleryUrl] = useState("");

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Action status indicators
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [toast, setToast] = useState<{ message: string; type?: "success" | "error" } | null>(null);

  // Esc key closure for modal dialogues
  const [isUnsavedModalOpen, setIsUnsavedModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Compute dirty status directly in render phase to avoid cascading renders
  const isDirty =
    title !== (initialProject?.title || "") ||
    slug !== (initialProject?.slug || "") ||
    description !== (initialProject?.description || "") ||
    category !== (initialProject?.category || "") ||
    location !== (initialProject?.location || "") ||
    coverImage !== (initialProject?.coverImage || "") ||
    JSON.stringify(gallery) !== JSON.stringify(initialProject?.gallery || []) ||
    year !== (initialProject?.year || new Date().getFullYear()) ||
    JSON.stringify(selectedServices) !== JSON.stringify(initialProject?.services || []) ||
    featured !== (initialProject?.featured || false);

  // Block unsaved browser unload
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

  // Escape key closures for dialog overlays
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

  // Handle title change and auto-slugify
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (mode === "create") {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
      );
    }
  };

  // Gallery URL handlers
  const handleAddGalleryUrl = () => {
    if (!newGalleryUrl.trim()) return;
    if (!newGalleryUrl.startsWith("http://") && !newGalleryUrl.startsWith("https://") && !newGalleryUrl.startsWith("/")) {
      setErrors({ ...errors, gallery: "Please specify a valid absolute or relative URL path." });
      return;
    }
    setGallery([...gallery, newGalleryUrl.trim()]);
    setNewGalleryUrl("");
    setErrors({ ...errors, gallery: "" });
  };

  const handleRemoveGalleryUrl = (idx: number) => {
    setGallery(gallery.filter((_, i) => i !== idx));
  };

  // Services toggle helpers
  const handleToggleService = (serviceName: string) => {
    if (selectedServices.includes(serviceName)) {
      setSelectedServices(selectedServices.filter((s) => s !== serviceName));
    } else {
      setSelectedServices([...selectedServices, serviceName]);
    }
  };

  // Save submit triggers
  const handleFormAction = async (isDraft: boolean) => {
    if (saveStatus !== "idle") return;

    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "Project Name is required.";
    if (!location.trim()) newErrors.location = "Location is required.";
    if (!category.trim()) newErrors.category = "Category is required.";
    if (!description.trim()) newErrors.description = "Full Description is required.";
    if (!coverImage.trim()) newErrors.coverImage = "Cover Image URL path is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setSaveStatus("saving");

    try {
      const payload: Project = {
        _id: initialProject?._id,
        title,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-"),
        description,
        category,
        location,
        coverImage,
        gallery,
        year: Number(year) || new Date().getFullYear(),
        services: selectedServices,
        featured,
      };

      await onSave(payload);
      setSaveStatus("saved");

      // Custom toast messages based on action
      const successMessage =
        mode === "create"
          ? isDraft
            ? "✓ Project saved as draft"
            : "✓ Project created successfully"
          : "✓ Changes saved";

      setToast({ message: successMessage });

      setTimeout(() => {
        setSaveStatus("idle");
      }, 2000);
    } catch (err: unknown) {
      console.error("Save error:", err);
      setSaveStatus("idle");
      const message = err instanceof Error ? err.message : "Unable to complete this action.";
      setToast({ message, type: "error" });
    }
  };

  const handleCancelClick = () => {
    if (isDirty) {
      setIsUnsavedModalOpen(true);
    } else if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="space-y-8 select-none relative pb-12">
      {/* 1. Header panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-6">
        <div className="space-y-2">
          <nav className="flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-white/40 font-sans">
            <span className="hover:text-white cursor-pointer transition-colors" onClick={handleCancelClick}>
              Projects
            </span>
            <span>/</span>
            <span className="text-white/80">
              {mode === "create" ? "New Project" : "Edit"}
            </span>
          </nav>
          <h1 className="text-xl font-serif text-white tracking-wide">
            {mode === "create" ? "Create New Project" : title || "Edit Project"}
          </h1>
          <p className="text-xs text-white/50 leading-relaxed font-sans max-w-xl">
            {mode === "create"
              ? "Add a new hospitality project to the THEDCO portfolio."
              : "Manage project information, engagement details and public-facing project content."}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleCancelClick}
            disabled={saveStatus === "saving"}
            className="px-5 py-3 text-[9px] uppercase tracking-widest font-sans font-semibold border border-white/15 hover:border-white/40 text-white transition-all duration-300 rounded-xs cursor-pointer outline-none"
          >
            Cancel
          </button>

          {mode === "create" ? (
            <>
              <button
                type="button"
                onClick={() => handleFormAction(true)}
                disabled={saveStatus === "saving" || saveStatus === "saved"}
                className="px-5 py-3 text-[9px] uppercase tracking-widest font-sans font-semibold border border-white/15 hover:border-[#C9A24A] text-white transition-colors duration-300 rounded-xs cursor-pointer outline-none flex items-center gap-2"
              >
                {saveStatus === "saving" ? (
                  <>
                    <Loader2 className="animate-spin" size={10} />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Draft</span>
                )}
              </button>
              <button
                type="button"
                onClick={() => handleFormAction(false)}
                disabled={saveStatus === "saving" || saveStatus === "saved"}
                className="px-5 py-3 text-[9px] uppercase tracking-widest font-sans font-semibold bg-[#C9A24A] text-black hover:bg-white transition-colors duration-300 rounded-xs cursor-pointer outline-none flex items-center gap-2"
              >
                {saveStatus === "saving" ? (
                  <>
                    <Loader2 className="animate-spin" size={10} />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <span>Publish Project</span>
                )}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => handleFormAction(false)}
              disabled={saveStatus === "saving" || saveStatus === "saved"}
              className="px-5 py-3 text-[9px] uppercase tracking-widest font-sans font-semibold bg-[#C9A24A] text-black hover:bg-white transition-colors duration-300 rounded-xs cursor-pointer outline-none flex items-center gap-2"
            >
              {saveStatus === "saving" ? (
                <>
                  <Loader2 className="animate-spin" size={10} />
                  <span>Saving...</span>
                </>
              ) : saveStatus === "saved" ? (
                <span>✓ Saved</span>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          )}
        </div>
      </div>

      {/* 2. Main Two Column Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column — Content (Span 8) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-[#050505] border border-white/5 p-6 rounded-xs space-y-6">
            <h3 className="text-xs uppercase tracking-widest text-[#C9A24A] font-sans font-semibold border-b border-white/5 pb-3">
              Project Content
            </h3>

            {/* Title */}
            <div className="space-y-2">
              <label htmlFor="projectTitle" className="block text-[9px] uppercase tracking-[0.2em] text-white/40 font-sans">
                Project Name
              </label>
              <input
                id="projectTitle"
                type="text"
                placeholder="Enter project name..."
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className={`w-full bg-black border ${errors.title ? "border-red-500/50" : "border-white/10"} text-xs text-white px-4 py-3 rounded-xs outline-none focus:border-[#C9A24A]/40 transition-colors font-sans`}
              />
              {errors.title && <p className="text-[10px] text-red-500 font-sans">{errors.title}</p>}
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <label htmlFor="projectSlug" className="block text-[9px] uppercase tracking-[0.2em] text-white/40 font-sans">
                Slug
              </label>
              <input
                id="projectSlug"
                type="text"
                placeholder="auto-generated-from-name"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full bg-black border border-white/10 text-xs text-white/70 px-4 py-3 rounded-xs outline-none focus:border-[#C9A24A]/40 transition-colors font-sans"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label htmlFor="projectDescription" className="block text-[9px] uppercase tracking-[0.2em] text-white/40 font-sans">
                Full Description
              </label>
              <textarea
                id="projectDescription"
                rows={10}
                placeholder="Describe project details, challenges, solutions and outcomes..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`w-full bg-black border ${errors.description ? "border-red-500/50" : "border-white/10"} text-xs text-white px-4 py-3 rounded-xs outline-none focus:border-[#C9A24A]/40 transition-colors font-sans resize-y leading-relaxed`}
              />
              {errors.description && <p className="text-[10px] text-red-500 font-sans">{errors.description}</p>}
            </div>

            {/* Cover Image */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="projectCover" className="block text-[9px] uppercase tracking-[0.2em] text-white/40 font-sans">
                  Cover Image URL
                </label>
                <input
                  id="projectCover"
                  type="text"
                  placeholder="/images/services/fine-dining.jpg"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className={`w-full bg-black border ${errors.coverImage ? "border-red-500/50" : "border-white/10"} text-xs text-white px-4 py-3 rounded-xs outline-none focus:border-[#C9A24A]/40 transition-colors font-sans`}
                />
                {errors.coverImage && <p className="text-[10px] text-red-500 font-sans">{errors.coverImage}</p>}
              </div>

              {coverImage && (
                <div className="relative w-full h-48 bg-white/2 border border-white/5 rounded-xs overflow-hidden flex items-center justify-center">
                  <img
                    src={coverImage}
                    alt="Cover preview"
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute top-3 left-3 bg-black/75 px-2.5 py-1 rounded-xs text-[7px] uppercase tracking-widest text-white/80 font-sans font-bold select-none border border-white/5">
                    Cover Preview
                  </div>
                </div>
              )}
            </div>

            {/* Gallery Media */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="projectGallery" className="block text-[9px] uppercase tracking-[0.2em] text-white/40 font-sans">
                  Gallery Images
                </label>
                <div className="flex gap-2">
                  <input
                    id="projectGallery"
                    type="text"
                    placeholder="Enter gallery image URL path..."
                    value={newGalleryUrl}
                    onChange={(e) => setNewGalleryUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddGalleryUrl();
                      }
                    }}
                    className={`flex-1 bg-black border ${errors.gallery ? "border-red-500/50" : "border-white/10"} text-xs text-white px-4 py-3 rounded-xs outline-none focus:border-[#C9A24A]/40 transition-colors font-sans`}
                  />
                  <button
                    type="button"
                    onClick={handleAddGalleryUrl}
                    className="px-4 bg-transparent border border-white/10 text-white/80 hover:text-white hover:border-[#C9A24A] transition-colors rounded-xs outline-none cursor-pointer flex items-center justify-center"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                {errors.gallery && <p className="text-[10px] text-red-500 font-sans">{errors.gallery}</p>}
              </div>

              {/* Gallery previews list */}
              {gallery.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {gallery.map((url, idx) => (
                    <div key={idx} className="relative aspect-video bg-white/2 border border-white/5 rounded-xs overflow-hidden group">
                      <img
                        src={url}
                        alt={`Gallery ${idx + 1}`}
                        className="w-full h-full object-cover opacity-75"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryUrl(idx)}
                        className="absolute top-2 right-2 bg-black/80 hover:bg-red-600 border border-white/10 p-1 rounded-full text-white transition-colors cursor-pointer opacity-0 group-hover:opacity-100 outline-none"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column — Details Panel (Span 4) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#050505] border border-white/5 p-6 rounded-xs space-y-6 select-none">
            <h3 className="text-xs uppercase tracking-widest text-[#C9A24A] font-sans font-semibold border-b border-white/5 pb-3">
              Project Details
            </h3>

            {/* Client (Fallback read-only) */}
            <div className="space-y-2">
              <label className="block text-[9px] uppercase tracking-[0.2em] text-white/40 font-sans">
                Client (Relationship)
              </label>
              <div className="flex items-center gap-2.5 bg-black border border-white/5 px-4 py-3 rounded-xs text-xs text-white/45">
                <Globe size={11} className="text-white/30" />
                <span>Private Engagement</span>
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label htmlFor="projectCategory" className="block text-[9px] uppercase tracking-[0.2em] text-white/40 font-sans">
                Category
              </label>
              <div className="relative">
                <Briefcase size={11} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  id="projectCategory"
                  type="text"
                  placeholder="Hotel / Restaurant Advisory..."
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`w-full bg-black border ${errors.category ? "border-red-500/50" : "border-white/10"} text-xs text-white pl-9 pr-4 py-3 rounded-xs outline-none focus:border-[#C9A24A]/40 transition-colors font-sans`}
                />
              </div>
              {errors.category && <p className="text-[10px] text-red-500 font-sans">{errors.category}</p>}
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label htmlFor="projectLocation" className="block text-[9px] uppercase tracking-[0.2em] text-white/40 font-sans">
                Location
              </label>
              <div className="relative">
                <Globe size={11} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  id="projectLocation"
                  type="text"
                  placeholder="Mumbai, India..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className={`w-full bg-black border ${errors.location ? "border-red-500/50" : "border-white/10"} text-xs text-white pl-9 pr-4 py-3 rounded-xs outline-none focus:border-[#C9A24A]/40 transition-colors font-sans`}
                />
              </div>
              {errors.location && <p className="text-[10px] text-red-500 font-sans">{errors.location}</p>}
            </div>

            {/* Year */}
            <div className="space-y-2">
              <label htmlFor="projectYear" className="block text-[9px] uppercase tracking-[0.2em] text-white/40 font-sans">
                Year
              </label>
              <div className="relative">
                <Calendar size={11} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  id="projectYear"
                  type="number"
                  placeholder="2026"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full bg-black border border-white/10 text-xs text-white pl-9 pr-4 py-3 rounded-xs outline-none focus:border-[#C9A24A]/40 transition-colors font-sans cursor-pointer"
                />
              </div>
            </div>

            {/* Featured State */}
            <div className="pt-2">
              <label className="flex items-center gap-3.5 cursor-pointer select-none">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4.5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white/40 peer-checked:after:bg-black after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-[#C9A24A] transition-colors duration-300" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-widest font-sans font-semibold text-white/80">
                    Featured Project
                  </span>
                  <span className="text-[8px] text-white/30 font-sans">
                    Promote project on the front-page showcases.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Services Delivered Relationship Selection */}
          <div className="bg-[#050505] border border-white/5 p-6 rounded-xs space-y-4 select-none">
            <div className="space-y-1">
              <h3 className="text-xs uppercase tracking-widest text-[#C9A24A] font-sans font-semibold border-b border-white/5 pb-3 flex items-center gap-2">
                <Award size={12} />
                <span>Services Delivered</span>
              </h3>
              <p className="text-[9px] text-white/30 font-sans">
                Select advisory services associated with this project.
              </p>
            </div>

            {advisoryServices.length === 0 ? (
              <p className="text-[10px] text-white/30 font-sans">No advisory services loaded.</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {advisoryServices.map((srv) => {
                  const isChecked = selectedServices.includes(srv.name);
                  return (
                    <label
                      key={srv.id}
                      className="flex items-center gap-3 py-1 cursor-pointer group text-xs text-white/60 hover:text-white transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleService(srv.name)}
                        className="sr-only"
                      />
                      <div className={`w-3.5 h-3.5 border rounded-xs flex items-center justify-center transition-all ${isChecked ? "border-[#C9A24A] bg-[#C9A24A]/10 text-[#C9A24A]" : "border-white/10 group-hover:border-white/30"}`}>
                        {isChecked && <span className="text-[8px] font-bold">✓</span>}
                      </div>
                      <span className="font-sans leading-relaxed select-none">{srv.name}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* Delete Action (Edit mode only) */}
          {mode === "edit" && onDelete && (
            <div className="bg-[#050505] border border-red-950/20 p-6 rounded-xs space-y-4">
              <div className="space-y-1">
                <h4 className="text-[10px] uppercase tracking-widest text-red-500 font-sans font-semibold">
                  Danger Area
                </h4>
                <p className="text-[9px] text-white/30 font-sans leading-relaxed">
                  Permanently remove this hospitality advisory project from the public website portfolio.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(true)}
                className="w-full py-2.5 bg-transparent border border-red-500/20 hover:border-red-500 hover:bg-red-950/20 text-red-500 hover:text-red-400 font-sans text-[9px] uppercase tracking-[0.18em] font-semibold transition-all duration-300 rounded-xs cursor-pointer outline-none flex items-center justify-center gap-2"
              >
                <Trash2 size={12} />
                <span>Delete Project</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 3. Action Dialog: Unsaved Changes Confirm */}
      <AnimatePresence>
        {isUnsavedModalOpen && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsUnsavedModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-xs cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: prefersReduced ? 1 : 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: prefersReduced ? 1 : 0.95 }}
              transition={{ duration: prefersReduced ? 0.05 : 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-sm bg-[#050505] border border-white/10 shadow-2xl p-6 rounded-xs space-y-6"
            >
              <div className="space-y-2">
                <h4 className="text-sm font-serif font-medium tracking-wider text-white flex items-center gap-2">
                  <AlertCircle size={16} className="text-[#C9A24A]" />
                  <span>Unsaved Changes</span>
                </h4>
                <p className="text-xs text-white/40 font-sans leading-relaxed">
                  You have unsaved changes on this project. If you leave now, your edits will be permanently lost.
                </p>
              </div>
              <div className="flex items-center justify-end gap-3 select-none">
                <button
                  type="button"
                  onClick={() => setIsUnsavedModalOpen(false)}
                  className="px-4 py-2.5 text-[9px] uppercase tracking-widest font-sans font-semibold text-white/40 hover:text-white transition-colors duration-300 rounded-xs outline-none cursor-pointer"
                >
                  Continue Editing
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsUnsavedModalOpen(false);
                    if (onCancel) onCancel();
                  }}
                  className="px-5 py-2.5 text-[9px] uppercase tracking-widest font-sans font-semibold bg-[#C9A24A] text-black hover:bg-white transition-colors duration-300 rounded-xs outline-none cursor-pointer"
                >
                  Leave
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. Action Dialog: Delete Project Confirm */}
      <AnimatePresence>
        {isDeleteModalOpen && onDelete && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-xs cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: prefersReduced ? 1 : 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: prefersReduced ? 1 : 0.95 }}
              transition={{ duration: prefersReduced ? 0.05 : 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-sm bg-[#050505] border border-white/10 shadow-2xl p-6 rounded-xs space-y-6"
            >
              <div className="space-y-2">
                <h4 className="text-sm font-serif font-medium tracking-wider text-white">
                  Delete Project?
                </h4>
                <p className="text-xs text-white/40 font-sans leading-relaxed">
                  Are you sure you want to delete <span className="text-white/70">&quot;{title}&quot;</span>? This action cannot be undone.
                </p>
              </div>
              <div className="flex items-center justify-end gap-3 select-none">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2.5 text-[9px] uppercase tracking-widest font-sans font-semibold text-white/40 hover:text-white transition-colors duration-300 rounded-xs outline-none cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    setIsDeleteModalOpen(false);
                    await onDelete();
                  }}
                  className="px-5 py-2.5 text-[9px] uppercase tracking-widest font-sans font-semibold bg-red-600 text-white hover:bg-red-500 transition-colors duration-300 rounded-xs outline-none cursor-pointer"
                >
                  Delete Project
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. Floating Action Toast */}
      <AnimatePresence>
        {toast && (
          <div className="fixed bottom-6 right-6 z-50">
            <motion.div
              initial={{ opacity: 0, y: prefersReduced ? 0 : 20, scale: prefersReduced ? 1 : 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: prefersReduced ? 0 : 20, scale: prefersReduced ? 1 : 0.95 }}
              transition={{ duration: prefersReduced ? 0.05 : 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={`flex items-center gap-2.5 border shadow-2xl px-5 py-3 rounded-xs text-[10px] uppercase tracking-widest font-sans font-semibold text-white select-none ${toast.type === "error" ? "bg-red-950/90 border-red-900/50" : "bg-[#0A0A0A] border-white/10"}`}
            >
              {toast.type === "error" ? (
                <span className="text-red-500 font-bold">!</span>
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
