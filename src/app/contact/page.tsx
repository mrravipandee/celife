import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { constructMetadata } from "@/config/seo";
import { Navbar } from "@/components/layout/Navbar";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/animations/SmoothScroll";
import { Mail, Phone, MapPin, Send, ArrowRight } from "lucide-react";
import { ProductEnquiryForm } from "@/components/enquiry/ProductEnquiryForm";

export const metadata: Metadata = constructMetadata({
  title: "Contact & Enquiries | Celife Health Solutions",
  description:
    "Get in touch with Celife Health Solutions for product enquiries, distributor partnerships, clinical documentation, and general support.",
});

export default function ContactPage() {
  return (
    <SmoothScroll>
      <Navbar />
      <MobileMenu />

      <main className="bg-[#F8FAF6] text-[#171B18] min-h-screen pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-16">
          {/* Header */}
          <div className="max-w-3xl space-y-4 mb-14">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ED1C24]" />
              <span className="text-xs uppercase tracking-[0.24em] font-sans font-semibold text-[#123C2D]">
                Get In Touch
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#171B18] tracking-tight leading-[1.1]">
              Connect With Celife Health Solutions
            </h1>

            <p className="text-sm sm:text-base font-sans text-[#52635A] leading-relaxed">
              We welcome inquiries from healthcare practitioners, pharmacies, distributors, and individuals. Use the product enquiry desk below or reach out via our direct coordinates.
            </p>

            <div className="pt-2">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] font-semibold text-[#123C2D] hover:underline"
              >
                <span>Browse Product Catalogue First</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Form Column */}
            <div className="lg:col-span-8">
              <ProductEnquiryForm />
            </div>

            {/* Coordinates Column */}
            <div className="lg:col-span-4 space-y-8">
              {/* Direct Info Card */}
              <div className="bg-white border border-[#123C2D]/10 rounded-xs p-6 md:p-8 space-y-6 shadow-sm">
                <h3 className="text-xs uppercase tracking-[0.2em] font-sans font-bold text-[#123C2D]">
                  Direct Coordinates
                </h3>

                <div className="space-y-4 text-xs font-sans text-[#52635A]">
                  <div className="flex items-start gap-3.5">
                    <Mail size={18} className="text-[#123C2D] shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-[10px] uppercase tracking-wider text-[#52635A]">General & Product Enquiries</span>
                      <a href="mailto:enquiry@celifehealth.com" className="text-[#171B18] font-medium hover:text-[#123C2D] text-sm">
                        enquiry@celifehealth.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <Phone size={18} className="text-[#123C2D] shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-[10px] uppercase tracking-wider text-[#52635A]">Advisory Desk</span>
                      <a href="tel:+919820012345" className="text-[#171B18] font-medium hover:text-[#123C2D] text-sm">
                        +91 98200 12345
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <MapPin size={18} className="text-[#123C2D] shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-[10px] uppercase tracking-wider text-[#52635A]">Corporate Office</span>
                      <span className="text-[#171B18] font-medium block text-sm">
                        Celife Health Solutions, Mumbai, Maharashtra, India
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Institutional Distribution Note */}
              <div className="bg-[#123C2D] text-white p-6 md:p-8 rounded-xs space-y-3 shadow-md">
                <span className="text-[10px] uppercase tracking-[0.24em] font-semibold text-[#C4D5C7] block">
                  Institutional Partnerships
                </span>
                <h4 className="text-lg font-serif font-bold text-white">
                  Pharmacies & Healthcare Facilities
                </h4>
                <p className="text-xs text-white/75 leading-relaxed">
                  For bulk procurement, hospital distribution tenders, and custom formulation inquiries, our team provides complete technical files and batch certifications.
                </p>
                <div className="pt-2">
                  <a
                    href="mailto:enquiry@celifehealth.com?subject=Institutional%20Distribution%20Enquiry"
                    className="inline-flex items-center gap-1.5 text-xs text-white underline underline-offset-4 font-medium"
                  >
                    <span>Request Institutional Dossier</span>
                    <Send size={11} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </SmoothScroll>
  );
}
