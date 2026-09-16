"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CelifeLogo } from "@/components/ui/CelifeLogo";
import { Button } from "@/components/ui/Button";
import { navItems } from "@/data/navigation";
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route navigation (render-phase sync pattern)
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsMobileMenuOpen(false);
    setIsProductsDropdownOpen(false);
  }

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-200 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
          isScrolled
            ? "bg-[var(--bone)] border-b border-[var(--line)] shadow-[var(--shadow-header)] py-3.5"
            : "bg-transparent border-b border-transparent py-5 md:py-6"
        )}
      >
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            href="/"
            aria-label="Celife Health Solutions Home"
            className="cursor-pointer select-none shrink-0"
          >
            <CelifeLogo variant="dark" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            className="hidden md:flex items-center gap-8 lg:gap-10"
            aria-label="Main navigation"
          >
            {navItems.map((item) => {
              const active = isActive(item.href);
              const hasSubmenu = Boolean(item.items && item.items.length > 0);

              if (hasSubmenu) {
                return (
                  <div
                    key={item.label}
                    className="relative py-2"
                    onMouseEnter={() => setIsProductsDropdownOpen(true)}
                    onMouseLeave={() => setIsProductsDropdownOpen(false)}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.14em] font-sans font-medium transition-colors duration-180",
                        active
                          ? "text-[var(--forest)] font-semibold"
                          : "text-[var(--ink)]/80 hover:text-[var(--forest)]"
                      )}
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        size={12}
                        className={cn(
                          "transition-transform duration-180",
                          isProductsDropdownOpen && "rotate-180 text-[var(--forest)]"
                        )}
                      />
                    </Link>

                    {/* Products Dropdown Menu */}
                    {isProductsDropdownOpen && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-72 z-50 animate-[fade-in_0.15s_ease-out]">
                        <div className="bg-[var(--paper)] border border-[var(--line)] rounded-[6px] shadow-[0_4px_20px_rgba(15,26,22,0.06)] p-2">
                          <div className="px-3 py-2 border-b border-[var(--line)] mb-1">
                            <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-[var(--sage)]">
                              Therapeutic Portfolios
                            </span>
                          </div>
                          {item.items?.map((sub) => (
                            <Link
                              key={sub.label}
                              href={sub.href}
                              className="block px-3 py-2.5 rounded-[4px] hover:bg-[var(--bone)] transition-colors group"
                            >
                              <div className="text-xs font-semibold text-[var(--ink)] group-hover:text-[var(--forest)] flex items-center justify-between">
                                <span>{sub.label}</span>
                                <ArrowRight
                                  size={12}
                                  className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[var(--forest)]"
                                />
                              </div>
                              {sub.tagline && (
                                <p className="text-[11px] text-[var(--sage)] line-clamp-1 mt-0.5">
                                  {sub.tagline}
                                </p>
                              )}
                            </Link>
                          ))}
                          <div className="mt-1 pt-2 border-t border-[var(--line)]">
                            <Link
                              href="/products"
                              className="block px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--forest)] hover:underline"
                            >
                              View All Formulations →
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "text-xs uppercase tracking-[0.14em] font-sans font-medium transition-colors duration-180",
                    active
                      ? "text-[var(--forest)] font-semibold border-b border-[var(--forest)] pb-0.5"
                      : "text-[var(--ink)]/80 hover:text-[var(--forest)]"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Product Enquiry CTA */}
          <div className="hidden md:flex items-center">
            <Button variant="primary" href="/enquire" showArrow>
              Product Enquiry
            </Button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex md:hidden items-center">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open Navigation Menu"
              className="p-2 text-[var(--forest)] hover:text-[var(--ink)] cursor-pointer"
            >
              <Menu size={22} strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          className="fixed inset-0 z-50 bg-[var(--bone)] flex flex-col justify-between p-6 md:hidden animate-[fade-in_0.2s_ease-out]"
        >
          {/* Top Bar inside Overlay */}
          <div className="flex items-center justify-between pb-6 border-b border-[var(--line)]">
            <CelifeLogo variant="dark" />
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close Navigation Menu"
              className="p-2 text-[var(--ink)] hover:text-[var(--forest)] cursor-pointer"
            >
              <X size={24} strokeWidth={1.75} />
            </button>
          </div>

          {/* Staggered Navigation Links */}
          <nav className="flex flex-col py-8 gap-6 flex-1 justify-center">
            {navItems.map((item, idx) => (
              <div key={item.label} className="flex flex-col">
                <Link
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-serif font-bold text-[var(--ink)] hover:text-[var(--forest)] flex items-center justify-between py-1 transition-colors"
                  style={{ animationDelay: `${idx * 40}ms` }}
                >
                  <span>{item.label}</span>
                  <ArrowRight size={18} className="text-[var(--sage)]" />
                </Link>
                {item.items && (
                  <div className="pl-4 mt-2 flex flex-col gap-2 border-l border-[var(--line)]">
                    {item.items.map((sub) => (
                      <Link
                        key={sub.label}
                        href={sub.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-xs font-sans text-[var(--sage)] hover:text-[var(--forest)] py-0.5"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile Overlay Bottom Action */}
          <div className="pt-6 border-t border-[var(--line)] space-y-4">
            <Button
              variant="primary"
              href="/enquire"
              showArrow
              className="w-full text-center py-4"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Submit a Product Enquiry
            </Button>
            <div className="text-center text-[11px] uppercase tracking-[0.14em] text-[var(--sage)]">
              Celife Health Solutions · Mumbai, India
            </div>
          </div>
        </div>
      )}
    </>
  );
}
