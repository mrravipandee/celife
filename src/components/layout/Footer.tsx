"use client";

import React from "react";
import Link from "next/link";
import { CelifeLogo } from "@/components/ui/CelifeLogo";
import { Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";
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
    `© ${new Date().getFullYear()} ${brandName}. All rights reserved.`;
  const disclaimer =
    settings?.footer?.disclaimer ||
    "Regulatory Notice: Information provided on this website is for professional evaluation and general educational purposes only. Formulations are dietary and botanical nutraceuticals, manufactured to standardized specifications, and are not intended to diagnose, treat, cure, or prevent any disease. Healthcare practitioners should evaluate suitability for their patients.";

  return (
    <footer className="bg-[var(--forest)] text-white relative overflow-hidden border-t border-[var(--forest-700)]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Brand Col */}
          <div className="lg:col-span-5 space-y-4">
            <Link href="/" className="inline-block">
              <CelifeLogo variant="light" />
            </Link>

            <p className="text-sm font-sans text-white/80 leading-relaxed max-w-[45ch]">
              {footerDesc}
            </p>

            <div className="pt-2 flex flex-col space-y-2 text-xs font-sans text-[var(--sage)]">
              <div className="flex items-center gap-2.5">
                <MapPin size={14} className="text-[var(--sage)] shrink-0" />
                <span className="text-white/90">{address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={14} className="text-[var(--sage)] shrink-0" />
                <a href={`mailto:${email}`} className="text-white/90 hover:text-white transition-colors">
                  {email}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={14} className="text-[var(--sage)] shrink-0" />
                <a href={`tel:${phone.replace(/\s+/g, "")}`} className="text-white/90 hover:text-white transition-colors">
                  {phone}
                </a>
              </div>
            </div>
          </div>

          {/* Formulations Col */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-[11px] uppercase tracking-[0.16em] font-sans font-semibold text-[var(--sage)]">
              Formulation Portfolios
            </h4>
            <ul className="space-y-2.5 text-xs font-sans">
              <li>
                <Link
                  href="/products/nervify-forte"
                  className="text-white/85 hover:text-white transition-colors flex items-center justify-between group"
                >
                  <span>Nervify Forte · Neuro-Vitality</span>
                  <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--sage)]" />
                </Link>
              </li>
              <li>
                <Link
                  href="/products/orthocare-active"
                  className="text-white/85 hover:text-white transition-colors flex items-center justify-between group"
                >
                  <span>OrthoCare Active · Joint & Mobility</span>
                  <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--sage)]" />
                </Link>
              </li>
              <li>
                <Link
                  href="/products/livcleanse-synergy"
                  className="text-white/85 hover:text-white transition-colors flex items-center justify-between group"
                >
                  <span>LivCleanse Synergy · Hepatic & Digestive</span>
                  <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--sage)]" />
                </Link>
              </li>
              <li>
                <Link
                  href="/products/immunoshield-daily"
                  className="text-white/85 hover:text-white transition-colors flex items-center justify-between group"
                >
                  <span>ImmunoShield Daily · Immunity Matrix</span>
                  <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--sage)]" />
                </Link>
              </li>
              <li className="pt-2">
                <Link
                  href="/products"
                  className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--sage)] hover:text-white transition-colors"
                >
                  View Complete Catalogue →
                </Link>
              </li>
            </ul>
          </div>

          {/* Institutional & Support Col */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-[11px] uppercase tracking-[0.16em] font-sans font-semibold text-[var(--sage)]">
              Institutional & Desk
            </h4>
            <ul className="space-y-2.5 text-xs font-sans text-white/85">
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
                  Distribution & Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="mt-14 pt-8 border-t border-[var(--forest-700)] space-y-4">
          <p className="text-[12px] font-sans text-[var(--sage)] leading-relaxed max-w-[85ch]">
            {disclaimer}
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-sans text-[var(--sage)] pt-2">
            <span>{copyright}</span>
            <div className="flex items-center gap-6">
              <Link href="/contact" className="hover:text-white transition-colors">
                Practitioner Terms
              </Link>
              <Link href="/contact" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/login" className="hover:text-white transition-colors">
                Staff Portal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
