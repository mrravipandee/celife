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
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-3 gap-x-6 items-center">
          {trustItems.map((item, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-3 text-[11px] font-sans uppercase tracking-[0.14em] font-semibold text-[var(--forest)] ${
                idx !== 0 ? "lg:border-l lg:border-[var(--line)] lg:pl-6" : ""
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--forest)]/60 shrink-0" />
              <span className="truncate">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
