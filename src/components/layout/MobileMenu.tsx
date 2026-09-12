"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUiStore } from "@/store/ui.store";
import { navItems } from "@/data/navigation";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ChevronDown } from "lucide-react";

export function MobileMenu() {
  const { isMenuOpen, closeMenu } = useUiStore();
  const pathname = usePathname();
  const preferReduced = useReducedMotion();
  const menuRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [isServicesExpanded, setIsServicesExpanded] = useState(
    pathname.startsWith("/services")
  );

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    if (pathname.startsWith("/services")) {
      setIsServicesExpanded(true);
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

      // Focus first link on opening
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

  // Circular clip-path expanding from the trigger button position
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
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
    },
    exit: {
      clipPath: preferReduced
        ? "inset(0% 0% 0% 0%)"
        : "circle(0px at calc(100% - 44px) 44px)",
      opacity: preferReduced ? 0 : 1,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const linkVariants = {
    initial: { opacity: 0, y: preferReduced ? 0 : 25 },
    animate: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: preferReduced ? 0 : 0.15 + i * 0.05,
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    }),
    exit: (i: number) => ({
      opacity: 0,
      y: preferReduced ? 0 : 15,
      transition: {
        delay: preferReduced ? 0 : (navItems.length - 1 - i) * 0.03,
        duration: 0.2,
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
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[44] bg-black/70 backdrop-blur-sm"
            onClick={closeMenu}
            aria-hidden="true"
          />

          {/* Menu panel with Circular Clip-Path & Focus Trap */}
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
            className="fixed inset-0 z-[45] bg-[#050505] flex flex-col justify-between px-6 pb-6 pt-24 sm:px-8 sm:pb-8 sm:pt-28 md:p-16 border-l border-white/5 overflow-y-auto"
          >
            {/* Header label */}
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-primary font-medium block">
                THE DCO // ADVISORY
              </span>
            </div>

            {/* Nav links */}
            <nav aria-label="Mobile navigation links" className="my-auto py-6">
              <ul className="flex flex-col space-y-4">
                {navItems.map((item, idx) => {
                  const active =
                    isActive(item.href) ||
                    Boolean(item.items?.some((sub) => isActive(sub.href)));
                  const isServices = Boolean(item.items && item.items.length > 0);

                  return (
                    <motion.li
                      key={item.label}
                      custom={idx}
                      variants={linkVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="border-b border-white/5 pb-3 last:border-b-0"
                    >
                      <div className="flex items-center justify-between">
                        <Link
                          href={item.href}
                          onClick={() => {
                            if (!isServices) closeMenu();
                          }}
                          className={cn(
                            "inline-block text-2xl sm:text-3xl md:text-4xl font-serif transition-all duration-300 leading-tight select-none",
                            active
                              ? "text-primary font-medium"
                              : "text-white/85 hover:text-primary"
                          )}
                        >
                          {item.label}
                          {active && !isServices && (
                            <span className="inline-block ml-3 w-1.5 h-1.5 rounded-full bg-primary align-middle translate-y-[-2px]" />
                          )}
                        </Link>

                        {isServices && (
                          <button
                            type="button"
                            onClick={() => setIsServicesExpanded((prev) => !prev)}
                            aria-expanded={isServicesExpanded}
                            aria-label={isServicesExpanded ? "Collapse Services menu" : "Expand Services menu"}
                            className="p-2 text-primary/80 hover:text-primary cursor-pointer flex items-center justify-center"
                          >
                            <ChevronDown
                              size={18}
                              className={cn(
                                "transition-transform duration-300",
                                isServicesExpanded ? "rotate-180 text-primary" : "text-white/60"
                              )}
                            />
                          </button>
                        )}
                      </div>

                      {/* Expandable Services Sub-Menu — Only Hospitality Audit Services */}
                      {isServices && item.items && (
                        <AnimatePresence initial={false}>
                          {isServicesExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                              className="overflow-hidden"
                            >
                              <div className="pl-4 border-l border-primary/40 mt-3 mb-1 space-y-1">
                                {item.items.map((sub) => {
                                  const subActive = isSubActive(sub.href);
                                  return (
                                    <Link
                                      key={sub.label}
                                      href={sub.href}
                                      onClick={closeMenu}
                                      className={cn(
                                        "block py-2.5 transition-colors duration-200",
                                        subActive
                                          ? "text-primary"
                                          : "text-white hover:text-primary"
                                      )}
                                    >
                                      <span
                                        className={cn(
                                          "block text-base font-sans font-medium tracking-wide leading-snug",
                                          subActive
                                            ? "text-primary"
                                            : "text-white/95"
                                        )}
                                      >
                                        {sub.label}
                                      </span>
                                      {sub.tagline && (
                                        <span className="block text-xs font-sans text-white/70 mt-1 font-normal leading-relaxed">
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
            </nav>

            {/* Footer coordinates */}
            <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between text-xs text-white/50 uppercase tracking-[0.2em] space-y-2 sm:space-y-0 font-mono">
              <span>Based in Maharashtra, India</span>
              <a
                href="mailto:hello@thedco.in"
                className="text-primary hover:underline"
              >
                hello@thedco.in
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
