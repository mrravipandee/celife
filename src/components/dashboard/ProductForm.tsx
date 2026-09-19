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
  Layers,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Product,
  ProductImage,
  CompositionItem,
  ProductComponent,
  UsageRule,
  ProductNutrition,
  ProductStatus,
} from "@/types/product";

interface ProductHighlight {
  label: string;
  value: string;
}

interface ProductFormData {
  // A. Basic Info
  name: string;
  slug: string;
  brand: string;
  subtitle: string;
  category: string;
  categoryId: string;
  productType: string;
  format: string;
  packSize: string;
  dosageForm: string;
  therapeuticDomain: string;
  flavour: string;
  netVolume: string;
  sugarStatement: string;
  ageStatement: string;
  productClassification: string;
  form: string;
  packaging: string;
  wellnessFocus: string;
  usageAdvice: string;
  keyFocus: string[];
  highlights: ProductHighlight[];

  // B. Product Description & Formulation
  shortDescription: string;
  description: string;
  aboutFormulation: string;
  scientificBackground: string;
  coreRationale: string;

  // C. Dynamic Composition
  composition: CompositionItem[];

  // D. Multi-pack Components
  components: ProductComponent[];

  // E. Usage & Administration
  recommendedUse: string;
  recommendedUsage: string;
  usageInstructions: string;
  administrationNotes: string;
  usageRules: UsageRule[];

  // F. Storage & Safety
  storageInstructions: string[];
  professionalCaution: string;
  warnings: string[];
  notes: string;
  excipientStandard: string;

  // Nutrition & Other Ingredients
  nutrition: ProductNutrition;
  otherIngredients: string[];

  // G. Product Images
  image: string;
  images: ProductImage[];

  // H. SEO
  seo: {
    metaTitle: string;
    metaDescription: string;
    canonicalUrl: string;
    keywords: string[];
  };

  // I. Publishing / Display
  status: ProductStatus;
  featured: boolean;
  published: boolean;
  order: number;
  displayOrder: number;

  // Source Audit
  source: {
    sourceType: string;
    sourceReference: string;
    verified: boolean;
  };
}

interface ProductFormProps {
  initialData?: Partial<Product>;
  productId?: string;
  isEditing?: boolean;
}

const DEFAULT_IMAGE_SLOT_TYPES: Array<"hero" | "front" | "back" | "detail" | "lifestyle"> = [
  "hero",
  "front",
  "back",
  "detail",
  "lifestyle",
];

const SLOT_LABELS = [
  "Slot 1: Main Pack Presentation",
  "Slot 2: Carton Front View",
  "Slot 3: Back / Composition Panel",
  "Slot 4: Product Detail / Texture",
  "Slot 5: Premium Product Graphic",
];

