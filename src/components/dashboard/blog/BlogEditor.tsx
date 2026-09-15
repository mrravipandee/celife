"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Loader2,
  Image as ImageIcon,
  UploadCloud,
  Trash2,
  RefreshCw,
  Link as LinkIcon,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { BackendBlog, BLOG_CATEGORIES, BlogCategory, BlogStatus } from "@/types/blog";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { uploadBlogImageClient } from "@/lib/services/blogs-client";

interface BlogFormProps {
  mode: "create" | "edit";
  initialBlog?: BackendBlog;
  onSave: (data: Partial<BackendBlog>) => Promise<void>;
  onCancel: () => void;
}

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function BlogForm({ mode, initialBlog, onSave, onCancel }: BlogFormProps) {
  const prefersReduced = useReducedMotion();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Main content fields state
  const [title, setTitle] = useState(initialBlog?.title || "");
  const [excerpt, setExcerpt] = useState(initialBlog?.excerpt || "");
  const [content, setContent] = useState(initialBlog?.content || "");

  // Cover image URL + Alt + Public ID state
  const [coverImageUrl, setCoverImageUrl] = useState(initialBlog?.coverImage?.url || "");
  const [coverImageAlt, setCoverImageAlt] = useState(initialBlog?.coverImage?.alt || "");
  const [coverImagePublicId, setCoverImagePublicId] = useState(
    initialBlog?.coverImage?.publicId || ""
  );

  // Image upload interactive state
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showManualUrl, setShowManualUrl] = useState(false);

  // Settings state
  const [category, setCategory] = useState(initialBlog?.category || "Hospitality");
  const [authorName, setAuthorName] = useState(initialBlog?.author?.name || "THE DCO Team");
  const [slug, setSlug] = useState(initialBlog?.slug || "");
  const [readTime, setReadTime] = useState(initialBlog?.readTime || 5);

  // SEO state
  const [metaTitle, setMetaTitle] = useState(initialBlog?.seo?.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(initialBlog?.seo?.metaDescription || "");

  // Auto-slug tracking
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

  // Form error state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [toast, setToast] = useState<{ message: string; type?: "success" | "error" } | null>(null);

  // Toast automatic dismiss
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  // Dirty state tracking for leaving warning
  const isDirty = useMemo(() => {
    return (
      title !== (initialBlog?.title || "") ||
      excerpt !== (initialBlog?.excerpt || "") ||
      content !== (initialBlog?.content || "") ||
      coverImageUrl !== (initialBlog?.coverImage?.url || "") ||
      coverImageAlt !== (initialBlog?.coverImage?.alt || "") ||
      coverImagePublicId !== (initialBlog?.coverImage?.publicId || "") ||
      category !== (initialBlog?.category || "Hospitality") ||
      authorName !== (initialBlog?.author?.name || "THE DCO Team") ||
      slug !== (initialBlog?.slug || "") ||
      readTime !== (initialBlog?.readTime || 5) ||
      metaTitle !== (initialBlog?.seo?.metaTitle || "") ||
      metaDescription !== (initialBlog?.seo?.metaDescription || "")
    );
  }, [
    title,
    excerpt,
    content,
    coverImageUrl,
    coverImageAlt,
    coverImagePublicId,
    category,
    authorName,
    slug,
    readTime,
    metaTitle,
    metaDescription,
    initialBlog,
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

  // Image Upload handler
  const handleImageFileSelect = async (file: File) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      const errorMsg = "Unsupported format. Please upload JPG, PNG, WEBP, AVIF, or GIF.";
      setErrors((prev) => ({ ...prev, coverImage: errorMsg }));
      setToast({ message: errorMsg, type: "error" });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      const errorMsg = "File size exceeds maximum allowed limit of 5MB.";
      setErrors((prev) => ({ ...prev, coverImage: errorMsg }));
      setToast({ message: errorMsg, type: "error" });
      return;
    }

    setIsUploadingImage(true);
    setErrors((prev) => {
      const next = { ...prev };
      delete next.coverImage;
      return next;
    });

    try {
      const result = await uploadBlogImageClient(file);
      setCoverImageUrl(result.url);
      setCoverImagePublicId(result.publicId);

      // If alt text is empty, auto-generate a descriptive alt tag
      if (!coverImageAlt.trim()) {
        const cleanName =
          title.trim() ||
          file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        setCoverImageAlt(cleanName);
      }

      setToast({ message: "✓ Cover image uploaded successfully" });
    } catch (err: unknown) {
      console.error("Cloudinary upload failed:", err);
      const msg =
        err instanceof Error ? err.message : "Failed to upload image to Cloudinary.";
      setErrors((prev) => ({ ...prev, coverImage: msg }));
      setToast({ message: msg, type: "error" });
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleImageFileSelect(file);
    }
  };

  const handleRemoveCoverImage = () => {
    setCoverImageUrl("");
    setCoverImagePublicId("");
  };

  // Perform form submission
  const handleSubmit = async (targetStatus: BlogStatus) => {
    if (saveStatus === "saving" || isUploadingImage) return;

    // Client-side validations
    const newErrors: Record<string, string> = {};
    if (!title.trim() || title.length < 5 || title.length > 200) {
      newErrors.title = "Title is required and must be between 5 and 200 characters.";
    }
    if (!slug.trim() || slug.length > 220 || !slugRegex.test(slug)) {
      newErrors.slug = "Slug must be URL-safe (lowercase letters, numbers, and hyphens only, no spaces).";
    }
    if (!excerpt.trim() || excerpt.length < 20 || excerpt.length > 500) {
      newErrors.excerpt = "Excerpt is required and must be between 20 and 500 characters.";
    }
    if (!content.trim() || content.length < 50 || content.length > 100000) {
      newErrors.content = "Content must be between 50 and 100,000 characters.";
    }
    if (!coverImageUrl.trim() || !coverImageUrl.startsWith("/")) {
      if (!coverImageUrl.startsWith("http://") && !coverImageUrl.startsWith("https://")) {
        newErrors.coverImage = "Cover image must be a valid URL path (e.g. /images/blog/img.jpg or Cloudinary URL).";
      }
    }
    if (!coverImageAlt.trim()) {
      newErrors.coverImageAlt = "Alt text is required for the cover image.";
    }
    if (!authorName.trim() || authorName.length > 100) {
      newErrors.authorName = "Author name is required and cannot exceed 100 characters.";
    }
    const parsedReadTime = Number(readTime);
    if (isNaN(parsedReadTime) || parsedReadTime < 1 || parsedReadTime > 120) {
      newErrors.readTime = "Read time must be an integer between 1 and 120 minutes.";
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
      const payload: Partial<BackendBlog> = {
        title: title.trim(),
        slug: slug.trim(),
        excerpt: excerpt.trim(),
        content: content.trim(),
        coverImage: {
          url: coverImageUrl.trim(),
          alt: coverImageAlt.trim(),
          publicId: coverImagePublicId.trim() || undefined,
        },
        category: category as BlogCategory,
        author: {
          name: authorName.trim(),
          id: initialBlog?.author?.id,
        },
        status: mode === "create" ? targetStatus : (initialBlog?.status as BlogStatus || targetStatus),
        readTime: parsedReadTime,
        seo: {
          metaTitle: metaTitle.trim() || undefined,
          metaDescription: metaDescription.trim() || undefined,
        },
      };

      await onSave(payload);
      setSaveStatus("success");
      setToast({ message: mode === "create" ? "✓ Article created successfully" : "✓ Changes saved successfully" });
    } catch (err: unknown) {
      console.error(err);
      setSaveStatus("error");
      const msg = err instanceof Error ? err.message : "Failed to save blog post.";
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
          <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-[#123C2D] font-sans font-semibold">
            <Link href="/dashboard" className="hover:underline">DASHBOARD</Link>
            <span>/</span>
            <Link href="/dashboard/blog" className="hover:underline">EDITORIAL</Link>
            <span>/</span>
            <span className="text-[#68756D]">{mode === "create" ? "NEW" : "EDIT"}</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#17201B] tracking-tight">
            {mode === "create" ? "Create Article" : "Edit Article"}
          </h2>
          <p className="text-xs text-[#68756D] font-sans mt-0.5">
            {mode === "create" ? "Draft and publish a new healthcare insight or wellness article." : "Update and manage article content and metadata."}
          </p>
        </div>

        {/* Action Triggers */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={saveStatus === "saving" || isUploadingImage}
            className="px-4 py-2 text-xs font-sans font-medium text-[#68756D] hover:text-[#17201B] disabled:opacity-40 transition-colors rounded-md outline-none cursor-pointer"
          >
            Cancel
          </button>

          {mode === "create" ? (
            <>
              <button
                type="button"
                onClick={() => handleSubmit("draft")}
                disabled={saveStatus === "saving" || isUploadingImage}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-sans font-medium bg-white border border-[#E1E8E2] text-[#17201B] hover:bg-[#F0F4F0] disabled:opacity-40 transition-colors rounded-md shadow-xs outline-none cursor-pointer"
              >
                {saveStatus === "saving" && <Loader2 className="animate-spin mr-1 text-[#123C2D]" size={12} />}
                Save Draft
              </button>
              <button
                type="button"
                onClick={() => handleSubmit("published")}
                disabled={saveStatus === "saving" || isUploadingImage}
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-sans font-medium bg-[#123C2D] text-white hover:bg-[#294F3D] disabled:opacity-40 transition-colors rounded-md shadow-xs outline-none cursor-pointer"
              >
                {saveStatus === "saving" && <Loader2 className="animate-spin mr-1" size={12} />}
                Publish
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => handleSubmit((initialBlog?.status as BlogStatus) || "draft")}
              disabled={saveStatus === "saving" || isUploadingImage}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-sans font-medium bg-[#123C2D] text-white hover:bg-[#294F3D] disabled:opacity-40 transition-colors rounded-md shadow-xs outline-none cursor-pointer"
            >
              {saveStatus === "saving" && <Loader2 className="animate-spin mr-1" size={12} />}
              Save Changes
            </button>
          )}
        </div>
      </div>

      {/* 2. Reusable Layout Content Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Editor fields */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-[#E1E8E2] p-6 rounded-lg space-y-6 shadow-xs">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-sans font-semibold text-[#17201B] block">
                Post Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter post title..."
                className={`w-full bg-white border ${errors.title ? "border-[#C0392B]" : "border-[#E1E8E2]"} text-xs text-[#17201B] px-4 py-2.5 rounded-md outline-none focus:border-[#123C2D] focus:ring-2 focus:ring-[#123C2D]/10 transition-colors font-sans placeholder:text-[#68756D]/60 shadow-xs`}
              />
              {errors.title && <p className="text-xs text-[#C0392B] font-sans mt-1">{errors.title}</p>}
            </div>

            {/* Excerpt */}
            <div className="space-y-1.5">
              <label className="text-xs font-sans font-semibold text-[#17201B] block">
                Short Excerpt
              </label>
              <textarea
                rows={3}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Write a brief article summary (20-500 characters)..."
                className={`w-full bg-white border ${errors.excerpt ? "border-[#C0392B]" : "border-[#E1E8E2]"} text-xs text-[#17201B] px-4 py-2.5 rounded-md outline-none focus:border-[#123C2D] focus:ring-2 focus:ring-[#123C2D]/10 resize-none transition-colors font-sans leading-relaxed placeholder:text-[#68756D]/60 shadow-xs`}
              />
              {errors.excerpt && <p className="text-xs text-[#C0392B] font-sans mt-1">{errors.excerpt}</p>}
            </div>

            {/* ========================================================= */}
            {/* COVER IMAGE UPLOADER SECTION (Cloudinary Integrated) */}
            {/* ========================================================= */}
            <div className="space-y-3 pt-2 border-t border-[#E1E8E2]">
              <div className="flex items-center justify-between">
                <label className="text-xs font-sans font-semibold text-[#17201B] flex items-center gap-1.5">
                  <ImageIcon size={14} className="text-[#123C2D]" />
                  <span>Cover / Featured Image</span>
                </label>

                <button
                  type="button"
                  onClick={() => setShowManualUrl(!showManualUrl)}
                  className="text-xs text-[#68756D] hover:text-[#123C2D] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <LinkIcon size={12} />
                  <span>{showManualUrl ? "Hide Direct URL" : "Direct URL / Advanced"}</span>
                </button>
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleImageFileSelect(e.target.files[0]);
                  }
                }}
              />

              {/* Uploader / Preview Component */}
              {!coverImageUrl.trim() ? (
                // Dropzone area when no image is uploaded
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => !isUploadingImage && fileInputRef.current?.click()}
                  className={`group relative w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-colors ${
                    isDragging
                      ? "border-[#123C2D] bg-[#F0F4F0]"
                      : errors.coverImage
                      ? "border-[#C0392B] bg-red-50/30"
                      : "border-[#E1E8E2] bg-[#F6F8F5] hover:bg-white hover:border-[#123C2D]/40"
                  }`}
                >
                  {isUploadingImage ? (
                    <div className="flex flex-col items-center space-y-3">
                      <Loader2 className="animate-spin text-[#123C2D]" size={28} />
                      <p className="text-xs text-[#17201B] font-sans font-medium">
                        Uploading cover image to Cloudinary...
                      </p>
                      <p className="text-[11px] text-[#68756D] font-sans">
                        Optimizing delivery quality & format
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-3 pointer-events-none">
                      <div className="w-12 h-12 rounded-full bg-white border border-[#E1E8E2] flex items-center justify-center group-hover:border-[#123C2D]/40 group-hover:scale-105 transition-all shadow-xs">
                        <UploadCloud size={20} className="text-[#123C2D]" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-[#17201B] font-sans">
                          <span className="text-[#123C2D] font-semibold underline underline-offset-4">
                            Click to upload
                          </span>{" "}
                          or drag and drop cover image
                        </p>
                        <p className="text-[11px] text-[#68756D] font-sans">
                          Supported: JPG, PNG, WEBP, AVIF (Max 5MB)
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Full-fidelity Preview card with replace and remove actions
                <div className="relative border border-[#E1E8E2] rounded-lg overflow-hidden bg-white shadow-xs group">
                  <div className="relative w-full h-56 md:h-64 bg-[#F6F8F5] flex items-center justify-center overflow-hidden">
                    <img
                      src={coverImageUrl}
                      alt={coverImageAlt || "Blog cover preview"}
                      className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />

                    {/* Gradient Overlay for controls */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-90 transition-opacity" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-sans font-semibold bg-black/60 backdrop-blur-md border border-white/20 text-white">
                        {coverImagePublicId ? (
                          <>
                            <CheckCircle2 size={12} className="text-emerald-400" />
                            <span>Cloudinary Asset</span>
                          </>
                        ) : (
                          <>
                            <ImageIcon size={12} className="text-white/80" />
                            <span>Image Selected</span>
                          </>
                        )}
                      </span>
                    </div>

                    {/* Center / Bottom Control Actions */}
                    <div className="absolute bottom-3 right-3 flex items-center gap-2">
                      <button
                        type="button"
                        disabled={isUploadingImage}
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-sans font-medium bg-black/70 backdrop-blur-md border border-white/20 text-white hover:bg-black/90 transition-all cursor-pointer"
                      >
                        {isUploadingImage ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <RefreshCw size={12} />
                        )}
                        <span>{isUploadingImage ? "Uploading..." : "Replace Image"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleRemoveCoverImage}
                        disabled={isUploadingImage}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-sans font-medium bg-red-600/90 backdrop-blur-md border border-red-500/50 text-white hover:bg-red-700 transition-all cursor-pointer"
                      >
                        <Trash2 size={12} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Cover Image Alt Text Input */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-sans font-semibold text-[#17201B] block">
                  Cover Image Alt Text (SEO & Accessibility)
                </label>
                <input
                  type="text"
                  value={coverImageAlt}
                  onChange={(e) => setCoverImageAlt(e.target.value)}
                  placeholder="e.g. Pure botanical herbal formulation extract..."
                  className={`w-full bg-white border ${errors.coverImageAlt ? "border-[#C0392B]" : "border-[#E1E8E2]"} text-xs text-[#17201B] px-4 py-2.5 rounded-md outline-none focus:border-[#123C2D] focus:ring-2 focus:ring-[#123C2D]/10 transition-colors font-sans placeholder:text-[#68756D]/60 shadow-xs`}
                />
                {errors.coverImageAlt && (
                  <p className="text-xs text-[#C0392B] font-sans mt-1">{errors.coverImageAlt}</p>
                )}
              </div>

              {/* Collapsible Direct URL Editor */}
              {showManualUrl && (
                <div className="p-3 bg-[#F6F8F5] border border-[#E1E8E2] rounded-md space-y-2">
                  <label className="text-xs font-sans font-semibold text-[#17201B] block">
                    Direct Image URL
                  </label>
                  <input
                    type="text"
                    value={coverImageUrl}
                    onChange={(e) => setCoverImageUrl(e.target.value)}
                    placeholder="https://res.cloudinary.com/... or /images/blog/..."
                    className="w-full bg-white border border-[#E1E8E2] text-xs text-[#17201B] px-3 py-2 rounded-md outline-none focus:border-[#123C2D] font-mono shadow-xs"
                  />
                  {coverImagePublicId && (
                    <p className="text-[11px] text-[#68756D] font-mono">
                      Cloudinary Public ID: <span className="text-[#17201B] font-semibold">{coverImagePublicId}</span>
                    </p>
                  )}
                </div>
              )}

              {errors.coverImage && (
                <p className="text-xs text-[#C0392B] font-sans mt-1">{errors.coverImage}</p>
              )}
            </div>

            {/* Content Body */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-sans font-semibold text-[#17201B] block">
                Article Body Content
              </label>
              <textarea
                rows={16}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write the full body content here (markdown/text)..."
                className={`w-full bg-white border ${errors.content ? "border-[#C0392B]" : "border-[#E1E8E2]"} text-xs text-[#17201B] px-4 py-3 rounded-md outline-none focus:border-[#123C2D] focus:ring-2 focus:ring-[#123C2D]/10 transition-colors font-mono leading-relaxed placeholder:text-[#68756D]/60 shadow-xs`}
              />
              {errors.content && <p className="text-xs text-[#C0392B] font-sans mt-1">{errors.content}</p>}
            </div>
          </div>
        </div>

        {/* Right Column: Settings */}
        <div className="space-y-6">
          <div className="bg-white border border-[#E1E8E2] p-6 rounded-lg space-y-6 shadow-xs">
            <h4 className="text-xs uppercase tracking-[0.14em] text-[#123C2D] font-sans font-bold border-b border-[#E1E8E2] pb-3">
              Article Settings
            </h4>

            {/* Category selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-sans font-semibold text-[#17201B] block">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white border border-[#E1E8E2] text-xs text-[#17201B] px-4 py-2.5 rounded-md outline-none focus:border-[#123C2D] cursor-pointer font-sans shadow-xs"
              >
                {BLOG_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Author */}
            <div className="space-y-1.5">
              <label className="text-xs font-sans font-semibold text-[#17201B] block">
                Author
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Celife Medical & Wellness Team"
                className={`w-full bg-white border ${errors.authorName ? "border-[#C0392B]" : "border-[#E1E8E2]"} text-xs text-[#17201B] px-4 py-2.5 rounded-md outline-none focus:border-[#123C2D] focus:ring-2 focus:ring-[#123C2D]/10 transition-colors font-sans placeholder:text-[#68756D]/60 shadow-xs`}
              />
              {errors.authorName && <p className="text-xs text-[#C0392B] font-sans mt-1">{errors.authorName}</p>}
            </div>

            {/* Slug */}
            <div className="space-y-1.5">
              <label className="text-xs font-sans font-semibold text-[#17201B] block">
                Slug Path
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="botanical-wellness-guide-2026"
                className={`w-full bg-white border ${errors.slug ? "border-[#C0392B]" : "border-[#E1E8E2]"} text-xs text-[#17201B] px-4 py-2.5 rounded-md outline-none focus:border-[#123C2D] focus:ring-2 focus:ring-[#123C2D]/10 transition-colors font-sans placeholder:text-[#68756D]/60 shadow-xs`}
              />
              {errors.slug && <p className="text-xs text-[#C0392B] font-sans mt-1">{errors.slug}</p>}
            </div>

            {/* Read Time */}
            <div className="space-y-1.5">
              <label className="text-xs font-sans font-semibold text-[#17201B] block">
                Read Time (minutes)
              </label>
              <input
                type="number"
                value={readTime}
                onChange={(e) => setReadTime(parseInt(e.target.value) || 0)}
                placeholder="5"
                min="1"
                max="120"
                className={`w-full bg-white border ${errors.readTime ? "border-[#C0392B]" : "border-[#E1E8E2]"} text-xs text-[#17201B] px-4 py-2.5 rounded-md outline-none focus:border-[#123C2D] focus:ring-2 focus:ring-[#123C2D]/10 transition-colors font-sans placeholder:text-[#68756D]/60 shadow-xs`}
              />
              {errors.readTime && <p className="text-xs text-[#C0392B] font-sans mt-1">{errors.readTime}</p>}
            </div>
          </div>

          {/* SEO Options Collapsible */}
          <div className="bg-white border border-[#E1E8E2] p-6 rounded-lg space-y-6 shadow-xs">
            <h4 className="text-xs uppercase tracking-[0.14em] text-[#123C2D] font-sans font-bold border-b border-[#E1E8E2] pb-3">
              SEO Metadata
            </h4>

            {/* Meta Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-sans font-semibold text-[#17201B] block">
                Meta Title
              </label>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="Title optimized for SEO..."
                className={`w-full bg-white border ${errors.metaTitle ? "border-[#C0392B]" : "border-[#E1E8E2]"} text-xs text-[#17201B] px-4 py-2.5 rounded-md outline-none focus:border-[#123C2D] focus:ring-2 focus:ring-[#123C2D]/10 transition-colors font-sans placeholder:text-[#68756D]/60 shadow-xs`}
              />
              {errors.metaTitle && <p className="text-xs text-[#C0392B] font-sans mt-1">{errors.metaTitle}</p>}
            </div>

            {/* Meta Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-sans font-semibold text-[#17201B] block">
                Meta Description
              </label>
              <textarea
                rows={3}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="Brief summary optimized for search engines..."
                className={`w-full bg-white border ${errors.metaDescription ? "border-[#C0392B]" : "border-[#E1E8E2]"} text-xs text-[#17201B] px-4 py-2.5 rounded-md outline-none focus:border-[#123C2D] focus:ring-2 focus:ring-[#123C2D]/10 resize-none transition-colors font-sans leading-relaxed placeholder:text-[#68756D]/60 shadow-xs`}
              />
              {errors.metaDescription && <p className="text-xs text-[#C0392B] font-sans mt-1">{errors.metaDescription}</p>}
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
              className={`flex items-center gap-2.5 border shadow-xl px-4 py-3 rounded-md text-xs font-sans font-semibold select-none ${toast.type === "error" ? "bg-white border-[#C0392B] text-[#C0392B]" : "bg-white border-[#E1E8E2] text-[#123C2D]"}`}
            >
              {toast.type === "error" ? (
                <span className="h-2 w-2 rounded-full bg-[#C0392B] animate-pulse" />
              ) : (
                <span className="h-2 w-2 rounded-full bg-[#2F7D54]" />
              )}
              <span>{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
