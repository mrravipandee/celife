"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useLenis } from "@/components/animations/SmoothScroll";
import { ArrowRight, ChevronDown } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface HeroProduct {
  id: string;
  name: string;
  badge: string;
  subtitle: string;
  description: string;
  volume: string;
  slug: string;
  bottleImage: string;
  accentColor: string;
  formulationType: string;
}

const HERO_PRODUCTS: HeroProduct[] = [
  {
    id: "vitafiv",
    name: "VITAFIV",
    badge: "Multivitamin & Mineral Syrup",
    subtitle: "Calibrated Multivitamin & Mineral Daily Health Supplement",
    description:
      "A balanced formulation of 25 essential bioactive vitamins, amino acids, and vital trace minerals in delicious chocolate flavour with no added sugar, designed for daily metabolic and vitality support.",
    volume: "200 ml",
    slug: "vitafiv-syrup",
    bottleImage: "/images/hero/vitafiv.png",
    accentColor: "#123C2D",
    formulationType: "Health Supplement",
  },
  {
    id: "ferify",
    name: "FERIFY",
    badge: "Iron & Protein Tonic",
    subtitle: "Hemoglobin Synthesis & Cellular Oxygenation Matrix",
    description:
      "Targeted bio-available elemental iron, zinc, protein, vitamin B12 and folic acid in palatable chocolate flavour to support healthy hemoglobin levels, cellular vitality, and daily energy.",
    volume: "200 ml",
    slug: "ferify-syrup",
    bottleImage: "/images/hero/ferify.png",
    accentColor: "#C84B31",
    formulationType: "Dietary Food Supplement",
  },
  {
    id: "ourliv",
    name: "OURLIV-24",
    badge: "Herbal Liver Revitaliser",
    subtitle: "24-Hour Hepatic Defense & Metabolic Detoxification",
    description:
      "Time-tested botanical synergistic formulation engineered to protect hepatic cellular integrity, stimulate natural bile secretion, and promote digestive harmony around the clock.",
    volume: "200 ml",
    slug: "ourliv-24-syrup",
    bottleImage: "/images/hero/ourliv.png",
    accentColor: "#D97706",
    formulationType: "Ayurvedic Proprietary Medicine",
  },
  {
    id: "reqipro",
    name: "REQIPRO",
    badge: "Nutritional Vitality Malt",
    subtitle: "Wholesome Restorative Stamina & Growth Formula",
    description:
      "Concentrated barley malt formulation enriched with vitality botanicals, bio-chelated minerals, and essential vitamins for growing children, active adults, and convalescence recovery.",
    volume: "200 gm",
    slug: "reqipro-malt",
    bottleImage: "/images/hero/reqipro.png",
    accentColor: "#B45309",
    formulationType: "Nutritional Supplement",
  },
  {
    id: "restoapp",
    name: "RESTOAPP",
    badge: "Appetite Restorer",
    subtitle: "Non-Addictive Botanical Digestive Activator",
    description:
      "Pure carminative herbal blend of ajwain, amla, and digestive spices formulated to gently re-kindle digestive fire, ease sluggish digestion, and promote natural nutritional intake across all ages.",
    volume: "200 ml",
    slug: "restoapp-syrup",
    bottleImage: "/images/hero/restoapp.png",
    accentColor: "#15803D",
    formulationType: "Botanical Digestive Tonic",
  },
];

interface CelifeHeroProps {
  content?: {
    eyebrow?: string;
    heading?: string;
    description?: string;
    primaryCtaLabel?: string;
    primaryCtaLink?: string;
    secondaryCtaLabel?: string;
    secondaryCtaLink?: string;
  };
}

