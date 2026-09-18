"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
} from "lucide-react";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";

interface Category {
  id: string;
  name: string;
  slug: string;
  tagline?: string;
  description?: string;
  order: number;
  archived: boolean;
}

export default function CategoriesPage() {
  const prefersReduced = useReducedMotion();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    tagline: "",
    description: "",
    order: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setCategories(json.data);
      }
    } catch {
      setError("Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    fetch("/api/categories")
      .then((res) => res.json())
      .then((json) => {
        if (active && json.success && Array.isArray(json.data)) {
          setCategories(json.data);
        }
      })
      .catch(() => {
        if (active) setError("Failed to load categories");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      slug: "",
      tagline: "",
      description: "",
      order: categories.length,
    });
    setFeedback(null);
    setIsModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      tagline: category.tagline || "",
      description: category.description || "",
      order: category.order || 0,
    });
    setFeedback(null);
    setIsModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    const slugVal = val
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
    setFormData((prev) => ({
      ...prev,
      name: val,
      ...(!editingCategory && { slug: slugVal }),
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    try {
      const url = editingCategory
        ? `/api/categories/${editingCategory.id}`
        : "/api/categories";
      const method = editingCategory ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to save category");
      }

      setFeedback({
        type: "success",
        message: editingCategory ? "Category updated!" : "Category created!",
      });
      setTimeout(() => {
        setIsModalOpen(false);
        fetchCategories();
      }, 800);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save category";
      setFeedback({ type: "error", message: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete or archive "${name}"?`)) return;

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (res.ok && json.success) {
        alert(json.message || "Category removed");
        fetchCategories();
      } else {
        alert("Failed to delete category");
      }
    } catch {
      alert("Error deleting category");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: prefersReduced ? 0 : 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 pb-16 select-none"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E1E8E2]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ED1C24]" />
            <span className="text-[11px] uppercase tracking-[0.2em] font-sans font-semibold text-[#6F8F80]">
              Catalogue Taxonomies
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#17201B] tracking-tight mt-1">
            Product Categories
          </h1>
          <p className="text-xs text-[#68756D] font-sans mt-0.5">
            Organize formulations into therapeutic disciplines referenced by product records and filter menus.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 bg-[#123C2D] hover:bg-[#294F3D] text-white text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors flex items-center gap-2 border border-[#123C2D] shadow-xs cursor-pointer"
        >
          <Plus size={14} />
          <span>Add Category</span>
        </button>
      </div>

      {/* Categories Table */}
      {isLoading ? (
        <LoadingState variant="table" />
      ) : error ? (
        <ErrorState title="Error Loading Categories" description={error} onRetry={fetchCategories} />
      ) : categories.length === 0 ? (
        <div className="py-16 text-center bg-[#FFFFFF] border border-[#E1E8E2] rounded-xs space-y-3 shadow-2xs">
          <p className="text-sm text-[#68756D]">No categories found.</p>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#123C2D] text-white text-xs uppercase tracking-wider font-semibold rounded-xs cursor-pointer shadow-xs"
          >
            <Plus size={13} />
            <span>Create First Category</span>
          </button>
        </div>
      ) : (
        <div className="bg-[#FFFFFF] border border-[#E1E8E2] rounded-xs overflow-x-auto shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E1E8E2] bg-[#F0F4F0] text-[#123C2D] uppercase tracking-wider font-sans font-semibold">
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4">Category Name</th>
                <th className="py-3 px-4">Slug</th>
                <th className="py-3 px-4">Tagline</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E1E8E2] font-sans">
              {categories.map((c) => (
                <tr key={c.id} className="hover:bg-[#F6F8F5] transition-colors">
                  <td className="py-3.5 px-4 text-[#68756D] font-mono">#{c.order}</td>
                  <td className="py-3.5 px-4 font-serif font-bold text-[#17201B] text-sm">
                    {c.name}
                  </td>
                  <td className="py-3.5 px-4 text-[#68756D] text-xs font-mono">
                    /{c.slug}
                  </td>
                  <td className="py-3.5 px-4 text-[#68756D]">
                    {c.tagline || "—"}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-xs text-[10px] uppercase font-semibold tracking-wider border ${
                        c.archived
                          ? "bg-amber-50 text-[#B7791F] border-amber-200"
                          : "bg-emerald-50 text-[#2F7D54] border-emerald-200"
                      }`}
                    >
                      {c.archived ? "Archived" : "Active"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEditModal(c)}
                        title="Edit Category"
                        className="p-1.5 text-[#123C2D] hover:text-[#294F3D] rounded-xs hover:bg-[#F0F4F0] transition-colors cursor-pointer"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id, c.name)}
                        title="Delete / Archive Category"
                        className="p-1.5 text-[#68756D] hover:text-[#C0392B] rounded-xs hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Dialog for Add / Edit Category */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] border border-[#E1E8E2] rounded-xs w-full max-w-md p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E1E8E2]">
              <h3 className="text-base font-serif font-bold text-[#17201B]">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#68756D] hover:text-[#17201B] p-1 rounded-xs transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {feedback && (
              <div
                className={`p-3 rounded-xs text-xs font-sans flex items-center gap-2 border ${
                  feedback.type === "error"
                    ? "bg-red-50 text-[#C0392B] border-red-200"
                    : "bg-emerald-50 text-[#2F7D54] border-emerald-200"
                }`}
              >
                {feedback.type === "error" ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />}
                <span>{feedback.message}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#17201B] font-sans font-semibold mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Neurological Wellness"
                  className="w-full bg-[#FFFFFF] border border-[#E1E8E2] px-3.5 py-2 text-xs text-[#17201B] rounded-xs focus:border-[#123C2D] focus:ring-1 focus:ring-[#123C2D]/10 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#17201B] font-sans font-semibold mb-1">
                  Slug *
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="neurological-wellness"
                  className="w-full bg-[#FFFFFF] border border-[#E1E8E2] px-3.5 py-2 text-xs text-[#17201B] rounded-xs focus:border-[#123C2D] focus:ring-1 focus:ring-[#123C2D]/10 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#17201B] font-sans font-semibold mb-1">
                  Short Tagline
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="e.g. Targeted Nerve Cellular Resilience"
                  className="w-full bg-[#FFFFFF] border border-[#E1E8E2] px-3.5 py-2 text-xs text-[#17201B] rounded-xs focus:border-[#123C2D] focus:ring-1 focus:ring-[#123C2D]/10 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#17201B] font-sans font-semibold mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  className="w-full bg-[#FFFFFF] border border-[#E1E8E2] px-3.5 py-2 text-xs text-[#17201B] rounded-xs focus:border-[#123C2D] focus:ring-1 focus:ring-[#123C2D]/10 outline-none transition-colors"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E1E8E2]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-[#F0F4F0] hover:bg-[#E1E8E2] text-[#17201B] text-xs uppercase tracking-wider font-semibold rounded-xs border border-[#E1E8E2] cursor-pointer transition-colors shadow-2xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#123C2D] hover:bg-[#294F3D] text-white text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-xs"
                >
                  {isSubmitting && <Loader2 size={13} className="animate-spin" />}
                  <span>Save</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
}
