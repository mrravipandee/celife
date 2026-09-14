"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useUiStore } from "@/store/ui.store";
import { navItems } from "@/data/navigation";
import { cn } from "@/lib/utils";
import { Menu, X, ChevronDown, Send } from "lucide-react";
import { useLenis } from "@/components/animations/SmoothScroll";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { CelifeLogo } from "@/components/ui/CelifeLogo";

export function Navbar() {
  const [isHidden, setIsHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const lastScrollY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLAnchorElement>(null);
  const { isMenuOpen, toggleMenu } = useUiStore();
  const pathname = usePathname();
  const preferReduced = useReducedMotion();

  // Close dropdown on route change
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsProductsOpen(false);
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsProductsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lenis scroll listener
  useLenis((lenis) => {
    const currentScroll = lenis.scroll;
    const delta = currentScroll - lastScrollY.current;

    setIsScrolled(currentScroll > 20);

    // 10px threshold to avoid jitter
    if (Math.abs(delta) > 10) {
      if (delta > 0 && currentScroll > 140 && !isMenuOpen) {
        setIsHidden(true);
        setIsProductsOpen(false);
      } else if (delta < 0 || currentScroll <= 60) {
        setIsHidden(false);
      }
      lastScrollY.current = currentScroll;
    }
  });

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: isHidden ? "-100%" : "0%" }}
      transition={{ duration: preferReduced ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/95 backdrop-blur-md border-b border-[#123C2D]/10 py-3 shadow-[0_2px_16px_rgba(18,60,45,0.06)]"
          : "bg-white/80 backdrop-blur-xs border-b border-[#123C2D]/5 py-4 md:py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" aria-label="Celife Health Solutions Home" className="cursor-pointer group">
          <CelifeLogo variant="dark" />
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          className="hidden md:flex items-center gap-7 lg:gap-9"
          aria-label="Main navigation"
        >
          {navItems.map((item) => {
            const active =
              isActive(item.href) ||
              Boolean(item.items?.some((sub) => isActive(sub.href)));
            const hasSubmenu = Boolean(item.items && item.items.length > 0);

            if (hasSubmenu) {
              return (
                <div
                  key={item.label}
                  ref={containerRef}
                  className="relative py-2"
                  onMouseEnter={() => setIsProductsOpen(true)}
                  onMouseLeave={() => setIsProductsOpen(false)}
                >
                  <div className="flex items-center">
                    <Link
                      ref={triggerRef}
                      href={item.href}
                      className={cn(
                        "relative text-xs uppercase tracking-[0.18em] py-1 font-semibold group transition-colors duration-200 flex items-center gap-1.5 cursor-pointer",
                        active ? "text-[#123C2D]" : "text-[#52635A] hover:text-[#123C2D]"
                      )}
                      aria-haspopup="true"
                      aria-expanded={isProductsOpen}
                    >
                      {item.label}
                      <ChevronDown
                        size={12}
                        className={cn(
                          "transition-transform duration-200 text-[#52635A]",
                          isProductsOpen ? "rotate-180 text-[#123C2D]" : "group-hover:text-[#123C2D]"
                        )}
                      />

                      {/* Active line indicator */}
                      {active ? (
                        <motion.span
                          layoutId="celife-navbar-indicator"
                          className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#123C2D]"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      ) : (
                        <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#123C2D]/40 transition-all duration-300 group-hover:w-full" />
                      )}
                    </Link>
                  </div>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {isProductsOpen && item.items && (
                      <motion.div
                        initial={preferReduced ? { opacity: 0 } : { opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={preferReduced ? { opacity: 0 } : { opacity: 0, y: -4 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute left-0 top-full pt-2 w-[280px] z-50 pointer-events-auto"
                      >
                        <div className="bg-white border border-[#123C2D]/12 rounded-xs p-3 shadow-xl space-y-1">
                          {item.items.map((sub) => {
                            const subActive = isActive(sub.href);
                            return (
                              <Link
                                key={sub.label}
                                href={sub.href}
                                onClick={() => setIsProductsOpen(false)}
                                className={cn(
                                  "group/item block p-2.5 rounded-xs transition-colors duration-150 border-l-2",
                                  subActive
                                    ? "bg-[#123C2D]/5 border-[#123C2D]"
                                    : "hover:bg-[#F4F5EF] border-transparent hover:border-[#123C2D]/50"
                                )}
                              >
                                <span
                                  className={cn(
                                    "text-xs uppercase tracking-wider font-sans font-semibold block",
                                    subActive ? "text-[#123C2D]" : "text-[#171B18] group-hover/item:text-[#123C2D]"
                                  )}
                                >
                                  {sub.label}
                                </span>
                                {sub.tagline && (
                                  <span className="text-[11px] text-[#52635A] font-sans block mt-0.5 leading-tight">
                                    {sub.tagline}
                                  </span>
                                )}
                              </Link>
                            );
                          })}
                          
                          <div className="pt-2 mt-1 border-t border-[#123C2D]/10">
                            <Link
                              href="/products"
                              onClick={() => setIsProductsOpen(false)}
                              className="text-[11px] uppercase tracking-wider font-semibold text-[#123C2D] block px-2.5 py-1 hover:underline"
                            >
                              Explore All Products &rarr;
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "relative text-xs uppercase tracking-[0.18em] py-1 font-semibold group transition-colors duration-200 cursor-pointer",
                  active ? "text-[#123C2D]" : "text-[#52635A] hover:text-[#123C2D]"
                )}
              >
                {item.label}
                {active ? (
                  <motion.span
                    layoutId="celife-navbar-indicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#123C2D]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                ) : (
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#123C2D]/40 transition-all duration-300 group-hover:w-full" />
                )}
              </Link>
            );
          })}

          {/* Primary Action Button: "Enquire Now" */}
          <Link
            href="/enquire"
            className={cn(
              "text-xs uppercase tracking-[0.16em] font-semibold px-5 py-2.5 rounded-xs transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-xs",
              isActive("/enquire")
                ? "bg-[#123C2D] text-white"
                : "bg-[#123C2D] text-white hover:bg-[#294F3D] hover:shadow-md"
            )}
          >
            <span>Enquire Now</span>
            <Send size={12} />
          </Link>
        </nav>

        {/* Mobile Menu Hamburger Toggle */}
        <button
          id="mobile-menu-toggle"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          className="md:hidden relative z-50 flex items-center justify-center w-10 h-10 text-[#123C2D] hover:text-[#294F3D] transition-colors cursor-pointer"
        >
          <AnimatePresence mode="wait" initial={false}>
            {isMenuOpen ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, scale: 0.6 }}
                animate={{ rotate: 0, scale: 1 }}
                exit={{ rotate: 90, scale: 0.6 }}
                transition={{ duration: 0.2 }}
              >
                <X size={24} />
              </motion.span>
            ) : (
              <motion.span
                key="open"
                initial={{ rotate: 90, scale: 0.6 }}
                animate={{ rotate: 0, scale: 1 }}
                exit={{ rotate: -90, scale: 0.6 }}
                transition={{ duration: 0.2 }}
              >
                <Menu size={24} />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.header>
  );
}