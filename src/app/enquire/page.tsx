import React from "react";
import type { Metadata } from "next";
import { constructMetadata } from "@/config/seo";
import { Navbar } from "@/components/layout/Navbar";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/animations/SmoothScroll";
import { ProductEnquiryForm } from "@/components/enquiry/ProductEnquiryForm";
import { Mail, Phone, MapPin, ShieldCheck } from "lucide-react";

export const metadata: Metadata = constructMetadata({
  title: "Product Enquiry | Celife Health Solutions",
  description:
    "Submit an official product enquiry for Celife Health Solutions formulations, including Nervify Forte. Connect with our healthcare team.",
});

interface EnquirePageProps {
  searchParams: Promise<{ product?: string }>;
}

export default async function EnquirePage({ searchParams }: EnquirePageProps) {
  const params = await searchParams;
  const initialProductSlug = params?.product;

  return (
    <SmoothScroll>
      <Navbar />
      <MobileMenu />

      <main className="bg-[#F8FAF6] text-[#171B18] min-h-screen pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 md:py-14">
          {/* Header */}
          <div className="max-w-3xl space-y-3 mb-12">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ED1C24]" />
              <span className="text-xs uppercase tracking-[0.24em] font-sans font-semibold text-[#123C2D]">
                Product Enquiry Desk
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#171B18] tracking-tight leading-tight">
              Enquire About This Product
            </h1>

            <p className="text-sm sm:text-base font-sans text-[#52635A] leading-relaxed">
              Connect with our product specialists and advisory personnel. Submit your inquiry below for product availability, clinical formulation questions, or institutional requirements.
            </p>
          </div>

          {/* Form & Support Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left/Main Column: The Enquiry Form */}
            <div className="lg:col-span-8">
              <ProductEnquiryForm initialProductSlug={initialProductSlug} />
            </div>

            {/* Right Column: Trust Badges & Contact Info */}
            <div className="lg:col-span-4 space-y-8">
              {/* Process Card */}
              <div className="bg-white border border-[#123C2D]/10 rounded-xs p-6 space-y-5">
                <h3 className="text-xs uppercase tracking-[0.18em] font-sans font-bold text-[#123C2D]">
                  How We Process Your Enquiry
                </h3>

                <ul className="space-y-4 text-xs font-sans text-[#52635A]">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#123C2D]/10 text-[#123C2D] flex items-center justify-center font-bold shrink-0 mt-0.5">
                      1
                    </div>
                    <div>
                      <strong className="text-[#171B18] block font-semibold">Immediate Logging</strong>
                      Your inquiry is recorded and assigned to the relevant product desk.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#123C2D]/10 text-[#123C2D] flex items-center justify-center font-bold shrink-0 mt-0.5">
                      2
                    </div>
                    <div>
                      <strong className="text-[#171B18] block font-semibold">Technical Verification</strong>
                      Our team verifies batch documentation, packaging specs, or distributor details.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#123C2D]/10 text-[#123C2D] flex items-center justify-center font-bold shrink-0 mt-0.5">
                      3
                    </div>
                    <div>
                      <strong className="text-[#171B18] block font-semibold">Prompt Direct Response</strong>
                      You will receive tailored follow-up by email or phone within 24 to 48 business hours.
                    </div>
                  </li>
                </ul>
              </div>

              {/* Direct Touchpoints */}
              <div className="bg-white border border-[#123C2D]/10 rounded-xs p-6 space-y-4 text-xs font-sans">
                <h3 className="text-xs uppercase tracking-[0.18em] font-sans font-bold text-[#123C2D]">
                  Direct Contact Coordinates
                </h3>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3 text-[#52635A]">
                    <Mail size={16} className="text-[#123C2D] shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-[10px] uppercase tracking-wider text-[#52635A]/80">Email</span>
                      <a href="mailto:enquiry@celifehealth.com" className="text-[#171B18] font-medium hover:text-[#123C2D]">
                        enquiry@celifehealth.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-[#52635A]">
                    <Phone size={16} className="text-[#123C2D] shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-[10px] uppercase tracking-wider text-[#52635A]/80">Phone</span>
                      <a href="tel:+919820012345" className="text-[#171B18] font-medium hover:text-[#123C2D]">
                        +91 98200 12345
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-[#52635A]">
                    <MapPin size={16} className="text-[#123C2D] shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-[10px] uppercase tracking-wider text-[#52635A]/80">Headquarters</span>
                      <span className="text-[#171B18] font-medium block">
                        Celife Health Solutions, Mumbai, Maharashtra, India
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust badges */}
              <div className="p-4 bg-[#F4F5EF] border border-[#123C2D]/10 rounded-xs space-y-2 text-xs font-sans text-[#52635A]">
                <div className="flex items-center gap-2 font-semibold text-[#123C2D]">
                  <ShieldCheck size={16} className="text-[#123C2D]" />
                  <span>Confidential & Direct</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Celife Health Solutions does not distribute or share client or healthcare provider contact details.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </SmoothScroll>
  );
}
