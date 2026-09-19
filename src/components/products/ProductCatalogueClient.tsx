"use client";

import React, { useState, useMemo, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Product } from "@/types/product";
import { ProductCard } from "@/components/products/ProductCard";
import { Search, X, SlidersHorizontal } from "lucide-react";

interface CategoryOption {
  label: string;
  value: string;
}

interface ProductCatalogueClientProps {
  initialProducts: Product[];
  categories: CategoryOption[];
  currentCategory: string;
}

export function ProductCatalogueClient({
  initialProducts,
  categories,
  currentCategory,
}: ProductCatalogueClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const [searchQuery, setSearchQuery] = useState("");

  const handleCategoryChange = (categoryValue: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (categoryValue === "all") {
        params.delete("category");
      } else {
        params.set("category", categoryValue);
      }
      const newQuery = params.toString();
      router.push(newQuery ? `/products?${newQuery}` : "/products", { scroll: false });
    });
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleResetAll = () => {
    setSearchQuery("");
    startTransition(() => {
      router.push("/products", { scroll: false });
    });
  };

  // Filter products by active category & search query
  const filteredProducts = useMemo(() => {
    let result = initialProducts;

    if (currentCategory && currentCategory !== "all") {
      result = result.filter(
        (p) => p.category.toLowerCase() === currentCategory.toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.shortDescription && p.shortDescription.toLowerCase().includes(q)) ||
          (p.format && p.format.toLowerCase().includes(q)) ||
          (p.dosageForm && p.dosageForm.toLowerCase().includes(q)) ||
          (p.wellnessFocus && p.wellnessFocus.toLowerCase().includes(q))
      );
    }

    return result;
  }, [initialProducts, currentCategory, searchQuery]);

  return (
    <div className="space-y-10">
      {/* Search & Filter Controls Toolbar */}
      <div className="space-y-6 pt-4 border-t border-[var(--line)]">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--sage)]">
              <Search size={16} strokeWidth={1.75} />
            </div>
            <input
              type="text"
              id="product-catalogue-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search formulations by name or category..."
              className="w-full pl-10 pr-10 py-2.5 bg-[var(--paper)] text-[var(--ink)] placeholder-[var(--sage)]/70 text-xs sm:text-sm font-sans border border-[var(--line)] rounded-[6px] focus:outline-hidden focus:border-[var(--forest)] focus:ring-1 focus:ring-[var(--forest)] transition-all"
              aria-label="Search formulations by name or category"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                aria-label="Clear search query"
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[var(--sage)] hover:text-[var(--ink)] cursor-pointer"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Result Count Indicator */}
          <div className="flex items-center gap-2 text-xs font-sans text-[var(--sage)]">
            <SlidersHorizontal size={13} className="text-[var(--forest)]" />
            <span>
              Showing <strong className="text-[var(--ink)] font-semibold">{filteredProducts.length}</strong> {filteredProducts.length === 1 ? "formulation" : "formulations"}
            </span>
          </div>
        </div>

        {/* Dynamic Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1" role="tablist" aria-label="Filter by formulation category">
          {categories.map((cat) => {
            const active =
              (currentCategory === "all" && cat.value === "all") ||
              currentCategory.toLowerCase() === cat.value.toLowerCase();

            return (
              <button
                key={cat.value}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => handleCategoryChange(cat.value)}
                className={`px-4 py-2 text-xs uppercase tracking-[0.12em] font-sans font-medium rounded-[4px] cursor-pointer transition-all duration-200 ${
                  active
                    ? "bg-[var(--forest)] text-white shadow-xs"
                    : "bg-[var(--paper)] text-[var(--sage)] hover:text-[var(--forest)] hover:bg-[var(--bone)] border border-[var(--line)]"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Cards Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-8 xl:gap-10">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-20 text-center bg-[var(--paper)] border border-[var(--line)] rounded-[6px] p-12 space-y-4 max-w-xl mx-auto shadow-xs">
          <p className="text-base text-[var(--ink)] font-serif font-bold">
            No formulations matching your search or category selection.
          </p>
          <p className="text-xs sm:text-sm text-[var(--sage)] font-sans">
            Try adjusting your search keywords or explore all available clinical formulation categories.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={handleResetAll}
              className="inline-flex items-center justify-center px-6 py-2.5 bg-[var(--forest)] text-white hover:bg-[var(--forest-700)] text-xs uppercase tracking-wider font-semibold rounded-[4px] cursor-pointer transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
