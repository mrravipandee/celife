"use client";

import React from "react";
import Link from "next/link";
import { CelifeLogo } from "@/components/ui/CelifeLogo";
import { Mail, Phone, MapPin, Send, ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#123C2D] text-white relative overflow-hidden border-t border-[#294F3D]">
      {/* Top Banner & Quick Enquiry Strip */}
      <div className="border-b border-white/10 bg-[#0E3125] py-10 md:py-14 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1 max-w-xl">
            <span className="text-[10px] uppercase tracking-[0.24em] text-[#C4D5C7] font-sans font-semibold">
              Healthcare Solutions & Advisory
            </span>
            <h3 className="text-xl md:text-2xl font-serif font-bold text-white tracking-tight">
              Have specific product or wholesale distribution questions?
            </h3>
            <p className="text-xs text-white/70 font-sans leading-relaxed">
              Our clinical inquiry desk is available to assist healthcare practitioners, pharmacies, and distributors.
            </p>
          </div>

          <Link
            href="/enquire"
            className="px-7 py-3.5 bg-white text-[#123C2D] hover:bg-[#F4F5EF] text-xs uppercase tracking-[0.2em] font-semibold rounded-xs transition-colors flex items-center gap-2.5 shrink-0 shadow-md"
          >
            <span>Submit Product Enquiry</span>
            <Send size={13} />
          </Link>
        </div>
      </div>

      {/* Main Footer Navigation Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-14 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 items-start">
          {/* Brand Col */}
          <div className="lg:col-span-5 space-y-5">
            <Link href="/" className="inline-block">
              <CelifeLogo variant="light" />
            </Link>

            <p className="text-xs sm:text-sm font-sans text-white/75 leading-relaxed max-w-md">
              Celife Health Solutions is a dedicated healthcare, nutraceutical, and herbal wellness brand creating evidence-guided botanical and nutritional formulations to support human vitality.
            </p>

            <div className="pt-2 flex flex-col space-y-2 text-xs font-sans text-white/70">
              <div className="flex items-center gap-2.5">
                <MapPin size={14} className="text-[#81998D] shrink-0" />
                <span>Mumbai, Maharashtra, India</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={14} className="text-[#81998D] shrink-0" />
                <a href="mailto:enquiry@celifehealth.com" className="hover:text-white transition-colors">
                  enquiry@celifehealth.com
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={14} className="text-[#81998D] shrink-0" />
                <a href="tel:+919820012345" className="hover:text-white transition-colors">
                  +91 98200 12345
                </a>
              </div>
            </div>
          </div>

          {/* Formulations / Categories Col */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] font-sans font-bold text-[#C4D5C7]">
              Product Formulations
            </h4>
            <ul className="space-y-2.5 text-xs font-sans">
              <li>
                <Link
                  href="/products/nervify-forte"
                  className="text-white/80 hover:text-white transition-colors flex items-center justify-between group"
                >
                  <span>Nervify Forte (Neuro-Vitality)</span>
                  <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  href="/products/orthocare-active"
                  className="text-white/80 hover:text-white transition-colors flex items-center justify-between group"
                >
                  <span>OrthoCare Active (Joint & Mobility)</span>
                  <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  href="/products/livcleanse-synergy"
                  className="text-white/80 hover:text-white transition-colors flex items-center justify-between group"
                >
                  <span>LivCleanse Synergy (Hepatic Health)</span>
                  <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  href="/products/immunoshield-daily"
                  className="text-white/80 hover:text-white transition-colors flex items-center justify-between group"
                >
                  <span>ImmunoShield Daily (Antioxidant)</span>
                  <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li className="pt-2">
                <Link
                  href="/products"
                  className="text-xs font-semibold text-[#C4D5C7] hover:underline"
                >
                  View Complete Product Catalogue &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Navigation Col */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] font-sans font-bold text-[#C4D5C7]">
              Company & Enquiries
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
                  About Celife
                </Link>
              </li>
              <li>
                <Link href="/enquire" className="hover:text-white transition-colors">
                  Product Enquiry Desk
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact & Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="mt-14 pt-8 border-t border-white/10 space-y-4">
          <p className="text-[11px] font-sans text-white/50 leading-relaxed max-w-4xl">
            Disclaimer: Information provided on this website is for professional and general educational purposes. Products are nutraceutical and dietary formulations not intended to diagnose, treat, cure, or prevent any medical condition. Always consult your qualified healthcare practitioner regarding health advice.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-white/50">
            <span>&copy; {new Date().getFullYear()} Celife Health Solutions. All rights reserved.</span>
            <div className="flex items-center gap-6">
              <Link href="/contact" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/contact" className="hover:text-white transition-colors">
                Terms of Use
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
