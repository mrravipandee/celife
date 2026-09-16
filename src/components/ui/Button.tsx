"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary" | "secondary-dark";
  showArrow?: boolean;
  href?: string;
}

export function Button({
  variant = "primary",
  showArrow = false,
  href,
  className,
  children,
  ...props
}: ButtonProps) {
  const baseClasses =
    "group inline-flex items-center justify-center gap-2.5 text-xs font-semibold uppercase tracking-[0.14em] rounded-[6px] transition-all duration-180 ease-[cubic-bezier(0.2,0.8,0.2,1)] cursor-pointer select-none disabled:opacity-50 disabled:pointer-events-none";

  const variantClasses = {
    primary:
      "bg-[var(--forest)] text-white hover:bg-[var(--forest-700)] py-3.5 px-6 shadow-xs active:translate-y-[1px]",
    secondary:
      "border border-[var(--forest)] text-[var(--forest)] bg-transparent hover:bg-[var(--forest)]/5 py-3.5 px-6 active:translate-y-[1px]",
    "secondary-dark":
      "border border-[var(--line)]/40 text-white bg-transparent hover:bg-white/10 py-3.5 px-6 active:translate-y-[1px]",
    tertiary:
      "p-0 text-[var(--forest)] hover:text-[var(--forest-700)] bg-transparent relative pb-0.5 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-current after:transition-transform after:duration-180 after:ease-[cubic-bezier(0.2,0.8,0.2,1)]",
  };

  const content = (
    <>
      <span>{children}</span>
      {showArrow && (
        <ArrowRight
          size={14}
          strokeWidth={1.75}
          className="shrink-0 transition-transform duration-180 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:translate-x-[3px]"
        />
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cn(baseClasses, variantClasses[variant], className)}>
        {content}
      </Link>
    );
  }

  return (
    <button className={cn(baseClasses, variantClasses[variant], className)} {...props}>
      {content}
    </button>
  );
}
