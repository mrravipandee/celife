import React from "react";
import { Button } from "@/components/ui/Button";

interface CelifeCTAProps {
  content?: {
    heading?: string;
    description?: string;
    primaryCtaLabel?: string;
    primaryCtaLink?: string;
  };
}

export function CelifeCTA({ content }: CelifeCTAProps) {
  const heading =
    content?.heading || "Requesting formulation data or distribution terms?";
  const description =
    content?.description ||
    "Our product desk responds to practitioner, pharmacy and distributor enquiries within two working days.";

  return (
    <section className="py-20 md:py-28 bg-[var(--bone)]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="border border-[var(--line)] rounded-[6px] bg-[var(--paper)] p-8 sm:p-12 lg:p-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--clay)]" />
              <span className="text-[11px] uppercase tracking-[0.16em] font-sans font-semibold text-[var(--sage)]">
                Direct Desk Communication
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[var(--ink)] tracking-tight leading-tight">
              {heading}
            </h2>

            <p className="text-sm sm:text-base font-sans text-[var(--ink)]/80 leading-relaxed max-w-[55ch]">
              {description}
            </p>
          </div>

          <div className="shrink-0">
            <Button variant="primary" href="/enquire" showArrow>
              Submit a Product Enquiry
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
