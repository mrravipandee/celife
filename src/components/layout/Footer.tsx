"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { navItems } from "@/data/navigation";
import { Button } from "@/components/ui/Button";


// Official Social Media SVGs
function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className || "w-5 h-5"}
      aria-hidden="true"
    >
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.67 1.67 0 1 0 0-3.34 1.67 1.67 0 0 0 0 3.34m1.4 9.74v-8.37H5.06v8.37z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className || "w-5 h-5"}
      aria-hidden="true"
    >
      <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className || "w-5 h-5"}
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className || "w-5 h-5"}
      aria-hidden="true"
    >
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.376.55 9.376.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const preferReduced = useReducedMotion();

  // Subtle parallax entrance
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end end"],
  });
  const translateY = useTransform(scrollYProgress, [0, 1], [20, 0]);

  return (
    <footer
      ref={footerRef}
      className="bg-black text-white relative overflow-hidden border-t border-white/10"
    >
      <motion.div
        style={preferReduced ? {} : { y: translateY }}
        className="w-full flex flex-col"
      >
        {/* ============================================================== */}
        {/* SECTION 1: TOP BANNER (COMMENTED OUT / HIDDEN AS REQUESTED)    */}
        {/* ============================================================== */}
        {/*
        <div className="relative w-full overflow-hidden bg-gradient-to-b from-[#141414] via-[#0f0f0f] to-[#070707] border-b border-white/10 pt-20 md:pt-28 pb-0 flex flex-col items-center justify-between text-center select-none">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-primary/[0.08] blur-[120px] rounded-full"
          />

          <div className="relative z-10 max-w-4xl mx-auto px-6 space-y-7 mb-10 md:mb-14">
            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-sans font-bold text-white tracking-tight leading-[1.08]">
              The future of hospitality.
            </h2>

            <div className="pt-2">
              <Link href="/contact" className="inline-block cursor-pointer">
                <Button
                  variant="primary"
                  className="font-bold tracking-[0.25em] px-8 sm:px-11 py-4 sm:py-5 text-xs sm:text-sm cursor-pointer shadow-2xl"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative w-full flex flex-col items-center justify-center overflow-hidden pointer-events-none px-4 sm:px-6 md:px-8">
            <Image
              src="/images/thedco-footer.png"
              alt="The Dco"
              width={2048}
              height={372}
              className="w-full max-w-7xl h-auto object-contain select-none block"
              priority={false}
            />
          </div>
        </div>
        */}

        {/* ============================================================== */}
        {/* SECTION 2: BOTTOM BAR WITH LINKS, SOCIALS, & CENTER COPYRIGHT  */}
        {/* ============================================================== */}
        <div className="bg-black py-8 md:py-10 px-6 md:px-12 w-full">
          <div className="max-w-7xl mx-auto flex flex-col gap-6">
            {/* Top Row: Left Pages Links & Right Social Media */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Left Side: Pages Links */}
              <nav className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 sm:gap-x-8 gap-y-2 text-xs uppercase tracking-[0.16em] text-white/70 font-sans">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="hover:text-primary transition-colors duration-200 py-1"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  href="/contact"
                  className="hover:text-primary transition-colors duration-200 py-1"
                >
                  Privacy Policy
                </Link>
              </nav>

              {/* Right Side: Social Media Icons */}
              <div className="flex items-center gap-5 text-white hover:text-white shrink-0">
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="text-white/80 hover:text-primary transition-colors duration-200"
                >
                  <LinkedInIcon className="w-5 h-5" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="text-white/80 hover:text-primary transition-colors duration-200"
                >
                  <FacebookIcon className="w-5 h-5" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X (Twitter)"
                  className="text-white/80 hover:text-primary transition-colors duration-200"
                >
                  <XIcon className="w-4 h-4" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="text-white/80 hover:text-primary transition-colors duration-200"
                >
                  <YouTubeIcon className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Bottom Row: Centered Copyright Symbol and Current Year */}
            <div className="pt-4 border-t border-white/5 text-center text-xs tracking-[0.14em] text-white/40 font-sans">
              <span>&copy; {new Date().getFullYear()} TheDco. All rights reserved.</span>
            </div>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
