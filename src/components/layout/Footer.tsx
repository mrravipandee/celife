"use client";

import React from "react";
import Link from "next/link";
import { CelifeLogo } from "@/components/ui/CelifeLogo";
import { BotanicalMandala } from "@/components/ui/BotanicalMandala";
import {
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
  FileCheck2,
  Building2,
  Clock,
  ArrowUp,
  ExternalLink,
} from "lucide-react";
import { PublicSettings } from "@/lib/services/settings";

interface FooterProps {
  settings?: Partial<PublicSettings>;
}

export function Footer({ settings }: FooterProps) {
  const brandName = settings?.brand?.companyName || "Celife Health Solutions";
  const footerDesc =
    settings?.footer?.description ||
    "Celife Health Solutions develops evidence-informed nutraceutical and botanical formulations for neurological vitality, joint mobility, and systemic wellness — supplied direct to healthcare practitioners, pharmacies, and distributors.";
  const address = settings?.contact?.address || "Mumbai, Maharashtra, India";
  const email = settings?.contact?.email || "enquiry@celifehealth.com";
  const phone = settings?.contact?.phone || "+91 98200 12345";
  const copyright =
    settings?.footer?.copyright ||
    `© ${new Date().getFullYear()} ${brandName} Pvt. Ltd. All rights reserved.`;
  const disclaimer =
    settings?.footer?.disclaimer ||
    "Regulatory Notice: Information provided on this website is for professional evaluation and general educational purposes only. Formulations are dietary and botanical nutraceuticals, manufactured to standardized specifications, and are not intended to diagnose, treat, cure, or prevent any disease. Healthcare practitioners should evaluate suitability for their patients.";

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-gradient-to-b from-[#092218] via-[#061911] to-[#040e0a] text-white relative overflow-hidden border-t border-[var(--forest-700)]">
      {/* Ambient background depth & Botanical watermarks */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-24 w-96 h-96 sm:w-[480px] sm:h-[480px] text-white opacity-[0.035] select-none"
      >
        <BotanicalMandala />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -right-32 w-[520px] h-[520px] text-white opacity-[0.025] select-none"
      >
        <BotanicalMandala />
      </div>
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent" />

      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 relative z-10">
        {/* 1. High-Trust Quality & Certification Strip */}
        <div className="py-8 md:py-10 border-b border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-md bg-white/[0.05] border border-white/10 text-emerald-400 shrink-0">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h5 className="text-xs font-semibold tracking-wide text-white uppercase font-sans">
                GMP & ISO Controlled
              </h5>
              <p className="text-[11px] text-white/60 font-sans mt-0.5 leading-snug">
                Standardized cleanroom extraction & batch controls
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-md bg-white/[0.05] border border-white/10 text-emerald-400 shrink-0">
              <Sparkles size={18} />
            </div>
            <div>
              <h5 className="text-xs font-semibold tracking-wide text-white uppercase font-sans">
                Ayurvedic Pharmacopoeia
              </h5>
              <p className="text-[11px] text-white/60 font-sans mt-0.5 leading-snug">
                Botanical wisdom unified with modern pharmacokinetics
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-md bg-white/[0.05] border border-white/10 text-emerald-400 shrink-0">
              <FileCheck2 size={18} />
            </div>
            <div>
              <h5 className="text-xs font-semibold tracking-wide text-white uppercase font-sans">
                Batch-Tested CoAs
              </h5>
              <p className="text-[11px] text-white/60 font-sans mt-0.5 leading-snug">
                Screened for heavy metals & microbial purity
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-md bg-white/[0.05] border border-white/10 text-emerald-400 shrink-0">
              <Building2 size={18} />
            </div>
            <div>
              <h5 className="text-xs font-semibold tracking-wide text-white uppercase font-sans">
                Direct Institutional Supply
              </h5>
              <p className="text-[11px] text-white/60 font-sans mt-0.5 leading-snug">
                Direct to verified clinics, pharmacies & partners
              </p>
            </div>
          </div>
        </div>

        {/* 2. Main 4-Column Structured Content */}
        <div className="py-14 md:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Col 1: Brand, Description & Contact Details */}
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="inline-block">
              <CelifeLogo variant="light" />
            </Link>

            <p className="text-xs sm:text-sm font-sans text-white/75 leading-relaxed max-w-[42ch]">
              {footerDesc}
            </p>

            {/* Live Operational Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/20 text-[11px] text-emerald-300 font-sans">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>Product Desk Open · Mon–Fri 09:00–18:00 IST</span>
            </div>

            <div className="pt-2 flex flex-col space-y-2.5 text-xs font-sans text-white/70">
              <div className="flex items-center gap-2.5">
                <MapPin size={14} className="text-emerald-400 shrink-0" />
                <span className="text-white/90">{address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={14} className="text-emerald-400 shrink-0" />
                <a
                  href={`mailto:${email}`}
                  className="text-white/90 hover:text-white hover:underline underline-offset-2 transition-colors"
                >
                  {email}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={14} className="text-emerald-400 shrink-0" />
                <a
                  href={`tel:${phone.replace(/\s+/g, "")}`}
                  className="text-white/90 hover:text-white hover:underline underline-offset-2 transition-colors"
                >
                  {phone}
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Formulation Portfolios */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-[11px] uppercase tracking-[0.18em] font-sans font-semibold text-emerald-300/90">
              Formulation Portfolios
            </h4>
            <ul className="space-y-3 text-xs font-sans">
              <li>
                <Link
                  href="/products/nervify-forte"
                  className="group flex flex-col hover:text-white transition-colors"
                >
                  <div className="flex items-center justify-between text-white/90 group-hover:text-white font-medium">
                    <span>Nervify Forte</span>
                    <ArrowUpRight
                      size={13}
                      className="opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-emerald-400"
                    />
                  </div>
                  <span className="text-[11px] text-white/50 group-hover:text-white/70 transition-colors">
                    Neuro-Vitality & Peripheral Nerve Care
                  </span>
                </Link>
              </li>

              <li>
                <Link
                  href="/products/orthocare-active"
                  className="group flex flex-col hover:text-white transition-colors"
                >
                  <div className="flex items-center justify-between text-white/90 group-hover:text-white font-medium">
                    <span>OrthoCare Active</span>
                    <ArrowUpRight
                      size={13}
                      className="opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-emerald-400"
                    />
                  </div>
                  <span className="text-[11px] text-white/50 group-hover:text-white/70 transition-colors">
                    Joint Flexibility & Cartilage Cushion
                  </span>
                </Link>
              </li>

              <li>
                <Link
                  href="/products/livcleanse-synergy"
                  className="group flex flex-col hover:text-white transition-colors"
                >
                  <div className="flex items-center justify-between text-white/90 group-hover:text-white font-medium">
                    <span>LivCleanse Synergy</span>
                    <ArrowUpRight
                      size={13}
                      className="opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-emerald-400"
                    />
                  </div>
                  <span className="text-[11px] text-white/50 group-hover:text-white/70 transition-colors">
                    Hepatic Detox & Digestive Resilience
                  </span>
                </Link>
              </li>

              <li>
                <Link
                  href="/products/immunoshield-daily"
                  className="group flex flex-col hover:text-white transition-colors"
                >
                  <div className="flex items-center justify-between text-white/90 group-hover:text-white font-medium">
                    <span>ImmunoShield Daily</span>
                    <ArrowUpRight
                      size={13}
                      className="opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-emerald-400"
                    />
                  </div>
                  <span className="text-[11px] text-white/50 group-hover:text-white/70 transition-colors">
                    Systemic Immunity Matrix & Antioxidant Defense
                  </span>
                </Link>
              </li>

              <li className="pt-2">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  <span>Explore Full Formulations</span>
                  <ArrowUpRight size={13} />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Institutional & Standards */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-[11px] uppercase tracking-[0.18em] font-sans font-semibold text-emerald-300/90">
              Institutional & Desk
            </h4>
            <ul className="space-y-2.5 text-xs font-sans text-white/80">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  Product Catalogue
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Quality Standards & Story
                </Link>
              </li>
              <li>
                <Link href="/enquire" className="hover:text-white transition-colors">
                  Product Enquiry Desk
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Distribution & Supply
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Botanical Research Base
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Attention-Grabbing Practitioner Fast-Desk Card */}
          <div className="lg:col-span-3">
            <div className="relative rounded-[8px] bg-white/[0.04] border border-white/12 p-6 backdrop-blur-md overflow-hidden group hover:border-emerald-500/40 transition-all duration-300 shadow-xl">
              {/* Subtle accent glow */}
              <div className="absolute -top-10 -right-10 w-28 h-28 bg-emerald-500/15 rounded-full blur-xl pointer-events-none group-hover:bg-emerald-500/25 transition-all" />

              <div className="space-y-3 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--clay)]" />
                  <span className="text-[10px] uppercase tracking-[0.16em] font-sans font-semibold text-emerald-300">
                    Direct Institutional Desk
                  </span>
                </div>

                <h5 className="text-base font-serif font-semibold text-white tracking-tight leading-snug">
                  Healthcare Practitioner or Distributor?
                </h5>

                <p className="text-xs font-sans text-white/70 leading-relaxed">
                  Request batch CoA dossiers, clinic sample allotments, or trade partnership terms directly.
                </p>

                <div className="pt-2">
                  <Link
                    href="/enquire"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-[4px] bg-[var(--bone)] text-[var(--forest)] font-sans font-semibold text-xs tracking-wider uppercase hover:bg-white hover:shadow-lg transition-all"
                  >
                    <span>Submit Product Enquiry</span>
                    <ArrowUpRight size={14} />
                  </Link>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-white/50 pt-1">
                  <Clock size={12} className="text-emerald-400" />
                  <span>Desk responds within two working days</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Regulatory Disclaimer */}
        <div className="pt-8 border-t border-white/10 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 rounded bg-white/[0.05] border border-white/10 text-emerald-300">
              Statutory Compliance
            </span>
          </div>
          <p className="text-[11px] sm:text-[12px] font-sans text-white/55 leading-relaxed max-w-[95ch]">
            {disclaimer}
          </p>
        </div>

        {/* 4. Bottom Utility & Copyright Bar */}
        <div className="py-8 mt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-sans text-white/60">
          <span>{copyright}</span>

          <div className="flex flex-wrap items-center gap-6 text-white/70">
            <Link href="/contact" className="hover:text-white transition-colors">
              Practitioner Terms
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/login" className="hover:text-white transition-colors">
              Staff Portal
            </Link>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 text-white/70 hover:text-emerald-300 transition-colors ml-2 cursor-pointer"
              aria-label="Scroll back to top"
            >
              <span>Back to top</span>
              <ArrowUp size={13} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

