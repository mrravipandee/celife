"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useUiStore } from "@/store/ui.store";
import { navItems } from "@/data/navigation";
import { cn } from "@/lib/utils";
import { Menu, X, ChevronDown } from "lucide-react";
import { useLenis } from "@/components/animations/SmoothScroll";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const desktopNavItems = navItems.filter((item) => item.href !== "/contact");

export function Navbar() {
  const [isHidden, setIsHidden] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const lastScrollY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLAnchorElement>(null);
  const { isMenuOpen, toggleMenu } = useUiStore();
  const pathname = usePathname();
  const preferReduced = useReducedMotion();

  // Close dropdown on outside click or route change
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsServicesOpen(false);
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Subscribe to Lenis scroll without raw window scroll listeners
  useLenis((lenis) => {
    const currentScroll = lenis.scroll;
    const delta = currentScroll - lastScrollY.current;

    // Ramp background opacity/blur over the first 100px of scroll
    const progress = Math.min(1, Math.max(0, currentScroll / 100));
    setScrollProgress(progress);

    // 10px deadzone to prevent flickering
    if (Math.abs(delta) > 10) {
      if (delta > 0 && currentScroll > 120 && !isMenuOpen) {
        setIsHidden(true); // Scrolling Down -> Hide
        setIsServicesOpen(false);
      } else if (delta < 0 || currentScroll <= 60) {
        setIsHidden(false); // Scrolling Up or at Top -> Reveal
      }
      lastScrollY.current = currentScroll;
    }
  });

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  const isSubActive = (href: string) => pathname === href;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsServicesOpen(false);
      triggerRef.current?.focus();
    } else if (e.key === "ArrowDown" || (e.key === "Enter" && !isServicesOpen)) {
      e.preventDefault();
      setIsServicesOpen(true);
    }
  };

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: isHidden ? "-100%" : "0%" }}
      transition={{ duration: preferReduced ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background:
          scrollProgress === 0
            ? "linear-gradient(to bottom, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.3) 65%, transparent 100%)"
            : `rgba(0, 0, 0, ${Math.min(0.92, 0.6 + scrollProgress * 0.35)})`,
        backdropFilter: scrollProgress > 0.05 ? `blur(${Math.min(16, 4 + scrollProgress * 12)}px)` : "none",
        borderBottomColor: scrollProgress > 0.1 ? `rgba(255, 255, 255, 0.08)` : "transparent",
      }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
        scrollProgress > 0.2 ? "py-2.5" : "py-4 md:py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          aria-label="THE DCO Home"
          className="flex items-center group select-none"
        >
          <div className="relative w-12 h-12 md:w-14 md:h-14 flex-shrink-0 transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
            <Image
              src="/images/thedoc.png"
              alt="THE DCO Logo"
              fill
              className="object-contain mix-blend-screen"
              priority
            />
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav
          className="hidden md:flex items-center gap-7 lg:gap-8"
          aria-label="Main navigation"
        >
          {desktopNavItems.map((item) => {
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
                  onMouseEnter={() => setIsServicesOpen(true)}
                  onMouseLeave={() => setIsServicesOpen(false)}
                  onKeyDown={handleKeyDown}
                >
                  <div className="flex items-center">
                    <Link
                      ref={triggerRef}
                      href={item.href}
                      className={cn(
                        "relative text-sm uppercase tracking-[0.18em] py-1 font-medium group transition-colors duration-300 flex items-center gap-1.5",
                        active ? "text-primary" : "text-white/80 hover:text-white"
                      )}
                      aria-haspopup="true"
                      aria-expanded={isServicesOpen}
                    >
                      {item.label}
                      <ChevronDown
                        size={12}
                        className={cn(
                          "transition-transform duration-200 opacity-60",
                          isServicesOpen ? "rotate-180 text-primary opacity-100" : "group-hover:opacity-100"
                        )}
                      />

                      {/* Animated Shared Layout Indicator */}
                      {active ? (
                        <motion.span
                          layoutId="navbar-active-indicator"
                          className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-primary"
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 30,
                          }}
                        />
                      ) : (
                        <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-primary/60 transition-all duration-300 group-hover:w-full" />
                      )}
                    </Link>
                  </div>

                  {/* Minimal Single-Item Services Dropdown */}
                  <AnimatePresence>
                    {isServicesOpen && item.items && (
                      <motion.div
                        initial={preferReduced ? { opacity: 0 } : { opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={preferReduced ? { opacity: 0 } : { opacity: 0, y: -4 }}
                        transition={{ duration: preferReduced ? 0.05 : 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute left-1/2 -translate-x-1/2 top-full pt-2 w-[310px] z-50 pointer-events-auto"
                      >
                        <div className="bg-[#050505]/95 backdrop-blur-xl border border-white/10 rounded-sm p-3.5 shadow-2xl space-y-1">
                          {item.items.map((sub) => {
                            const subActive = isSubActive(sub.href);
                            return (
                              <Link
                                key={sub.label}
                                href={sub.href}
                                onClick={() => setIsServicesOpen(false)}
                                className={cn(
                                  "group/item block p-3 rounded-sm transition-all duration-200 border-l-2",
                                  subActive
                                    ? "bg-white/[0.04] border-primary"
                                    : "hover:bg-white/[0.03] border-transparent hover:border-primary/60"
                                )}
                              >
                                <span
                                  className={cn(
                                    "text-xs uppercase tracking-wider font-sans font-semibold transition-colors duration-200 block leading-snug",
                                    subActive
                                      ? "text-primary font-medium"
                                      : "text-white group-hover/item:text-primary"
                                  )}
                                >
                                  {sub.label}
                                </span>
                                {sub.tagline && (
                                  <span className="text-[11px] text-white/70 font-sans block mt-1 leading-tight group-hover/item:text-white/90">
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
                </div>
              );
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "relative text-sm uppercase tracking-[0.18em] py-1 font-medium group transition-colors duration-300",
                  active ? "text-primary" : "text-white/80 hover:text-white"
                )}
              >
                {item.label}

                {/* Animated Shared Layout Indicator */}
                {active ? (
                  <motion.span
                    layoutId="navbar-active-indicator"
                    className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-primary"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                ) : (
                  <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-primary/60 transition-all duration-300 group-hover:w-full" />
                )}
              </Link>
            );
          })}

          {/* Consultation CTA Button */}
          <Link
            href="/contact"
            className={cn(
              "text-xs uppercase tracking-[0.12em] font-semibold border px-5 py-2.5 transition-all duration-300 rounded-xs shrink-0 shadow-sm",
              isActive("/contact")
                ? "bg-primary text-black border-primary"
                : "bg-black/40 backdrop-blur-xs border-primary/75 text-primary hover:bg-primary hover:text-black hover:border-primary hover:shadow-[0_0_20px_rgba(201,162,74,0.35)]"
            )}
          >
            Book Consultation
          </Link>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          id="mobile-menu-toggle"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          className="md:hidden relative z-50 flex items-center justify-center w-10 h-10 text-white/80 hover:text-primary transition-colors duration-300 cursor-pointer"
        >
          <AnimatePresence mode="wait" initial={false}>
            {isMenuOpen ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, scale: 0.6 }}
                animate={{ rotate: 0, scale: 1 }}
                exit={{ rotate: 90, scale: 0.6 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <X size={22} />
              </motion.span>
            ) : (
              <motion.span
                key="open"
                initial={{ rotate: 90, scale: 0.6 }}
                animate={{ rotate: 0, scale: 1 }}
                exit={{ rotate: -90, scale: 0.6 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <Menu size={22} />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.header>
  );
}