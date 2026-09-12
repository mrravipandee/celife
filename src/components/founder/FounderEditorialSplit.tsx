"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Reveal } from "@/components/motion/Reveal";

interface SolutionItem {
  imageSrc: string;
  alt: string;
  tagline: string;
  description: string;
}

const SOLUTIONS: SolutionItem[] = [
  {
    imageSrc: "/images/founder/thumb_operations.jpg",
    alt: "Operational kitchen and food costing",
    tagline: "SUCCEED WITH US!",
    description:
      "Precision kitchen pass coordination, recipe yield controls, and standard operating procedures to stop margin leaks.",
  },
  {
    imageSrc: "/images/founder/thumb_resort.jpg",
    alt: "Resort and hotel asset management",
    tagline: "BE SUCCESSFUL, IT'S EASY!",
    description:
      "Resort infrastructure planning, guest circulation architecture, and multi-unit operational governance.",
  },
  {
    imageSrc: "/images/founder/thumb_strategy.jpg",
    alt: "Strategic governance and financial planning",
    tagline: "CLIENTS CHOOSE US!",
    description:
      "Rigorous family business governance, ownership succession roadmaps, and capital allocation frameworks.",
  },
  {
    imageSrc: "/images/founder/thumb_service.jpg",
    alt: "Michelin caliber service standards",
    tagline: "SOLUTIONS, THAT YOU NEED!",
    description:
      "Refined dining room choreography, high-margin beverage programs, and direct guest loyalty systems.",
  },
];

const SERVICES_LIST = [
  { label: "Hospitality Diagnostic Audit", href: "/services/hospitality-audit" },
  { label: "Hotel & Resort Operations Advisory", href: "/services/consulting-services" },
  { label: "Restaurant Turnaround & Menu Costing", href: "/services/consulting-services" },
  { label: "Family Enterprise Succession & Governance", href: "/services/consulting-services" },
  { label: "Standard Operating Procedures (SOPs)", href: "/services/consulting-services" },
  { label: "Pre-Opening & Facility Planning", href: "/services/consulting-services" },
  { label: "Sales, Digital Media & Guest Acquisition", href: "/services/consulting-services" },
];

