"use client";

/**
 * FounderHero
 * ─────────────────────────────────────────────────────────────────────────────
 * Premium editorial hero for the Founder page.
 *
 * What changed vs. the previous version
 *  1. ONE layout instead of two forked trees (desktop/mobile duplication removed).
 *     The stage is a true 50 / 50 grid — the quote side and the portrait side are
 *     mathematically equal and both are optically centred.
 *  2. Scroll-driven 3D: the stage lifts out of the page on a perspective camera
 *     (rotateX + scale + depth layers) and the portrait parallaxes inside its
 *     frame. All values are spring-smoothed so nothing snaps.
 *  3. Auto-play carousel with a typewriter reveal, a circular progress ring,
 *     hover / focus / tab-hidden pause, and keyboard + swipe control.
 *  4. The "comment box" (gold speech bubble) is rebuilt: fluid clamp() sizing,
 *     a reserved text box so typing never reflows the layout, a seamed beak that
 *     always meets the portrait edge, and real a11y (aria-live, roles, labels).
 *  5. Every animation is gated behind prefers-reduced-motion.
 *
 * Drop-in: same import path, same props (none), same image + token usage.
 */

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/* ═══════════════════════════════════════════════════════════════════════════
   CONTENT
   ═══════════════════════════════════════════════════════════════════════════ */

interface SlideData {
  /** Large serif word that anchors the slide. */
  accentWord: string;
  /** Small caps kicker under the accent word. */
  subheading: string;
  /** Body copy — this is what gets typed out. */
  description: string;
}

const HERO_SLIDES: readonly SlideData[] = [
  {
    accentWord: "real",
    subheading: "method of approach",
    description:
      "Direct ground-level hospitality leadership. Every advisory recommendation is forged in daily property operations, kitchen lines, and margin discipline.",
  },
  {
    accentWord: "heritage",
    subheading: "established",
    description:
      "Third-generation hospitality entrepreneur carrying forward Panchavati Group of Hotels, Motels & Restaurants with over four decades of operating provenance.",
  },
  {
    accentWord: "rigor",
    subheading: "academic & strategic",
    description:
      "SP Jain Global Family Managed Business Master's paired with over a decade directing brand acquisition funnels, digital media, and revenue turnarounds.",
  },
] as const;

const SECTIONS_NAV = [
  { label: "OVERVIEW", href: "#overview" },
  { label: "PILLARS", href: "#pillars" },
  { label: "SOLUTIONS", href: "#solutions" },
  { label: "PRACTICES", href: "#practices" },
  { label: "HERITAGE", href: "#heritage" },
  { label: "CONTACT", href: "#contact" },
] as const;

/* Timing constants — single source of truth for the autoplay loop. */
const SLIDE_DURATION_MS = 6200; // full dwell time per slide
const TYPE_SPEED_MS = 16; // ms per character
const TYPE_START_DELAY_MS = 260; // let the accent word land first

/** Shared premium easing (expo-out). Used everywhere for a consistent feel. */
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

/* ─────────────────────────────────────────────────────────────────────────────
   SUBJECT FRAMING — the only two numbers to touch if Manav sits too far
   left or right inside the stage. Both are card-relative, so they behave
   predictably at every viewport width.

   SUBJECT_PLATE_WIDTH   How much of the card the sharp photo plate covers,
                         anchored to the right edge. Narrower = the whole
                         plate (and therefore the subject) shifts RIGHT.

   SUBJECT_FOCAL_X       object-position X inside that plate.
                         LOWER  → subject moves RIGHT.
                         HIGHER → subject moves LEFT.
   ───────────────────────────────────────────────────────────────────────── */
const SUBJECT_PLATE_WIDTH = "58%"; // desktop only; mobile is always full-bleed
const SUBJECT_FOCAL_DESKTOP = "30% center"; // subject sits right of the bubble
const SUBJECT_FOCAL_MOBILE = "28% 22%"; // narrow viewport → clear portrait framing above card

