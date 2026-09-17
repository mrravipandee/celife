import React from "react";

export function CelifeTrustStatement() {
  const trustItems = [
    "Non-GMO Excipient Standards",
    "Batch-Verified Consistency",
    "Standardised Herbal Extracts",
    "Practitioner-Direct Supply",
  ];

  return (
    <section className="w-full border-y border-[var(--line)] bg-[var(--paper)] py-3 sm:py-5 overflow-hidden">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Mobile: Infinite Single-Line Slow Marquee (Right-to-Left) */}
        <div className="sm:hidden relative w-full overflow-hidden flex select-none py-1">
          {/* Subtle edge fade masks for elegant entrance and exit */}
          <div className="pointer-events-none absolute left-0 inset-y-0 w-6 bg-gradient-to-r from-[var(--paper)] to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 inset-y-0 w-6 bg-gradient-to-l from-[var(--paper)] to-transparent z-10" />

          <div className="flex whitespace-nowrap animate-[marquee_24s_linear_infinite] will-change-transform">
            {[...trustItems, ...trustItems, ...trustItems, ...trustItems].map((item, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-2.5 px-4 text-[11px] font-sans uppercase tracking-[0.14em] font-semibold text-[var(--forest)] shrink-0"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--clay)] shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tablet / Desktop: 4-Column Clean Grid */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 items-center">
          {trustItems.map((item, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-start gap-2.5 sm:gap-3 text-xs xl:text-xs font-sans uppercase tracking-[0.14em] font-semibold text-[var(--forest)] ${
                idx !== 0 ? "lg:border-l lg:border-[var(--line)] lg:pl-6 xl:pl-8" : ""
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--clay)] shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
