"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  Plus,
  Edit,
  Trash2,
  FolderTree,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Archive,
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ED1C24]" />
            <span className="text-[11px] uppercase tracking-[0.2em] font-sans font-semibold text-[#81998D]">
              Catalogue Taxonomies
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight mt-1">
            Product Categories
          </h1>
          <p className="text-xs text-white/60 font-sans mt-0.5">
            Organize formulations into therapeutic disciplines referenced by product records and filter menus.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 bg-[#123C2D] hover:bg-[#294F3D] text-white text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors flex items-center gap-2 border border-white/10 shadow-xs cursor-pointer"
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
        <div className="py-16 text-center bg-[#0E1B15] border border-white/10 rounded-xs space-y-3">
          <p className="text-sm text-white/60">No categories found.</p>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#123C2D] text-white text-xs uppercase tracking-wider font-semibold rounded-xs"
          >
            <Plus size={13} />
            <span>Create First Category</span>
          </button>
        </div>
      ) : (
        <div className="bg-[#0E1B15] border border-white/10 rounded-xs overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-[#0A1410] text-[#81998D] uppercase tracking-wider font-sans font-semibold">
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4">Category Name</th>
                <th className="py-3 px-4">Slug</th>
                <th className="py-3 px-4">Tagline</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-sans">
              {categories.map((c) => (
                <tr key={c.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4 text-white/50 font-mono">#{c.order}</td>
                  <td className="py-3.5 px-4 font-serif font-bold text-white text-sm">
                    {c.name}
                  </td>
                  <td className="py-3.5 px-4 text-white/60 text-xs font-mono">
                    /{c.slug}
                  </td>
                  <td className="py-3.5 px-4 text-white/60">
                    {c.tagline || "—"}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-xs text-[10px] uppercase font-semibold tracking-wider ${
                        c.archived
                          ? "bg-amber-500/20 text-amber-300"
                          : "bg-emerald-500/20 text-emerald-300"
                      }`}
                    >
                      {c.archived ? "Archived" : "Active"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(c)}
                        title="Edit Category"
                        className="p-1.5 text-[#81998D] hover:text-white transition-colors cursor-pointer"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id, c.name)}
                        title="Delete / Archive Category"
                        className="p-1.5 text-white/40 hover:text-red-400 transition-colors cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0E1B15] border border-white/15 rounded-xs w-full max-w-md p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-serif font-bold text-white">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/40 hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {feedback && (
              <div
                className={`p-3 rounded-xs text-xs font-sans flex items-center gap-2 ${
                  feedback.type === "error"
                    ? "bg-red-500/15 text-red-300 border border-red-500/30"
                    : "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                }`}
              >
                {feedback.type === "error" ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />}
                <span>{feedback.message}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-white/70 font-sans mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Neurological Wellness"
                  className="w-full bg-[#0A1410] border border-white/10 px-3.5 py-2 text-xs text-white rounded-xs focus:border-[#81998D] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/70 font-sans mb-1">
                  Slug *
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="neurological-wellness"
                  className="w-full bg-[#0A1410] border border-white/10 px-3.5 py-2 text-xs text-white rounded-xs focus:border-[#81998D] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/70 font-sans mb-1">
                  Short Tagline
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="e.g. Targeted Nerve Cellular Resilience"
                  className="w-full bg-[#0A1410] border border-white/10 px-3.5 py-2 text-xs text-white rounded-xs focus:border-[#81998D] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/70 font-sans mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  className="w-full bg-[#0A1410] border border-white/10 px-3.5 py-2 text-xs text-white rounded-xs focus:border-[#81998D] outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs uppercase tracking-wider rounded-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#123C2D] hover:bg-[#294F3D] text-white text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
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
