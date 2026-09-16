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
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-3.5 gap-x-4 sm:gap-x-6 lg:gap-x-8 items-center">
          {trustItems.map((item, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-2.5 sm:gap-3 text-[10.5px] sm:text-[11px] xl:text-xs font-sans uppercase tracking-[0.14em] font-semibold text-[var(--forest)] ${
                idx !== 0 ? "lg:border-l lg:border-[var(--line)] lg:pl-6 xl:pl-8" : ""
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--forest)]/70 shrink-0" />
              <span className="whitespace-nowrap">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