/* ═══════════════════════════════════════════════════════════════════════════
   HOOKS
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Types `text` out character by character on a rAF clock (no timer drift, and
 * it naturally throttles on background tabs). When `enabled` is false the full
 * string is returned immediately — that is the reduced-motion path.
 */
function useTypewriter(
  text: string,
  { enabled = true, speed = TYPE_SPEED_MS, startDelay = TYPE_START_DELAY_MS } = {}
) {
  const [typed, setTyped] = useState("");

  useEffect(() => {
    if (!enabled) return;

    let frame = 0;
    let index = 0;
    let lastEmit = 0;
    const begunAt = performance.now();

    const tick = (now: number) => {
      if (now - begunAt < startDelay) {
        frame = requestAnimationFrame(tick);
        return;
      }
      if (now - lastEmit >= speed) {
        lastEmit = now;
        index += 1;
        setTyped(text.slice(0, index));
      }
      if (index < text.length) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [text, enabled, speed, startDelay]);

  const displayedText = enabled ? typed : text;
  return { typed: displayedText, isTyping: enabled && displayedText.length < text.length };
}

/** True while the document is hidden — so autoplay never runs off-screen. */
function usePageVisible() {
  const [visible, setVisible] = useState(() =>
    typeof document !== "undefined" ? document.visibilityState === "visible" : true
  );

  useEffect(() => {
    const onChange = () => setVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onChange);
    return () => document.removeEventListener("visibilitychange", onChange);
  }, []);

  return visible;
}

/**
 * Pointer-driven 3D tilt, normalised to −1…1 on both axes.
 * Returns spring-smoothed motion values plus the handlers to bind.
 */
function usePointerTilt(disabled: boolean) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const x = useSpring(rawX, { stiffness: 140, damping: 20, mass: 0.4 });
  const y = useSpring(rawY, { stiffness: 140, damping: 20, mass: 0.4 });

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (disabled || event.pointerType !== "mouse") return;
      const rect = event.currentTarget.getBoundingClientRect();
      rawX.set(((event.clientX - rect.left) / rect.width - 0.5) * 2);
      rawY.set(((event.clientY - rect.top) / rect.height - 0.5) * 2);
    },
    [disabled, rawX, rawY]
  );

  const onPointerLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  return { x, y, onPointerMove, onPointerLeave };
}

/* ═══════════════════════════════════════════════════════════════════════════
   SUB-COMPONENT — the gold "comment box"
   ═══════════════════════════════════════════════════════════════════════════ */

interface CommentBubbleProps {
  slide: SlideData;
  slideKey: number;
  total: number;
  activeIndex: number;
  progress: MotionValue<number>;
  reduced: boolean;
  onSelect: (index: number) => void;
  /** "right" on desktop (points at the portrait), "up" when stacked. */
  className?: string;
}

