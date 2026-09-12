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
          <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.2em] text-white/40 font-sans">
            <Link href="/dashboard" className="hover:text-white transition-colors">DASHBOARD</Link>
            <span>/</span>
            <Link href="/dashboard/blog" className="hover:text-white transition-colors">BLOG</Link>
            <span>/</span>
            <span className="text-white/60">{mode === "create" ? "NEW" : "EDIT"}</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-serif text-white tracking-wide">
            {mode === "create" ? "Create Blog Post" : "Edit Blog Post"}
          </h2>
          <p className="text-xs text-white/50 font-sans tracking-wide">
            {mode === "create" ? "Create and publish a new THE DCO article." : "Update and manage this article."}
          </p>
        </div>

        {/* Action Triggers */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={saveStatus === "saving" || isUploadingImage}
            className="px-4 py-2.5 text-[9px] uppercase tracking-widest font-sans font-semibold border border-transparent text-white/40 hover:text-white disabled:opacity-30 transition-colors rounded-xs outline-none cursor-pointer"
          >
            Cancel
          </button>

          {mode === "create" ? (
            <>
              <button
                type="button"
                onClick={() => handleSubmit("draft")}
                disabled={saveStatus === "saving" || isUploadingImage}
                className="flex items-center gap-1.5 px-4 py-2.5 text-[9px] uppercase tracking-widest font-sans font-semibold border border-white/10 text-white/85 hover:text-white disabled:opacity-30 transition-all rounded-xs outline-none cursor-pointer"
              >
                {saveStatus === "saving" && <Loader2 className="animate-spin mr-1" size={10} />}
                Save Draft
              </button>
              <button
                type="button"
                onClick={() => handleSubmit("published")}
                disabled={saveStatus === "saving" || isUploadingImage}
                className="flex items-center gap-1.5 px-5 py-2.5 text-[9px] uppercase tracking-widest font-sans font-semibold bg-primary text-black hover:bg-white disabled:opacity-30 transition-all rounded-xs outline-none cursor-pointer"
              >
                {saveStatus === "saving" && <Loader2 className="animate-spin mr-1" size={10} />}
                Publish
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => handleSubmit((initialBlog?.status as BlogStatus) || "draft")}
              disabled={saveStatus === "saving" || isUploadingImage}
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
          <div className="bg-[#050505] border border-white/5 p-6 rounded-xs space-y-6">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-[9px] uppercase tracking-[0.18em] text-white/40 font-sans font-semibold block">
                Post Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter post title..."
                className={`w-full bg-black border ${errors.title ? "border-red-500/50" : "border-white/10"} text-xs text-white px-4 py-3 rounded-xs outline-none focus:border-primary/45 transition-colors font-sans`}
              />
              {errors.title && <p className="text-[10px] text-red-500 font-sans">{errors.title}</p>}
            </div>

            {/* Excerpt */}
            <div className="space-y-1.5">
              <label className="text-[9px] uppercase tracking-[0.18em] text-white/40 font-sans font-semibold block">
                Short Excerpt
              </label>
              <textarea
                rows={3}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Write a brief article summary (20-500 characters)..."
                className={`w-full bg-black border ${errors.excerpt ? "border-red-500/50" : "border-white/10"} text-xs text-white px-4 py-3 rounded-xs outline-none focus:border-primary/45 resize-none transition-colors font-sans leading-relaxed`}
              />
              {errors.excerpt && <p className="text-[10px] text-red-500 font-sans">{errors.excerpt}</p>}
            </div>

            {/* ========================================================= */}
            {/* COVER IMAGE UPLOADER SECTION (Cloudinary Integrated) */}
            {/* ========================================================= */}
            <div className="space-y-3 pt-2 border-t border-white/5">
              <div className="flex items-center justify-between">
                <label className="text-[9px] uppercase tracking-[0.18em] text-white/40 font-sans font-semibold flex items-center gap-1.5">
                  <ImageIcon size={12} className="text-primary" />
                  <span>Cover / Featured Image</span>
                </label>

                <button
                  type="button"
                  onClick={() => setShowManualUrl(!showManualUrl)}
                  className="text-[9px] uppercase tracking-widest text-white/40 hover:text-primary transition-colors flex items-center gap-1"
                >
                  <LinkIcon size={10} />
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
                  className={`group relative w-full h-52 border-2 border-dashed rounded-xs flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all duration-300 ${
                    isDragging
                      ? "border-primary bg-primary/[0.04] scale-[1.005]"
                      : errors.coverImage
                      ? "border-red-500/40 bg-red-950/10 hover:border-red-500/70"
                      : "border-white/10 bg-black/40 hover:border-primary/40 hover:bg-white/[0.01]"
                  }`}
                >
                  {isUploadingImage ? (
                    <div className="flex flex-col items-center space-y-3">
                      <Loader2 className="animate-spin text-primary" size={28} />
                      <p className="text-xs text-white/80 font-sans tracking-wide">
                        Uploading cover image to Cloudinary...
                      </p>
                      <p className="text-[10px] text-white/40 font-sans">
                        Optimizing delivery quality & format
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-3 pointer-events-none">
                      <div className="w-12 h-12 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover:border-primary/40 group-hover:scale-105 transition-all">
                        <UploadCloud size={20} className="text-white/60 group-hover:text-primary transition-colors" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-white/80 font-sans">
                          <span className="text-primary font-medium underline underline-offset-4">
                            Click to upload
                          </span>{" "}
                          or drag and drop cover image
                        </p>
                        <p className="text-[10px] text-white/40 font-sans">
                          Supported: JPG, PNG, WEBP, AVIF (Max 5MB)
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Full-fidelity Preview card with replace and remove actions
                <div className="relative border border-white/10 rounded-xs overflow-hidden bg-black group">
                  <div className="relative w-full h-56 md:h-64 bg-zinc-950 flex items-center justify-center overflow-hidden">
                    <img
                      src={coverImageUrl}
                      alt={coverImageAlt || "Blog cover preview"}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />

                    {/* Gradient Overlay for controls */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 opacity-90 transition-opacity" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-xs text-[9px] uppercase tracking-widest font-sans font-semibold bg-black/70 backdrop-blur-md border border-white/10 text-white/90">
                        {coverImagePublicId ? (
                          <>
                            <CheckCircle2 size={10} className="text-primary" />
                            <span>Cloudinary Asset</span>
                          </>
                        ) : (
                          <>
                            <ImageIcon size={10} className="text-white/60" />
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
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xs text-[9px] uppercase tracking-widest font-sans font-semibold bg-black/80 backdrop-blur-md border border-white/15 text-white hover:border-primary hover:text-primary transition-all cursor-pointer"
                      >
                        {isUploadingImage ? (
                          <Loader2 size={11} className="animate-spin" />
                        ) : (
                          <RefreshCw size={11} />
                        )}
                        <span>{isUploadingImage ? "Uploading..." : "Replace Image"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleRemoveCoverImage}
                        disabled={isUploadingImage}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xs text-[9px] uppercase tracking-widest font-sans font-semibold bg-red-950/80 backdrop-blur-md border border-red-900/50 text-red-300 hover:bg-red-900 hover:text-white transition-all cursor-pointer"
                      >
                        <Trash2 size={11} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Cover Image Alt Text Input */}
              <div className="space-y-1.5 pt-1">
                <label className="text-[9px] uppercase tracking-[0.18em] text-white/40 font-sans font-semibold block">
                  Cover Image Alt Text (SEO & Accessibility)
                </label>
                <input
                  type="text"
                  value={coverImageAlt}
                  onChange={(e) => setCoverImageAlt(e.target.value)}
                  placeholder="e.g. Modern hotel suite interior with panoramic ocean view..."
                  className={`w-full bg-black border ${errors.coverImageAlt ? "border-red-500/50" : "border-white/10"} text-xs text-white px-4 py-2.5 rounded-xs outline-none focus:border-primary/45 transition-colors font-sans`}
                />
                {errors.coverImageAlt && (
                  <p className="text-[10px] text-red-500 font-sans">{errors.coverImageAlt}</p>
                )}
              </div>

              {/* Collapsible Direct URL Editor */}
              {showManualUrl && (
                <div className="p-3 bg-black/50 border border-white/10 rounded-xs space-y-2">
                  <label className="text-[9px] uppercase tracking-[0.18em] text-white/40 font-sans font-semibold block">
                    Direct Image URL
                  </label>
                  <input
                    type="text"
                    value={coverImageUrl}
                    onChange={(e) => setCoverImageUrl(e.target.value)}
                    placeholder="https://res.cloudinary.com/... or /images/blog/..."
                    className="w-full bg-black border border-white/10 text-xs text-white px-3 py-2 rounded-xs outline-none focus:border-primary/45 font-mono"
                  />
                  {coverImagePublicId && (
                    <p className="text-[9px] text-white/40 font-mono">
                      Cloudinary Public ID: <span className="text-white/70">{coverImagePublicId}</span>
                    </p>
                  )}
                </div>
              )}

              {errors.coverImage && (
                <p className="text-[10px] text-red-500 font-sans">{errors.coverImage}</p>
              )}
            </div>

            {/* Content Body */}
            <div className="space-y-1.5 pt-2">
              <label className="text-[9px] uppercase tracking-[0.18em] text-white/40 font-sans font-semibold block">
                Article Body Content
              </label>
              <textarea
                rows={16}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write the full body content here (markdown/text)..."
                className={`w-full bg-black border ${errors.content ? "border-red-500/50" : "border-white/10"} text-xs text-white px-4 py-3 rounded-xs outline-none focus:border-primary/45 transition-colors font-mono leading-relaxed`}
              />
              {errors.content && <p className="text-[10px] text-red-500 font-sans">{errors.content}</p>}
            </div>
          </div>
        </div>

        {/* Right Column: Settings */}
        <div className="space-y-6">
          <div className="bg-[#050505] border border-white/5 p-6 rounded-xs space-y-6">
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-white/80 font-sans font-semibold border-b border-white/5 pb-3">
              Settings
            </h4>

            {/* Category selection */}
            <div className="space-y-1.5">
              <label className="text-[9px] uppercase tracking-[0.18em] text-white/40 font-sans font-semibold block">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-black border border-white/10 text-xs text-white/80 px-4 py-3 rounded-xs outline-none focus:border-primary/45 cursor-pointer font-sans"
              >
                {BLOG_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Author */}
            <div className="space-y-1.5">
              <label className="text-[9px] uppercase tracking-[0.18em] text-white/40 font-sans font-semibold block">
                Author
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Manav Chandak"
                className={`w-full bg-black border ${errors.authorName ? "border-red-500/50" : "border-white/10"} text-xs text-white px-4 py-3 rounded-xs outline-none focus:border-primary/45 transition-colors font-sans`}
              />
              {errors.authorName && <p className="text-[10px] text-red-500 font-sans">{errors.authorName}</p>}
            </div>

            {/* Slug */}
            <div className="space-y-1.5">
              <label className="text-[9px] uppercase tracking-[0.18em] text-white/40 font-sans font-semibold block">
                Slug Path
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="hospitality-insights-2026"
                className={`w-full bg-black border ${errors.slug ? "border-red-500/50" : "border-white/10"} text-xs text-white px-4 py-3 rounded-xs outline-none focus:border-primary/45 transition-colors font-sans`}
              />
              {errors.slug && <p className="text-[10px] text-red-500 font-sans">{errors.slug}</p>}
            </div>

            {/* Read Time */}
            <div className="space-y-1.5">
              <label className="text-[9px] uppercase tracking-[0.18em] text-white/40 font-sans font-semibold block">
                Read Time (minutes)
              </label>
              <input
                type="number"
                value={readTime}
                onChange={(e) => setReadTime(parseInt(e.target.value) || 0)}
                placeholder="5"
                min="1"
                max="120"
                className={`w-full bg-black border ${errors.readTime ? "border-red-500/50" : "border-white/10"} text-xs text-white px-4 py-3 rounded-xs outline-none focus:border-primary/45 transition-colors font-sans`}
              />
              {errors.readTime && <p className="text-[10px] text-red-500 font-sans">{errors.readTime}</p>}
            </div>
          </div>

          {/* SEO Options Collapsible */}
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
                placeholder="Title optimized for SEO..."
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
                placeholder="Brief summary optimized for search engines..."
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
