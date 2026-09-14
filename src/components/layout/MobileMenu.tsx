"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUiStore } from "@/store/ui.store";
import { navItems } from "@/data/navigation";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ChevronDown, Send, X } from "lucide-react";
import { CelifeLogo } from "@/components/ui/CelifeLogo";

export function MobileMenu() {
  const { isMenuOpen, closeMenu } = useUiStore();
  const pathname = usePathname();
  const preferReduced = useReducedMotion();
  const menuRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [isProductsExpanded, setIsProductsExpanded] = useState(
    pathname.startsWith("/products")
  );

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    if (pathname.startsWith("/products")) {
      setIsProductsExpanded(true);
    }
  }

  useEffect(() => {
    if (isMenuOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          closeMenu();
          const toggleBtn = document.getElementById("mobile-menu-toggle");
          toggleBtn?.focus();
        }

        // Focus trap inside the mobile dialog
        if (e.key === "Tab" && menuRef.current) {
          const focusable = menuRef.current.querySelectorAll<HTMLElement>(
            'a[href], button, input, [tabindex]:not([tabindex="-1"])'
          );
          if (focusable.length === 0) return;

          const first = focusable[0];
          const last = focusable[focusable.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === first) {
              e.preventDefault();
              last.focus();
            }
          } else {
            if (document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";

      const timer = setTimeout(() => {
        const firstLink = menuRef.current?.querySelector<HTMLElement>("a[href]");
        firstLink?.focus();
      }, 200);

      return () => {
        clearTimeout(timer);
        window.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "";
      };
    } else if (previousFocusRef.current) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, [isMenuOpen, closeMenu]);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  const isSubActive = (href: string) => pathname === href;

  const menuVariants = {
    initial: {
      clipPath: preferReduced
        ? "inset(0% 0% 0% 0%)"
        : "circle(0px at calc(100% - 44px) 44px)",
      opacity: preferReduced ? 0 : 1,
    },
    animate: {
      clipPath: preferReduced
        ? "inset(0% 0% 0% 0%)"
        : "circle(150% at calc(100% - 44px) 44px)",
      opacity: 1,
      transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
    },
    exit: {
      clipPath: preferReduced
        ? "inset(0% 0% 0% 0%)"
        : "circle(0px at calc(100% - 44px) 44px)",
      opacity: preferReduced ? 0 : 1,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const linkVariants = {
    initial: { opacity: 0, y: preferReduced ? 0 : 20 },
    animate: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: preferReduced ? 0 : 0.1 + i * 0.05,
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    }),
    exit: (i: number) => ({
      opacity: 0,
      y: preferReduced ? 0 : 10,
      transition: {
        delay: preferReduced ? 0 : (navItems.length - 1 - i) * 0.02,
        duration: 0.15,
        ease: "easeIn" as const,
      },
    }),
  };

  return (
    <AnimatePresence>
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[44] bg-[#123C2D]/40 backdrop-blur-xs"
            onClick={closeMenu}
            aria-hidden="true"
          />

          {/* Menu panel */}
          <motion.div
            ref={menuRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            variants={menuVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 z-[45] bg-[#F8FAF6] text-[#171B18] flex flex-col justify-between px-6 pb-6 pt-24 sm:px-8 sm:pb-8 sm:pt-28 border-l border-[#123C2D]/10 overflow-y-auto"
          >
            {/* Header branding */}
            <div className="flex items-center justify-between pb-6 border-b border-[#123C2D]/10">
              <CelifeLogo variant="dark" />
              <button
                type="button"
                onClick={closeMenu}
                aria-label="Close mobile menu"
                className="p-2 text-[#123C2D] hover:bg-[#123C2D]/5 rounded-xs cursor-pointer"
              >
                <X size={22} />
              </button>
            </div>

            {/* Navigation links */}
            <nav aria-label="Mobile navigation links" className="my-auto py-6">
              <ul className="flex flex-col space-y-4">
                {navItems.map((item, idx) => {
                  const active =
                    isActive(item.href) ||
                    Boolean(item.items?.some((sub) => isActive(sub.href)));
                  const isProducts = Boolean(item.items && item.items.length > 0);

                  return (
                    <motion.li
                      key={item.label}
                      custom={idx}
                      variants={linkVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="border-b border-[#123C2D]/8 pb-3 last:border-b-0"
                    >
                      <div className="flex items-center justify-between">
                        <Link
                          href={item.href}
                          onClick={() => {
                            if (!isProducts) closeMenu();
                          }}
                          className={cn(
                            "inline-block text-2xl sm:text-3xl font-serif font-semibold transition-colors duration-200 leading-tight",
                            active ? "text-[#123C2D]" : "text-[#171B18] hover:text-[#123C2D]"
                          )}
                        >
                          {item.label}
                          {active && !isProducts && (
                            <span className="inline-block ml-3 w-2 h-2 rounded-full bg-[#ED1C24] align-middle translate-y-[-2px]" />
                          )}
                        </Link>

                        {isProducts && (
                          <button
                            type="button"
                            onClick={() => setIsProductsExpanded((prev) => !prev)}
                            aria-expanded={isProductsExpanded}
                            aria-label={isProductsExpanded ? "Collapse Products menu" : "Expand Products menu"}
                            className="p-2 text-[#123C2D] cursor-pointer flex items-center justify-center"
                          >
                            <ChevronDown
                              size={20}
                              className={cn(
                                "transition-transform duration-300",
                                isProductsExpanded ? "rotate-180 text-[#123C2D]" : "text-[#52635A]"
                              )}
                            />
                          </button>
                        )}
                      </div>

                      {/* Expandable Category Sub-Menu */}
                      {isProducts && item.items && (
                        <AnimatePresence initial={false}>
                          {isProductsExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                              className="overflow-hidden"
                            >
                              <div className="pl-4 border-l-2 border-[#123C2D]/30 mt-3 mb-1 space-y-1">
                                {item.items.map((sub) => {
                                  const subActive = isSubActive(sub.href);
                                  return (
                                    <Link
                                      key={sub.label}
                                      href={sub.href}
                                      onClick={closeMenu}
                                      className={cn(
                                        "block py-2 transition-colors duration-150",
                                        subActive
                                          ? "text-[#123C2D] font-medium"
                                          : "text-[#52635A] hover:text-[#123C2D]"
                                      )}
                                    >
                                      <span className="block text-sm font-sans font-semibold">
                                        {sub.label}
                                      </span>
                                      {sub.tagline && (
                                        <span className="block text-xs font-sans text-[#52635A]/80 mt-0.5">
                                          {sub.tagline}
                                        </span>
                                      )}
                                    </Link>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      )}
                    </motion.li>
                  );
                })}
              </ul>

              {/* Prominent Mobile "Enquire Now" CTA */}
              <div className="pt-6">
                <Link
                  href="/enquire"
                  onClick={closeMenu}
                  className="w-full py-3.5 bg-[#123C2D] text-white text-xs uppercase tracking-[0.2em] font-semibold rounded-xs shadow-md flex items-center justify-center gap-2"
                >
                  <span>Enquire Now</span>
                  <Send size={13} />
                </Link>
              </div>
            </nav>

            {/* Footer coordinates */}
            <div className="border-t border-[#123C2D]/10 pt-5 flex flex-col sm:flex-row justify-between text-xs text-[#52635A] space-y-1 sm:space-y-0 font-sans">
              <span>Mumbai, Maharashtra, India</span>
              <a href="mailto:enquiry@celifehealth.com" className="text-[#123C2D] font-medium hover:underline">
                enquiry@celifehealth.com
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
