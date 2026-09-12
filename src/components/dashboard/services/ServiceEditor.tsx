"use client";

import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, Eye, Save, Globe, Plus, Trash2 } from "lucide-react";
import { Service, ServiceStatus } from "@/data/services";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ServicePreview } from "./ServicePreview";

interface ServiceEditorProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (service: Service) => void;
}

export function ServiceEditor({ service, isOpen, onClose, onSave }: ServiceEditorProps) {
  const prefersReduced = useReducedMotion();
  const editorRef = useRef<HTMLDivElement>(null);

  // Form local state fields
  const [name, setName] = useState(service?.name || "");
  const [slug, setSlug] = useState(service?.slug || "");
  const [shortDescription, setShortDescription] = useState(service?.shortDescription || "");
  const [category, setCategory] = useState(service?.category || "Operations");
  const [displayOrder, setDisplayOrder] = useState<number>(service?.displayOrder || 1);
  const [status, setStatus] = useState<ServiceStatus>(service?.status || "draft");
  const [featured, setFeatured] = useState<boolean>(service?.featured || false);
  const [heroLabel, setHeroLabel] = useState(service?.heroLabel || "");
  const [description, setDescription] = useState(service?.description || "");
  const [keyPoints, setKeyPoints] = useState<string[]>(service?.keyPoints || []);

  // Nested preview overlay state
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Keyboard Escape listener and page scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isPreviewOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, isPreviewOpen, onClose]);

  // Key Points list adjustments
  const handleAddPoint = () => {
    setKeyPoints([...keyPoints, ""]);
  };

  const handleUpdatePoint = (index: number, value: string) => {
    const updated = [...keyPoints];
    updated[index] = value;
    setKeyPoints(updated);
  };

  const handleRemovePoint = (index: number) => {
    setKeyPoints(keyPoints.filter((_, idx) => idx !== index));
  };

  const handleSave = (finalStatus: ServiceStatus) => {
    const today = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

    const updatedService: Service = {
      id: service?.id || `srv-${Date.now()}`,
      name,
      slug,
      shortDescription,
      category,
      displayOrder: Number(displayOrder) || 1,
      status: finalStatus,
      featured,
      heroLabel,
      description,
      keyPoints: keyPoints.filter(pt => pt.trim() !== ""),
      updatedAt: today,
    };

    onSave(updatedService);
  };

  // Generate preview data object matching current states
  const previewService: Service = {
    id: service?.id || "temp-srv-id",
    name: name || "Untitled Service",
    slug,
    shortDescription,
    category,
    displayOrder,
    status,
    featured,
    heroLabel,
    description,
    keyPoints: keyPoints.filter(pt => pt.trim() !== ""),
    updatedAt: "22 Aug 2026",
  };

  const backdropVariants = {
    closed: { opacity: 0 },
    open: {
      opacity: 1,
      transition: { duration: prefersReduced ? 0.05 : 0.3 }
    },
    exit: {
      opacity: 0,
      transition: { duration: prefersReduced ? 0.05 : 0.25 }
    }
  };

  const modalVariants = {
    closed: { opacity: 0, y: prefersReduced ? 0 : 20, scale: prefersReduced ? 1 : 0.98 },
    open: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: prefersReduced ? 0.05 : 0.45,
        ease: [0.16, 1, 0.3, 1] as const
      }
    },
    exit: {
      opacity: 0,
      y: prefersReduced ? 0 : 15,
      scale: prefersReduced ? 1 : 0.98,
      transition: {
        duration: prefersReduced ? 0.05 : 0.35,
        ease: [0.16, 1, 0.3, 1] as const
      }
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6 select-none" role="none">
            {/* Backdrop overlay */}
            <motion.div
              variants={backdropVariants}
              initial="closed"
              animate="open"
              exit="exit"
              onClick={onClose}
              className="fixed inset-0 bg-black/75 backdrop-blur-xs cursor-pointer"
              aria-hidden="true"
            />

            {/* Modal CMS Panel */}
            <motion.div
              ref={editorRef}
              variants={modalVariants}
              initial="closed"
              animate="open"
              exit="exit"
              role="dialog"
              aria-modal="true"
              aria-label={service ? "Edit Service" : "New Service"}
              className="relative w-full h-full md:h-auto md:max-h-[90vh] md:max-w-4xl bg-[#050505] border border-white/5 md:border-white/10 shadow-2xl flex flex-col focus:outline-none overflow-hidden"
            >
              {/* Header block */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
                <div className="space-y-0.5">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-white/40 font-sans block">
                    SERVICE MANAGER
                  </span>
                  <h3 className="text-sm font-serif font-medium tracking-wider text-white">
                    {service ? "Edit Hospitality Service" : "Create New Hospitality Service"}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close editor"
                  className="p-1.5 rounded-sm border border-white/5 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-all outline-none focus-visible:ring-1 focus-visible:ring-primary/50 cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Scrollable Form Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-10">
                
                {/* 01 — Overview */}
                <div className="space-y-4">
                  <div className="border-b border-white/5 pb-2">
                    <h4 className="text-[10px] uppercase tracking-[0.2em] text-primary font-sans font-semibold">
                      01 — Overview
                    </h4>
                  </div>
                  
                  {/* Service Name & Slug */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase tracking-wider text-white/40 font-sans font-semibold">Service Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          // Auto generate slug if no manual edits yet
                          if (!slug || slug === e.target.value.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").slice(0, -1)) {
                            setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-"));
                          }
                        }}
                        placeholder="Hospitality Operations Advisory"
                        className="w-full px-3 py-2 text-xs font-sans bg-black border border-white/5 rounded-xs text-white placeholder-white/20 outline-none focus:border-primary/30 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase tracking-wider text-white/40 font-sans font-semibold">Slug</label>
                      <input
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        placeholder="hospitality-operations-advisory"
                        className="w-full px-3 py-2 text-xs font-sans bg-black border border-white/5 rounded-xs text-white placeholder-white/20 outline-none focus:border-primary/30 transition-all"
                      />
                    </div>
                  </div>

                  {/* Short Description */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider text-white/40 font-sans font-semibold">Short Description</label>
                    <textarea
                      rows={2}
                      value={shortDescription}
                      onChange={(e) => setShortDescription(e.target.value)}
                      placeholder="Concise description used for public service cards, previews, and metadata..."
                      className="w-full px-3 py-2 text-xs font-sans bg-black border border-white/5 rounded-xs text-white placeholder-white/20 outline-none focus:border-primary/30 resize-none transition-all"
                    />
                  </div>

                  {/* Grid Row: Category, Display Order, Status */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase tracking-wider text-white/40 font-sans font-semibold">Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-3 py-2 text-xs font-sans bg-black border border-white/5 rounded-xs text-white/80 outline-none cursor-pointer focus:border-primary/30 transition-all"
                      >
                        <option value="Operations">Operations</option>
                        <option value="Finance">Finance</option>
                        <option value="Restaurant Advisory">Restaurant Advisory</option>
                        <option value="Development">Development</option>
                        <option value="Brand & Marketing">Brand & Marketing</option>
                        <option value="People & Operations">People & Operations</option>
                        <option value="Business Strategy">Business Strategy</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase tracking-wider text-white/40 font-sans font-semibold">Display Order</label>
                      <input
                        type="number"
                        min={1}
                        value={displayOrder}
                        onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 1)}
                        placeholder="01"
                        className="w-full px-3 py-2 text-xs font-mono bg-black border border-white/5 rounded-xs text-white placeholder-white/20 outline-none focus:border-primary/30 transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase tracking-wider text-white/40 font-sans font-semibold">Status</label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as ServiceStatus)}
                        className="w-full px-3 py-2 text-xs font-sans bg-black border border-white/5 rounded-xs text-white/80 outline-none cursor-pointer focus:border-primary/30 transition-all"
                      >
                        <option value="active">Active</option>
                        <option value="draft">Draft</option>
                        <option value="hidden">Hidden</option>
                      </select>
                    </div>
                  </div>

                  {/* Featured Service and Hero Label */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="flex items-center gap-3 bg-black border border-white/5 p-3 rounded-xs">
                      <input
                        type="checkbox"
                        id="featuredToggle"
                        checked={featured}
                        onChange={(e) => setFeatured(e.target.checked)}
                        className="w-4 h-4 rounded-sm accent-primary cursor-pointer border border-white/10 outline-none focus-visible:ring-1 focus-visible:ring-primary"
                      />
                      <label htmlFor="featuredToggle" className="text-xs text-white/70 font-sans cursor-pointer select-none">
                        Featured Service (promote on public homepage)
                      </label>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase tracking-wider text-white/40 font-sans font-semibold">Hero Label</label>
                      <input
                        type="text"
                        value={heroLabel}
                        onChange={(e) => setHeroLabel(e.target.value)}
                        placeholder="OPERATIONS / STRATEGY"
                        className="w-full px-3 py-2 text-xs font-sans bg-black border border-white/5 rounded-xs text-white placeholder-white/20 outline-none focus:border-primary/30 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* 02 — Main Description */}
                <div className="space-y-4">
                  <div className="border-b border-white/5 pb-2">
                    <h4 className="text-[10px] uppercase tracking-[0.2em] text-primary font-sans font-semibold">
                      02 — Main Description
                    </h4>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider text-white/40 font-sans font-semibold">Main Description</label>
                    <textarea
                      rows={6}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe the service, the business problems it addresses and the value THEDCO provides."
                      className="w-full px-3 py-2 text-xs font-sans bg-black border border-white/5 rounded-xs text-white placeholder-white/20 outline-none focus:border-primary/30 transition-all font-sans leading-relaxed"
                    />
                  </div>
                </div>

                {/* 03 — Key Points */}
                <div className="space-y-4">
                  <div className="border-b border-white/5 pb-2">
                    <h4 className="text-[10px] uppercase tracking-[0.2em] text-primary font-sans font-semibold">
                      03 — Key Points (What We Help With)
                    </h4>
                  </div>
                  
                  {/* Dynamic point rows list */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[9px] uppercase tracking-wider text-white/40 font-sans font-semibold">Key Points / Deliverables</label>
                      <button
                        type="button"
                        onClick={handleAddPoint}
                        className="flex items-center gap-1 text-[9px] uppercase tracking-widest text-primary hover:text-white transition-colors cursor-pointer outline-none"
                      >
                        <Plus size={10} />
                        <span>Add Point</span>
                      </button>
                    </div>

                    {keyPoints.length === 0 ? (
                      <div className="py-4 text-center border border-dashed border-white/5 rounded-xs text-[10px] text-white/20 font-sans">
                        No key points added yet. Click &apos;Add Point&apos;.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {keyPoints.map((point, idx) => (
                          <div key={idx} className="flex gap-2 items-center">
                            <input
                              type="text"
                              value={point}
                              onChange={(e) => handleUpdatePoint(idx, e.target.value)}
                              placeholder="e.g. Operational Audit"
                              className="flex-1 px-3 py-2 text-xs font-sans bg-black border border-white/5 rounded-xs text-white placeholder-white/20 outline-none focus:border-primary/20"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemovePoint(idx)}
                              aria-label={`Remove point ${idx + 1}`}
                              className="p-2 rounded-sm border border-white/5 bg-white/5 text-white/40 hover:text-red-400 hover:bg-white/10 transition-all outline-none cursor-pointer"
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

              {/* Action triggers bottom bar */}
              <div className="p-4 bg-[#0A0A0A] border-t border-white/5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 select-none">
                {/* Left: Preview trigger */}
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => setIsPreviewOpen(true)}
                    className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-[9px] uppercase tracking-widest font-sans font-semibold border border-white/10 text-white/80 hover:text-white hover:border-white/20 transition-all rounded-xs outline-none focus-visible:ring-1 focus-visible:ring-primary/50 cursor-pointer"
                  >
                    <Eye size={12} className="text-white/40" />
                    <span>Preview</span>
                  </button>
                </div>

                {/* Right: Cancel, Draft, Publish */}
                <div className="flex flex-col sm:flex-row items-stretch gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 text-[9px] uppercase tracking-widest font-sans font-semibold border border-transparent text-white/40 hover:text-white transition-colors rounded-xs outline-none cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSave("draft")}
                    className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-[9px] uppercase tracking-widest font-sans font-semibold border border-white/10 text-white/80 hover:text-white hover:border-white/20 transition-all rounded-xs outline-none focus-visible:ring-1 focus-visible:ring-primary/50 cursor-pointer"
                  >
                    <Save size={12} className="text-white/40" />
                    <span>Save Draft</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSave("active")}
                    className="flex items-center justify-center gap-1.5 px-5 py-2.5 text-[9px] uppercase tracking-widest font-sans font-semibold bg-primary text-black hover:bg-white hover:text-black transition-colors rounded-xs outline-none focus-visible:ring-1 focus-visible:ring-primary/50 cursor-pointer"
                  >
                    <Globe size={12} />
                    <span>Publish / Activate</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Nested Editorial Preview Modal */}
      <ServicePreview
        service={previewService}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </>
  );
}
