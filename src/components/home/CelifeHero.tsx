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

export function CelifeHero({ content: _content }: CelifeHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const bottleWrapRef = useRef<HTMLDivElement>(null);

  const bottleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const textCardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Subtle botanical negative space parallax elements
  const herbStemRef = useRef<HTMLDivElement>(null);
  const leafDriftRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const curveSilhouetteRef = useRef<HTMLDivElement>(null);

  const [activeIdx, setActiveIdx] = useState(0);
  const [loadSubsequentBottles, setLoadSubsequentBottles] = useState(false);
  const lenis = useLenis();

  // Progressively load non-visible product bottles (1-4) on idle or scroll
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    let idleId: number | null = null;

    const triggerLoad = () => {
      setLoadSubsequentBottles(true);
    };

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      idleId = (window as unknown as { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback(
        triggerLoad,
        { timeout: 1200 }
      );
    } else {
      timer = setTimeout(triggerLoad, 800);
    }

    const onUserScroll = () => {
      triggerLoad();
      window.removeEventListener("scroll", onUserScroll);
    };
    window.addEventListener("scroll", onUserScroll, { passive: true });

    return () => {
      if (timer) clearTimeout(timer);
      if (idleId !== null && "cancelIdleCallback" in window) {
        (window as unknown as { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(idleId);
      }
      window.removeEventListener("scroll", onUserScroll);
    };
  }, []);

  // Keep Lenis and ScrollTrigger in sync
  useEffect(() => {
    if (!lenis) return;
    const handleScroll = () => {
      setLoadSubsequentBottles(true);
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

        // Initial setup for text cards & their inner elements
        textCardRefs.current.forEach((card, i) => {
          if (!card) return;
          const title = card.querySelector(".hero-prod-title");
          const category = card.querySelector(".hero-prod-category");
          const desc = card.querySelector(".hero-prod-desc");
          const cta = card.querySelector(".hero-prod-cta");

          if (i === 0) {
            gsap.set(card, { opacity: 1, pointerEvents: "auto" });
            if (title) gsap.set(title, { x: 0, opacity: 1, filter: "blur(0px)" });
            if (category) gsap.set(category, { x: 0, opacity: 1, filter: "blur(0px)" });
            if (desc) gsap.set(desc, { y: 0, opacity: 1, filter: "blur(0px)" });
            if (cta) gsap.set(cta, { y: 0, opacity: 1 });
          } else {
            gsap.set(card, { opacity: 0, pointerEvents: "none" });
            if (title) gsap.set(title, { x: 40, opacity: 0, filter: "blur(6px)" });
            if (category) gsap.set(category, { x: 25, opacity: 0, filter: "blur(4px)" });
            if (desc) gsap.set(desc, { y: 20, opacity: 0, filter: "blur(4px)" });
            if (cta) gsap.set(cta, { y: 12, opacity: 0 });
          }
        });

        // Respect prefers-reduced-motion
        const prefersReduced =
          typeof window !== "undefined" &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        let floatTween: gsap.core.Tween | null = null;
        let shadowTween: gsap.core.Tween | null = null;

        if (!prefersReduced) {
          // Subtle 2.5D Idle Float on Active Bottle Container
          floatTween = gsap.to(bottleWrapRef.current, {
            y: -8,
            duration: 3.2,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          });

          // Dynamic shadow breathing
          shadowTween = gsap.to(shadowRef.current, {
            scaleX: 1.08,
            scaleY: 1.08,
            opacity: 0.28,
            duration: 3.2,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          });
        }

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
              // Calculate discrete active product index synchronized at transition midpoints
              const timelineTime = self.progress * 4.35;
              const step = Math.min(4, Math.max(0, Math.floor(timelineTime + 0.5)));
              setActiveIdx((prev) => (prev !== step ? step : prev));
            },
          },
        });

        // Subtle botanical scroll parallax across full showcase timeline
        if (herbStemRef.current) {
          tl.to(herbStemRef.current, { y: -65, rotation: -6, ease: "none", duration: 4.35 }, 0);
        }
        if (leafDriftRef.current) {
          tl.to(leafDriftRef.current, { x: 35, y: -45, rotation: 22, ease: "none", duration: 4.35 }, 0);
        }
        if (particlesRef.current) {
          tl.to(particlesRef.current, { y: -80, ease: "none", duration: 4.35 }, 0);
        }
        if (curveSilhouetteRef.current) {
          tl.to(curveSilhouetteRef.current, { y: -30, opacity: 0.22, ease: "none", duration: 4.35 }, 0);
        }

        // 4 transitions between the 5 products (each taking 1 unit of timeline)
        for (let i = 0; i < 4; i++) {
          const currentBottle = bottleRefs.current[i];
          const nextBottle = bottleRefs.current[i + 1];
          const currentText = textCardRefs.current[i];
          const nextText = textCardRefs.current[i + 1];

          const currTitle = currentText?.querySelector(".hero-prod-title");
          const currCategory = currentText?.querySelector(".hero-prod-category");
          const currDesc = currentText?.querySelector(".hero-prod-desc");
          const currCta = currentText?.querySelector(".hero-prod-cta");

          const nextTitle = nextText?.querySelector(".hero-prod-title");
          const nextCategory = nextText?.querySelector(".hero-prod-category");
          const nextDesc = nextText?.querySelector(".hero-prod-desc");
          const nextCta = nextText?.querySelector(".hero-prod-cta");

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

          // ─── OUTGOING TEXT ELEMENTS (Staggered exit) ───
          if (currTitle) {
            tl.to(
              currTitle,
              { x: -40, opacity: 0, filter: "blur(6px)", duration: 0.45, ease: "power2.in" },
              transitionTime
            );
          }
          if (currCategory) {
            tl.to(
              currCategory,
              { x: -25, opacity: 0, filter: "blur(4px)", duration: 0.4, ease: "power2.in" },
              transitionTime + 0.04
            );
          }
          if (currDesc) {
            tl.to(
              currDesc,
              { y: -16, opacity: 0, filter: "blur(4px)", duration: 0.4, ease: "power2.in" },
              transitionTime + 0.06
            );
          }
          if (currCta) {
            tl.to(
              currCta,
              { opacity: 0, y: -10, duration: 0.35, ease: "power2.in" },
              transitionTime + 0.08
            );
          }
          if (currentText) {
            tl.to(
              currentText,
              { opacity: 0, pointerEvents: "none", duration: 0.45 },
              transitionTime + 0.1
            );
          }

          // ─── INCOMING TEXT ELEMENTS (Staggered entrance: Title -> Category -> Desc -> CTA) ───
          if (nextText) {
            tl.set(nextText, { opacity: 1, pointerEvents: "auto" }, transitionTime + 0.12);
          }
          if (nextTitle) {
            tl.fromTo(
              nextTitle,
              { x: 40, opacity: 0, filter: "blur(6px)" },
              { x: 0, opacity: 1, filter: "blur(0px)", duration: 0.55, ease: "power2.out" },
              transitionTime + 0.12
            );
          }
          if (nextCategory) {
            tl.fromTo(
              nextCategory,
              { x: 25, opacity: 0, filter: "blur(4px)" },
              { x: 0, opacity: 1, filter: "blur(0px)", duration: 0.5, ease: "power2.out" },
              transitionTime + 0.16
            );
          }
          if (nextDesc) {
            tl.fromTo(
              nextDesc,
              { y: 20, opacity: 0, filter: "blur(4px)" },
              { x: 0, y: 0, opacity: 1, filter: "blur(0px)", duration: 0.5, ease: "power2.out" },
              transitionTime + 0.20
            );
          }
          if (nextCta) {
            tl.fromTo(
              nextCta,
              { y: 12, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.45, ease: "power2.out" },
              transitionTime + 0.26
            );
          }

          // Rotate orbital leaves with scroll scrub
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
          floatTween?.kill();
          shadowTween?.kill();
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

        textCardRefs.current.forEach((card, i) => {
          if (!card) return;
          const title = card.querySelector(".hero-prod-title");
          const category = card.querySelector(".hero-prod-category");
          const desc = card.querySelector(".hero-prod-desc");
          const cta = card.querySelector(".hero-prod-cta");

          if (i === 0) {
            gsap.set(card, { opacity: 1, pointerEvents: "auto" });
            if (title) gsap.set(title, { x: 0, opacity: 1 });
            if (category) gsap.set(category, { opacity: 1 });
            if (desc) gsap.set(desc, { y: 0, opacity: 1 });
            if (cta) gsap.set(cta, { y: 0, opacity: 1 });
          } else {
            gsap.set(card, { opacity: 0, pointerEvents: "none" });
            if (title) gsap.set(title, { x: 28, opacity: 0 });
            if (category) gsap.set(category, { opacity: 0 });
            if (desc) gsap.set(desc, { y: 14, opacity: 0 });
            if (cta) gsap.set(cta, { y: 8, opacity: 0 });
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
              const timelineTime = self.progress * 4.25;
              const step = Math.min(4, Math.max(0, Math.floor(timelineTime + 0.5)));
              setActiveIdx((prev) => (prev !== step ? step : prev));
            },
          },
        });

        for (let i = 0; i < 4; i++) {
          const currentBottle = bottleRefs.current[i];
          const nextBottle = bottleRefs.current[i + 1];
          const currentText = textCardRefs.current[i];
          const nextText = textCardRefs.current[i + 1];

          const currTitle = currentText?.querySelector(".hero-prod-title");
          const currCategory = currentText?.querySelector(".hero-prod-category");
          const currDesc = currentText?.querySelector(".hero-prod-desc");
          const currCta = currentText?.querySelector(".hero-prod-cta");

          const nextTitle = nextText?.querySelector(".hero-prod-title");
          const nextCategory = nextText?.querySelector(".hero-prod-category");
          const nextDesc = nextText?.querySelector(".hero-prod-desc");
          const nextCta = nextText?.querySelector(".hero-prod-cta");

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

          // Outgoing mobile text
          if (currTitle) tlMobile.to(currTitle, { x: -28, opacity: 0, duration: 0.4, ease: "power2.in" }, tTime);
          if (currCategory) tlMobile.to(currCategory, { opacity: 0, duration: 0.35 }, tTime + 0.04);
          if (currDesc) tlMobile.to(currDesc, { y: -12, opacity: 0, duration: 0.35 }, tTime + 0.06);
          if (currCta) tlMobile.to(currCta, { opacity: 0, y: -8, duration: 0.3 }, tTime + 0.08);
          if (currentText) tlMobile.to(currentText, { pointerEvents: "none", opacity: 0, duration: 0.4 }, tTime + 0.1);

          // Incoming mobile text
          if (nextText) tlMobile.set(nextText, { opacity: 1, pointerEvents: "auto" }, tTime + 0.12);
          if (nextTitle) tlMobile.fromTo(nextTitle, { x: 28, opacity: 0 }, { x: 0, opacity: 1, duration: 0.48, ease: "power2.out" }, tTime + 0.12);
          if (nextCategory) tlMobile.fromTo(nextCategory, { opacity: 0 }, { opacity: 1, duration: 0.4 }, tTime + 0.16);
          if (nextDesc) tlMobile.fromTo(nextDesc, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, tTime + 0.20);
          if (nextCta) tlMobile.fromTo(nextCta, { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, tTime + 0.24);
        }

        tlMobile.to({}, { duration: 0.25 });
      });

      return () => mm.revert();
    },
    { scope: containerRef }
  );

  const activeProduct = HERO_PRODUCTS[activeIdx] || HERO_PRODUCTS[0];
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
            quality={75}
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
            
              {/* ─── LEFT COLUMN: Editorial Storytelling with Subtle Luxury Botanical Details ─── */}
              <div className="lg:col-span-6 xl:col-span-6 relative flex flex-col items-center lg:items-start text-center lg:text-left z-20">
                
                {/* ─── BOTANICAL NEGATIVE SPACE COMPOSITION (Desktop Only, Subtle & Luxury) ─── */}
                <div className="absolute inset-0 -left-6 sm:-left-12 -right-4 pointer-events-none select-none z-0 hidden lg:block overflow-visible">
                  {/* 1. Faint Ayurvedic Herbal Stem Silhouette (Top-Left Background, drifts upward on scroll) */}
                  <div
                    ref={herbStemRef}
                    className="absolute -top-12 -left-6 opacity-[0.14] text-[var(--forest)] will-change-transform"
                    style={{ transformOrigin: "bottom center" }}
                  >
                    <svg width="180" height="240" viewBox="0 0 180 240" fill="none" stroke="currentColor">
                      <path d="M40 230 C 50 170, 70 100, 110 20" strokeWidth="1.2" strokeLinecap="round" />
                      <path d="M52 185 C 30 175, 20 155, 34 145 C 44 152, 48 168, 54 180" strokeWidth="0.9" />
                      <path d="M62 150 C 85 140, 95 125, 82 115 C 72 122, 66 138, 64 148" strokeWidth="0.9" />
                      <path d="M72 115 C 50 105, 42 85, 54 75 C 64 82, 68 98, 74 110" strokeWidth="0.9" />
                      <path d="M88 80 C 110 70, 118 55, 106 45 C 96 52, 92 66, 89 77" strokeWidth="0.9" />
                      <path d="M104 35 C 100 20, 112 12, 118 16 C 122 24, 114 30, 107 34" strokeWidth="0.9" />
                    </svg>
                  </div>

                  {/* 2. Delicate Translucent Leaf drifting diagonally on scroll */}
                  <div
                    ref={leafDriftRef}
                    className="absolute top-1/4 -left-2 opacity-[0.25] text-[var(--forest)] will-change-transform"
                  >
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                      <path
                        d="M6 42 C 6 22, 22 6, 42 6 C 42 26, 26 42, 6 42 Z"
                        fill="currentColor"
                        fillOpacity="0.4"
                        stroke="currentColor"
                        strokeWidth="0.8"
                      />
                      <path d="M6 42 Q 22 24 42 6" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" strokeLinecap="round" />
                    </svg>
                  </div>

                  {/* 3. Subtle Botanical Contour Line-Art (Far Left edge curve) */}
                  <div
                    ref={curveSilhouetteRef}
                    className="absolute bottom-16 -left-8 opacity-[0.12] text-[var(--forest)] will-change-transform"
                  >
                    <svg width="120" height="160" viewBox="0 0 120 160" fill="none" stroke="currentColor">
                      <path d="M10 150 C 40 120, 30 70, 80 20" strokeWidth="0.8" strokeDasharray="3 4" />
                      <path d="M40 100 C 65 95, 75 75, 60 65 C 50 72, 45 88, 42 98" strokeWidth="0.8" />
                    </svg>
                  </div>

                  {/* 4. Natural Botanical Floating Particles / Spores */}
                  <div ref={particlesRef} className="absolute inset-0 pointer-events-none will-change-transform">
                    <span className="absolute top-10 left-1/3 w-1.5 h-1.5 rounded-full bg-[var(--forest)]/20 blur-[0.5px]" />
                    <span className="absolute top-2/3 left-8 w-2 h-2 rounded-full bg-[var(--clay)]/15 blur-[0.5px]" />
                    <span className="absolute bottom-16 left-1/2 w-1 h-1 rounded-full bg-[var(--forest)]/25" />
                  </div>
                </div>

                {/* Dynamic Synchronized Product Info Cards Stack */}
                <div className="relative w-full min-h-[270px] sm:min-h-[300px] md:min-h-[320px] lg:min-h-[340px] flex items-center z-10">
                  {HERO_PRODUCTS.map((prod, idx) => (
                    <div
                      key={prod.id}
                      ref={(el) => {
                        textCardRefs.current[idx] = el;
                      }}
                      className="absolute inset-0 flex flex-col justify-center items-center lg:items-start text-center lg:text-left space-y-3 sm:space-y-4"
                    >
                      {/* Small Category / Product Type */}
                      <div className="hero-prod-category flex items-center gap-2 text-xs uppercase tracking-[0.14em] font-sans text-[var(--sage)]">
                        <span className="font-semibold text-[var(--forest)]">
                          {prod.badge}
                        </span>
                        <span className="text-[var(--line)]">·</span>
                        <span className="tabular-nums font-medium">{prod.volume}</span>
                      </div>

                      {/* Bold Editorial Product Title (Single H1 for active primary product, semantic H2 for slides) */}
                      {idx === 0 ? (
                        <h1 className="hero-prod-title text-5xl sm:text-7xl lg:text-[76px] xl:text-[84px] font-bold text-[var(--ink)] tracking-tight leading-[0.95] drop-shadow-xs font-sans">
                          {prod.name}
                        </h1>
                      ) : (
                        <h2 className="hero-prod-title text-5xl sm:text-7xl lg:text-[76px] xl:text-[84px] font-bold text-[var(--ink)] tracking-tight leading-[0.95] drop-shadow-xs font-sans">
                          {prod.name}
                        </h2>
                      )}

                      {/* Concise Clinical Description */}
                      <p className="hero-prod-desc text-base sm:text-lg lg:text-xl font-sans text-[var(--ink)]/80 leading-relaxed max-w-[48ch] font-normal">
                        {prod.description}
                      </p>

                      {/* Know More CTA Button */}
                      <div className="hero-prod-cta pt-2 sm:pt-4 flex items-center">
                        <Link
                          href={`/products/${prod.slug}`}
                          className="inline-flex items-center justify-center gap-2.5 px-7 sm:px-8 py-3.5 sm:py-4 bg-[var(--forest)] hover:bg-[var(--forest-700)] text-white rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg group active:scale-[0.98]"
                        >
                          <span>Know More</span>
                          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Synchronized Progress Tracker & Product Counter */}
                <div className="pt-6 sm:pt-8 w-full flex items-center justify-between gap-4 border-t border-[var(--line)]/60 max-w-[520px] z-10">
                  {/* 5 Segmented Progress Indicator */}
                  <div className="flex items-center gap-2">
                    {HERO_PRODUCTS.map((prod, i) => (
                      <div
                        key={prod.id}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          i === activeIdx
                            ? "w-8 bg-[var(--clay)] shadow-xs"
                            : i < activeIdx
                            ? "w-3 bg-[var(--forest)]/70"
                            : "w-3 bg-[var(--line)]"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Tabular Discrete Counter */}
                  <div className="text-xs font-mono font-semibold tracking-wider text-[var(--sage)] flex items-center">
                    <span className="text-sm font-bold text-[var(--ink)] tabular-nums">
                      0{activeIdx + 1}
                    </span>
                    <span className="mx-1 text-[var(--line)]">/</span>
                    <span className="tabular-nums">0{HERO_PRODUCTS.length}</span>
                    <span className="ml-3 text-[11px] font-sans font-medium uppercase tracking-wider text-[var(--forest)]">
                      {activeProduct.name}
                    </span>
                  </div>
                </div>
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
                          {(idx === 0 || loadSubsequentBottles) && (
                            <Image
                              src={prod.bottleImage}
                              alt={`${prod.name} - ${prod.badge}`}
                              fill
                              priority={idx === 0}
                              sizes="(max-width: 768px) 280px, (max-width: 1200px) 340px, 400px"
                              className="object-contain object-bottom select-none pointer-events-none drop-shadow-[0_18px_26px_rgba(18,60,45,0.22)]"
                            />
                          )}
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
