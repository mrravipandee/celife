"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Reveal } from "@/components/motion/Reveal";
import { LineReveal } from "@/components/motion/LineReveal";
import { HeroCanvas } from "@/components/home/hero/HeroCanvas";

/* -------------------------------------------------------------------------- */
/*  Easing tokens — a single, deliberate curve family used everywhere below.  */
/*  Slightly more "settled" than the default framer eases: quick departure,   */
/*  long, confident arrival. Reads expensive rather than bouncy.              */
/* -------------------------------------------------------------------------- */
const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const EASE_INOUT = [0.65, 0, 0.35, 1] as const;

/* -------------------------------------------------------------------------- */
/*  MagneticLink — CTA that leans toward the cursor and carries a soft glow.  */
/*  Disabled entirely under reduced motion (falls back to a static link).    */
/* -------------------------------------------------------------------------- */
function MagneticLink({
  href,
  children,
  variant,
  preferReduced,
}: {
  href: string;
  children: React.ReactNode;
  variant: "solid" | "outline";
  preferReduced: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });
  const [hover, setHover] = useState(false);

  function handleMove(e: React.MouseEvent<HTMLAnchorElement>) {
    if (preferReduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set(relX * 0.28);
    y.set(relY * 0.4);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
    setHover(false);
  }

  const base =
    "relative flex w-full sm:w-auto items-center justify-center text-xs uppercase tracking-[0.22em] font-medium px-8 py-4 md:py-5 text-center overflow-hidden";

  const solid = "bg-primary text-black font-semibold";
  const outline = "border border-white/35 text-white hover:border-primary";

  return (
    <motion.div
      style={preferReduced ? {} : { x: springX, y: springY }}
      className="w-full sm:w-auto"
    >
      <Link
        ref={ref}
        href={href}
        onMouseMove={handleMove}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={handleLeave}
        className={`${base} ${variant === "solid" ? solid : outline} transition-colors duration-300`}
      >
        {/* Cursor-tracking glow, solid variant only */}
        {variant === "solid" && !preferReduced && (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full mix-blend-overlay"
            animate={{ opacity: hover ? 0.5 : 0 }}
            transition={{ duration: 0.3 }}
            style={{
              background:
                "radial-gradient(120px circle at 50% 50%, white, transparent 70%)",
            }}
          />
        )}

        {/* Outline variant: fill sweeps in from the left on hover */}
        {variant === "outline" && (
          <motion.span
            aria-hidden
            className="absolute inset-0 bg-primary/10"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: hover && !preferReduced ? 1 : 0 }}
            transition={{ duration: 0.45, ease: EASE_OUT }}
            style={{ transformOrigin: "left center" }}
          />
        )}

        <span className="relative z-10">{children}</span>
      </Link>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  CurtainLine — a headline line that reveals by rising out from behind a    */
