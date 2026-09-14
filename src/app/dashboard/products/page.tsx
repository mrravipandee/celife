"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Sparkles,
} from "lucide-react";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Product } from "@/types/product";

interface CategoryItem {
  id: string;
  name: string;
}

export default function ProductsListPage() {
  const prefersReduced = useReducedMotion();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    let active = true;
    Promise.all([fetch("/api/products"), fetch("/api/categories")])
      .then(async ([prodRes, catRes]) => {
        const prodJson = await prodRes.json();
        const catJson = await catRes.json();
        if (active) {
          if (prodJson.success && Array.isArray(prodJson.data)) {
            setProducts(prodJson.data);
          }
          if (catJson.success && Array.isArray(catJson.data)) {
            setCategories(catJson.data);
          }
        }
      })
      .catch(() => {
        if (active) setError("Failed to load products");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleTogglePublish = async (id: string, currentStatus?: boolean) => {
    try {
      const nextStatus = !Boolean(currentStatus);
      const res = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: nextStatus }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, published: nextStatus } : p))
        );
      }
    } catch {
      alert("Failed to update published status");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert("Failed to delete product");
      }
    } catch {
      alert("Error deleting product");
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.subtitle && p.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      p.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesStatus =
      selectedStatus === "all" ||
      (selectedStatus === "published" && p.published) ||
      (selectedStatus === "draft" && !p.published);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: prefersReduced ? 0 : 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 pb-16 select-none"
    >
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ED1C24]" />
            <span className="text-[11px] uppercase tracking-[0.2em] font-sans font-semibold text-[#81998D]">
              Catalogue CMS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight mt-1">
            Product Formulations
          </h1>
          <p className="text-xs text-white/60 font-sans mt-0.5">
            Manage your nutraceutical and botanical product portfolio, specifications, and visibility.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/categories"
            className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors border border-white/10"
          >
            Manage Categories
          </Link>
          <Link
            href="/dashboard/products/new"
            className="px-5 py-2.5 bg-[#123C2D] hover:bg-[#294F3D] text-white text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors flex items-center gap-2 border border-white/10 shadow-xs"
          >
            <Plus size={14} />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-[#0E1B15] border border-white/10 rounded-xs p-4">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by formulation name, subtitle, or category..."
            className="w-full bg-[#0A1410] border border-white/10 pl-10 pr-4 py-2 text-xs text-white rounded-xs focus:border-[#81998D] outline-none"
          />
        </div>

        {/* Category Filter */}
        <div className="w-full md:w-56">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-[#0A1410] border border-white/10 px-3 py-2 text-xs text-white rounded-xs focus:border-[#81998D] outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="w-full md:w-44">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-[#0A1410] border border-white/10 px-3 py-2 text-xs text-white rounded-xs focus:border-[#81998D] outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published Only</option>
            <option value="draft">Draft Only</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      {isLoading ? (
        <LoadingState variant="table" />
      ) : error ? (
        <ErrorState title="Error Loading Products" description={error} onRetry={() => window.location.reload()} />
      ) : filteredProducts.length === 0 ? (
        <div className="py-16 text-center bg-[#0E1B15] border border-white/10 rounded-xs space-y-3">
          <p className="text-sm text-white/60">No formulations found matching the criteria.</p>
          <Link
            href="/dashboard/products/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#123C2D] text-white text-xs uppercase tracking-wider font-semibold rounded-xs"
          >
            <Plus size={13} />
            <span>Create First Formulation</span>
          </Link>
        </div>
      ) : (
        <div className="bg-[#0E1B15] border border-white/10 rounded-xs overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-[#0A1410] text-[#81998D] uppercase tracking-wider font-sans font-semibold">
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Presentation</th>
                <th className="py-3 px-4">Featured</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-sans">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-white/5 transition-colors">
                  {/* Order */}
                  <td className="py-3.5 px-4 text-white/50 font-mono">
                    #{p.order ?? 0}
                  </td>

                  {/* Product Info */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-xs overflow-hidden border border-white/10 bg-white shrink-0">
                        <Image
                          src={p.image || "/images/products/nervify-forte.jpg"}
                          alt={p.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <strong className="text-sm font-serif font-bold text-white block truncate">
                          {p.name}
                        </strong>
                        <span className="text-[11px] text-white/50 block truncate">
                          /{p.slug}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4 text-white/80">
                    <span className="px-2 py-0.5 bg-white/5 rounded-xs border border-white/5 text-[11px]">
                      {p.category}
                    </span>
                  </td>

                  {/* Presentation */}
                  <td className="py-3.5 px-4 text-white/60 text-[11px]">
                    {p.form || p.packaging || "—"}
                  </td>

                  {/* Featured */}
                  <td className="py-3.5 px-4">
                    {p.featured ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-300">
                        <Sparkles size={12} />
                        <span>Featured</span>
                      </span>
                    ) : (
                      <span className="text-white/30 text-[11px]">—</span>
                    )}
                  </td>

                  {/* Status Toggle */}
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleTogglePublish(p.id, p.published)}
                      title="Click to toggle publish status"
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs text-[10px] uppercase tracking-wider font-semibold cursor-pointer transition-colors ${
                        p.published
                          ? "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
                          : "bg-white/10 text-white/50 hover:bg-white/15"
                      }`}
                    >
                      {p.published ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
                      <span>{p.published ? "Published" : "Draft"}</span>
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/products/${p.slug}`}
                        target="_blank"
                        title="View Live Page"
                        className="p-1.5 text-white/60 hover:text-white transition-colors"
                      >
                        <ExternalLink size={14} />
                      </Link>
                      <Link
                        href={`/dashboard/products/${p.id}/edit`}
                        title="Edit Product"
                        className="p-1.5 text-[#81998D] hover:text-white transition-colors"
                      >
                        <Edit size={14} />
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        title="Delete Product"
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
    </motion.div>
  );
}
