"use client";

import React from "react";
import Link from "next/link";
import { CelifeLogo } from "@/components/ui/CelifeLogo";
import { Mail, Phone, MapPin, ArrowUp, ArrowRight } from "lucide-react";
import { PublicSettings } from "@/lib/services/settings";

interface FooterProps {
  settings?: Partial<PublicSettings>;
}

export function Footer({ settings }: FooterProps) {
  const brandName = settings?.brand?.companyName || "Celife Health Solutions";
  const footerDesc =
    settings?.footer?.description ||
    "Dedicated healthcare and botanical formulations engineered to verified clinical specifications for neurological vitality, joint mobility, and systemic wellness.";
  const address = settings?.contact?.address || "Mumbai, Maharashtra, India";
  const email = settings?.contact?.email || "enquiry@celifehealth.com";
  const phone = settings?.contact?.phone || "+91 98200 12345";
  const copyright =
    settings?.footer?.copyright ||
    `© ${new Date().getFullYear()} ${brandName} Pvt. Ltd. All rights reserved.`;
  const disclaimer =
    settings?.footer?.disclaimer ||
    "Regulatory Notice: Information provided on this website is for professional evaluation and general educational purposes only. Formulations are dietary and botanical nutraceuticals, manufactured to standardized specifications, and are not intended to diagnose, treat, cure, or prevent any disease.";

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-[#0A1C14] text-white border-t border-[#1C3E2D] relative select-none">
      <div className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Main Footer Columns */}
        <div className="py-12 sm:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12">
          
          {/* Column 1: Brand & Contact Info (5 cols) */}
          <div className="sm:col-span-2 lg:col-span-5 space-y-5">
            <Link href="/" className="inline-block">
              <CelifeLogo variant="light" />
            </Link>

            <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-light max-w-md">
              {footerDesc}
            </p>

            {/* Direct, clean contact details with simple native icons */}
            <div className="space-y-2.5 pt-2 text-xs sm:text-sm text-white/80">
              <div className="flex items-center gap-2.5">
                <MapPin size={15} className="text-[#8FB39E] shrink-0" />
                <span>{address}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail size={15} className="text-[#8FB39E] shrink-0" />
                <a
                  href={`mailto:${email}`}
                  className="hover:text-white transition-colors"
                >
                  {email}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone size={15} className="text-[#8FB39E] shrink-0" />
                <a
                  href={`tel:${phone.replace(/\s+/g, "")}`}
                  className="hover:text-white transition-colors"
                >
                  {phone}
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Formulations (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs uppercase tracking-[0.16em] font-semibold text-[#8FB39E]">
              Formulations
            </h3>

            <ul className="space-y-2.5 text-xs sm:text-sm text-white/75 font-light">
              <li>
                <Link href="/products/nervify-forte" className="hover:text-white transition-colors block py-0.5">
                  Nervify Forte
                </Link>
              </li>
              <li>
                <Link href="/products/orthocare-active" className="hover:text-white transition-colors block py-0.5">
                  OrthoCare Active
                </Link>
              </li>
              <li>
                <Link href="/products/livcleanse-synergy" className="hover:text-white transition-colors block py-0.5">
                  LivCleanse Synergy
                </Link>
              </li>
              <li>
                <Link href="/products/immunoshield-daily" className="hover:text-white transition-colors block py-0.5">
                  ImmunoShield Daily
                </Link>
              </li>
              <li>
                <Link href="/products/vitafiv-syrup" className="hover:text-white transition-colors block py-0.5">
                  Vitafiv Syrup
                </Link>
              </li>
              <li className="pt-1.5">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-1.5 text-xs text-[#8FB39E] hover:text-white font-medium transition-colors"
                >
                  <span>View Full Catalogue</span>
                  <ArrowRight size={12} />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs uppercase tracking-[0.16em] font-semibold text-[#8FB39E]">
              Company
            </h3>

            <ul className="space-y-2.5 text-xs sm:text-sm text-white/75 font-light">
              <li>
                <Link href="/about" className="hover:text-white transition-colors block py-0.5">
                  About Celife
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors block py-0.5">
                  Quality Standards
                </Link>
              </li>
              <li>
                <Link href="/enquire" className="hover:text-white transition-colors block py-0.5">
                  Product Enquiry
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors block py-0.5">
                  Institutional Supply
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors block py-0.5">
                  Staff Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Compliance & Quality (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs uppercase tracking-[0.16em] font-semibold text-[#8FB39E]">
              Standards
            </h3>

            <div className="space-y-2 text-xs text-white/70 font-light leading-relaxed">
              <p>
                Manufactured in certified GMP and ISO 9001:2015 cleanroom facilities.
              </p>
              <p className="text-[11px] text-white/50">
                Batch-level Certificate of Analysis (CoA) available upon practitioner request.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-1.5">
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-xs bg-white/5 border border-white/10 text-[#8FB39E]">
                GMP Certified
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-xs bg-white/5 border border-white/10 text-[#8FB39E]">
                ISO 9001
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-xs bg-white/5 border border-white/10 text-[#8FB39E]">
                FSSAI Aligned
              </span>
            </div>
          </div>

        </div>

        {/* Regulatory Notice Banner */}
        <div className="py-5 border-t border-white/10">
          <p className="text-[11px] text-white/50 leading-relaxed max-w-4xl font-light">
            {disclaimer}
          </p>
        </div>

        {/* Bottom Utility Bar */}
        <div className="py-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60 font-light">
          <span className="text-center sm:text-left">{copyright}</span>

          <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-6">
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/refund" className="hover:text-white transition-colors">
              Refund Policy
            </Link>

            {/* Simple, real Back to top button */}
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 hover:text-white transition-colors cursor-pointer text-xs font-normal"
              aria-label="Scroll back to top"
            >
              <span>Back to top</span>
              <ArrowUp size={13} className="text-[#8FB39E]" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}