function CommentBubble({
  slide,
  slideKey,
  total,
  activeIndex,
  progress,
  reduced,
  onSelect,
  className = "",
}: CommentBubbleProps) {
  const { typed, isTyping } = useTypewriter(slide.description, {
    enabled: !reduced,
  });

  /* Circular autoplay progress ring. r=49 in a 100-unit viewBox. */
  const RING_RADIUS = 49;
  const CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
  const dashOffset = useTransform(
    progress,
    [0, 1],
    [CIRCUMFERENCE, 0]
  );

  return (
    <div className={`relative ${className}`}>
      {/* ── MOBILE DESIGN: Premium Dark Luxury Editorial Glass Card ─────── */}
      <div className="lg:hidden w-full max-w-sm mx-auto px-3">
        <div className="relative overflow-hidden rounded-xl border border-primary/30 bg-black/85 p-5 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] text-center flex flex-col items-center">
          {/* Subtle top gold accent line */}
          <span
            aria-hidden="true"
            className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] w-20 bg-gradient-to-r from-transparent via-primary to-transparent"
          />

          {/* Accent Word */}
          <motion.span
            key={`mob-word-${slideKey}`}
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
            className="block font-serif text-3xl font-bold italic text-primary tracking-tight"
          >
            {slide.accentWord}
          </motion.span>

          {/* Subheading */}
          <motion.span
            key={`mob-sub-${slideKey}`}
            initial={reduced ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08, ease: EASE_OUT_EXPO }}
            className="mt-1 block font-sans text-[10px] font-bold uppercase tracking-[0.25em] text-white/70"
          >
            {slide.subheading}
          </motion.span>

          {/* Divider */}
          <span aria-hidden="true" className="my-2.5 block h-px w-8 bg-primary/40" />

          {/* Body Copy */}
          <div className="relative w-full font-sans text-xs font-normal leading-relaxed text-white/85">
            <span className="invisible block" aria-hidden="true">
              {slide.description}
            </span>
            <p className="absolute inset-0">
              {reduced ? slide.description : typed}
              {!reduced && isTyping && (
                <span className="ml-px inline-block h-[1em] w-px translate-y-[0.15em] animate-pulse bg-primary align-middle" />
              )}
            </p>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-center gap-1.5">
            {Array.from({ length: total }).map((_, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={index}
                  type="button"
                  aria-current={isActive}
                  aria-label={`Highlight ${index + 1} of ${total}: ${HERO_SLIDES[index].accentWord}`}
                  onClick={() => onSelect(index)}
                  className={`
                    h-2 rounded-full transition-all duration-300 ease-out
                    ${isActive ? "w-6 bg-primary" : "w-2 bg-white/20 hover:bg-white/40"}
                  `}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* ── DESKTOP DESIGN: Gold Circle Disc (Original) ───────────────────── */}
      <div className="hidden lg:block">
        {/* ── Progress ring ── */}
        {!reduced && (
          <svg
            aria-hidden="true"
            viewBox="0 0 100 100"
            className="pointer-events-none absolute -inset-[6px] h-[calc(100%+12px)] w-[calc(100%+12px)] -rotate-90"
          >
            <circle
              cx="50"
              cy="50"
              r={RING_RADIUS}
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-white/10"
            />
            <motion.circle
              cx="50"
              cy="50"
              r={RING_RADIUS}
              fill="none"
              stroke="currentColor"
              strokeWidth="0.7"
              strokeLinecap="round"
              className="text-primary/70"
              strokeDasharray={CIRCUMFERENCE}
              style={{ strokeDashoffset: dashOffset }}
            />
          </svg>
        )}

        {/* ── The disc itself ── */}
        <div
          className="
            relative flex aspect-square w-[clamp(320px,26vw,404px)] select-none
            flex-col items-center justify-center rounded-full
            bg-primary px-[10%] text-center text-black
            shadow-[0_30px_80px_-14px_rgba(0,0,0,0.75),0_0_90px_-18px_rgba(201,162,74,0.55)]
          "
        >
          {/* Inner bevel */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-white/25"
          />

          {/* Beak — points RIGHT on desktop */}
          <span
            aria-hidden="true"
            className="
              absolute right-0 top-1/2 h-5 w-4
              translate-x-[95%] -translate-y-1/2
              [clip-path:polygon(100%_50%,0_0,0_100%)] bg-primary
            "
          />

          {/* ── Slide content ── */}
          <div
            className="flex w-full max-w-[82%] flex-col items-center"
            aria-live="polite"
            aria-atomic="true"
          >
            {/* Accent word */}
            <motion.span
              key={`word-dt-${slideKey}`}
              initial={reduced ? false : { opacity: 0, y: 14, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.55, ease: EASE_OUT_EXPO }}
              className="
                block font-serif text-[clamp(2.9rem,3.4vw,3.75rem)] font-bold italic
                leading-[0.95] tracking-tight text-black
              "
            >
              {slide.accentWord}
            </motion.span>

            {/* Kicker */}
            <motion.span
              key={`sub-dt-${slideKey}`}
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08, ease: EASE_OUT_EXPO }}
              className="
                mt-1.5 block font-sans text-[11px] font-bold uppercase
                tracking-[0.24em] text-black/70
              "
            >
              {slide.subheading}
            </motion.span>

            {/* Hairline rule */}
            <span
              aria-hidden="true"
              className="my-2 block h-px w-7 bg-black/25"
            />

            {/* Typed body copy */}
            <p
              className="
                relative w-full font-sans text-[12.5px] font-medium
                leading-relaxed text-black/85
              "
            >
              <span className="invisible" aria-hidden="true">
                {slide.description}
              </span>
              <span className="absolute inset-0">
                {reduced ? slide.description : typed}
                {!reduced && isTyping && (
                  <span className="ml-px inline-block h-[1em] w-px translate-y-[0.15em] animate-pulse bg-black/70 align-middle" />
                )}
              </span>
            </p>
          </div>

          {/* ── Pagination ── */}
          <div
            aria-label="Founder highlights"
            className="mt-4 flex items-center justify-center gap-2"
          >
            {Array.from({ length: total }).map((_, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={index}
                  type="button"
                  aria-current={isActive}
                  aria-label={`Highlight ${index + 1} of ${total}: ${HERO_SLIDES[index].accentWord}`}
                  onClick={() => onSelect(index)}
                  className={`
                    h-2.5 rounded-full transition-all duration-500 ease-out
                    focus-visible:outline focus-visible:outline-2
                    focus-visible:outline-offset-2 focus-visible:outline-black
                    ${isActive ? "w-7 bg-black" : "w-2.5 bg-black/25 hover:bg-black/55"}
                  `}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

export function FounderHero() {
  const reduced = useReducedMotion();
  const pageVisible = usePageVisible();

  const [activeSlide, setActiveSlide] = useState(0);
  const [interacting, setInteracting] = useState(false); // hover / focus / drag

  const stageRef = useRef<HTMLDivElement>(null);
  const total = HERO_SLIDES.length;
  const currentSlide = HERO_SLIDES[activeSlide];

  /* ── Autoplay ─────────────────────────────────────────────────────────
     A single motion value (0 → 1) drives BOTH the progress ring and the
     advance. One clock = ring and slide can never desync.                */
  const progress = useMotionValue(0);
  const autoplayPaused = reduced || interacting || !pageVisible;

  const goTo = useCallback(
    (index: number) => {
      progress.set(0);
      setActiveSlide(((index % total) + total) % total);
    },
    [progress, total]
  );

  useAnimationFrame((_, delta) => {
    if (autoplayPaused) return;
    const next = progress.get() + delta / SLIDE_DURATION_MS;
    if (next >= 1) {
      progress.set(0);
      setActiveSlide((i) => (i + 1) % total);
    } else {
      progress.set(next);
    }
  });

  /* ── Keyboard control on the stage ───────────────────────────────────── */
  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goTo(activeSlide + 1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        goTo(activeSlide - 1);
      }
    },
    [activeSlide, goTo]
  );

  /* ── Swipe control (touch) ───────────────────────────────────────────── */
  const touchStartX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 48) goTo(activeSlide + (dx < 0 ? 1 : -1));
    touchStartX.current = null;
  };

  /* ── Scroll-driven 3D camera ─────────────────────────────────────────
     The stage enters tilted back on X, slightly small and dimmed, then
     "docks" into place as it reaches the viewport centre. Springs remove
     any 1:1 scroll stickiness.                                          */
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start end", "center center"],
  });
  const dock = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.5,
    restDelta: 0.0005,
  });

  const stageRotateX = useTransform(dock, [0, 1], [14, 0]);
  const stageScale = useTransform(dock, [0, 1], [0.9, 1]);
  const stageY = useTransform(dock, [0, 1], [72, 0]);
  const stageOpacity = useTransform(dock, [0, 0.45, 1], [0, 0.85, 1]);

  /* Portrait parallax runs across the WHOLE pass-through, not just the dock. */
  const { scrollYProgress: passThrough } = useScroll({
    target: stageRef,
    offset: ["start end", "end start"],
  });
  const portraitY = useSpring(
    useTransform(passThrough, [0, 1], ["-7%", "7%"]),
    { stiffness: 80, damping: 26, mass: 0.6 }
  );
  const portraitScale = useTransform(passThrough, [0, 0.5, 1], [1.14, 1.06, 1.14]);

  /* The blurred ambient field drifts the OPPOSITE way and slower — that
     counter-motion is what makes the single canvas read as having depth. */
  const ambientY = useSpring(
    useTransform(passThrough, [0, 1], ["4%", "-4%"]),
    { stiffness: 60, damping: 28, mass: 0.8 }
  );

  /* Pointer tilt layered on top of the scroll camera. */
  const tilt = usePointerTilt(reduced);
  const tiltY = useTransform(tilt.x, [-1, 1], [-5, 5]);
  const tiltX = useTransform(tilt.y, [-1, 1], [3.5, -3.5]);
  const glareX = useTransform(tilt.x, [-1, 1], [30, 70]);
  const glareY = useTransform(tilt.y, [-1, 1], [25, 75]);
  // Hoisted to the top level — hooks must never sit inside conditional JSX.
  const glareBackground = useTransform(
    [glareX, glareY],
    ([gx, gy]: number[]) =>
      `radial-gradient(420px circle at ${gx}% ${gy}%, #ffffff, transparent 62%)`
  );

  /* Static values when reduced motion is on — no transforms at all. */
  const stageStyle = reduced
    ? undefined
    : {
      rotateX: stageRotateX,
      scale: stageScale,
      y: stageY,
      opacity: stageOpacity,
      transformStyle: "preserve-3d" as const,
    };

  const innerTiltStyle = reduced
    ? undefined
    : { rotateX: tiltX, rotateY: tiltY, transformStyle: "preserve-3d" as const };

  /* Shared entrance transition factory to keep the masthead cascade tidy. */
  const rise = (delay: number) => ({
    initial: reduced ? false : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.85, delay, ease: EASE_OUT_EXPO },
  });

  return (
    <section
      id="overview"
      className="
        relative overflow-hidden border-b border-white/10 bg-[#0a0a0a] text-white
        pb-16 pt-28 sm:pt-36 md:pb-24 md:pt-40
      "
    >
      {/* ── Ambient background: architectural dot grid + gold bloom ──────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "radial-gradient(#ffffff 1px, transparent 1px), radial-gradient(#c9a24a 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          backgroundPosition: "0 0, 16px 16px",
        }}
      />
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute left-1/2 top-[38%] h-[520px] w-[520px]
          -translate-x-1/2 rounded-full bg-primary/10 blur-[130px]
        "
      />

      <div className="relative z-10 mx-auto max-w-7xl space-y-8 px-4 sm:px-6 md:space-y-12 md:px-12">
        {/* ══════════════ MASTHEAD ══════════════ */}
        <header className="space-y-3 text-center">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
          >
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.35em] text-primary sm:text-xs">
              FOUNDER &amp; EXECUTIVE ADVISOR // PROVENANCE
            </span>
          </motion.div>

          <motion.h1
            {...rise(0.12)}
            className="
              font-serif text-4xl uppercase leading-none tracking-tight text-white
              sm:text-6xl md:text-7xl lg:text-8xl
            "
          >
            Manav Chandak
          </motion.h1>

          <motion.p
            {...rise(0.26)}
            className="
              font-sans text-[11px] font-light uppercase tracking-[0.25em]
              text-white/60 sm:text-xs md:text-sm
            "
          >
            Hospitality Entrepreneur &bull; Third Generation Operator &bull;
            Strategic Advisor
          </motion.p>
        </header>

        {/* ══════════════ HAIRLINE SUBNAV ══════════════
            Now visible on mobile too — it scrolls horizontally instead of
            being hidden, with edge fades so the overflow reads intentional. */}
        <motion.nav
          aria-label="Founder page sections"
          initial={reduced ? false : { opacity: 0, scaleX: 0.96 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.36, ease: EASE_OUT_EXPO }}
          className="relative border-y border-white/15 py-3"
        >
          <div
            className="
              flex items-center gap-4 overflow-x-auto font-mono text-[10px]
              tracking-[0.22em] text-white/55 [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
              md:justify-between md:gap-0 md:overflow-visible md:text-xs
            "
          >
            {SECTIONS_NAV.map((item, idx) => (
              <React.Fragment key={item.label}>
                <a
                  href={item.href}
                  className="
                    whitespace-nowrap py-1 transition-colors duration-200
                    hover:text-primary focus-visible:text-primary
                    focus-visible:outline-none
                  "
                >
                  {item.label}
                </a>
                {idx < SECTIONS_NAV.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="hidden select-none text-white/20 md:inline"
                  >
                    |
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
          {/* Right edge fade, mobile only */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[#0a0a0a] to-transparent md:hidden"
          />
        </motion.nav>

        {/* ══════════════ 3D STAGE ══════════════
            Outer div = the camera (perspective owner).
            Inner motion.div = the object being rotated.                   */}
        <div style={{ perspective: reduced ? undefined : 1500 }}>
          <motion.div
            ref={stageRef}
            style={stageStyle}
            onPointerMove={tilt.onPointerMove}
            onPointerLeave={() => {
              tilt.onPointerLeave();
              setInteracting(false);
            }}
            onPointerEnter={() => setInteracting(true)}
            onFocusCapture={() => setInteracting(true)}
            onBlurCapture={() => setInteracting(false)}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            onKeyDown={onKeyDown}
            tabIndex={0}
            role="group"
            aria-roledescription="carousel"
            aria-label="Founder highlights — use arrow keys to change slide"
            className="
              relative overflow-hidden rounded-sm border border-white/15 bg-[#0a0a0a]
              shadow-[0_40px_110px_-28px_rgba(0,0,0,0.9)]
              focus-visible:outline focus-visible:outline-1
              focus-visible:outline-offset-4 focus-visible:outline-primary/60
            "
          >
            <motion.div style={innerTiltStyle} className="relative isolate">
              {/* Architectural corner calipers */}
              {(
                [
                  "left-0 top-0 border-l border-t",
                  "right-0 top-0 border-r border-t",
                  "bottom-0 left-0 border-b border-l",
                  "bottom-0 right-0 border-b border-r",
                ] as const
              ).map((pos) => (
                <span
                  key={pos}
                  aria-hidden="true"
                  className={`absolute z-40 h-3.5 w-3.5 border-primary/60 ${pos}`}
                />
              ))}

              {/* Pointer glare — a soft specular sweep that follows the cursor */}
              {!reduced && (
                <motion.span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-40 opacity-[0.07] mix-blend-screen"
                  style={{ background: glareBackground }}
                />
              )}

              {/*
                ══ ONE CONTINUOUS CANVAS ══
                The card is no longer two boxes sitting next to each other.
                It is a single photographic field built from three stacked
                layers of the SAME image, so the tones match perfectly and
                there is no seam anywhere:

                  L0  AMBIENT   — the photo, full-bleed, scaled + blurred.
                                  This is what paints the left half, so the
                                  background behind the comment box is the
                                  photograph itself, not flat #121212.
                  L1  SUBJECT   — the photo again, sharp, anchored right and
                                  feathered on its left edge with a mask so it
                                  dissolves into L0 instead of cutting.
                  L2  SCRIM     — a directional darkening pass that carves a
                                  readable zone under the comment box.

                Content then floats on top; the grid only positions it and
                never slices the image.
              */}

              {/* ── L0 · AMBIENT FIELD ────────────────────────────────── */}
              <div
                aria-hidden="true"
                className="absolute inset-0 overflow-hidden rounded-sm"
              >
                <motion.div
                  className="absolute -inset-[12%]"
                  style={reduced ? undefined : { y: ambientY }}
                >
                  <Image
                    src="/images/founder/founder_hero_portrait.png"
                    alt=""
                    fill
                    priority
                    sizes="100vw"
                    aria-hidden="true"
                    className="scale-110 object-cover object-center opacity-55 blur-[38px] grayscale"
                  />
                </motion.div>
                {/* Tone-lock so the ambient field never washes out to grey */}
                <span className="absolute inset-0 bg-[#0a0a0a]/45" />
              </div>

              {/* ── L1 · SHARP SUBJECT, ANCHORED RIGHT ────────────────── */}
              {/*
                NOTE ON THE MASK: it is applied ONLY from lg up.
                On mobile the plate is full-bleed, so feathering its left edge
                would punch a hole in the photo and expose the blurred ambient
                layer underneath — which is exactly what it did before.
              */}
              <div
                className="
                  absolute inset-y-0 right-0 w-full overflow-hidden
                  [mask-image:none]
                  lg:w-[var(--plate-w)] lg:[--focal:var(--focal-lg)]
                  lg:[-webkit-mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.35)_14%,#000_40%)]
                  lg:[mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.35)_14%,#000_40%)]
                "
                style={
                  {
                    "--plate-w": SUBJECT_PLATE_WIDTH,
                    "--focal": SUBJECT_FOCAL_MOBILE,
                    "--focal-lg": SUBJECT_FOCAL_DESKTOP,
                    transform: reduced ? undefined : "translateZ(24px)",
                  } as React.CSSProperties
                }
              >
                <motion.div
                  className="absolute inset-0"
                  style={
                    reduced ? undefined : { y: portraitY, scale: portraitScale }
                  }
                >
                  <Image
                    src="/images/founder/founder_hero_portrait.png"
                    alt="Manav Chandak — Founder & Lead Advisor, THE DCO"
                    fill
                    priority
                    sizes="(min-width: 1024px) 58vw, 100vw"
                    className="object-cover object-[var(--focal)] grayscale contrast-[1.08]"
                  />
                </motion.div>
              </div>

              {/* ── L2 · DIRECTIONAL SCRIM ────────────────────────────── */}
              {/* Mobile: darkens upward from the base so the stacked bubble
                  sits on solid tone. Desktop: darkens leftward. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-10 lg:hidden"
                style={{
                  backgroundImage:
                    "linear-gradient(to top, #0a0a0a 0%, rgba(10,10,10,0.92) 34%, rgba(10,10,10,0.35) 62%, transparent 100%)",
                }}
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-10 hidden lg:block"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #0a0a0a 0%, rgba(10,10,10,0.9) 22%, rgba(10,10,10,0.42) 40%, transparent 58%)",
                }}
              />
              {/* Soft edge vignette to seat the whole canvas in the frame */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-10"
                style={{
                  boxShadow: "inset 0 0 120px 24px rgba(10,10,10,0.55)",
                }}
              />

              {/* ── CONTENT ──────────────────────────────────────────── */}
              <div
                className="
                  relative z-20 grid grid-cols-1
                  grid-rows-[minmax(clamp(260px,50vw,340px),1fr)_auto]
                  [transform-style:preserve-3d]
                  lg:h-[clamp(540px,46vw,620px)] lg:grid-cols-2 lg:grid-rows-1
                  lg:items-center
                "
              >
                {/* Mobile-only breathing room that keeps the face clear of
                    the bubble. Collapses entirely at lg. */}
                <div aria-hidden="true" className="lg:hidden" />

                {/* Comment box — left column on desktop, lower band on mobile */}
                <div
                  className="
                    flex w-full items-center justify-center px-2 pb-6 pt-2
                    lg:h-full lg:justify-center lg:px-8 lg:py-0 xl:px-12
                  "
                  style={{ transform: reduced ? undefined : "translateZ(70px)" }}
                >
                  <CommentBubble
                    slide={currentSlide}
                    slideKey={activeSlide}
                    activeIndex={activeSlide}
                    total={total}
                    progress={progress}
                    reduced={reduced}
                    onSelect={goTo}
                  />
                </div>
              </div>

              {/* Metadata tag — top-right on mobile (the bubble owns the
                  bottom band there), bottom-right from lg up. */}
              <div
                className="
                  absolute right-4 top-4 z-30 border border-white/15 bg-black/70
                  px-3 py-1.5 font-mono text-[9px] font-medium uppercase
                  tracking-widest text-primary backdrop-blur-md
                  sm:text-[10px] lg:bottom-6 lg:right-6 lg:top-auto
                "
              >
                MANAV CHANDAK
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default FounderHero;