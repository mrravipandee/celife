import React from "react";
import { ProductForm } from "@/components/dashboard/ProductForm";

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <span className="text-[11px] uppercase tracking-[0.2em] font-sans font-semibold text-[#6F8F80]">
          Product Catalogue
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#17201B] tracking-tight mt-1">
          Add New Formulation
        </h1>
        <p className="text-xs text-[#68756D] font-sans mt-0.5">
          Enter product identification, botanical matrix, dosage form, packaging, and high-resolution photo.
        </p>
      </div>

      <ProductForm isEditing={false} />
    </div>
  );
}
