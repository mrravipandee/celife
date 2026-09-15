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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E1E8E2]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ED1C24]" />
            <span className="text-[11px] uppercase tracking-[0.2em] font-sans font-semibold text-[#6F8F80]">
              Catalogue CMS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#17201B] tracking-tight mt-1">
            Product Formulations
          </h1>
          <p className="text-xs text-[#68756D] font-sans mt-0.5">
            Manage your nutraceutical and botanical product portfolio, specifications, and visibility.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/categories"
            className="px-4 py-2.5 bg-[#FFFFFF] hover:bg-[#F0F4F0] text-[#17201B] text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors border border-[#E1E8E2] shadow-2xs"
          >
            Manage Categories
          </Link>
          <Link
            href="/dashboard/products/new"
            className="px-5 py-2.5 bg-[#123C2D] hover:bg-[#294F3D] text-white text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors flex items-center gap-2 border border-[#123C2D] shadow-xs"
          >
            <Plus size={14} />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-[#FFFFFF] border border-[#E1E8E2] rounded-xs p-4 shadow-2xs">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#68756D]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by formulation name, subtitle, or category..."
            className="w-full bg-[#F6F8F5] focus:bg-[#FFFFFF] border border-[#E1E8E2] pl-10 pr-4 py-2.5 text-xs text-[#17201B] placeholder-[#68756D]/60 rounded-xs focus:border-[#123C2D] outline-none transition-colors"
          />
        </div>

        {/* Category Filter */}
        <div className="w-full md:w-56">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-[#F6F8F5] focus:bg-[#FFFFFF] border border-[#E1E8E2] px-3.5 py-2.5 text-xs text-[#17201B] rounded-xs focus:border-[#123C2D] outline-none cursor-pointer transition-colors"
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
            className="w-full bg-[#F6F8F5] focus:bg-[#FFFFFF] border border-[#E1E8E2] px-3.5 py-2.5 text-xs text-[#17201B] rounded-xs focus:border-[#123C2D] outline-none cursor-pointer transition-colors"
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
        <div className="py-16 text-center bg-[#FFFFFF] border border-[#E1E8E2] rounded-xs space-y-3 shadow-2xs">
          <p className="text-sm text-[#68756D]">No formulations found matching the criteria.</p>
          <Link
            href="/dashboard/products/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#123C2D] text-white text-xs uppercase tracking-wider font-semibold rounded-xs shadow-xs"
          >
            <Plus size={13} />
            <span>Create First Formulation</span>
          </Link>
        </div>
      ) : (
        <div className="bg-[#FFFFFF] border border-[#E1E8E2] rounded-xs overflow-x-auto shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E1E8E2] bg-[#F0F4F0] text-[#123C2D] uppercase tracking-wider font-sans font-semibold">
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Presentation</th>
                <th className="py-3 px-4">Featured</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E1E8E2] font-sans">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-[#F6F8F5] transition-colors">
                  {/* Order */}
                  <td className="py-3.5 px-4 text-[#68756D] font-mono">
                    #{p.order ?? 0}
                  </td>

                  {/* Product Info */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-xs overflow-hidden border border-[#E1E8E2] bg-[#F6F8F5] shrink-0">
                        <Image
                          src={p.image || "/images/products/nervify-forte.jpg"}
                          alt={p.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <strong className="text-sm font-serif font-bold text-[#17201B] block truncate">
                          {p.name}
                        </strong>
                        <span className="text-[11px] text-[#68756D] block truncate font-mono">
                          /{p.slug}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 bg-[#F0F4F0] border border-[#E1E8E2] text-[#123C2D] rounded-xs text-[11px] font-medium">
                      {p.category}
                    </span>
                  </td>

                  {/* Presentation */}
                  <td className="py-3.5 px-4 text-[#68756D] text-[11px]">
                    {p.form || p.packaging || "—"}
                  </td>

                  {/* Featured */}
                  <td className="py-3.5 px-4">
                    {p.featured ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#B7791F]">
                        <Sparkles size={12} />
                        <span>Featured</span>
                      </span>
                    ) : (
                      <span className="text-[#68756D]/40 text-[11px]">—</span>
                    )}
                  </td>

                  {/* Status Toggle */}
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleTogglePublish(p.id, p.published)}
                      title="Click to toggle publish status"
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs text-[10px] uppercase tracking-wider font-semibold cursor-pointer transition-colors border ${
                        p.published
                          ? "bg-emerald-50 text-[#2F7D54] border-emerald-200 hover:bg-emerald-100"
                          : "bg-gray-100 text-[#68756D] border-gray-200 hover:bg-gray-200"
                      }`}
                    >
                      {p.published ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
                      <span>{p.published ? "Published" : "Draft"}</span>
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/products/${p.slug}`}
                        target="_blank"
                        title="View Live Page"
                        className="p-1.5 text-[#68756D] hover:text-[#123C2D] rounded-xs hover:bg-[#F0F4F0] transition-colors"
                      >
                        <ExternalLink size={14} />
                      </Link>
                      <Link
                        href={`/dashboard/products/${p.id}/edit`}
                        title="Edit Product"
                        className="p-1.5 text-[#123C2D] hover:text-[#294F3D] rounded-xs hover:bg-[#F0F4F0] transition-colors"
                      >
                        <Edit size={14} />
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        title="Delete Product"
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
    </motion.div>
  );
}
