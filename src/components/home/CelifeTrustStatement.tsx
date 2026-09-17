import React from "react";

export function CelifeTrustStatement() {
  const trustItems = [
    "Non-GMO Excipient Standards",
    "Batch-Verified Consistency",
    "Standardised Herbal Extracts",
    "Practitioner-Direct Supply",
  ];

  return (
    <section className="w-full border-y border-[var(--line)] bg-[var(--paper)] py-4 sm:py-5">
      <div className="max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 items-center">
          {trustItems.map((item, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-center sm:justify-start gap-2.5 sm:gap-3 text-xs xl:text-xs font-sans uppercase tracking-[0.14em] font-semibold text-[var(--forest)] ${
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