/*  hard mask edge, rather than fading. This is the primary "premium" beat.  */
/* -------------------------------------------------------------------------- */
function CurtainLine({
  children,
  delay,
  className = "",
  preferReduced,
}: {
  children: React.ReactNode;
  delay: number;
  className?: string;
  preferReduced: boolean;
}) {
  return (
    <span className="block overflow-hidden">
      <motion.span
        className={`block ${className}`}
        initial={preferReduced ? false : { y: "115%" }}
        animate={preferReduced ? {} : { y: "0%" }}
        transition={{ duration: 1.1, delay, ease: EASE_OUT }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  CornerFrame — the signature element. Four brackets that draw themselves   */
/*  in around the hero's content column, echoing a spec sheet / floor plan —  */
/*  a quiet nod to the design + build side of hospitality advisory.          */
/* -------------------------------------------------------------------------- */
function CornerFrame({ preferReduced }: { preferReduced: boolean }) {
  const stroke = "rgba(212, 175, 120, 0.55)"; // matches --primary gold family
  const corners = [
    { top: 0, left: 0, rotate: 0 },
    { top: 0, right: 0, rotate: 90 },
    { bottom: 0, right: 0, rotate: 180 },
    { bottom: 0, left: 0, rotate: 270 },
  ] as const;

  return (
    <div className="pointer-events-none absolute inset-4 md:inset-8 z-10 hidden sm:block">
      {corners.map((c, i) => (
        <motion.svg
          key={i}
          width="28"
          height="28"
          viewBox="0 0 28 28"
          className="absolute"
          style={{
            top: "top" in c ? c.top : undefined,
            bottom: "bottom" in c ? c.bottom : undefined,
            left: "left" in c ? c.left : undefined,
            right: "right" in c ? c.right : undefined,
            transform: `rotate(${c.rotate}deg)`,
          }}
        >
          <motion.path
            d="M0 0 H28 M0 0 V28"
            fill="none"
            stroke={stroke}
            strokeWidth="1"
            initial={preferReduced ? false : { pathLength: 0 }}
            animate={preferReduced ? {} : { pathLength: 1 }}
            transition={{ duration: 0.9, delay: 1.5 + i * 0.08, ease: EASE_INOUT }}
          />
        </motion.svg>
      ))}
    </div>
  );
}

export function Hero() {
  const preferReduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // BACKGROUND TRANSFORMS
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  // FOREGROUND TRANSFORMS
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);
  const bottomOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);

  // Heading keeps a gentle scale-in tied to scroll, toned down slightly
  // so it doesn't fight with the new curtain reveal on load.
  const headingScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.08]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100svh] flex flex-col bg-black text-white overflow-hidden"
    >
      {/* Background WebGL Scene / Fallback Image */}
      <motion.div
        className="absolute inset-0 z-0 origin-center"
        style={preferReduced ? {} : { y: bgY, scale: bgScale }}
      >
        <HeroCanvas />

        <div className="absolute inset-0 bg-black/30 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/85 pointer-events-none" />
        {/* Soft radial ambient density behind left-aligned copy */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 25% 45%, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.15) 50%, transparent 80%)",
          }}
        />
      </motion.div>

      {/* Film grain — subtle texture so the black reads as material, not a hex value */}
      {!preferReduced && (
        <svg className="absolute inset-0 z-[1] w-full h-full opacity-[0.05] mix-blend-overlay pointer-events-none">
          <filter id="hero-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#hero-grain)" />
        </svg>
      )}

      {/* Hero Content */}
      <motion.div
        className="relative z-10 flex-1 flex items-center"
        style={preferReduced ? {} : { opacity: contentOpacity, y: contentY }}
      >
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 pt-28 pb-10 md:pt-32 md:pb-12">
          <div className="max-w-4xl">
            {/* Eyebrow */}
            <div className="space-y-4">
              <Reveal delay={0.2} duration={0.8}>
                <div className="text-sm md:text-base font-serif tracking-[0.25em] text-primary">
                  THE DCO
                </div>
              </Reveal>

              <LineReveal
                delay={0.35}
                className="bg-primary/70 w-16 md:w-28"
              />

              <Reveal delay={0.45} duration={0.8}>
                <div className="text-xs uppercase tracking-[0.25em] text-white/75 font-medium">
                  Hospitality Advisory Firm
                </div>
              </Reveal>
            </div>

            {/* Main Heading — curtain reveal per line, gentle scroll-scale on top */}
            <motion.h1
              style={
                preferReduced
                  ? {}
                  : {
                    scale: headingScale,
                    transformOrigin: "left center",
                    willChange: "transform",
                  }
              }
              className="
                mt-8
                md:mt-10
                text-[2.55rem]
                leading-[1.08]
                sm:text-5xl
                md:text-6xl
                lg:text-7xl
                font-serif
                tracking-tight
              "
            >
              <CurtainLine delay={0.55} preferReduced={preferReduced} className="text-white">
                Building Better Hotels.
              </CurtainLine>

              <CurtainLine
                delay={0.7}
                preferReduced={preferReduced}
                className="hero-shine-text mt-1 md:mt-2"
              >
                Creating Profitable Restaurants.
              </CurtainLine>
            </motion.h1>

            {/* Supporting Text */}
            <Reveal delay={0.95} duration={0.9}>
              <p
                className="
                  mt-7
                  md:mt-8
                  text-base
                  md:text-lg
                  text-white/80
                  max-w-2xl
                  font-sans
                  leading-[1.65]
                "
              >
                We handle strategy, operations and profitability, from the first idea to daily execution, for hotels, restaurants, cafés and resorts.
              </p>
            </Reveal>

            {/* CTAs — magnetic, with distinct hover language per variant */}
            <Reveal delay={1.15} duration={0.9}>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-8 md:mt-10">
                <MagneticLink href="/contact" variant="solid" preferReduced={preferReduced}>
                  Book a Consultation
                </MagneticLink>
                <MagneticLink href="/services/consulting-services" variant="outline" preferReduced={preferReduced}>
                  View Our Services
                </MagneticLink>
              </div>
            </Reveal>
          </div>
        </div>
      </motion.div>

      {/* Bottom Information */}
      <motion.div
        style={preferReduced ? {} : { opacity: bottomOpacity }}
        className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pb-6 md:pb-8"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-5 text-white/70 text-xs">
          <Reveal delay={1.3} duration={0.8}>
            <div className="uppercase tracking-[0.18em] leading-relaxed text-xs text-white/70 font-sans">
              Based in Maharashtra.
              <br />
              Advising hospitality businesses across India.
            </div>
          </Reveal>

          {/* Scroll cue — a drawing line instead of a pinging dot: calmer,
              reads as "measured" rather than "look at me" */}
          <Reveal delay={1.4} duration={0.8}>
            <div className="flex items-center gap-3 uppercase tracking-[0.2em] text-xs text-white/60 font-medium font-sans">
              <span>Scroll Down</span>
              <span className="relative block w-px h-6 bg-white/20 overflow-hidden">
                {!preferReduced && (
                  <motion.span
                    className="absolute left-0 top-0 w-full bg-primary"
                    initial={{ height: "0%", top: "0%" }}
                    animate={{ height: ["0%", "100%", "0%"], top: ["0%", "0%", "100%"] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: EASE_INOUT,
                      delay: 1.6,
                    }}
                  />
                )}
              </span>
            </div>
          </Reveal>
        </div>
      </motion.div>

      {/* Scroll progress bar */}
      {!preferReduced && (
        <motion.div
          className="absolute bottom-0 left-0 h-[2px] bg-primary/70 z-20 origin-left"
          style={{ scaleX: scrollYProgress }}
        />
      )}
    </section>
  );
}