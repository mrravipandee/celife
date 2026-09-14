"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productEnquirySchema, ProductEnquiryInput } from "@/lib/validations/enquiry";
import { Product } from "@/types/product";
import { productsData } from "@/data/products";
import { CheckCircle2, AlertCircle, Loader2, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductEnquiryFormProps {
  initialProductSlug?: string;
}

export function ProductEnquiryForm({ initialProductSlug }: ProductEnquiryFormProps) {
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Determine initial product
  const defaultProduct =
    productsData.find((p) => p.slug === initialProductSlug) || productsData[0];

  const [selectedProduct, setSelectedProduct] = useState<Product>(defaultProduct);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<ProductEnquiryInput>({
    resolver: zodResolver(productEnquirySchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      product: defaultProduct.name,
      company: "",
      message: `I would like more information regarding ${defaultProduct.name}.`,
    },
  });

  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const slug = e.target.value;
    const found = productsData.find((p) => p.slug === slug);
    if (found) {
      setSelectedProduct(found);
      setValue("product", found.name, { shouldValidate: true });
      setValue("message", `I would like more information regarding ${found.name}.`);
    }
  };

  const onSubmit = async (data: ProductEnquiryInput) => {
    setSubmitStatus("loading");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          product: data.product,
          company: data.company || "",
          projectType: "Product Enquiry",
          message: data.message,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitStatus("success");
        reset();
      } else {
        setSubmitStatus("error");
        setErrorMessage(
          result?.error?.message || "Unable to submit enquiry. Please try again or contact us directly."
        );
      }
    } catch (err: unknown) {
      console.error("Product enquiry error:", err);
      setSubmitStatus("error");
      setErrorMessage("Network connection error. Please verify your connection and retry.");
    }
  };

  return (
    <div className="bg-white border border-[#123C2D]/10 rounded-xs shadow-sm overflow-hidden">
      {/* Active Selected Product Banner */}
      <div className="bg-[#123C2D] text-white p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-[#123C2D]/20">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-xs overflow-hidden border border-white/20 shrink-0">
            <Image
              src={selectedProduct.image}
              alt={selectedProduct.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#C4D5C7] block font-medium">
              Product Enquiry
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
              {selectedProduct.name}
            </h2>
            <span className="text-xs text-white/70 block mt-0.5">
              {selectedProduct.category} • {selectedProduct.packaging.split("(")[0].trim()}
            </span>
          </div>
        </div>

        <Link
          href={`/products/${selectedProduct.slug}`}
          className="inline-flex items-center gap-1.5 text-xs text-white/80 hover:text-white uppercase tracking-wider font-sans underline underline-offset-4"
        >
          <span>View Spec Sheet</span>
        </Link>
      </div>

      {/* Form Content Area */}
      <div className="p-6 md:p-10">
        {submitStatus === "success" ? (
          <div className="py-12 text-center space-y-5 max-w-lg mx-auto">
            <div className="w-14 h-14 bg-[#123C2D]/10 text-[#123C2D] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={32} className="text-[#123C2D]" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-serif font-bold text-[#171B18]">
                Enquiry Received
              </h3>
              <p className="text-sm font-sans text-[#52635A] leading-relaxed">
                Thank you for your interest in <strong>{selectedProduct.name}</strong>. Our medical and product advisory team will review your specifications and get in touch promptly.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setSubmitStatus("idle")}
                className="px-6 py-3 text-xs uppercase tracking-wider font-semibold bg-[#123C2D] text-white hover:bg-[#294F3D] rounded-xs transition-colors cursor-pointer"
              >
                Send Another Enquiry
              </button>
              <Link
                href="/products"
                className="px-6 py-3 text-xs uppercase tracking-wider font-medium text-[#123C2D] border border-[#123C2D]/20 hover:bg-[#F4F5EF] rounded-xs transition-colors"
              >
                Back to Catalogue
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            {/* Error Notification Alert */}
            {submitStatus === "error" && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xs flex items-start gap-3 text-red-900 text-xs">
                <AlertCircle size={18} className="text-[#ED1C24] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold">Submission Issue</p>
                  <p className="text-red-700">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Product Switcher Field */}
            <div className="space-y-1.5">
              <label htmlFor="product-select" className="block text-xs uppercase tracking-wider font-semibold text-[#171B18]">
                Selected Product <span className="text-[#ED1C24]">*</span>
              </label>
              <select
                id="product-select"
                value={selectedProduct.slug}
                onChange={handleProductChange}
                className="w-full px-4 py-3 bg-[#F8FAF6] border border-[#123C2D]/20 rounded-xs text-sm text-[#171B18] focus:outline-none focus:border-[#123C2D] focus:ring-1 focus:ring-[#123C2D] transition-colors"
              >
                {productsData.map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {p.name} ({p.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Grid Row: Name & Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label htmlFor="enquiry-name" className="block text-xs uppercase tracking-wider font-semibold text-[#171B18]">
                  Full Name <span className="text-[#ED1C24]">*</span>
                </label>
                <input
                  id="enquiry-name"
                  type="text"
                  placeholder="Your full name"
                  {...register("name")}
                  className={cn(
                    "w-full px-4 py-3 bg-[#F8FAF6] border rounded-xs text-sm text-[#171B18] placeholder:text-[#52635A]/50 focus:outline-none focus:ring-1 transition-colors",
                    errors.name
                      ? "border-[#ED1C24] focus:border-[#ED1C24] focus:ring-[#ED1C24]"
                      : "border-[#123C2D]/20 focus:border-[#123C2D] focus:ring-[#123C2D]"
                  )}
                />
                {errors.name && (
                  <p className="text-[11px] text-[#ED1C24]">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="enquiry-phone" className="block text-xs uppercase tracking-wider font-semibold text-[#171B18]">
                  Phone Number <span className="text-[#ED1C24]">*</span>
                </label>
                <input
                  id="enquiry-phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  {...register("phone")}
                  className={cn(
                    "w-full px-4 py-3 bg-[#F8FAF6] border rounded-xs text-sm text-[#171B18] placeholder:text-[#52635A]/50 focus:outline-none focus:ring-1 transition-colors",
                    errors.phone
                      ? "border-[#ED1C24] focus:border-[#ED1C24] focus:ring-[#ED1C24]"
                      : "border-[#123C2D]/20 focus:border-[#123C2D] focus:ring-[#123C2D]"
                  )}
                />
                {errors.phone && (
                  <p className="text-[11px] text-[#ED1C24]">{errors.phone.message}</p>
                )}
              </div>
            </div>

            {/* Grid Row: Email & Organization */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label htmlFor="enquiry-email" className="block text-xs uppercase tracking-wider font-semibold text-[#171B18]">
                  Email Address <span className="text-[#ED1C24]">*</span>
                </label>
                <input
                  id="enquiry-email"
                  type="email"
                  placeholder="you@domain.com"
                  {...register("email")}
                  className={cn(
                    "w-full px-4 py-3 bg-[#F8FAF6] border rounded-xs text-sm text-[#171B18] placeholder:text-[#52635A]/50 focus:outline-none focus:ring-1 transition-colors",
                    errors.email
                      ? "border-[#ED1C24] focus:border-[#ED1C24] focus:ring-[#ED1C24]"
                      : "border-[#123C2D]/20 focus:border-[#123C2D] focus:ring-[#123C2D]"
                  )}
                />
                {errors.email && (
                  <p className="text-[11px] text-[#ED1C24]">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="enquiry-company" className="block text-xs uppercase tracking-wider font-semibold text-[#171B18]">
                  Organization / Clinic / Pharmacy (Optional)
                </label>
                <input
                  id="enquiry-company"
                  type="text"
                  placeholder="Clinic, distributor or business name"
                  {...register("company")}
                  className="w-full px-4 py-3 bg-[#F8FAF6] border border-[#123C2D]/20 rounded-xs text-sm text-[#171B18] placeholder:text-[#52635A]/50 focus:outline-none focus:border-[#123C2D] focus:ring-1 focus:ring-[#123C2D] transition-colors"
                />
              </div>
            </div>

            {/* Message Area */}
            <div className="space-y-1.5">
              <label htmlFor="enquiry-message" className="block text-xs uppercase tracking-wider font-semibold text-[#171B18]">
                Enquiry Details <span className="text-[#ED1C24]">*</span>
              </label>
              <textarea
                id="enquiry-message"
                rows={4}
                placeholder="Specify your inquiry, wholesale requirement, formulation details, or distribution questions..."
                {...register("message")}
                className={cn(
                  "w-full px-4 py-3 bg-[#F8FAF6] border rounded-xs text-sm text-[#171B18] placeholder:text-[#52635A]/50 focus:outline-none focus:ring-1 transition-colors resize-y",
                  errors.message
                    ? "border-[#ED1C24] focus:border-[#ED1C24] focus:ring-[#ED1C24]"
                    : "border-[#123C2D]/20 focus:border-[#123C2D] focus:ring-[#123C2D]"
                )}
              />
              {errors.message && (
                <p className="text-[11px] text-[#ED1C24]">{errors.message.message}</p>
              )}
            </div>

            {/* Submit CTA */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-[#52635A]">
                Your information is handled strictly according to professional confidentiality standards.
              </p>

              <button
                type="submit"
                disabled={submitStatus === "loading"}
                className="w-full sm:w-auto px-8 py-4 bg-[#123C2D] hover:bg-[#294F3D] text-white text-xs uppercase tracking-[0.2em] font-semibold rounded-xs shadow-md transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
              >
                {submitStatus === "loading" ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Submitting Enquiry...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Product Enquiry</span>
                    <Send size={14} />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
