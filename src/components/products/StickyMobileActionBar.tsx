"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface StickyMobileActionBarProps {
  productName: string;
  productSlug: string;
  category: string;
}

export function StickyMobileActionBar({
  productName,
  productSlug,
  category,
}: StickyMobileActionBarProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;
      const scrollProgress = window.scrollY / scrollHeight;
      setIsVisible(scrollProgress > 0.4); // trigger after ~40-50% scroll for timely visibility
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <aside
      aria-label="Quick product enquiry action"
      className={cn(
        "fixed bottom-0 left-0 right-0 z-30 md:hidden bg-[var(--bone)] border-t border-[var(--line)] shadow-[0_-4px_16px_rgba(15,26,22,0.06)] px-5 py-3 transition-transform duration-200 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
        isVisible ? "translate-y-0" : "translate-y-full"
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col min-w-0">
          <span className="text-[10px] uppercase tracking-[0.14em] font-sans text-[var(--sage)] truncate">
            {category}
          </span>
          <span className="text-sm font-serif font-bold text-[var(--ink)] truncate">
            {productName}
          </span>
        </div>

        <Button
          variant="primary"
          href={`/enquire?product=${productSlug}`}
          showArrow
          className="py-2.5 px-4 text-[11px] shrink-0"
        >
          Enquire
        </Button>
      </div>
    </aside>
  );
}
