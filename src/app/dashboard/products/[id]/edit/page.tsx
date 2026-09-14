"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ProductForm } from "@/components/dashboard/ProductForm";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Product } from "@/types/product";

export default function EditProductPage() {
  const params = useParams();
  const id = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProduct() {
      if (!id) return;
      try {
        const res = await fetch(`/api/products/${id}`);
        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.error?.message || "Failed to load product");
        }
        setProduct(json.data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        setIsLoading(false);
      }
    }
    loadProduct();
  }, [id]);

  if (isLoading) return <LoadingState variant="form" />;
  if (error || !product) {
    return (
      <ErrorState
        title="Formulation Not Found"
        description={error || "The requested product does not exist."}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[11px] uppercase tracking-[0.2em] font-sans font-semibold text-[#81998D]">
          Product Catalogue
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight mt-1">
          Edit {product.name}
        </h1>
        <p className="text-xs text-white/60 font-sans mt-0.5">
          Update formulation specifications, presentation, and publishing visibility.
        </p>
      </div>

      <ProductForm initialData={product} productId={id} isEditing={true} />
    </div>
  );
}