export function CelifeHero({ content }: CelifeHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const bottleWrapRef = useRef<HTMLDivElement>(null);

  const bottleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const textCardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [activeIdx, setActiveIdx] = useState(0);
  const lenis = useLenis();

  // Keep Lenis and ScrollTrigger in sync
  useEffect(() => {
    if (!lenis) return;
    const handleScroll = () => {
      ScrollTrigger.update();
    };
    lenis.on("scroll", handleScroll);
    return () => {
      lenis.off("scroll", handleScroll);
    };
  }, [lenis]);

  useGSAP(
    () => {
      if (!containerRef.current || !pinRef.current) return;

      const mm = gsap.matchMedia();

      // ─── DESKTOP SCROLLTRIGGER TIMELINE (>= 1024px) ──────────────────────────
      mm.add("(min-width: 1024px)", () => {
        // Initial setup for bottles
        bottleRefs.current.forEach((el, i) => {
          if (!el) return;
          if (i === 0) {
            gsap.set(el, { opacity: 1, scale: 1, x: 0, y: 0, rotation: 0, filter: "blur(0px)", zIndex: 10 });
          } else {
            gsap.set(el, { opacity: 0, scale: 0.84, x: 75, y: 35, rotation: -10, filter: "blur(4px)", zIndex: 5 });
          }
        });

        // Initial setup for text cards
        textCardRefs.current.forEach((el, i) => {
          if (!el) return;
          if (i === 0) {
            gsap.set(el, { opacity: 1, y: 0, filter: "blur(0px)", pointerEvents: "auto" });
          } else {
            gsap.set(el, { opacity: 0, y: 30, filter: "blur(4px)", pointerEvents: "none" });
          }
        });

        // Subtle 2.5D Idle Float on Active Bottle Container
        const floatTween = gsap.to(bottleWrapRef.current, {
          y: -8,
          duration: 3.2,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });

        // Dynamic shadow breathing
        const shadowTween = gsap.to(shadowRef.current, {
          scaleX: 1.08,
          scaleY: 1.08,
          opacity: 0.28,
          duration: 3.2,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });

        // Master Timeline pinned over scroll track
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom bottom",
            pin: pinRef.current,
            pinSpacing: true,
            scrub: 1.1,
            anticipatePin: 1,
            onUpdate: (self) => {
              // Calculate discrete active product index without extra re-renders
              const rawProgress = self.progress;
              // Map progress 0 -> 1 across 5 products
              const step = Math.min(4, Math.floor(rawProgress * 5));
              setActiveIdx((prev) => (prev !== step ? step : prev));
            },
          },
        });

        // 4 transitions between the 5 products (each taking 1 unit of timeline)
        for (let i = 0; i < 4; i++) {
          const currentBottle = bottleRefs.current[i];
          const nextBottle = bottleRefs.current[i + 1];
          const currentText = textCardRefs.current[i];
          const nextText = textCardRefs.current[i + 1];

          const transitionTime = i * 1.0;

          // Outgoing bottle: lifts, rotates forward, blurs, and fades out
          if (currentBottle) {
            tl.to(
              currentBottle,
              {
                x: -85,
                y: -30,
                scale: 1.08,
                rotation: 8,
                opacity: 0,
                filter: "blur(5px)",
                duration: 0.85,
                ease: "power2.inOut",
              },
              transitionTime
            );
          }

          // Incoming bottle: sweeps in from lower-right with 2.5D depth, settles crisply
          if (nextBottle) {
            tl.fromTo(
              nextBottle,
              {
                x: 85,
                y: 40,
                scale: 0.82,
                rotation: -12,
                opacity: 0,
                filter: "blur(5px)",
                zIndex: 10 + i,
              },
              {
                x: 0,
                y: 0,
                scale: 1,
                rotation: 0,
                opacity: 1,
                filter: "blur(0px)",
                duration: 0.85,
                ease: "power2.inOut",
              },
              transitionTime + 0.12
            );
          }

          // Outgoing text card
          if (currentText) {
            tl.to(
              currentText,
              {
                y: -28,
                opacity: 0,
                filter: "blur(4px)",
                pointerEvents: "none",
                duration: 0.55,
                ease: "power2.in",
              },
              transitionTime
            );
          }

          // Incoming text card
          if (nextText) {
            tl.fromTo(
              nextText,
              {
                y: 32,
                opacity: 0,
                filter: "blur(4px)",
                pointerEvents: "none",
              },
              {
                y: 0,
                opacity: 1,
                filter: "blur(0px)",
                pointerEvents: "auto",
                duration: 0.65,
                ease: "power2.out",
              },
              transitionTime + 0.22
            );
          }

          // Rotate orbital rings with scroll scrub
          if (orbitRef.current) {
            tl.to(
              orbitRef.current,
              {
                rotation: `+=${85}`,
                duration: 1.0,
                ease: "none",
              },
              transitionTime
            );
          }
        }

        // Buffer time at end so Product 5 stays visible before hero releases pin
        tl.to({}, { duration: 0.35 });

        return () => {
          floatTween.kill();
          shadowTween.kill();
        };
      });

      // ─── MOBILE SCROLLTRIGGER TIMELINE (< 1024px) ───────────────────────────
      mm.add("(max-width: 1023px)", () => {
        // Initial setup on mobile
        bottleRefs.current.forEach((el, i) => {
          if (!el) return;
          if (i === 0) {
            gsap.set(el, { opacity: 1, scale: 1, x: 0, y: 0, rotation: 0 });
          } else {
            gsap.set(el, { opacity: 0, scale: 0.88, x: 50, y: 20, rotation: -6 });
          }
        });

        textCardRefs.current.forEach((el, i) => {
          if (!el) return;
          if (i === 0) {
            gsap.set(el, { opacity: 1, y: 0, pointerEvents: "auto" });
          } else {
            gsap.set(el, { opacity: 0, y: 20, pointerEvents: "none" });
          }
        });

        // Mobile pinned scrub (clean & lightweight, zero overflow)
        const tlMobile = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom bottom",
            pin: pinRef.current,
            pinSpacing: true,
            scrub: 0.8,
            onUpdate: (self) => {
              const step = Math.min(4, Math.floor(self.progress * 5));
              setActiveIdx((prev) => (prev !== step ? step : prev));
            },
          },
        });

        for (let i = 0; i < 4; i++) {
          const currentBottle = bottleRefs.current[i];
          const nextBottle = bottleRefs.current[i + 1];
          const currentText = textCardRefs.current[i];
          const nextText = textCardRefs.current[i + 1];

          const tTime = i * 1.0;

          if (currentBottle) {
            tlMobile.to(
              currentBottle,
              { x: -50, scale: 1.05, opacity: 0, duration: 0.8, ease: "power2.inOut" },
              tTime
            );
          }
          if (nextBottle) {
            tlMobile.fromTo(
              nextBottle,
              { x: 50, scale: 0.88, opacity: 0 },
              { x: 0, scale: 1, opacity: 1, duration: 0.8, ease: "power2.inOut" },
              tTime + 0.1
            );
          }
          if (currentText) {
            tlMobile.to(currentText, { opacity: 0, y: -18, duration: 0.5 }, tTime);
          }
          if (nextText) {
            tlMobile.fromTo(
              nextText,
              { opacity: 0, y: 18 },
              { opacity: 1, y: 0, duration: 0.6 },
              tTime + 0.2
            );
          }
        }

        tlMobile.to({}, { duration: 0.25 });
      });

      return () => mm.revert();
    },
    { scope: containerRef }
  );

  // const activeProduct = HERO_PRODUCTS[activeIdx] || HERO_PRODUCTS[0];
  // const progressRatio = ((activeIdx + 1) / HERO_PRODUCTS.length) * 100;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[360vh] md:h-[400vh] bg-[var(--bone)]"
      id="hero-showcase"
    >
      {/* Pinned Viewport Container */}
      <div
        ref={pinRef}
        className="sticky top-0 w-full h-screen overflow-hidden flex flex-col justify-between"
      >
        {/* Photorealistic Botanical & Plinth Background Layer */}
        <div className="absolute inset-0 -z-10 overflow-hidden select-none pointer-events-none">
          <Image
            src="/images/celife-hero-background.png"
            alt="Celife Health Solutions Formulation Environment"
            fill
            priority
            quality={90}
            sizes="100vw"
            className="object-cover object-center scale-[1.01]"
          />

          {/* Left/Center Optical Reading Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--bone)]/95 via-[var(--bone)]/80 via-45% to-[var(--bone)]/20 lg:to-transparent lg:w-[68%]" />

          {/* Soft Bottom Gradient to blend into subsequent sections */}
          <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[var(--bone)]/60 to-transparent" />
        </div>

        {/* Top Header Spacing Buffer */}
        <div className="w-full pt-20 sm:pt-24 lg:pt-28" />

        {/* Main Stage Grid: Left Editorial Details + Right 2.5D Product Stage */}
        <div className="max-w-[1380px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 flex-1 flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center w-full">
            
              {/* ─── LEFT COLUMN: Editorial Storytelling (Minimal: Name, Description & Know More Button) ─── */}
              <div className="lg:col-span-6 xl:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left z-20">
                
                {/* [COMMENTED OUT PER USER REQUEST: Only product name, description, and button]
                <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-[var(--paper)]/85 border border-[var(--line)]/80 shadow-2xs backdrop-blur-xs mb-4 sm:mb-6">
                  <span className="w-2 h-2 rounded-full bg-[var(--clay)] shrink-0 animate-pulse" />
                  <span className="text-[11px] sm:text-xs uppercase tracking-[0.16em] font-sans font-semibold text-[var(--forest)]">
                    {content?.eyebrow || "EVIDENCE-GUIDED SYRUP & TONIC FORMULATIONS"}
                  </span>
                </div>
                */}

                {/* Dynamic Synchronized Product Info Cards Stack */}
                <div className="relative w-full min-h-[220px] sm:min-h-[250px] md:min-h-[280px] flex items-center">
                  {HERO_PRODUCTS.map((prod, idx) => (
                    <div
                      key={prod.id}
                      ref={(el) => {
                        textCardRefs.current[idx] = el;
                      }}
                      className="absolute inset-0 flex flex-col justify-center items-center lg:items-start text-center lg:text-left space-y-4 sm:space-y-6"
                    >
                      {/* [COMMENTED OUT PER USER REQUEST] Category / Sub-badge
                      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.12em] font-sans text-[var(--sage)]">
                        <span className="font-semibold text-[var(--forest)]">
                          {prod.badge}
                        </span>
                        <span>·</span>
                        <span className="tabular-nums">{prod.volume}</span>
                      </div>
                      */}

                      {/* Bold Editorial Product Title */}
                      <h1 className="text-5xl sm:text-7xl lg:text-[76px] xl:text-[84px] font-bold text-[var(--ink)] tracking-tight leading-[0.95] drop-shadow-xs font-sans">
                        {prod.name}
                      </h1>

                      {/* [COMMENTED OUT PER USER REQUEST] Subtitle
                      <p className="text-sm sm:text-base lg:text-lg font-semibold text-[var(--clay)] tracking-tight">
                        {prod.subtitle}
                      </p>
                      */}

                      {/* Concise Clinical Description */}
                      <p className="text-base sm:text-lg lg:text-xl font-sans text-[var(--ink)]/80 leading-relaxed max-w-[48ch] font-normal">
                        {prod.description}
                      </p>

                      {/* Know More CTA Button */}
                      <div className="pt-2 sm:pt-4 flex items-center">
                        <Link
                          href={`/products/${prod.slug}`}
                          className="inline-flex items-center justify-center gap-2.5 px-7 sm:px-8 py-3.5 sm:py-4 bg-[var(--forest)] hover:bg-[var(--forest-700)] text-white rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg group active:scale-[0.98]"
                        >
                          <span>Know More</span>
                          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>

                        {/* [COMMENTED OUT PER USER REQUEST] Secondary Formulations link
                        <Link
                          href="/products"
                          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--ink)]/75 hover:text-[var(--forest)] transition-colors py-3 px-2"
                        >
                          <span>All Formulations</span>
                          <span aria-hidden="true">→</span>
                        </Link>
                        */}
                      </div>
                    </div>
                  ))}
                </div>

                {/* [COMMENTED OUT PER USER REQUEST: Keeping left side clean with only product name, description & button]
                <div className="pt-4 sm:pt-6 w-full flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[var(--line)]/70">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {HERO_PRODUCTS.map((prod, i) => (
                      <div
                        key={prod.id}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          i === activeIdx
                            ? "w-8 bg-[var(--clay)] shadow-xs"
                            : i < activeIdx
                            ? "w-3 bg-[var(--forest)]"
                            : "w-3 bg-[var(--line)]"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="text-xs font-mono font-semibold tracking-wider text-[var(--sage)]">
                    <span className="text-sm font-bold text-[var(--ink)] tabular-nums">
                      0{activeIdx + 1}
                    </span>
                    <span className="mx-1 text-[var(--line)]">/</span>
                    <span className="tabular-nums">0{HERO_PRODUCTS.length}</span>
                    <span className="ml-2.5 text-[11px] font-sans font-medium uppercase tracking-wider text-[var(--ink)]/60">
                      {activeProduct.name}
                    </span>
                  </div>
                </div>
                */}
              </div>

              {/* ─── RIGHT COLUMN: 2.5D Product Stage with Transparent Botanical Leaves & Plinth Grounding ─── */}
              <div className="lg:col-span-6 xl:col-span-6 relative flex items-center justify-center min-h-[380px] sm:min-h-[440px] lg:min-h-[560px]">
                
                {/* Orbital Rings & Botanical System (Centered behind bottle) */}
                <div
                  ref={orbitRef}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0"
                >
                  {/* Outer Orbit Container with Botanical Leaves & Herbal Sprigs (No geometric border lines) */}
                  <div className="relative w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] lg:w-[490px] lg:h-[490px] rounded-full">
                    
                    {/* Botanical Transparent Leaf 1 - Top Right (Ayurvedic/Botanical Leaf) */}
                    <div className="absolute -top-4 right-16 sm:right-24 transform rotate-[28deg] opacity-75 drop-shadow-[0_4px_10px_rgba(18,60,45,0.2)]">
                      <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
                        <defs>
                          <linearGradient id="orbitLeafGrad1" x1="0%" y1="100%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#1B4332" stopOpacity="0.8" />
                            <stop offset="50%" stopColor="#2D6A4F" stopOpacity="0.55" />
                            <stop offset="100%" stopColor="#74C69D" stopOpacity="0.35" />
                          </linearGradient>
                        </defs>
                        {/* Leaf blade */}
                        <path
                          d="M8 44 C 8 22, 22 8, 44 8 C 44 30, 30 44, 8 44 Z"
                          fill="url(#orbitLeafGrad1)"
                          stroke="rgba(45, 106, 79, 0.45)"
                          strokeWidth="1"
                        />
                        {/* Central vein */}
                        <path d="M8 44 Q 24 26 44 8" stroke="rgba(255, 255, 255, 0.45)" strokeWidth="1" strokeLinecap="round" />
                        {/* Delicate side veins */}
                        <path d="M18 34 Q 24 30 28 35" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="0.75" />
                        <path d="M26 26 Q 32 22 36 27" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="0.75" />
                      </svg>
                    </div>

                    {/* Botanical Transparent Herbal Sprig 2 - Bottom Left (Herbal Branch with Leaflets) */}
                    <div className="absolute -bottom-5 left-12 sm:left-20 transform -rotate-[35deg] opacity-70 drop-shadow-[0_4px_8px_rgba(18,60,45,0.18)]">
                      <svg width="58" height="58" viewBox="0 0 58 58" fill="none">
                        <defs>
                          <linearGradient id="orbitHerbGrad1" x1="0%" y1="100%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#1B4332" stopOpacity="0.75" />
                            <stop offset="100%" stopColor="#52B788" stopOpacity="0.4" />
                          </linearGradient>
                        </defs>
                        {/* Curved stem */}
                        <path d="M12 48 C 22 42, 34 30, 46 14" stroke="rgba(45, 106, 79, 0.55)" strokeWidth="1.5" strokeLinecap="round" />
                        {/* Leaflet pair 1 */}
                        <path d="M24 38 C 18 34, 16 26, 22 24 C 28 26, 28 34, 24 38 Z" fill="url(#orbitHerbGrad1)" stroke="rgba(45, 106, 79, 0.4)" strokeWidth="0.75" />
                        <path d="M26 36 C 32 34, 36 28, 34 22 C 28 24, 26 32, 26 36 Z" fill="url(#orbitHerbGrad1)" stroke="rgba(45, 106, 79, 0.4)" strokeWidth="0.75" />
                        {/* Leaflet pair 2 */}
                        <path d="M36 26 C 32 20, 32 14, 38 12 C 42 16, 40 22, 36 26 Z" fill="url(#orbitHerbGrad1)" stroke="rgba(45, 106, 79, 0.4)" strokeWidth="0.75" />
                        {/* Tip leaflet */}
                        <path d="M46 14 C 44 8, 50 6, 52 8 C 54 14, 48 16, 46 14 Z" fill="url(#orbitHerbGrad1)" stroke="rgba(45, 106, 79, 0.4)" strokeWidth="0.75" />
                      </svg>
                    </div>

                    {/* Botanical Transparent Leaf 3 - Top Left (Curved Organic Foliage) */}
                    <div className="absolute top-18 -left-4 sm:-left-6 transform -rotate-[48deg] opacity-65 drop-shadow-[0_3px_8px_rgba(18,60,45,0.18)]">
                      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                        <defs>
                          <linearGradient id="orbitLeafGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#2D6A4F" stopOpacity="0.7" />
                            <stop offset="100%" stopColor="#74C69D" stopOpacity="0.3" />
                          </linearGradient>
                        </defs>
                        <path d="M8 36 C 8 18, 20 8, 36 8 C 36 24, 24 36, 8 36 Z" fill="url(#orbitLeafGrad2)" stroke="rgba(45, 106, 79, 0.4)" strokeWidth="0.8" />
                        <path d="M8 36 Q 22 22 36 8" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="0.8" strokeLinecap="round" />
                      </svg>
                    </div>

                    {/* Botanical Transparent Herbal Sprig 4 - Bottom Right */}
                    <div className="absolute bottom-16 -right-3 sm:-right-5 transform rotate-[58deg] opacity-70 drop-shadow-[0_4px_8px_rgba(18,60,45,0.18)]">
                      <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
                        <path d="M6 34 C 6 20, 18 10, 34 6 C 34 20, 22 34, 6 34 Z" fill="#2D6A4F" fillOpacity="0.5" stroke="rgba(45, 106, 79, 0.4)" strokeWidth="0.8" />
                        <path d="M6 34 Q 20 20 34 6" stroke="rgba(255, 255, 255, 0.35)" strokeWidth="0.75" />
                      </svg>
                    </div>
                  </div>

                  {/* Middle Botanical Orbit Ring (Leaves only, no dashed line) */}
                  <div className="absolute w-[260px] h-[260px] sm:w-[330px] sm:h-[330px] lg:w-[390px] lg:h-[390px] rounded-full pointer-events-none">
                    {/* Small transparent herbal leaflet on middle radius */}
                    <div className="absolute top-1/2 -right-3 transform -rotate-12 opacity-65 drop-shadow-[0_2px_6px_rgba(18,60,45,0.15)]">
                      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                        <path d="M4 24 C 4 14, 12 6, 24 4 C 24 14, 16 24, 4 24 Z" fill="#40916C" fillOpacity="0.45" stroke="rgba(45,106,79,0.35)" strokeWidth="0.7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* 2.5D Floating Bottle Wrap with Realistic Multi-Tier Base Shadow */}
                <div className="relative flex flex-col items-center justify-center">
                  
                  {/* Bottle Showcase Stack */}
                  <div
                    ref={bottleWrapRef}
                    className="relative w-[240px] sm:w-[300px] lg:w-[360px] h-[340px] sm:h-[420px] lg:h-[500px] flex items-center justify-center z-10"
                    style={{
                      perspective: 1200,
                      transformStyle: "preserve-3d",
                    }}
                  >
                    {HERO_PRODUCTS.map((prod, idx) => (
                      <div
                        key={prod.id}
                        ref={(el) => {
                          bottleRefs.current[idx] = el;
                        }}
                        className="absolute inset-0 flex items-center justify-center will-change-transform"
                      >
                        <div className="relative w-full h-full">
                          <Image
                            src={prod.bottleImage}
                            alt={`${prod.name} - ${prod.badge}`}
                            fill
                            priority={idx === 0}
                            sizes="(max-width: 768px) 280px, (max-width: 1200px) 340px, 400px"
                            className="object-contain object-bottom select-none pointer-events-none drop-shadow-[0_18px_26px_rgba(18,60,45,0.22)]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* ─── REALISTIC MULTI-TIER BOTTLE BOTTOM SHADOW SYSTEM ─── */}
                  {/* 1. Deep Core Contact Occlusion Shadow directly touching the bottle base rim */}
                  <div
                    className="absolute bottom-0 w-[150px] sm:w-[190px] lg:w-[225px] h-[12px] sm:h-[15px] rounded-[50%] pointer-events-none z-5"
                    style={{
                      background:
                        "radial-gradient(ellipse at center, rgba(8, 22, 14, 0.92) 0%, rgba(12, 30, 20, 0.7) 40%, rgba(15, 40, 26, 0.25) 70%, transparent 85%)",
                      filter: "blur(3.5px)",
                    }}
                  />

                  {/* 2. Amber Glass Caustic Underglow directly reflecting bottle warmth on stone */}
                  <div
                    className="absolute -bottom-1.5 w-[170px] sm:w-[210px] lg:w-[245px] h-[15px] sm:h-[18px] rounded-[50%] pointer-events-none z-4"
                    style={{
                      background:
                        "radial-gradient(ellipse at center, rgba(180, 83, 9, 0.25) 0%, rgba(120, 53, 15, 0.12) 50%, transparent 75%)",
                      filter: "blur(5px)",
                    }}
                  />

                  {/* 3. Soft Ambient Plinth Dispersion Shadow spreading onto the stone pedestal */}
                  <div
                    ref={shadowRef}
                    className="absolute -bottom-3 sm:-bottom-4 lg:-bottom-5 w-[230px] sm:w-[290px] lg:w-[335px] h-[24px] sm:h-[30px] rounded-[50%] pointer-events-none z-3"
                    style={{
                      background:
                        "radial-gradient(ellipse at center, rgba(18, 50, 35, 0.5) 0%, rgba(18, 50, 35, 0.22) 55%, transparent 78%)",
                      filter: "blur(8px)",
                    }}
                  />
                </div>

                {/* [COMMENTED OUT PER USER REQUEST] Floating Quality Assurance Capsule Tag
                <div className="absolute bottom-0 right-2 sm:right-6 lg:right-4 z-20 hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--paper)]/95 border border-[var(--line)] shadow-xs backdrop-blur-xs text-[11px] font-medium text-[var(--forest)]">
                  <Sparkles className="w-3.5 h-3.5 text-[var(--clay)]" />
                  <span>ICMR RDA Calibrated · Amber Shield</span>
                </div>
                */}
              </div>

          </div>
        </div>

        {/* Bottom Interactive Scroll Indicator */}
        <div className="w-full pb-4 sm:pb-6 flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.14em] font-sans font-medium text-[var(--sage)] select-none">
          <span>Scroll to explore formulations</span>
          <ChevronDown className="w-3.5 h-3.5 animate-bounce text-[var(--clay)]" />
        </div>
      </div>
    </div>
  );
}