export function ProductForm({ initialData, productId, isEditing }: ProductFormProps) {
  const router = useRouter();

  // Initialize form data with safe defaults for every field
  const [formData, setFormData] = useState<ProductFormData>({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    brand: initialData?.brand || "Celife",
    subtitle: initialData?.subtitle || "",
    category: initialData?.category || "Health Supplement",
    categoryId: initialData?.categoryId || "",
    productType: initialData?.productType || "Health Supplement",
    format: initialData?.format || "",
    packSize: initialData?.packSize || "",
    dosageForm: initialData?.dosageForm || "",
    therapeuticDomain: initialData?.therapeuticDomain || "",
    flavour: initialData?.flavour || "",
    netVolume: initialData?.netVolume || "",
    sugarStatement: initialData?.sugarStatement || "",
    ageStatement: initialData?.ageStatement || "",
    productClassification: initialData?.productClassification || "Health Supplement",
    form: initialData?.form || "Oral Liquid Formulation",
    packaging: initialData?.packaging || "",
    wellnessFocus: initialData?.wellnessFocus || "",
    usageAdvice: initialData?.usageAdvice || "",
    keyFocus: initialData?.keyFocus && initialData.keyFocus.length > 0 ? initialData.keyFocus : [""],
    highlights: initialData?.highlights || [],
    shortDescription: initialData?.shortDescription || "",
    description: initialData?.description || "",
    aboutFormulation: initialData?.aboutFormulation || "",
    scientificBackground: initialData?.scientificBackground || "",
    coreRationale: initialData?.coreRationale || "",
    composition: initialData?.composition || [],
    components: initialData?.components || [],
    recommendedUse: initialData?.recommendedUse || initialData?.recommendedUsage || "",
    recommendedUsage: initialData?.recommendedUsage || initialData?.recommendedUse || "",
    usageInstructions: initialData?.usageInstructions || "",
    administrationNotes: initialData?.administrationNotes || "",
    usageRules: initialData?.usageRules || [],
    storageInstructions: initialData?.storageInstructions || [],
    professionalCaution: initialData?.professionalCaution || "",
    warnings: initialData?.warnings || [],
    notes: initialData?.notes || "",
    excipientStandard: initialData?.excipientStandard || "",
    nutrition: initialData?.nutrition || {
      servingSize: "5 ml",
      energy: "",
      fat: "",
      protein: "",
      carbohydrates: "",
      totalSugars: "",
      addedSugars: "",
      sodium: "",
      excipients: "",
    },
    otherIngredients: initialData?.otherIngredients || [],
    image: initialData?.image || "/images/products/vitafiv-syrup.jpg",
    images:
      initialData?.images && initialData.images.length > 0
        ? initialData.images
        : [
            {
              url: initialData?.image || "/images/products/vitafiv-syrup.jpg",
              alt: initialData?.name || "Main Pack View",
              altText: initialData?.name || "Main Pack View",
              type: "hero",
              order: 1,
              isPrimary: true,
              sortOrder: 0,
            },
          ],
    seo: {
      metaTitle: initialData?.seo?.metaTitle || "",
      metaDescription: initialData?.seo?.metaDescription || "",
      canonicalUrl: initialData?.seo?.canonicalUrl || "",
      keywords: initialData?.seo?.keywords || [],
    },
    status: initialData?.status || (initialData?.published ? "published" : "draft"),
    featured: Boolean(initialData?.featured || initialData?.isFeatured),
    published: initialData?.published ?? true,
    order: initialData?.order ?? initialData?.displayOrder ?? 0,
    displayOrder: initialData?.displayOrder ?? initialData?.order ?? 0,
    source: {
      sourceType: initialData?.source?.sourceType || initialData?.sourceType || "Product packaging",
      sourceReference: initialData?.source?.sourceReference || initialData?.sourceNotes || "",
      verified: initialData?.source?.verified ?? initialData?.contentVerified ?? true,
    },
  });

  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingSlot, setUploadingSlot] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [keywordsInput, setKeywordsInput] = useState((initialData?.seo?.keywords || []).join(", "));

  // Fetch categories from API
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

  // Auto-generate slug from name if creating or slug is empty
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

  // Upload handler for up to 5 image slots
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
        const defaultType = DEFAULT_IMAGE_SLOT_TYPES[slotIdx] || "hero";
        if (newImages[slotIdx]) {
          newImages[slotIdx] = {
            ...newImages[slotIdx],
            url: data.url,
            order: slotIdx + 1,
          };
        } else {
          newImages[slotIdx] = {
            url: data.url,
            alt: `${prev.name || "Product"} View ${slotIdx + 1}`,
            altText: `${prev.name || "Product"} View ${slotIdx + 1}`,
            type: defaultType,
            order: slotIdx + 1,
            isPrimary: slotIdx === 0,
            sortOrder: slotIdx,
          };
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

  // Dynamic Composition Helpers
  const addCompositionRow = () => {
    setFormData((prev) => ({
      ...prev,
      composition: [
        ...prev.composition,
        {
          ingredient: "",
          quantity: "",
          unit: "mg",
          group: "",
          note: "",
          order: prev.composition.length + 1,
          standardisedTo: "",
          rdaPercentage: null,
          rdaDisplay: "#",
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

  // Dynamic Multi-pack Components Helpers (e.g. Bonigo Combo)
  const addComponent = () => {
    setFormData((prev) => ({
      ...prev,
      components: [
        ...prev.components,
        {
          name: `Pack ${prev.components.length + 1}`,
          description: "",
          packSize: "",
          composition: [],
        },
      ],
    }));
  };

  const updateComponent = (idx: number, field: keyof ProductComponent, val: unknown) => {
    setFormData((prev) => {
      const next = [...prev.components];
      next[idx] = { ...next[idx], [field]: val };
      return { ...prev, components: next };
    });
  };

  const removeComponent = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      components: prev.components.filter((_, i) => i !== idx),
    }));
  };

  const addComponentCompositionRow = (compIdx: number) => {
    setFormData((prev) => {
      const next = [...prev.components];
      const comp = next[compIdx];
      const compComposition = comp.composition || [];
      next[compIdx] = {
        ...comp,
        composition: [
          ...compComposition,
          {
            ingredient: "",
            quantity: "",
            unit: "mg",
            group: "",
            note: "",
            order: compComposition.length + 1,
            rdaDisplay: "#",
          },
        ],
      };
      return { ...prev, components: next };
    });
  };

  const updateComponentCompositionRow = (
    compIdx: number,
    rowIdx: number,
    field: keyof CompositionItem,
    val: unknown
  ) => {
    setFormData((prev) => {
      const next = [...prev.components];
      const comp = next[compIdx];
      const compComposition = [...(comp.composition || [])];
      compComposition[rowIdx] = { ...compComposition[rowIdx], [field]: val };
      next[compIdx] = { ...comp, composition: compComposition };
      return { ...prev, components: next };
    });
  };

  const removeComponentCompositionRow = (compIdx: number, rowIdx: number) => {
    setFormData((prev) => {
      const next = [...prev.components];
      const comp = next[compIdx];
      const compComposition = (comp.composition || []).filter((_, i) => i !== rowIdx);
      next[compIdx] = { ...comp, composition: compComposition };
      return { ...prev, components: next };
    });
  };

  // Structured Usage Rules Helpers
  const addUsageRule = () => {
    setFormData((prev) => ({
      ...prev,
      usageRules: [
        ...prev.usageRules,
        {
          ageGroup: "",
          dosage: "",
          frequency: "",
          instructions: "",
        },
      ],
    }));
  };

  const updateUsageRule = (idx: number, field: keyof UsageRule, val: string) => {
    setFormData((prev) => {
      const next = [...prev.usageRules];
      next[idx] = { ...next[idx], [field]: val };
      return { ...prev, usageRules: next };
    });
  };

  const removeUsageRule = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      usageRules: prev.usageRules.filter((_, i) => i !== idx),
    }));
  };

  // Helper for string list fields (storageInstructions, warnings, otherIngredients)
  const addStringItem = (field: "storageInstructions" | "warnings" | "otherIngredients") => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const updateStringItem = (
    field: "storageInstructions" | "warnings" | "otherIngredients",
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
    field: "storageInstructions" | "warnings" | "otherIngredients",
    idx: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== idx),
    }));
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    // Filter empty items
    const cleanedComposition = formData.composition
      .filter((c) => c.ingredient.trim().length > 0)
      .map((c, i) => ({
        ...c,
        order: c.order || i + 1,
        rdaDisplay: c.rdaDisplay || "#",
      }));

    const cleanedComponents = formData.components
      .filter((c) => c.name.trim().length > 0)
      .map((c) => ({
        ...c,
        composition: (c.composition || []).filter((ci) => ci.ingredient.trim().length > 0),
      }));

    const cleanedUsageRules = formData.usageRules.filter(
      (r) =>
        (r.ageGroup && r.ageGroup.trim().length > 0) ||
        (r.dosage && r.dosage.trim().length > 0) ||
        (r.instructions && r.instructions.trim().length > 0)
    );

    const cleanedImages = formData.images
      .filter((img) => img && img.url && img.url.trim().length > 0)
      .map((img, idx) => ({
        url: img.url.trim(),
        alt: img.alt?.trim() || `${formData.name} packaging view`,
        type: img.type || "hero",
        order: idx + 1,
      }))
      .slice(0, 5);

    const primaryImage =
      cleanedImages.find((img, idx) => formData.images[idx]?.isPrimary)?.url ||
      cleanedImages[0]?.url ||
      formData.image;

    const keywordsArray = keywordsInput
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    const payload = {
      name: formData.name.trim(),
      slug: formData.slug.trim(),
      brand: formData.brand.trim() || "Celife",
      subtitle: formData.subtitle.trim(),
      category: formData.category.trim(),
      categoryId: formData.categoryId || null,
      productType: formData.productType.trim() || "Health Supplement",
      format: formData.format.trim(),
      packSize: formData.packSize.trim(),
      dosageForm: formData.dosageForm.trim(),
      therapeuticDomain: formData.therapeuticDomain.trim(),
      shortDescription: formData.shortDescription.trim(),
      description: formData.description.trim(),
      aboutFormulation: formData.aboutFormulation.trim(),
      scientificBackground: formData.scientificBackground.trim(),
      coreRationale: formData.coreRationale.trim(),
      flavour: formData.flavour.trim(),
      netVolume: formData.netVolume.trim(),
      sugarStatement: formData.sugarStatement.trim(),
      ageStatement: formData.ageStatement.trim(),
      productClassification: formData.productClassification.trim(),
      form: formData.form.trim(),
      packaging: formData.packaging.trim(),
      wellnessFocus: formData.wellnessFocus.trim(),
      usageAdvice: formData.usageAdvice.trim(),
      keyFocus: formData.keyFocus.filter((kf) => kf.trim().length > 0),
      highlights: formData.highlights.filter((h) => h.label.trim().length > 0),
      composition: cleanedComposition,
      components: cleanedComponents,
      recommendedUse: formData.recommendedUse.trim() || formData.recommendedUsage.trim(),
      recommendedUsage: formData.recommendedUsage.trim() || formData.recommendedUse.trim(),
      usageInstructions: formData.usageInstructions.trim(),
      administrationNotes: formData.administrationNotes.trim(),
      usageRules: cleanedUsageRules,
      storageInstructions: formData.storageInstructions.filter((s) => s.trim().length > 0),
      professionalCaution: formData.professionalCaution.trim(),
      warnings: formData.warnings.filter((w) => w.trim().length > 0),
      notes: formData.notes.trim(),
      excipientStandard: formData.excipientStandard.trim(),
      nutrition: formData.nutrition,
      otherIngredients: formData.otherIngredients.filter((oi) => oi.trim().length > 0),
      image: primaryImage,
      images: cleanedImages,
      status: formData.status,
      published: formData.status === "published",
      featured: formData.featured,
      isFeatured: formData.featured,
      order: Number(formData.displayOrder) || Number(formData.order) || 0,
      displayOrder: Number(formData.displayOrder) || Number(formData.order) || 0,
      source: formData.source,
      sourceType: formData.source.sourceType,
      sourceNotes: formData.source.sourceReference,
      contentVerified: formData.source.verified,
      seo: {
        metaTitle: formData.seo.metaTitle.trim() || null,
        metaDescription: formData.seo.metaDescription.trim() || null,
        canonicalUrl: formData.seo.canonicalUrl.trim() || null,
        keywords: keywordsArray,
      },
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
        throw new Error(json.error?.message || "Failed to save product formulation");
      }

      setFeedback({
        type: "success",
        message: isEditing
          ? "Formulation updated successfully!"
          : "New formulation created successfully!",
      });

      setTimeout(() => {
        router.push("/dashboard/products");
      }, 1200);
    } catch (err: unknown) {
      setFeedback({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to save product formulation",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl pb-24 select-none font-sans">
      {/* Sticky Top Action & Quick Jump Header */}
      <div className="sticky top-0 z-30 bg-[#F6F8F5]/95 backdrop-blur-md pt-2 pb-4 border-b border-[#E1E8E2] space-y-3">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/dashboard/products"
            className="text-xs uppercase tracking-wider text-[#68756D] hover:text-[#17201B] font-semibold transition-colors flex items-center gap-1.5"
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
                  <span>{isEditing ? "Save Changes" : "Create Formulation"}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Jump Section Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-sans no-scrollbar">
          <span className="text-[#68756D] text-[10px] uppercase tracking-wider font-bold shrink-0 mr-1">
            Jump:
          </span>
          <a href="#sec-a" className="px-2.5 py-1 bg-white hover:bg-[#F0F4F0] border border-[#E1E8E2] rounded-xs text-[#17201B] shrink-0 transition-colors">
            A. Basic Info
          </a>
          <a href="#sec-b" className="px-2.5 py-1 bg-white hover:bg-[#F0F4F0] border border-[#E1E8E2] rounded-xs text-[#17201B] shrink-0 transition-colors">
            B. Description
          </a>
          <a href="#sec-c" className="px-2.5 py-1 bg-white hover:bg-[#F0F4F0] border border-[#E1E8E2] rounded-xs text-[#17201B] shrink-0 transition-colors">
            C. Composition ({formData.composition.length})
          </a>
          <a href="#sec-d" className="px-2.5 py-1 bg-white hover:bg-[#F0F4F0] border border-[#E1E8E2] rounded-xs text-[#17201B] shrink-0 transition-colors">
            D. Multi-Pack ({formData.components.length})
          </a>
          <a href="#sec-e" className="px-2.5 py-1 bg-white hover:bg-[#F0F4F0] border border-[#E1E8E2] rounded-xs text-[#17201B] shrink-0 transition-colors">
            E. Usage & Rules
          </a>
          <a href="#sec-f" className="px-2.5 py-1 bg-white hover:bg-[#F0F4F0] border border-[#E1E8E2] rounded-xs text-[#17201B] shrink-0 transition-colors">
            F. Safety & Storage
          </a>
          <a href="#sec-g" className="px-2.5 py-1 bg-white hover:bg-[#F0F4F0] border border-[#E1E8E2] rounded-xs text-[#17201B] shrink-0 transition-colors">
            G. Images
          </a>
          <a href="#sec-h" className="px-2.5 py-1 bg-white hover:bg-[#F0F4F0] border border-[#E1E8E2] rounded-xs text-[#17201B] shrink-0 transition-colors">
            H. SEO
          </a>
          <a href="#sec-i" className="px-2.5 py-1 bg-white hover:bg-[#F0F4F0] border border-[#E1E8E2] rounded-xs text-[#17201B] shrink-0 transition-colors">
            I. Publishing
          </a>
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

      {/* SECTION A: Basic Information */}
      <section id="sec-a" className="bg-[#FFFFFF] border border-[#E1E8E2] rounded-xs p-6 md:p-8 space-y-5 shadow-2xs">
        <div className="flex items-center justify-between border-b border-[#E1E8E2] pb-3">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#6F8F80]">Section A</span>
            <h2 className="text-base font-serif font-bold text-[#17201B]">
              Basic Product Information
            </h2>
          </div>
          <span className="text-xs font-mono text-[#68756D]">Primary Identity</span>
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
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => {
                const selected = categories.find((c) => c.name === e.target.value);
                setFormData((prev) => ({
                  ...prev,
                  category: e.target.value,
                  categoryId: selected ? selected.id : prev.categoryId,
                }));
              }}
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
              Product Type
            </label>
            <input
              type="text"
              value={formData.productType}
              onChange={(e) => setFormData((prev) => ({ ...prev, productType: e.target.value }))}
              placeholder="e.g. Health Supplement"
              className="w-full bg-[#FFFFFF] border border-[#E1E8E2] px-4 py-2.5 text-xs text-[#17201B] rounded-xs focus:border-[#123C2D] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#17201B] font-semibold mb-1.5">
              Format
            </label>
            <input
              type="text"
              value={formData.format}
              onChange={(e) => setFormData((prev) => ({ ...prev, format: e.target.value }))}
              placeholder="e.g. Syrup / Oral Liquid / Tablets"
              className="w-full bg-[#FFFFFF] border border-[#E1E8E2] px-4 py-2.5 text-xs text-[#17201B] rounded-xs focus:border-[#123C2D] outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#17201B] font-semibold mb-1.5">
              Pack Size
            </label>
            <input
              type="text"
              value={formData.packSize}
              onChange={(e) => setFormData((prev) => ({ ...prev, packSize: e.target.value }))}
              placeholder="e.g. 200 ml Amber Bottle"
              className="w-full bg-[#FFFFFF] border border-[#E1E8E2] px-4 py-2.5 text-xs text-[#17201B] rounded-xs focus:border-[#123C2D] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#17201B] font-semibold mb-1.5">
              Dosage Form
            </label>
            <input
              type="text"
              value={formData.dosageForm}
              onChange={(e) => setFormData((prev) => ({ ...prev, dosageForm: e.target.value }))}
              placeholder="e.g. Oral Liquid Syrup / Film-Coated Tablet"
              className="w-full bg-[#FFFFFF] border border-[#E1E8E2] px-4 py-2.5 text-xs text-[#17201B] rounded-xs focus:border-[#123C2D] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#17201B] font-semibold mb-1.5">
              Therapeutic Domain
            </label>
            <input
              type="text"
              value={formData.therapeuticDomain}
              onChange={(e) => setFormData((prev) => ({ ...prev, therapeuticDomain: e.target.value }))}
              placeholder="e.g. Multivitamin Supplement / Nerve Nutrition"
              className="w-full bg-[#FFFFFF] border border-[#E1E8E2] px-4 py-2.5 text-xs text-[#17201B] rounded-xs focus:border-[#123C2D] outline-none"
            />
          </div>
        </div>
      </section>

      {/* SECTION B: Product Description & Formulation Rationale */}
      <section id="sec-b" className="bg-[#FFFFFF] border border-[#E1E8E2] rounded-xs p-6 md:p-8 space-y-5 shadow-2xs">
        <div className="flex items-center justify-between border-b border-[#E1E8E2] pb-3">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#6F8F80]">Section B</span>
            <h2 className="text-base font-serif font-bold text-[#17201B]">
              Product Descriptions & Formulation Background
            </h2>
          </div>
          <span className="text-xs font-mono text-[#68756D]">Narrative & Science</span>
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
            placeholder="A balanced multivitamin and mineral formulation designed for daily metabolic and vitality support."
            className="w-full bg-[#FFFFFF] border border-[#E1E8E2] px-4 py-2.5 text-xs text-[#17201B] rounded-xs focus:border-[#123C2D] outline-none"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-[#17201B] font-semibold mb-1.5">
            Long Product Description *
          </label>
          <textarea
            rows={4}
            required
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Detailed clinical overview and nutritional positioning..."
            className="w-full bg-[#FFFFFF] border border-[#E1E8E2] p-4 text-xs text-[#17201B] rounded-xs focus:border-[#123C2D] outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#17201B] font-semibold mb-1.5">
              About Formulation
            </label>
            <textarea
              rows={3}
              value={formData.aboutFormulation}
              onChange={(e) => setFormData((prev) => ({ ...prev, aboutFormulation: e.target.value }))}
              placeholder="Clinical matrix overview and development principles..."
              className="w-full bg-[#FFFFFF] border border-[#E1E8E2] p-3 text-xs text-[#17201B] rounded-xs focus:border-[#123C2D] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#17201B] font-semibold mb-1.5">
              Scientific Background
            </label>
            <textarea
              rows={3}
              value={formData.scientificBackground}
              onChange={(e) => setFormData((prev) => ({ ...prev, scientificBackground: e.target.value }))}
              placeholder="Biochemical pathway, bioavailability studies, RDA calibration..."
              className="w-full bg-[#FFFFFF] border border-[#E1E8E2] p-3 text-xs text-[#17201B] rounded-xs focus:border-[#123C2D] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#17201B] font-semibold mb-1.5">
              Core Rationale
            </label>
            <textarea
              rows={3}
              value={formData.coreRationale}
              onChange={(e) => setFormData((prev) => ({ ...prev, coreRationale: e.target.value }))}
              placeholder="Pull-quote or core therapeutic justification statement..."
              className="w-full bg-[#FFFFFF] border border-[#E1E8E2] p-3 text-xs text-[#17201B] rounded-xs focus:border-[#123C2D] outline-none"
            />
          </div>
        </div>
      </section>

      {/* SECTION C: Active Bioactive Composition Builder */}
      <section id="sec-c" className="bg-[#FFFFFF] border border-[#E1E8E2] rounded-xs p-6 md:p-8 space-y-5 shadow-2xs">
        <div className="flex items-center justify-between border-b border-[#E1E8E2] pb-3">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#6F8F80]">Section C</span>
            <h2 className="text-base font-serif font-bold text-[#17201B]">
              Active Bioactive Composition ({formData.composition.length} entries)
            </h2>
            <p className="text-xs text-[#68756D] font-sans mt-0.5">
              Quantities are stored safely as text (e.g. &quot;50 million spores&quot;, &quot;eq. to elemental Calcium&quot;).
            </p>
          </div>
          <button
            type="button"
            onClick={addCompositionRow}
            className="px-3.5 py-1.5 bg-[#123C2D] text-white text-xs font-semibold rounded-xs flex items-center gap-1.5 hover:bg-[#294F3D] cursor-pointer"
          >
            <Plus size={13} />
            <span>Add Ingredient Row</span>
          </button>
        </div>

        {formData.composition.length === 0 ? (
          <p className="text-xs text-[#68756D] italic py-4 text-center">
            No active ingredients added. Click &quot;Add Ingredient Row&quot; above to enter formulation actives.
          </p>
        ) : (
          <div className="space-y-3 overflow-x-auto">
            <div className="grid grid-cols-12 gap-2 text-[11px] font-semibold uppercase text-[#68756D] px-2 min-w-[720px]">
              <span className="col-span-3">Ingredient *</span>
              <span className="col-span-2">Quantity</span>
              <span className="col-span-2">Unit</span>
              <span className="col-span-2">Group</span>
              <span className="col-span-2">Note / Equivalent</span>
              <span className="col-span-1 text-right">Action</span>
            </div>

            {formData.composition.map((comp, idx) => (
              <div
                key={idx}
                className="grid grid-cols-12 gap-2 items-center bg-[#F8FAF6] p-2 rounded-xs border border-[#E1E8E2] min-w-[720px]"
              >
                <div className="col-span-3">
                  <input
                    type="text"
                    value={comp.ingredient}
                    onChange={(e) => updateCompositionRow(idx, "ingredient", e.target.value)}
                    placeholder="e.g. Alpha Lipoic Acid"
                    className="w-full bg-[#FFFFFF] border border-[#E1E8E2] px-2.5 py-1.5 text-xs text-[#17201B] rounded-xs"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="text"
                    value={comp.quantity || (comp.amount !== null && comp.amount !== undefined ? String(comp.amount) : "")}
                    onChange={(e) => updateCompositionRow(idx, "quantity", e.target.value)}
                    placeholder="100 or 50 million"
                    className="w-full bg-[#FFFFFF] border border-[#E1E8E2] px-2.5 py-1.5 text-xs text-[#17201B] rounded-xs"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="text"
                    value={comp.unit || ""}
                    onChange={(e) => updateCompositionRow(idx, "unit", e.target.value)}
                    placeholder="mg / mcg / spores"
                    className="w-full bg-[#FFFFFF] border border-[#E1E8E2] px-2.5 py-1.5 text-xs text-[#17201B] rounded-xs"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="text"
                    value={comp.group || ""}
                    onChange={(e) => updateCompositionRow(idx, "group", e.target.value)}
                    placeholder="e.g. Active Ingredients"
                    className="w-full bg-[#FFFFFF] border border-[#E1E8E2] px-2.5 py-1.5 text-xs text-[#17201B] rounded-xs"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="text"
                    value={comp.note || ""}
                    onChange={(e) => updateCompositionRow(idx, "note", e.target.value)}
                    placeholder="e.g. eq. to elemental"
                    className="w-full bg-[#FFFFFF] border border-[#E1E8E2] px-2.5 py-1.5 text-xs text-[#17201B] rounded-xs"
                  />
                </div>
                <div className="col-span-1 text-right">
                  <button
                    type="button"
                    onClick={() => removeCompositionRow(idx)}
                    className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                    title="Remove Ingredient"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SECTION D: Multi-Pack / Multi-Component Formulations */}
      <section id="sec-d" className="bg-[#FFFFFF] border border-[#E1E8E2] rounded-xs p-6 md:p-8 space-y-5 shadow-2xs">
        <div className="flex items-center justify-between border-b border-[#E1E8E2] pb-3">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#6F8F80]">Section D</span>
            <h2 className="text-base font-serif font-bold text-[#17201B]">
              Multi-Pack / Multi-Component Formulations (Optional)
            </h2>
            <p className="text-xs text-[#68756D] font-sans mt-0.5">
              Support products like Bonigo Combo with multiple distinct packs/bottles inside a single product.
            </p>
          </div>
          <button
            type="button"
            onClick={addComponent}
            className="px-3.5 py-1.5 bg-[#123C2D] text-white text-xs font-semibold rounded-xs flex items-center gap-1.5 hover:bg-[#294F3D] cursor-pointer"
          >
            <Plus size={13} />
            <span>Add Component</span>
          </button>
        </div>

        {formData.components.length === 0 ? (
          <p className="text-xs text-[#68756D] italic py-3 text-center bg-[#F6F8F5] rounded-xs border border-dashed border-[#E1E8E2]">
            Single-item product (no multi-components). If this is a combo product (like Bonigo Combo with Pack 1 & Pack 2), click &quot;Add Component&quot;.
          </p>
        ) : (
          <div className="space-y-6">
            {formData.components.map((comp, cIdx) => (
              <div key={cIdx} className="border border-[#E1E8E2] rounded-xs p-5 bg-[#FAFAF8] space-y-4">
                <div className="flex items-center justify-between border-b border-[#E1E8E2] pb-2">
                  <div className="flex items-center gap-2">
                    <Layers size={14} className="text-[#123C2D]" />
                    <span className="text-xs font-bold uppercase text-[#17201B]">
                      Component #{cIdx + 1}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeComponent(cIdx)}
                    className="text-xs text-red-600 hover:text-red-800 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 size={12} />
                    <span>Remove Component</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#17201B] font-semibold mb-1">
                      Component Name *
                    </label>
                    <input
                      type="text"
                      value={comp.name}
                      onChange={(e) => updateComponent(cIdx, "name", e.target.value)}
                      placeholder="e.g. Pack 1 (Tablets)"
                      className="w-full bg-[#FFFFFF] border border-[#E1E8E2] px-3 py-1.5 text-xs text-[#17201B] rounded-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#17201B] font-semibold mb-1">
                      Pack Size
                    </label>
                    <input
                      type="text"
                      value={comp.packSize || ""}
                      onChange={(e) => updateComponent(cIdx, "packSize", e.target.value)}
                      placeholder="e.g. 30 Tablets"
                      className="w-full bg-[#FFFFFF] border border-[#E1E8E2] px-3 py-1.5 text-xs text-[#17201B] rounded-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#17201B] font-semibold mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      value={comp.description || ""}
                      onChange={(e) => updateComponent(cIdx, "description", e.target.value)}
                      placeholder="e.g. Calcium Citrate Malate & Vitamin D3"
                      className="w-full bg-[#FFFFFF] border border-[#E1E8E2] px-3 py-1.5 text-xs text-[#17201B] rounded-xs"
                    />
                  </div>
                </div>

                {/* Sub-composition for this component */}
                <div className="space-y-2 pt-2 border-t border-[#E1E8E2]/60">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase font-bold text-[#68756D]">
                      Component Composition ({(comp.composition || []).length} Actives)
                    </span>
                    <button
                      type="button"
                      onClick={() => addComponentCompositionRow(cIdx)}
                      className="text-[11px] text-[#123C2D] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Plus size={12} />
                      <span>Add Ingredient to {comp.name || `Pack ${cIdx + 1}`}</span>
                    </button>
                  </div>

                  {(comp.composition || []).map((cRow, rIdx) => (
                    <div key={rIdx} className="grid grid-cols-12 gap-2 items-center bg-white p-2 border border-[#E1E8E2] rounded-xs">
                      <div className="col-span-4">
                        <input
                          type="text"
                          value={cRow.ingredient}
                          onChange={(e) => updateComponentCompositionRow(cIdx, rIdx, "ingredient", e.target.value)}
                          placeholder="Ingredient name"
                          className="w-full border border-[#E1E8E2] px-2 py-1 text-xs rounded-xs"
                        />
                      </div>
                      <div className="col-span-3">
                        <input
                          type="text"
                          value={cRow.quantity || ""}
                          onChange={(e) => updateComponentCompositionRow(cIdx, rIdx, "quantity", e.target.value)}
                          placeholder="Quantity"
                          className="w-full border border-[#E1E8E2] px-2 py-1 text-xs rounded-xs"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="text"
                          value={cRow.unit || ""}
                          onChange={(e) => updateComponentCompositionRow(cIdx, rIdx, "unit", e.target.value)}
                          placeholder="Unit"
                          className="w-full border border-[#E1E8E2] px-2 py-1 text-xs rounded-xs"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="text"
                          value={cRow.note || ""}
                          onChange={(e) => updateComponentCompositionRow(cIdx, rIdx, "note", e.target.value)}
                          placeholder="Note"
                          className="w-full border border-[#E1E8E2] px-2 py-1 text-xs rounded-xs"
                        />
                      </div>
                      <div className="col-span-1 text-right">
                        <button
                          type="button"
                          onClick={() => removeComponentCompositionRow(cIdx, rIdx)}
                          className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SECTION E: Usage Instructions & Structured Usage Rules */}
      <section id="sec-e" className="bg-[#FFFFFF] border border-[#E1E8E2] rounded-xs p-6 md:p-8 space-y-5 shadow-2xs">
        <div className="flex items-center justify-between border-b border-[#E1E8E2] pb-3">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#6F8F80]">Section E</span>
            <h2 className="text-base font-serif font-bold text-[#17201B]">
              Usage, Administration & Structured Rules
            </h2>
          </div>
          <span className="text-xs font-mono text-[#68756D]">Administration</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#17201B] font-semibold mb-1.5">
              Recommended Use
            </label>
            <textarea
              rows={3}
              value={formData.recommendedUse}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  recommendedUse: e.target.value,
                  recommendedUsage: e.target.value,
                }))
              }
              placeholder="e.g. 1–2 teaspoonful twice a day or as directed by Doctor."
              className="w-full bg-[#FFFFFF] border border-[#E1E8E2] p-3 text-xs text-[#17201B] rounded-xs"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#17201B] font-semibold mb-1.5">
              Usage Instructions
            </label>
            <textarea
              rows={3}
              value={formData.usageInstructions}
              onChange={(e) => setFormData((prev) => ({ ...prev, usageInstructions: e.target.value }))}
              placeholder="e.g. Shake well before use. Take after meals."
              className="w-full bg-[#FFFFFF] border border-[#E1E8E2] p-3 text-xs text-[#17201B] rounded-xs"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#17201B] font-semibold mb-1.5">
              Administration Notes
            </label>
            <textarea
              rows={3}
              value={formData.administrationNotes}
              onChange={(e) => setFormData((prev) => ({ ...prev, administrationNotes: e.target.value }))}
              placeholder="e.g. For pediatric administration, use measuring cup."
              className="w-full bg-[#FFFFFF] border border-[#E1E8E2] p-3 text-xs text-[#17201B] rounded-xs"
            />
          </div>
        </div>

        {/* Dynamic Structured Usage Rules */}
        <div className="pt-4 border-t border-[#E1E8E2] space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs uppercase tracking-wider text-[#17201B] font-bold">
                Age-Wise Structured Usage Rules ({formData.usageRules.length})
              </h3>
              <p className="text-[11px] text-[#68756D]">
                Optional structured instructions by demographic group (e.g. &quot;5–9 yrs&quot;, &quot;Adults&quot;).
              </p>
            </div>
            <button
              type="button"
              onClick={addUsageRule}
              className="px-3 py-1 bg-[#123C2D] text-white text-xs font-semibold rounded-xs flex items-center gap-1.5 hover:bg-[#294F3D] cursor-pointer"
            >
              <Plus size={12} />
              <span>Add Usage Rule</span>
            </button>
          </div>

          {formData.usageRules.length === 0 ? (
            <p className="text-xs text-[#68756D] italic py-2">
              No age-specific rules defined. Global recommended use will apply.
            </p>
          ) : (
            <div className="space-y-2.5">
              {formData.usageRules.map((rule, rIdx) => (
                <div key={rIdx} className="grid grid-cols-12 gap-2.5 items-center bg-[#F8FAF6] p-3 border border-[#E1E8E2] rounded-xs">
                  <div className="col-span-3">
                    <label className="block text-[10px] uppercase text-[#68756D] font-bold mb-0.5">Age Group</label>
                    <input
                      type="text"
                      value={rule.ageGroup || ""}
                      onChange={(e) => updateUsageRule(rIdx, "ageGroup", e.target.value)}
                      placeholder="e.g. 5–9 yrs"
                      className="w-full bg-white border border-[#E1E8E2] px-2 py-1.5 text-xs rounded-xs"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] uppercase text-[#68756D] font-bold mb-0.5">Dosage</label>
                    <input
                      type="text"
                      value={rule.dosage || ""}
                      onChange={(e) => updateUsageRule(rIdx, "dosage", e.target.value)}
                      placeholder="e.g. 2.5 ml"
                      className="w-full bg-white border border-[#E1E8E2] px-2 py-1.5 text-xs rounded-xs"
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="block text-[10px] uppercase text-[#68756D] font-bold mb-0.5">Frequency</label>
                    <input
                      type="text"
                      value={rule.frequency || ""}
                      onChange={(e) => updateUsageRule(rIdx, "frequency", e.target.value)}
                      placeholder="e.g. once daily"
                      className="w-full bg-white border border-[#E1E8E2] px-2 py-1.5 text-xs rounded-xs"
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="block text-[10px] uppercase text-[#68756D] font-bold mb-0.5">Instructions</label>
                    <input
                      type="text"
                      value={rule.instructions || ""}
                      onChange={(e) => updateUsageRule(rIdx, "instructions", e.target.value)}
                      placeholder="e.g. from both packs"
                      className="w-full bg-white border border-[#E1E8E2] px-2 py-1.5 text-xs rounded-xs"
                    />
                  </div>
                  <div className="col-span-1 text-right pt-4">
                    <button
                      type="button"
                      onClick={() => removeUsageRule(rIdx)}
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
      </section>

      {/* SECTION F: Storage Conditions, Excipient Standards & Warnings */}
      <section id="sec-f" className="bg-[#FFFFFF] border border-[#E1E8E2] rounded-xs p-6 md:p-8 space-y-5 shadow-2xs">
        <div className="flex items-center justify-between border-b border-[#E1E8E2] pb-3">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#6F8F80]">Section F</span>
            <h2 className="text-base font-serif font-bold text-[#17201B]">
              Storage, Excipient Standards & Safety Warnings
            </h2>
          </div>
          <span className="text-xs font-mono text-[#68756D]">Compliance</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#17201B] font-semibold mb-1.5">
              Excipient Standard
            </label>
            <input
              type="text"
              value={formData.excipientStandard}
              onChange={(e) => setFormData((prev) => ({ ...prev, excipientStandard: e.target.value }))}
              placeholder="e.g. Non-GMO, Titanium Dioxide-free, clean coating"
              className="w-full bg-[#FFFFFF] border border-[#E1E8E2] px-3.5 py-2.5 text-xs text-[#17201B] rounded-xs focus:border-[#123C2D] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#17201B] font-semibold mb-1.5">
              Professional Caution
            </label>
            <input
              type="text"
              value={formData.professionalCaution}
              onChange={(e) => setFormData((prev) => ({ ...prev, professionalCaution: e.target.value }))}
              placeholder="e.g. For professional evaluation and guidance of healthcare practitioner."
              className="w-full bg-[#FFFFFF] border border-[#E1E8E2] px-3.5 py-2.5 text-xs text-[#17201B] rounded-xs focus:border-[#123C2D] outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Storage Instructions List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-[#17201B] font-semibold">
                Storage Instructions ({formData.storageInstructions.length})
              </span>
              <button
                type="button"
                onClick={() => addStringItem("storageInstructions")}
                className="text-xs text-[#123C2D] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus size={12} />
                <span>Add Instruction</span>
              </button>
            </div>
            <div className="space-y-2">
              {formData.storageInstructions.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateStringItem("storageInstructions", idx, e.target.value)}
                    placeholder="e.g. Keep in a cool & dry place away from sunlight."
                    className="flex-1 bg-white border border-[#E1E8E2] px-3 py-1.5 text-xs rounded-xs"
                  />
                  <button
                    type="button"
                    onClick={() => removeStringItem("storageInstructions", idx)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Warnings List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-[#17201B] font-semibold">
                Packaging Warnings ({formData.warnings.length})
              </span>
              <button
                type="button"
                onClick={() => addStringItem("warnings")}
                className="text-xs text-[#123C2D] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus size={12} />
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
                    placeholder="e.g. HEALTH SUPPLEMENT, NOT FOR MEDICINAL USE."
                    className="flex-1 bg-white border border-[#E1E8E2] px-3 py-1.5 text-xs rounded-xs"
                  />
                  <button
                    type="button"
                    onClick={() => removeStringItem("warnings", idx)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION G: Product Gallery Images (Up to 5 Slots) */}
      <section id="sec-g" className="bg-[#FFFFFF] border border-[#E1E8E2] rounded-xs p-6 md:p-8 space-y-5 shadow-2xs">
        <div className="flex items-center justify-between border-b border-[#E1E8E2] pb-3">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#6F8F80]">Section G</span>
            <h2 className="text-base font-serif font-bold text-[#17201B]">
              Product Gallery Assets (Up to 5 Slots)
            </h2>
            <p className="text-xs text-[#68756D] font-sans mt-0.5">
              Only URLs and file paths are stored in the database. Primary photo is used in catalogue listings.
            </p>
          </div>
          <span className="text-xs font-mono text-[#68756D]">Max 5 Images</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[0, 1, 2, 3, 4].map((slotIdx) => {
            const img = formData.images[slotIdx];
            const defaultType = DEFAULT_IMAGE_SLOT_TYPES[slotIdx] || "hero";

            return (
              <div
                key={slotIdx}
                className={`p-4 border rounded-xs space-y-3 ${
                  img?.isPrimary ? "border-[#123C2D] bg-[#F8FAF6]" : "border-[#E1E8E2] bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#17201B]">
                    {SLOT_LABELS[slotIdx]}
                  </span>
                  {img && img.url && (
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
                      <span className="font-semibold text-[#123C2D]">Primary</span>
                    </label>
                  )}
                </div>

                {img?.url ? (
                  <div className="relative aspect-video w-full rounded overflow-hidden border border-[#E1E8E2] bg-[#F4F5EF]">
                    <Image
                      src={img.url}
                      alt={img.alt || img.altText || "Product photo"}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-video w-full rounded border border-dashed border-[#E1E8E2] flex items-center justify-center bg-[#FAFAF8] text-[#A0ACA5]">
                    <ImageIcon size={24} />
                  </div>
                )}

                <div className="space-y-2">
                  <input
                    type="text"
                    value={img?.url || ""}
                    onChange={(e) => {
                      const next = [...formData.images];
                      if (!next[slotIdx]) {
                        next[slotIdx] = {
                          url: e.target.value,
                          alt: `${formData.name} View ${slotIdx + 1}`,
                          type: defaultType,
                          order: slotIdx + 1,
                          isPrimary: slotIdx === 0,
                        };
                      } else {
                        next[slotIdx].url = e.target.value;
                      }
                      setFormData((prev) => ({ ...prev, images: next }));
                    }}
                    placeholder="/images/products/..."
                    className="w-full bg-[#FFFFFF] border border-[#E1E8E2] px-2.5 py-1.5 text-xs text-[#17201B] rounded-xs font-mono"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={img?.type || defaultType}
                      onChange={(e) => {
                        const next = [...formData.images];
                        if (next[slotIdx]) {
                          next[slotIdx].type = e.target.value;
                          setFormData((prev) => ({ ...prev, images: next }));
                        }
                      }}
                      className="w-full bg-white border border-[#E1E8E2] px-2 py-1 text-[11px] rounded-xs cursor-pointer"
                    >
                      <option value="hero">Hero Pack</option>
                      <option value="front">Carton Front</option>
                      <option value="back">Back Panel</option>
                      <option value="detail">Active Detail</option>
                      <option value="lifestyle">Graphic</option>
                      <option value="bottle">Bottle</option>
                      <option value="main">Main</option>
                    </select>

                    <input
                      type="text"
                      value={img?.alt || ""}
                      onChange={(e) => {
                        const next = [...formData.images];
                        if (next[slotIdx]) {
                          next[slotIdx].alt = e.target.value;
                          setFormData((prev) => ({ ...prev, images: next }));
                        }
                      }}
                      placeholder="Alt text"
                      className="w-full bg-white border border-[#E1E8E2] px-2 py-1 text-[11px] rounded-xs"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="flex-1 py-1.5 px-2 border border-[#E1E8E2] rounded-xs text-[11px] text-center font-semibold text-[#123C2D] bg-[#F8FAF6] hover:bg-[#EBEFEA] cursor-pointer transition-colors flex items-center justify-center gap-1.5">
                      {uploadingSlot === slotIdx ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <Upload size={12} />
                      )}
                      <span>{uploadingSlot === slotIdx ? "Uploading..." : "Upload Photo"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleSlotImageUpload(e, slotIdx)}
                        className="hidden"
                      />
                    </label>

                    {img?.url && (
                      <button
                        type="button"
                        onClick={() => {
                          const next = [...formData.images];
                          next[slotIdx] = { ...next[slotIdx], url: "" };
                          setFormData((prev) => ({ ...prev, images: next }));
                        }}
                        className="p-1.5 border border-[#E1E8E2] text-red-500 hover:bg-red-50 rounded-xs cursor-pointer"
                        title="Clear Slot"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION H: Search Engine Optimization (SEO) */}
      <section id="sec-h" className="bg-[#FFFFFF] border border-[#E1E8E2] rounded-xs p-6 md:p-8 space-y-5 shadow-2xs">
        <div className="flex items-center justify-between border-b border-[#E1E8E2] pb-3">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#6F8F80]">Section H</span>
            <h2 className="text-base font-serif font-bold text-[#17201B]">
              Search Engine Optimization (SEO)
            </h2>
          </div>
          <span className="text-xs font-mono text-[#68756D]">Meta & Indexing</span>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs uppercase tracking-wider text-[#17201B] font-semibold">
                SEO Meta Title
              </label>
              <span className={`text-[11px] font-mono ${formData.seo.metaTitle.length > 60 ? "text-amber-600 font-bold" : "text-[#68756D]"}`}>
                {formData.seo.metaTitle.length} / 60 characters
              </span>
            </div>
            <input
              type="text"
              value={formData.seo.metaTitle}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  seo: { ...prev.seo, metaTitle: e.target.value },
                }))
              }
              placeholder="e.g. VITAFIV Syrup 200 ml | Calibrated Multivitamin | Celife"
              className="w-full bg-[#FFFFFF] border border-[#E1E8E2] px-3.5 py-2.5 text-xs text-[#17201B] rounded-xs"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs uppercase tracking-wider text-[#17201B] font-semibold">
                SEO Meta Description
              </label>
              <span className={`text-[11px] font-mono ${formData.seo.metaDescription.length > 160 ? "text-amber-600 font-bold" : "text-[#68756D]"}`}>
                {formData.seo.metaDescription.length} / 160 characters
              </span>
            </div>
            <textarea
              rows={2}
              value={formData.seo.metaDescription}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  seo: { ...prev.seo, metaDescription: e.target.value },
                }))
              }
              placeholder="Calibrated oral multivitamin syrup formulated to ICMR guidelines with 25 vital co-factors..."
              className="w-full bg-[#FFFFFF] border border-[#E1E8E2] p-3 text-xs text-[#17201B] rounded-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#17201B] font-semibold mb-1">
                Canonical URL
              </label>
              <input
                type="text"
                value={formData.seo.canonicalUrl}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    seo: { ...prev.seo, canonicalUrl: e.target.value },
                  }))
                }
                placeholder="https://celife.in/products/vitafiv-syrup"
                className="w-full bg-[#FFFFFF] border border-[#E1E8E2] px-3 py-2 text-xs font-mono rounded-xs"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#17201B] font-semibold mb-1">
                Keywords (Comma Separated)
              </label>
              <input
                type="text"
                value={keywordsInput}
                onChange={(e) => setKeywordsInput(e.target.value)}
                placeholder="multivitamin, syrup, bone health, celife"
                className="w-full bg-[#FFFFFF] border border-[#E1E8E2] px-3 py-2 text-xs rounded-xs"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION I: Publishing Status, Featured & Audit Metadata */}
      <section id="sec-i" className="bg-[#FFFFFF] border border-[#E1E8E2] rounded-xs p-6 md:p-8 space-y-5 shadow-2xs">
        <div className="flex items-center justify-between border-b border-[#E1E8E2] pb-3">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#6F8F80]">Section I</span>
            <h2 className="text-base font-serif font-bold text-[#17201B]">
              Publishing, Display Order & Verification Audit
            </h2>
          </div>
          <span className="text-xs font-mono text-[#68756D]">Visibility Control</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#17201B] font-semibold mb-1.5">
              Lifecycle Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => {
                const nextStatus = e.target.value as ProductStatus;
                setFormData((prev) => ({
                  ...prev,
                  status: nextStatus,
                  published: nextStatus === "published",
                }));
              }}
              className="w-full bg-[#FFFFFF] border border-[#E1E8E2] px-4 py-2.5 text-xs font-semibold text-[#17201B] rounded-xs focus:border-[#123C2D] outline-none cursor-pointer"
            >
              <option value="draft">Draft (Admin Only)</option>
              <option value="published">Published (Live Public)</option>
              <option value="archived">Archived (Delisted)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#17201B] font-semibold mb-1.5">
              Catalogue Display Order
            </label>
            <input
              type="number"
              value={formData.displayOrder}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  displayOrder: parseInt(e.target.value) || 0,
                  order: parseInt(e.target.value) || 0,
                }))
              }
              placeholder="0"
              className="w-full bg-[#FFFFFF] border border-[#E1E8E2] px-4 py-2.5 text-xs text-[#17201B] rounded-xs focus:border-[#123C2D] outline-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-6">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-[#17201B]">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData((prev) => ({ ...prev, featured: e.target.checked }))}
                className="w-4 h-4 text-[#123C2D] rounded border-[#E1E8E2]"
              />
              <span className="flex items-center gap-1.5">
                <Sparkles size={13} className="text-[#B7791F]" />
                <span>Featured Formulation</span>
              </span>
            </label>
          </div>
        </div>

        {/* Source & Audit Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-3 border-t border-[#E1E8E2]/60">
          <div>
            <label className="block text-[11px] uppercase text-[#68756D] font-bold mb-1">
              Source Type
            </label>
            <input
              type="text"
              value={formData.source.sourceType}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  source: { ...prev.source, sourceType: e.target.value },
                }))
              }
              placeholder="Product packaging"
              className="w-full bg-white border border-[#E1E8E2] px-3 py-1.5 text-xs rounded-xs"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase text-[#68756D] font-bold mb-1">
              Source Reference / Dossier
            </label>
            <input
              type="text"
              value={formData.source.sourceReference}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  source: { ...prev.source, sourceReference: e.target.value },
                }))
              }
              placeholder="e.g. Physical carton artwork verification"
              className="w-full bg-white border border-[#E1E8E2] px-3 py-1.5 text-xs rounded-xs"
            />
          </div>

          <div className="flex items-center gap-2 pt-5">
            <label className="flex items-center gap-2 text-xs font-semibold text-[#17201B] cursor-pointer">
              <input
                type="checkbox"
                checked={formData.source.verified}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    source: { ...prev.source, verified: e.target.checked },
                  }))
                }
                className="w-4 h-4 text-[#123C2D]"
              />
              <span>Content Verified by QA</span>
            </label>
          </div>
        </div>
      </section>

      {/* Sticky Bottom Save Bar */}
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
