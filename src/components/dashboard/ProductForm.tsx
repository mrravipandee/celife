"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Plus,
  Trash2,
  Upload,
  ArrowLeft,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ProductHighlight {
  label: string;
  value: string;
}

interface ProductFormData {
  name: string;
  slug: string;
  subtitle: string;
  category: string;
  shortDescription: string;
  description: string;
  formulation: string;
  form: string;
  packaging: string;
  wellnessFocus: string;
  usageAdvice: string;
  keyFocus: string[];
  highlights: ProductHighlight[];
  image: string;
  gallery: string[];
  featured: boolean;
  published: boolean;
  order: number;
}

interface ProductFormProps {
  initialData?: Partial<ProductFormData>;
  productId?: string;
  isEditing?: boolean;
}

export function ProductForm({ initialData, productId, isEditing }: ProductFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<ProductFormData>({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    subtitle: initialData?.subtitle || "",
    category: initialData?.category || "Neurological Wellness",
    shortDescription: initialData?.shortDescription || "",
    description: initialData?.description || "",
    formulation: initialData?.formulation || "",
    form: initialData?.form || "Film-Coated Tablets",
    packaging: initialData?.packaging || "Box of 60 Tablets",
    wellnessFocus: initialData?.wellnessFocus || "",
    usageAdvice: initialData?.usageAdvice || "",
    keyFocus: initialData?.keyFocus || [""],
    highlights: initialData?.highlights || [
      { label: "Category", value: "" },
      { label: "Form", value: "" },
      { label: "Pack Size", value: "" },
    ],
    image: initialData?.image || "/images/products/nervify-forte.jpg",
    gallery: initialData?.gallery || [],
    featured: initialData?.featured || false,
    published: initialData?.published ?? true,
    order: initialData?.order ?? 0,
  });

  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/categories");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setCategories(json.data);
          if (!formData.category && json.data.length > 0) {
            setFormData((prev) => ({ ...prev, category: json.data[0].name }));
          }
        }
      } catch (err) {
        console.error("Categories fetch error:", err);
      }
    }
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNameChange = (val: string) => {
    const updates: Partial<ProductFormData> = { name: val };
    // Auto-generate slug if new product or empty slug
    if (!isEditing || !formData.slug) {
      updates.slug = val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
    }
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const body = new FormData();
    body.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body,
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Upload failed");
      }
      setFormData((prev) => ({ ...prev, image: data.url }));
    } catch (err: unknown) {
      alert("Image upload error: " + (err instanceof Error ? err.message : "Failed"));
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    // Filter out empty keyFocus items
    const cleanedKeyFocus = formData.keyFocus.filter((k) => k.trim().length > 0);
    const cleanedHighlights = formData.highlights.filter(
      (h) => h.label.trim().length > 0 && h.value.trim().length > 0
    );

    const payload = {
      ...formData,
      keyFocus: cleanedKeyFocus,
      highlights: cleanedHighlights,
    };

    try {
      const url = isEditing ? `/api/products/${productId}` : "/api/products";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to save product");
      }

      setFeedback({
        type: "success",
        message: isEditing ? "Product updated successfully!" : "Product created successfully!",
      });

      setTimeout(() => {
        router.push("/dashboard/products");
      }, 1200);
    } catch (err: unknown) {
      setFeedback({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to save product",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl pb-16 select-none">
      {/* Top action row */}
      <div className="flex items-center justify-between gap-4 pb-6 border-b border-white/10">
        <Link
          href="/dashboard/products"
          className="text-xs uppercase tracking-wider text-white/60 hover:text-white transition-colors flex items-center gap-2"
        >
          <ArrowLeft size={14} />
          <span>Back to Products</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-[#123C2D] hover:bg-[#294F3D] text-white text-xs uppercase tracking-wider font-semibold rounded-xs transition-all flex items-center gap-2 border border-white/10 shadow-xs disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={14} />
                <span>{isEditing ? "Save Changes" : "Create Product"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xs text-xs font-sans flex items-center gap-2.5 ${
            feedback.type === "error"
              ? "bg-red-500/15 border border-red-500/30 text-red-300"
              : "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300"
          }`}
        >
          {feedback.type === "error" ? <AlertCircle size={15} /> : <CheckCircle2 size={15} />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Basic Details Section */}
      <div className="bg-[#0E1B15] border border-white/10 rounded-xs p-6 md:p-8 space-y-5">
        <h2 className="text-base font-serif font-bold text-white border-b border-white/10 pb-3">
          Product Identification & Category
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs uppercase tracking-wider text-white/70 font-sans mb-1.5">
              Product Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Nervify Forte"
              className="w-full bg-[#0A1410] border border-white/10 px-4 py-2.5 text-sm text-white rounded-xs focus:border-[#81998D] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-white/70 font-sans mb-1.5">
              URL Slug *
            </label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="nervify-forte"
              className="w-full bg-[#0A1410] border border-white/10 px-4 py-2.5 text-sm text-white rounded-xs focus:border-[#81998D] outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs uppercase tracking-wider text-white/70 font-sans mb-1.5">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-[#0A1410] border border-white/10 px-4 py-2.5 text-sm text-white rounded-xs focus:border-[#81998D] outline-none"
            >
              {categories.length > 0 ? (
                categories.map((c) => (
                  <option key={c.id} value={c.name} className="bg-[#0E1B15] text-white">
                    {c.name}
                  </option>
                ))
              ) : (
                <>
                  <option value="Neurological Wellness">Neurological Wellness</option>
                  <option value="Joint & Mobility">Joint & Mobility</option>
                  <option value="Hepatic Wellness">Hepatic Wellness</option>
                  <option value="Immune & Cellular">Immune & Cellular</option>
                </>
              )}
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-white/70 font-sans mb-1.5">
              Formulation Subtitle
            </label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              placeholder="e.g. Advanced Neuro-Cellular Formulation"
              className="w-full bg-[#0A1410] border border-white/10 px-4 py-2.5 text-sm text-white rounded-xs focus:border-[#81998D] outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-white/70 font-sans mb-1.5">
            Short Description (Product Card Snippet) *
          </label>
          <textarea
            rows={2}
            required
            value={formData.shortDescription}
            onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
            placeholder="Concise overview summarizing physiological support..."
            className="w-full bg-[#0A1410] border border-white/10 px-4 py-2.5 text-sm text-white rounded-xs focus:border-[#81998D] outline-none"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-white/70 font-sans mb-1.5">
            Full Description (Product Detail Page) *
          </label>
          <textarea
            rows={4}
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Detailed editorial narrative of the formulation..."
            className="w-full bg-[#0A1410] border border-white/10 px-4 py-2.5 text-sm text-white rounded-xs focus:border-[#81998D] outline-none"
          />
        </div>
      </div>

      {/* Specifications & Presentation */}
      <div className="bg-[#0E1B15] border border-white/10 rounded-xs p-6 md:p-8 space-y-5">
        <h2 className="text-base font-serif font-bold text-white border-b border-white/10 pb-3">
          Formulation & Packaging Specs
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs uppercase tracking-wider text-white/70 font-sans mb-1.5">
              Dosage Form
            </label>
            <input
              type="text"
              value={formData.form}
              onChange={(e) => setFormData({ ...formData, form: e.target.value })}
              placeholder="e.g. Film-Coated Tablets, Vegetarian Capsules"
              className="w-full bg-[#0A1410] border border-white/10 px-4 py-2.5 text-sm text-white rounded-xs focus:border-[#81998D] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-white/70 font-sans mb-1.5">
              Packaging Presentation
            </label>
            <input
              type="text"
              value={formData.packaging}
              onChange={(e) => setFormData({ ...formData, packaging: e.target.value })}
              placeholder="e.g. Box of 60 Tablets (6 × 10 Blister Pack)"
              className="w-full bg-[#0A1410] border border-white/10 px-4 py-2.5 text-sm text-white rounded-xs focus:border-[#81998D] outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs uppercase tracking-wider text-white/70 font-sans mb-1.5">
              Formulation Composition Matrix
            </label>
            <input
              type="text"
              value={formData.formulation}
              onChange={(e) => setFormData({ ...formData, formulation: e.target.value })}
              placeholder="e.g. Neuro-supportive micronutrient matrix with bio-factors"
              className="w-full bg-[#0A1410] border border-white/10 px-4 py-2.5 text-sm text-white rounded-xs focus:border-[#81998D] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-white/70 font-sans mb-1.5">
              Wellness Focus
            </label>
            <input
              type="text"
              value={formData.wellnessFocus}
              onChange={(e) => setFormData({ ...formData, wellnessFocus: e.target.value })}
              placeholder="e.g. Peripheral nervous system & everyday vitality"
              className="w-full bg-[#0A1410] border border-white/10 px-4 py-2.5 text-sm text-white rounded-xs focus:border-[#81998D] outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-white/70 font-sans mb-1.5">
            Usage Advice (Non-clinical instruction)
          </label>
          <input
            type="text"
            value={formData.usageAdvice}
            onChange={(e) => setFormData({ ...formData, usageAdvice: e.target.value })}
            placeholder="e.g. Take as directed by your healthcare professional."
            className="w-full bg-[#0A1410] border border-white/10 px-4 py-2.5 text-sm text-white rounded-xs focus:border-[#81998D] outline-none"
          />
        </div>
      </div>

      {/* Key Focus & Highlights */}
      <div className="bg-[#0E1B15] border border-white/10 rounded-xs p-6 md:p-8 space-y-5">
        <h2 className="text-base font-serif font-bold text-white border-b border-white/10 pb-3">
          Key Focus Points & Highlights
        </h2>

        {/* Key Focus Bullets */}
        <div className="space-y-3">
          <label className="block text-xs uppercase tracking-wider text-white/70 font-sans">
            Key Focus Bullets (Displayed on PDP)
          </label>
          {formData.keyFocus.map((item, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) => {
                  const updated = [...formData.keyFocus];
                  updated[idx] = e.target.value;
                  setFormData({ ...formData, keyFocus: updated });
                }}
                placeholder="e.g. Nerve tissue nourishment & micro-cellular support"
                className="flex-1 bg-[#0A1410] border border-white/10 px-4 py-2 text-sm text-white rounded-xs focus:border-[#81998D] outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  const updated = formData.keyFocus.filter((_, i) => i !== idx);
                  setFormData({ ...formData, keyFocus: updated });
                }}
                className="p-2 text-white/40 hover:text-red-400 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setFormData({ ...formData, keyFocus: [...formData.keyFocus, ""] })
            }
            className="text-xs text-[#81998D] hover:text-white transition-colors flex items-center gap-1 font-semibold uppercase tracking-wider pt-1"
          >
            <Plus size={13} />
            <span>Add Focus Bullet</span>
          </button>
        </div>

        {/* Highlights Key-Value Pairs */}
        <div className="space-y-3 pt-4 border-t border-white/10">
          <label className="block text-xs uppercase tracking-wider text-white/70 font-sans">
            Technical Specification Highlights
          </label>
          {formData.highlights.map((item, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                type="text"
                value={item.label}
                onChange={(e) => {
                  const updated = [...formData.highlights];
                  updated[idx] = { ...updated[idx], label: e.target.value };
                  setFormData({ ...formData, highlights: updated });
                }}
                placeholder="Label (e.g. Form)"
                className="w-1/3 bg-[#0A1410] border border-white/10 px-4 py-2 text-sm text-white rounded-xs focus:border-[#81998D] outline-none"
              />
              <input
                type="text"
                value={item.value}
                onChange={(e) => {
                  const updated = [...formData.highlights];
                  updated[idx] = { ...updated[idx], value: e.target.value };
                  setFormData({ ...formData, highlights: updated });
                }}
                placeholder="Value (e.g. Film-Coated Tablets)"
                className="flex-1 bg-[#0A1410] border border-white/10 px-4 py-2 text-sm text-white rounded-xs focus:border-[#81998D] outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  const updated = formData.highlights.filter((_, i) => i !== idx);
                  setFormData({ ...formData, highlights: updated });
                }}
                className="p-2 text-white/40 hover:text-red-400 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setFormData({
                ...formData,
                highlights: [...formData.highlights, { label: "", value: "" }],
              })
            }
            className="text-xs text-[#81998D] hover:text-white transition-colors flex items-center gap-1 font-semibold uppercase tracking-wider pt-1"
          >
            <Plus size={13} />
            <span>Add Highlight Row</span>
          </button>
        </div>
      </div>

      {/* Product Image & Visibility Settings */}
      <div className="bg-[#0E1B15] border border-white/10 rounded-xs p-6 md:p-8 space-y-5">
        <h2 className="text-base font-serif font-bold text-white border-b border-white/10 pb-3">
          Product Photography & Publishing State
        </h2>

        <div>
          <label className="block text-xs uppercase tracking-wider text-white/70 font-sans mb-1.5">
            Primary Product Image *
          </label>
          <div className="flex flex-col sm:flex-row items-start gap-4">
            {formData.image && (
              <div className="relative w-24 h-24 rounded-xs overflow-hidden border border-white/15 bg-white shrink-0">
                <Image
                  src={formData.image}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1 w-full space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="/images/products/nervify-forte.jpg"
                  className="flex-1 bg-[#0A1410] border border-white/10 px-4 py-2.5 text-sm text-white rounded-xs focus:border-[#81998D] outline-none"
                />
                <label className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer border border-white/10 shrink-0">
                  <Upload size={13} />
                  <span>{isUploading ? "Uploading..." : "Upload"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                </label>
              </div>
              <span className="text-[11px] text-white/40 block font-sans">
                Enter an image URL, local path, or click Upload to attach a file.
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-4 border-t border-white/10 items-center">
          <div>
            <label className="block text-xs uppercase tracking-wider text-white/70 font-sans mb-1.5">
              Display Order
            </label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
              className="w-full bg-[#0A1410] border border-white/10 px-4 py-2 text-sm text-white rounded-xs focus:border-[#81998D] outline-none"
            />
          </div>

          <div className="flex items-center gap-3 pt-4 sm:pt-0">
            <input
              type="checkbox"
              id="featured-checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="rounded-xs w-4 h-4 accent-[#123C2D]"
            />
            <label htmlFor="featured-checkbox" className="text-xs uppercase tracking-wider text-white font-sans cursor-pointer">
              Mark as Featured Product
            </label>
          </div>

          <div className="flex items-center gap-3 pt-4 sm:pt-0">
            <input
              type="checkbox"
              id="published-checkbox"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="rounded-xs w-4 h-4 accent-[#123C2D]"
            />
            <label htmlFor="published-checkbox" className="text-xs uppercase tracking-wider text-white font-sans cursor-pointer">
              Published (Visible on site)
            </label>
          </div>
        </div>
      </div>
    </form>
  );
}
