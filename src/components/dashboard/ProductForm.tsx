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
  Image as ImageIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Product,
  ProductImage,
  CompositionItem,
  ProductNutrition,
  ProductSEO,
  ProductStatus,
} from "@/types/product";

interface ProductHighlight {
  label: string;
  value: string;
}

interface ProductFormData {
  name: string;
  slug: string;
  brand: string;
  subtitle: string;
  category: string;
  productType: string;
  productClassification: string;
  packSize: string;
  netVolume: string;
  flavour: string;
  sugarStatement: string;
  ageStatement: string;
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
  images: ProductImage[];
  composition: CompositionItem[];
  nutrition: ProductNutrition;
  otherIngredients: string[];
  recommendedUsage: string;
  storageInstructions: string[];
  warnings: string[];
  status: ProductStatus;
  featured: boolean;
  published: boolean;
  order: number;
  seo: ProductSEO;
}

interface ProductFormProps {
  initialData?: Partial<Product>;
  productId?: string;
  isEditing?: boolean;
}

export function ProductForm({ initialData, productId, isEditing }: ProductFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<ProductFormData>({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    brand: initialData?.brand || "Celife",
    subtitle: initialData?.subtitle || "",
    category: initialData?.category || "Nutritional Wellness",
    productType: initialData?.productType || "",
    productClassification: initialData?.productClassification || "Health Supplement",
    packSize: initialData?.packSize || "",
    netVolume: initialData?.netVolume || "",
    flavour: initialData?.flavour || "",
    sugarStatement: initialData?.sugarStatement || "",
    ageStatement: initialData?.ageStatement || "",
    shortDescription: initialData?.shortDescription || "",
    description: initialData?.description || "",
    formulation: initialData?.formulation || "",
    form: initialData?.form || "Oral Liquid Formulation",
    packaging: initialData?.packaging || "",
    wellnessFocus: initialData?.wellnessFocus || "",
    usageAdvice: initialData?.usageAdvice || "",
    keyFocus: initialData?.keyFocus && initialData.keyFocus.length > 0 ? initialData.keyFocus : [""],
    highlights: initialData?.highlights || [],
    image: initialData?.image || "/images/products/vitafiv-syrup.jpg",
    images:
      initialData?.images && initialData.images.length > 0
        ? initialData.images
        : [
            {
              url: initialData?.image || "/images/products/vitafiv-syrup.jpg",
              alt: initialData?.name || "Pack View",
              altText: initialData?.name || "Pack View",
              type: "main",
              order: 1,
              isPrimary: true,
              sortOrder: 0,
            },
          ],
    composition: initialData?.composition || [],
    nutrition: initialData?.nutrition || {
      servingSize: "5 ml",
      servingsPerContainer: "40",
    },
    otherIngredients: initialData?.otherIngredients || [],
    recommendedUsage: initialData?.recommendedUsage || "",
    storageInstructions: initialData?.storageInstructions || [],
    warnings: initialData?.warnings || [],
    status: initialData?.status || (initialData?.published ? "published" : "draft"),
    featured: initialData?.featured || false,
    published: initialData?.published ?? true,
    order: initialData?.order ?? 0,
    seo: initialData?.seo || {
      metaTitle: "",
      metaDescription: "",
      keywords: [],
    },
  });

  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingSlot, setUploadingSlot] = useState<number | null>(null);
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
    if (!isEditing || !formData.slug) {
      updates.slug = val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
    }
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  // Image Upload handler for 5 slots
  const handleSlotImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, slotIdx: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingSlot(slotIdx);
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

      setFormData((prev) => {
        const newImages = [...prev.images];
        if (newImages[slotIdx]) {
          newImages[slotIdx] = { ...newImages[slotIdx], url: data.url };
        } else {
          newImages.push({
            url: data.url,
            alt: `${prev.name || "Product"} View ${slotIdx + 1}`,
            altText: `${prev.name || "Product"} View ${slotIdx + 1}`,
            type: slotIdx === 0 ? "main" : slotIdx === 1 ? "front" : slotIdx === 2 ? "back" : slotIdx === 3 ? "bottle" : "graphic",
            order: slotIdx + 1,
            isPrimary: slotIdx === 0,
            sortOrder: slotIdx,
          });
        }
        return {
          ...prev,
          images: newImages,
          image: slotIdx === 0 ? data.url : prev.image,
        };
      });
    } catch (err: unknown) {
      alert("Image upload error: " + (err instanceof Error ? err.message : "Failed"));
    } finally {
      setUploadingSlot(null);
    }
  };

  // Composition Row Helpers
  const addCompositionRow = () => {
    setFormData((prev) => ({
      ...prev,
      composition: [
        ...prev.composition,
        {
          ingredient: "",
          standardisedTo: "",
          quantity: "",
          unit: "mg",
          rdaPercentage: null,
          rdaDisplay: "",
          category: "Other",
        },
      ],
    }));
  };

  const updateCompositionRow = <K extends keyof CompositionItem>(
    idx: number,
    field: K,
    val: CompositionItem[K]
  ) => {
    setFormData((prev) => {
      const next = [...prev.composition];
      next[idx] = { ...next[idx], [field]: val };
      return { ...prev, composition: next };
    });
  };

  const removeCompositionRow = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      composition: prev.composition.filter((_, i) => i !== idx),
    }));
  };

  // Array string helpers (Other Ingredients, Storage, Warnings)
  const addStringItem = (field: "otherIngredients" | "storageInstructions" | "warnings") => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const updateStringItem = (
    field: "otherIngredients" | "storageInstructions" | "warnings",
    idx: number,
    val: string
  ) => {
    setFormData((prev) => {
      const next = [...prev[field]];
      next[idx] = val;
      return { ...prev, [field]: next };
    });
  };

  const removeStringItem = (
    field: "otherIngredients" | "storageInstructions" | "warnings",
    idx: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== idx),
    }));
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    const cleanedKeyFocus = formData.keyFocus.filter((k) => k.trim().length > 0);
    const cleanedOtherIngredients = formData.otherIngredients.filter((k) => k.trim().length > 0);
    const cleanedStorage = formData.storageInstructions.filter((k) => k.trim().length > 0);
    const cleanedWarnings = formData.warnings.filter((k) => k.trim().length > 0);
    const cleanedComposition = formData.composition.filter((c) => c.ingredient.trim().length > 0);

    const primaryImage =
      formData.images.find((img) => img.isPrimary)?.url ||
      formData.images[0]?.url ||
      formData.image;

    const payload = {
      ...formData,
      image: primaryImage,
      keyFocus: cleanedKeyFocus,
      otherIngredients: cleanedOtherIngredients,
      storageInstructions: cleanedStorage,
      warnings: cleanedWarnings,
      composition: cleanedComposition,
      published: formData.status === "published",
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
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl pb-16 select-none font-sans">
      {/* Top action row */}
      <div className="flex items-center justify-between gap-4 pb-6 border-b border-[#E1E8E2]">
        <Link
          href="/dashboard/products"
          className="text-xs uppercase tracking-wider text-[#68756D] hover:text-[#17201B] font-semibold transition-colors flex items-center gap-2"
        >
          <ArrowLeft size={14} />
          <span>Back to Products</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-[#123C2D] hover:bg-[#294F3D] text-white text-xs uppercase tracking-wider font-semibold rounded-xs transition-all flex items-center gap-2 border border-[#123C2D] shadow-xs disabled:opacity-50 cursor-pointer"
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
          className={`p-4 rounded-xs text-xs font-sans flex items-center gap-2.5 border ${
            feedback.type === "error"
              ? "bg-red-50 border-red-200 text-[#C0392B]"
              : "bg-emerald-50 border-emerald-200 text-[#2F7D54]"
          }`}
        >
          {feedback.type === "error" ? <AlertCircle size={15} /> : <CheckCircle2 size={15} />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* SECTION 1: Product Identification & Core Status */}
      <div className="bg-[#FFFFFF] border border-[#E1E8E2] rounded-xs p-6 md:p-8 space-y-5 shadow-2xs">
        <div className="flex items-center justify-between border-b border-[#E1E8E2] pb-3">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#6F8F80]">Section 1</span>
            <h2 className="text-base font-serif font-bold text-[#17201B]">
              Identification & Publishing Status
            </h2>
          </div>
          <span className="text-xs font-mono text-[#68756D]">Basic Info</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#17201B] font-semibold mb-1.5">
              Product Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. VITAFIV Syrup"
              className="w-full bg-[#FFFFFF] border border-[#E1E8E2] px-4 py-2.5 text-xs text-[#17201B] rounded-xs focus:border-[#123C2D] outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#17201B] font-semibold mb-1.5">
              URL Slug *
            </label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
              placeholder="e.g. vitafiv-syrup"
              className="w-full bg-[#FFFFFF] border border-[#E1E8E2] px-4 py-2.5 text-xs font-mono text-[#17201B] rounded-xs focus:border-[#123C2D] outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#17201B] font-semibold mb-1.5">
              Brand
            </label>
            <input
              type="text"
              value={formData.brand}
              onChange={(e) => setFormData((prev) => ({ ...prev, brand: e.target.value }))}
              placeholder="e.g. Celife"
              className="w-full bg-[#FFFFFF] border border-[#E1E8E2] px-4 py-2.5 text-xs text-[#17201B] rounded-xs focus:border-[#123C2D] outline-none transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#17201B] font-semibold mb-1.5">
              Therapeutic Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
              className="w-full bg-[#FFFFFF] border border-[#E1E8E2] px-4 py-2.5 text-xs text-[#17201B] rounded-xs focus:border-[#123C2D] outline-none transition-colors cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#17201B] font-semibold mb-1.5">
              Lifecycle Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  status: e.target.value as ProductStatus,
                  published: e.target.value === "published",
                }))
              }
              className="w-full bg-[#FFFFFF] border border-[#E1E8E2] px-4 py-2.5 text-xs font-semibold text-[#17201B] rounded-xs focus:border-[#123C2D] outline-none transition-colors cursor-pointer"
            >
              <option value="draft">Draft (Private)</option>
              <option value="published">Published (Live)</option>
              <option value="archived">Archived (Hidden)</option>
            </select>
          </div>

          <div className="flex items-center gap-6 pt-6">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#17201B]">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData((prev) => ({ ...prev, featured: e.target.checked }))}
                className="w-4 h-4 text-[#123C2D] rounded border-[#E1E8E2] focus:ring-0"
              />
              <span>Featured on Homepage</span>
            </label>
          </div>
        </div>
      </div>

      {/* SECTION 2: Product Presentation, Packaging & Regulatory Classification */}
      <div className="bg-[#FFFFFF] border border-[#E1E8E2] rounded-xs p-6 md:p-8 space-y-5 shadow-2xs">
        <div className="flex items-center justify-between border-b border-[#E1E8E2] pb-3">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#6F8F80]">Section 2</span>
            <h2 className="text-base font-serif font-bold text-[#17201B]">
              Presentation, Packaging & Classification
            </h2>
          </div>
          <span className="text-xs font-mono text-[#68756D]">Verified Packaging</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#17201B] font-semibold mb-1.5">
              Product Classification
            </label>
            <input
              type="text"
              value={formData.productClassification}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, productClassification: e.target.value }))
              }
              placeholder="e.g. Health Supplement"
              className="w-full bg-[#FFFFFF] border border-[#E1E8E2] px-4 py-2.5 text-xs text-[#17201B] rounded-xs focus:border-[#123C2D] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#17201B] font-semibold mb-1.5">
              Pack Size
            </label>
            <input
              type="text"
              value={formData.packSize}
              onChange={(e) => setFormData((prev) => ({ ...prev, packSize: e.target.value }))}
              placeholder="e.g. 200 ml Bottle"
              className="w-full bg-[#FFFFFF] border border-[#E1E8E2] px-4 py-2.5 text-xs text-[#17201B] rounded-xs focus:border-[#123C2D] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#17201B] font-semibold mb-1.5">
              Net Volume
            </label>
            <input
              type="text"
              value={formData.netVolume}
              onChange={(e) => setFormData((prev) => ({ ...prev, netVolume: e.target.value }))}
              placeholder="e.g. 200 ml"
              className="w-full bg-[#FFFFFF] border border-[#E1E8E2] px-4 py-2.5 text-xs text-[#17201B] rounded-xs focus:border-[#123C2D] outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#17201B] font-semibold mb-1.5">
              Flavour Profile
            </label>
            <input
              type="text"
              value={formData.flavour}
              onChange={(e) => setFormData((prev) => ({ ...prev, flavour: e.target.value }))}
              placeholder="e.g. Mixed Fruit Flavour"
              className="w-full bg-[#FFFFFF] border border-[#E1E8E2] px-4 py-2.5 text-xs text-[#17201B] rounded-xs focus:border-[#123C2D] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#17201B] font-semibold mb-1.5">
              Sugar Profile
            </label>
            <input
              type="text"
              value={formData.sugarStatement}
              onChange={(e) => setFormData((prev) => ({ ...prev, sugarStatement: e.target.value }))}
              placeholder="e.g. Contains artificial sweetener"
              className="w-full bg-[#FFFFFF] border border-[#E1E8E2] px-4 py-2.5 text-xs text-[#17201B] rounded-xs focus:border-[#123C2D] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#17201B] font-semibold mb-1.5">
              Target Age Demographics
            </label>
            <input
              type="text"
              value={formData.ageStatement}
              onChange={(e) => setFormData((prev) => ({ ...prev, ageStatement: e.target.value }))}
              placeholder="e.g. Adults and children above 5 years"
              className="w-full bg-[#FFFFFF] border border-[#E1E8E2] px-4 py-2.5 text-xs text-[#17201B] rounded-xs focus:border-[#123C2D] outline-none"
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: Descriptions & Rationale */}
      <div className="bg-[#FFFFFF] border border-[#E1E8E2] rounded-xs p-6 md:p-8 space-y-5 shadow-2xs">
        <div className="flex items-center justify-between border-b border-[#E1E8E2] pb-3">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#6F8F80]">Section 3</span>
            <h2 className="text-base font-serif font-bold text-[#17201B]">
              Clinical Positioning & Descriptions
            </h2>
          </div>
          <span className="text-xs font-mono text-[#68756D]">Copy & Editorial</span>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-[#17201B] font-semibold mb-1.5">
            Short Description (Catalog cards & Search) *
          </label>
          <input
            type="text"
            required
            value={formData.shortDescription}
            onChange={(e) => setFormData((prev) => ({ ...prev, shortDescription: e.target.value }))}
            placeholder="e.g. Calibrated multivitamin syrup with 25 essential vitamins, minerals, and amino acids."
            className="w-full bg-[#FFFFFF] border border-[#E1E8E2] px-4 py-2.5 text-xs text-[#17201B] rounded-xs focus:border-[#123C2D] outline-none"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-[#17201B] font-semibold mb-1.5">
            Full Scientific Formulation Overview
          </label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Detailed clinical rationale, mechanism of action, and formulation background..."
            className="w-full bg-[#FFFFFF] border border-[#E1E8E2] p-4 text-xs text-[#17201B] rounded-xs focus:border-[#123C2D] outline-none"
          />
        </div>
      </div>

      {/* SECTION 4: Active Composition Rows (Dynamic 25 Actives Table) */}
      <div className="bg-[#FFFFFF] border border-[#E1E8E2] rounded-xs p-6 md:p-8 space-y-5 shadow-2xs">
        <div className="flex items-center justify-between border-b border-[#E1E8E2] pb-3">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#6F8F80]">Section 4</span>
            <h2 className="text-base font-serif font-bold text-[#17201B]">
              Active Bioactive Composition ({formData.composition.length} items)
            </h2>
          </div>
          <button
            type="button"
            onClick={addCompositionRow}
            className="px-3.5 py-1.5 bg-[#123C2D] text-white text-xs font-semibold rounded-xs flex items-center gap-1.5 hover:bg-[#294F3D] cursor-pointer"
          >
            <Plus size={13} />
            <span>Add Active Row</span>
          </button>
        </div>

        {formData.composition.length === 0 ? (
          <p className="text-xs text-[#68756D] italic py-4 text-center">
            No active ingredients added yet. Click &quot;Add Active Row&quot; above to enter vitamins, minerals, or amino acids.
          </p>
        ) : (
          <div className="space-y-3 overflow-x-auto">
            <div className="grid grid-cols-12 gap-2 text-[11px] font-semibold uppercase text-[#68756D] px-2">
              <span className="col-span-3">Ingredient</span>
              <span className="col-span-3">Standardised Form</span>
              <span className="col-span-2">Quantity & Unit</span>
              <span className="col-span-2">% RDA</span>
              <span className="col-span-1">RDA Note</span>
              <span className="col-span-1 text-right">Action</span>
            </div>

            {formData.composition.map((comp, idx) => (
              <div
                key={idx}
                className="grid grid-cols-12 gap-2 items-center bg-[#F8FAF6] p-2 rounded-xs border border-[#E1E8E2]"
              >
                <div className="col-span-3">
                  <input
                    type="text"
                    value={comp.ingredient}
                    onChange={(e) => updateCompositionRow(idx, "ingredient", e.target.value)}
                    placeholder="e.g. Vitamin C"
                    className="w-full bg-[#FFFFFF] border border-[#E1E8E2] px-2.5 py-1.5 text-xs text-[#17201B] rounded-xs"
                  />
                </div>
                <div className="col-span-3">
                  <input
                    type="text"
                    value={comp.standardisedTo || ""}
                    onChange={(e) => updateCompositionRow(idx, "standardisedTo", e.target.value)}
                    placeholder="e.g. L-Ascorbic Acid"
                    className="w-full bg-[#FFFFFF] border border-[#E1E8E2] px-2.5 py-1.5 text-xs text-[#17201B] rounded-xs"
                  />
                </div>
                <div className="col-span-2 flex gap-1">
                  <input
                    type="text"
                    value={comp.quantity}
                    onChange={(e) => updateCompositionRow(idx, "quantity", e.target.value)}
                    placeholder="40"
                    className="w-2/3 bg-[#FFFFFF] border border-[#E1E8E2] px-2 py-1.5 text-xs text-[#17201B] rounded-xs"
                  />
                  <input
                    type="text"
                    value={comp.unit || ""}
                    onChange={(e) => updateCompositionRow(idx, "unit", e.target.value)}
                    placeholder="mg"
                    className="w-1/3 bg-[#FFFFFF] border border-[#E1E8E2] px-1 py-1.5 text-xs text-[#17201B] rounded-xs text-center"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    step="0.1"
                    value={comp.rdaPercentage ?? ""}
                    onChange={(e) =>
                      updateCompositionRow(
                        idx,
                        "rdaPercentage",
                        e.target.value ? parseFloat(e.target.value) : null
                      )
                    }
                    placeholder="100"
                    className="w-full bg-[#FFFFFF] border border-[#E1E8E2] px-2 py-1.5 text-xs text-[#17201B] rounded-xs"
                  />
                </div>
                <div className="col-span-1">
                  <input
                    type="text"
                    value={comp.rdaDisplay || ""}
                    onChange={(e) => updateCompositionRow(idx, "rdaDisplay", e.target.value)}
                    placeholder="#"
                    className="w-full bg-[#FFFFFF] border border-[#E1E8E2] px-1 py-1.5 text-xs text-center text-[#17201B] rounded-xs"
                  />
                </div>
                <div className="col-span-1 text-right">
                  <button
                    type="button"
                    onClick={() => removeCompositionRow(idx)}
                    className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 5: Nutrition Information (Facts Panel) */}
      <div className="bg-[#FFFFFF] border border-[#E1E8E2] rounded-xs p-6 md:p-8 space-y-5 shadow-2xs">
        <div className="flex items-center justify-between border-b border-[#E1E8E2] pb-3">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#6F8F80]">Section 5</span>
            <h2 className="text-base font-serif font-bold text-[#17201B]">
              Nutritional Facts Panel
            </h2>
          </div>
          <span className="text-xs font-mono text-[#68756D]">Caloric & Macronutrient Breakdown</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs uppercase text-[#17201B] font-semibold mb-1">
              Serving Size
            </label>
            <input
              type="text"
              value={formData.nutrition?.servingSize || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  nutrition: { ...prev.nutrition, servingSize: e.target.value },
                }))
              }
              placeholder="e.g. 5 ml"
              className="w-full bg-[#FFFFFF] border border-[#E1E8E2] px-3 py-2 text-xs rounded-xs"
            />
          </div>
          <div>
            <label className="block text-xs uppercase text-[#17201B] font-semibold mb-1">
              Energy (kcal)
            </label>
            <input
              type="text"
              value={formData.nutrition?.energy || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  nutrition: { ...prev.nutrition, energy: e.target.value },
                }))
              }
              placeholder="12.12"
              className="w-full bg-[#FFFFFF] border border-[#E1E8E2] px-3 py-2 text-xs rounded-xs"
            />
          </div>
          <div>
            <label className="block text-xs uppercase text-[#17201B] font-semibold mb-1">
              Carbohydrates (g)
            </label>
            <input
              type="text"
              value={formData.nutrition?.carbohydrates || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  nutrition: { ...prev.nutrition, carbohydrates: e.target.value },
                }))
              }
              placeholder="3.03"
              className="w-full bg-[#FFFFFF] border border-[#E1E8E2] px-3 py-2 text-xs rounded-xs"
            />
          </div>
          <div>
            <label className="block text-xs uppercase text-[#17201B] font-semibold mb-1">
              Protein (g)
            </label>
            <input
              type="text"
              value={formData.nutrition?.protein || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  nutrition: { ...prev.nutrition, protein: e.target.value },
                }))
              }
              placeholder="0.0"
              className="w-full bg-[#FFFFFF] border border-[#E1E8E2] px-3 py-2 text-xs rounded-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs uppercase text-[#17201B] font-semibold mb-1">
              Total Sugars (g)
            </label>
            <input
              type="text"
              value={formData.nutrition?.totalSugars || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  nutrition: { ...prev.nutrition, totalSugars: e.target.value },
                }))
              }
              placeholder="2.75"
              className="w-full bg-[#FFFFFF] border border-[#E1E8E2] px-3 py-2 text-xs rounded-xs"
            />
          </div>
          <div>
            <label className="block text-xs uppercase text-[#17201B] font-semibold mb-1">
              Added Sugars (g)
            </label>
            <input
              type="text"
              value={formData.nutrition?.addedSugars || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  nutrition: { ...prev.nutrition, addedSugars: e.target.value },
                }))
              }
              placeholder="0.0"
              className="w-full bg-[#FFFFFF] border border-[#E1E8E2] px-3 py-2 text-xs rounded-xs"
            />
          </div>
          <div>
            <label className="block text-xs uppercase text-[#17201B] font-semibold mb-1">
              Total Fat (g)
            </label>
            <input
              type="text"
              value={formData.nutrition?.fat || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  nutrition: { ...prev.nutrition, fat: e.target.value },
                }))
              }
              placeholder="0.0"
              className="w-full bg-[#FFFFFF] border border-[#E1E8E2] px-3 py-2 text-xs rounded-xs"
            />
          </div>
          <div>
            <label className="block text-xs uppercase text-[#17201B] font-semibold mb-1">
              Sodium (mg)
            </label>
            <input
              type="text"
              value={formData.nutrition?.sodium || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  nutrition: { ...prev.nutrition, sodium: e.target.value },
                }))
              }
              placeholder="5.2"
              className="w-full bg-[#FFFFFF] border border-[#E1E8E2] px-3 py-2 text-xs rounded-xs"
            />
          </div>
        </div>
      </div>

      {/* SECTION 6: Other Ingredients (Excipients List) */}
      <div className="bg-[#FFFFFF] border border-[#E1E8E2] rounded-xs p-6 md:p-8 space-y-5 shadow-2xs">
        <div className="flex items-center justify-between border-b border-[#E1E8E2] pb-3">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#6F8F80]">Section 6</span>
            <h2 className="text-base font-serif font-bold text-[#17201B]">
              Other Ingredients & Excipients ({formData.otherIngredients.length} items)
            </h2>
          </div>
          <button
            type="button"
            onClick={() => addStringItem("otherIngredients")}
            className="px-3.5 py-1.5 bg-[#123C2D] text-white text-xs font-semibold rounded-xs flex items-center gap-1.5 hover:bg-[#294F3D] cursor-pointer"
          >
            <Plus size={13} />
            <span>Add Excipient</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {formData.otherIngredients.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) => updateStringItem("otherIngredients", idx, e.target.value)}
                placeholder="e.g. Purified Water, Liquid Glucose"
                className="flex-1 bg-[#FFFFFF] border border-[#E1E8E2] px-3 py-2 text-xs rounded-xs"
              />
              <button
                type="button"
                onClick={() => removeStringItem("otherIngredients", idx)}
                className="text-red-500 hover:text-red-700 p-1"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 7 & 8: Usage & Storage Instructions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SECTION 7: Recommended Usage */}
        <div className="bg-[#FFFFFF] border border-[#E1E8E2] rounded-xs p-6 space-y-4 shadow-2xs">
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#6F8F80]">Section 7</span>
          <h2 className="text-base font-serif font-bold text-[#17201B] border-b border-[#E1E8E2] pb-2">
            Recommended Usage
          </h2>
          <textarea
            rows={3}
            value={formData.recommendedUsage}
            onChange={(e) => setFormData((prev) => ({ ...prev, recommendedUsage: e.target.value }))}
            placeholder="One teaspoonful (5 ml) daily or as directed by the Healthcare Professional."
            className="w-full bg-[#FFFFFF] border border-[#E1E8E2] p-3 text-xs text-[#17201B] rounded-xs"
          />
        </div>

        {/* SECTION 8: Storage Instructions */}
        <div className="bg-[#FFFFFF] border border-[#E1E8E2] rounded-xs p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-[#E1E8E2] pb-2">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#6F8F80]">Section 8</span>
              <h2 className="text-base font-serif font-bold text-[#17201B]">
                Storage Conditions
              </h2>
            </div>
            <button
              type="button"
              onClick={() => addStringItem("storageInstructions")}
              className="text-xs text-[#123C2D] font-semibold hover:underline flex items-center gap-1"
            >
              <Plus size={13} />
              <span>Add Condition</span>
            </button>
          </div>
          <div className="space-y-2">
            {formData.storageInstructions.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateStringItem("storageInstructions", idx, e.target.value)}
                  placeholder="e.g. Store in a cool, dry & dark place, below 25°C."
                  className="flex-1 bg-[#FFFFFF] border border-[#E1E8E2] px-3 py-1.5 text-xs rounded-xs"
                />
                <button
                  type="button"
                  onClick={() => removeStringItem("storageInstructions", idx)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 9: Professional Warnings & Disclaimers */}
      <div className="bg-[#FFFFFF] border border-[#E1E8E2] rounded-xs p-6 md:p-8 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between border-b border-[#E1E8E2] pb-3">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#6F8F80]">Section 9</span>
            <h2 className="text-base font-serif font-bold text-[#17201B]">
              Warnings, Disclaimers & Cautions ({formData.warnings.length} items)
            </h2>
          </div>
          <button
            type="button"
            onClick={() => addStringItem("warnings")}
            className="px-3.5 py-1.5 bg-[#123C2D] text-white text-xs font-semibold rounded-xs flex items-center gap-1.5 hover:bg-[#294F3D] cursor-pointer"
          >
            <Plus size={13} />
            <span>Add Warning</span>
          </button>
        </div>

        <div className="space-y-2">
          {formData.warnings.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) => updateStringItem("warnings", idx, e.target.value)}
                placeholder="e.g. NOT FOR MEDICINAL USE, Keep out of reach of children"
                className="flex-1 bg-[#FFFFFF] border border-[#E1E8E2] px-3 py-2 text-xs rounded-xs"
              />
              <button
                type="button"
                onClick={() => removeStringItem("warnings", idx)}
                className="text-red-500 hover:text-red-700 p-1"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 10: 5 Image Slots Management */}
      <div className="bg-[#FFFFFF] border border-[#E1E8E2] rounded-xs p-6 md:p-8 space-y-5 shadow-2xs">
        <div className="flex items-center justify-between border-b border-[#E1E8E2] pb-3">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#6F8F80]">Section 10</span>
            <h2 className="text-base font-serif font-bold text-[#17201B]">
              Product Gallery Images (Up to 5 Slots)
            </h2>
          </div>
          <span className="text-xs font-mono text-[#68756D]">Max 5 High-Res Photos</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[0, 1, 2, 3, 4].map((slotIdx) => {
            const img = formData.images[slotIdx];
            const slotLabels = [
              "Slot 1: Main Pack Presentation",
              "Slot 2: Carton Front View",
              "Slot 3: Composition & Facts Panel",
              "Slot 4: Standalone Bottle",
              "Slot 5: Multi-Nutrient Matrix",
            ];

            return (
              <div
                key={slotIdx}
                className={`p-4 border rounded-xs space-y-3 ${
                  img?.isPrimary ? "border-[#123C2D] bg-[#F8FAF6]" : "border-[#E1E8E2] bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#17201B]">
                    {slotLabels[slotIdx]}
                  </span>
                  {img && (
                    <label className="flex items-center gap-1 text-[11px] text-[#68756D] cursor-pointer">
                      <input
                        type="radio"
                        name="primaryImage"
                        checked={Boolean(img.isPrimary)}
                        onChange={() => {
                          setFormData((prev) => ({
                            ...prev,
                            image: img.url,
                            images: prev.images.map((im, i) => ({
                              ...im,
                              isPrimary: i === slotIdx,
                            })),
                          }));
                        }}
                        className="text-[#123C2D]"
                      />
                      <span>Primary</span>
                    </label>
                  )}
                </div>

                {img?.url ? (
                  <div className="relative aspect-video w-full rounded overflow-hidden border border-[#E1E8E2] bg-[#F4F5EF]">
                    <Image
                      src={img.url}
                      alt={img.altText || "Product photo"}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-video w-full rounded border border-dashed border-[#E1E8E2] flex items-center justify-center bg-[#FAFAF8] text-[#A0ACA5]">
                    <ImageIcon size={24} />
                  </div>
                )}

                <div className="space-y-1.5">
                  <input
                    type="text"
                    value={img?.url || ""}
                    onChange={(e) => {
                      const next = [...formData.images];
                      if (!next[slotIdx]) {
                        next[slotIdx] = {
                          url: e.target.value,
                          alt: `Product View ${slotIdx + 1}`,
                          altText: `Product View ${slotIdx + 1}`,
                          type: slotIdx === 0 ? "main" : slotIdx === 1 ? "front" : slotIdx === 2 ? "back" : slotIdx === 3 ? "bottle" : "graphic",
                          order: slotIdx + 1,
                          isPrimary: slotIdx === 0,
                          sortOrder: slotIdx,
                        };
                      } else {
                        next[slotIdx].url = e.target.value;
                      }
                      setFormData((prev) => ({ ...prev, images: next }));
                    }}
                    placeholder="/images/products/..."
                    className="w-full bg-[#FFFFFF] border border-[#E1E8E2] px-2.5 py-1.5 text-xs text-[#17201B] rounded-xs font-mono"
                  />

                  <div className="flex items-center gap-2">
                    <label className="flex-1 py-1 px-2 border border-[#E1E8E2] rounded-xs text-[11px] text-center font-semibold text-[#123C2D] bg-[#F8FAF6] hover:bg-[#EBEFEA] cursor-pointer transition-colors flex items-center justify-center gap-1.5">
                      {uploadingSlot === slotIdx ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <Upload size={12} />
                      )}
                      <span>{uploadingSlot === slotIdx ? "Uploading..." : "Upload File"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleSlotImageUpload(e, slotIdx)}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 11: SEO Metadata */}
      <div className="bg-[#FFFFFF] border border-[#E1E8E2] rounded-xs p-6 md:p-8 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between border-b border-[#E1E8E2] pb-3">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#6F8F80]">Section 11</span>
            <h2 className="text-base font-serif font-bold text-[#17201B]">
              Search Engine Optimization (SEO)
            </h2>
          </div>
          <span className="text-xs font-mono text-[#68756D]">Meta Tags</span>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#17201B] font-semibold mb-1">
              Meta Title
            </label>
            <input
              type="text"
              value={formData.seo?.metaTitle || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  seo: { ...prev.seo, metaTitle: e.target.value },
                }))
              }
              placeholder="e.g. VITAFIV Syrup | 25 Multivitamins & Minerals"
              className="w-full bg-[#FFFFFF] border border-[#E1E8E2] px-3 py-2 text-xs rounded-xs"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#17201B] font-semibold mb-1">
              Meta Description
            </label>
            <textarea
              rows={2}
              value={formData.seo?.metaDescription || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  seo: { ...prev.seo, metaDescription: e.target.value },
                }))
              }
              placeholder="Calibrated oral multivitamin syrup formulated to ICMR 2020 RDA guidelines..."
              className="w-full bg-[#FFFFFF] border border-[#E1E8E2] p-3 text-xs rounded-xs"
            />
          </div>
        </div>
      </div>

      {/* Bottom Save Bar */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#E1E8E2]">
        <Link
          href="/dashboard/products"
          className="px-5 py-2.5 bg-white border border-[#E1E8E2] text-[#68756D] hover:text-[#17201B] text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-2.5 bg-[#123C2D] hover:bg-[#294F3D] text-white text-xs uppercase tracking-wider font-semibold rounded-xs transition-all flex items-center gap-2 border border-[#123C2D] shadow-xs disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save size={14} />
              <span>{isEditing ? "Save Changes" : "Create Formulation"}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