export function FounderEditorialSplit() {
  const preferReduced = useReducedMotion();
  const [emailInput, setEmailInput] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setIsSubmitted(true);
      setTimeout(() => {
        setEmailInput("");
      }, 4000);
    }
  };

  return (
    <section id="solutions" className="bg-[#0b0b0b] text-white py-16 md:py-24 border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* ──────────────────────────────────────────────────────────
              LEFT COLUMN: Welcome / Ethos + 2x2 Solutions Grid (Quarto Style)
             ────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Top Feature Row: Welcome Eyebrow, Statement Headline & Candid Portrait */}
            <div className="space-y-6">
              {/* Luxury Gold Editorial Eyebrow */}
              <Reveal>
                <span className="font-serif italic text-2xl sm:text-3xl text-primary font-bold block">
                  Welcome
                </span>
              </Reveal>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-8 items-center">
                {/* Statement Headline & 3-Dot Status */}
                <div className="sm:col-span-7 space-y-4">
                  <Reveal delay={0.1}>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-white tracking-tight uppercase leading-snug">
                      Our work is dedicated to the prosperity of our clients!
                    </h2>
                  </Reveal>

                  <Reveal delay={0.2}>
                    <p className="text-xs sm:text-sm font-sans leading-relaxed text-white/70 font-light">
                      True advisory cannot be taught in boardrooms alone. It requires decades of live property operations, direct guest accountability, and the resilience of a multi-generational family enterprise.
                    </p>
                  </Reveal>

                  {/* 3 Status Dots in Website Gold Accent */}
                  <Reveal delay={0.25}>
                    <div className="flex items-center space-x-2 pt-2">
                      <span className="w-3 h-3 rounded-full bg-primary" />
                      <span className="w-3 h-3 rounded-full bg-primary/50" />
                      <span className="w-3 h-3 rounded-full bg-primary/20" />
                    </div>
                  </Reveal>
                </div>

                {/* Candid B&W Portrait Vignette */}
                <div className="sm:col-span-5 flex justify-center sm:justify-end">
                  <div className="relative w-40 h-40 xs:w-44 xs:h-44 sm:w-48 sm:h-48 rounded-sm overflow-hidden border border-white/20 shadow-xl group">
                    <Image
                      src="/images/founder/founder_candid_portrait.jpg"
                      alt="Manav Chandak - Personal Advisory Ethos"
                      fill
                      sizes="(max-width: 640px) 176px, 192px"
                      className="object-cover filter grayscale contrast-110 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    <span className="absolute bottom-2 left-2 text-[10px] font-mono uppercase tracking-widest text-primary font-semibold">
                      MANAV CHANDAK
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Hairline Horizontal Rule */}
            <div className="h-px w-full bg-white/15" />

            {/* Bottom 2x2 Feature Grid: "Good solutions for your business!" */}
            <div className="space-y-6">
              <Reveal>
                <h3 className="text-xl sm:text-2xl font-serif text-white tracking-tight uppercase">
                  Good solutions for your business!
                </h3>
              </Reveal>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 pt-2">
                {SOLUTIONS.map((item, idx) => (
                  <motion.div
                    key={item.tagline}
                    initial={preferReduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{
                      duration: 0.5,
                      delay: preferReduced ? 0 : idx * 0.1,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="flex space-x-4 p-4 border border-white/10 bg-white/[0.015] hover:border-primary/40 rounded-sm transition-all duration-300 group"
                  >
                    {/* Square Monochrome Thumbnail Image */}
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-sm overflow-hidden border border-white/15 bg-black">
                      <Image
                        src={item.imageSrc}
                        alt={item.alt}
                        fill
                        sizes="(max-width: 640px) 64px, 80px"
                        className="object-cover filter grayscale contrast-110 group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>

                    {/* Text Details with Website Gold Accent */}
                    <div className="space-y-1.5 flex-1">
                      <span className="text-xs font-mono uppercase tracking-wider text-primary font-bold block">
                        {item.tagline}
                      </span>
                      <p className="text-[11px] sm:text-xs font-sans text-white/70 leading-relaxed font-light">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

          </div>

          {/* ──────────────────────────────────────────────────────────
              RIGHT COLUMN: Editorial Sidebar (Services Index & Newsletter)
             ────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-4 lg:pl-8 lg:border-l border-white/15 space-y-10">
            
            {/* Sidebar Module 1: Services List */}
            <div id="practices" className="space-y-6">
              <div className="border-b border-white/15 pb-3">
                <h3 className="text-2xl font-serif text-white tracking-tight uppercase">
                  Services
                </h3>
              </div>

              <ul className="space-y-3 font-sans text-xs sm:text-sm">
                {SERVICES_LIST.map((srv) => (
                  <li key={srv.label} className="group">
                    <Link
                      href={srv.href}
                      className="flex items-center space-x-2.5 text-white/70 hover:text-white transition-colors duration-200"
                    >
                      <span className="text-primary font-bold text-xs select-none">
                        ▸
                      </span>
                      <span className="leading-snug group-hover:underline underline-offset-4 decoration-primary/60">
                        {srv.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="pt-2">
                <Link
                  href="/services/consulting-services"
                  className="text-xs font-mono uppercase tracking-[0.2em] text-primary font-semibold hover:text-white transition-colors duration-200 inline-flex items-center gap-1.5"
                >
                  <span>MORE</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            {/* Hairline Divider between Sidebar Modules */}
            <div className="h-px w-full bg-white/15" />

            {/* Sidebar Module 2: Newsletter / Consultation Inquiry Box */}
            <div className="space-y-4">
              <div className="border-b border-white/15 pb-3">
                <h3 className="text-2xl font-serif text-white tracking-tight uppercase">
                  Newsletter
                </h3>
              </div>

              <p className="text-xs text-white/60 font-sans leading-relaxed font-light">
                Receive private operational memos, hospitality diagnostics, and strategic turnaround insights directly from Manav.
              </p>

              {isSubmitted ? (
                <div className="p-4 border border-primary/40 bg-primary/10 rounded-sm text-xs text-primary font-mono space-y-1">
                  <span className="font-semibold block">SUBSCRIPTION CONFIRMED</span>
                  <span className="text-white/80 block">Thank you. You have been added to our private advisory distribution list.</span>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="flex items-stretch gap-2 pt-1">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Enter Your Email..."
                    required
                    aria-label="Enter your email"
                    className="flex-1 bg-black border border-white/20 px-3.5 py-2.5 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-primary rounded-sm font-mono transition-colors"
                  />
                  <button
                    type="submit"
                    aria-label="Submit inquiry"
                    className="px-4 bg-primary hover:bg-[#b58f3c] text-black font-bold text-sm flex items-center justify-center rounded-sm transition-colors cursor-pointer"
                  >
                    →
                  </button>
                </form>
              )}
            </div>

            {/* Sidebar Module 3: Fast Property Consultation Link */}
            <div className="p-5 border border-white/10 bg-white/[0.02] rounded-sm space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-primary font-semibold block">
                DIRECT ADVISORY
              </span>
              <h4 className="text-base font-serif text-white uppercase">
                Property Turnaround Inquiry
              </h4>
              <p className="text-xs text-white/60 font-sans leading-relaxed font-light">
                For confidential asset audits or multi-unit hospitality restructuring.
              </p>
              <Link
                href="/contact"
                className="inline-block text-xs uppercase tracking-widest font-mono text-white underline underline-offset-4 decoration-primary hover:text-primary transition-colors"
              >
                SCHEDULE CONSULTATION →
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
