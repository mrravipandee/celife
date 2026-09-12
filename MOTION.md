# MOTION RULES & GUIDELINES

This rules document governs all motion, animation, and 3D implementations across this project. Every subsequent task involving animation, interactivity, WebGL, canvas, or scroll effects must adhere strictly to the constraints outlined below.

---

## STACK FACTS

- **Framework**: Next.js 16.3.1 (App Router), React 19.2.8, TypeScript (strict mode).
- **Styling**: Tailwind CSS v4 — the theme configuration lives inside `@theme` in `src/app/globals.css`. There is **NO** `tailwind.config.js` or `tailwind.config.ts`. Never create one.
- **Installed Animation & Motion Libraries**:
  - `gsap` (v3.15.0) + `ScrollTrigger`
  - `@gsap/react` (v2.1.2)
  - `motion` (v13.1.0) — **Always import from `"motion/react"`**, never from `"framer-motion"`.
  - `lenis` (v1.3.26) for smooth scrolling.
- **Brand System**:
  - Background: Black (`#000000`)
  - Foreground: White (`#ffffff`)
  - Accent: Gold (`#c9a24a`)
  - Typography: Serif display = `var(--font-cormorant)` (`Cormorant Garamond`), Sans body = `var(--font-manrope)` (`Manrope`).

---

## HARD RULES

1. **Lenis Owns Scroll**: Never attach a raw `window.addEventListener("scroll", ...)`. Always read scroll position, direction, or progress directly from the Lenis instance or through GSAP `ScrollTrigger`.
2. **GSAP Cleanup & Scoping**: Every GSAP `ScrollTrigger` and timeline must be instantiated inside `useGSAP()` from `@gsap/react` with a scope ref (`{ scope: containerRef }`) to ensure automatic revert on unmount. Do not manage manual cleanup arrays.
3. **Strict Reduced Motion**: Every animated component must check `useReducedMotion()` from `"motion/react"` and immediately render its FINAL state (opacity `1`, `transform: none`, no delays) when true. Reduced motion is **never** "a faster animation" — it is strictly "no animation".
4. **No Pinned `will-change`**: Nothing animates opacity or transform from 0 without removing `will-change` upon animation completion. Never leave a permanent `will-change` property on elements.
5. **Zero Unapproved Dependencies**: No new npm packages without prior explicit user approval.
6. **Server Component Integrity**: Server Components must remain Server Components. When a page or section requires motion, extract **only** the animated sub-tree into an isolated, minimal `"use client"` child component. Never add `"use client"` directly to a `page.tsx` file.
7. **Mobile 3D/Canvas Gate**: All WebGL, Three.js, and heavy Canvas rendering must be gated behind a `768px` min-width viewport check (`window.innerWidth >= 768` or media query) **AND** must provide a real, lightweight static fallback (optimized image or CSS). Never ship Three.js or heavy WebGL canvases to mobile devices.
8. **Primitive Reuse**: Always reuse existing motion primitives from `src/components/motion/` (`Reveal`, `TextReveal`, `LineReveal`, `Stagger`, `ScrollReveal`, `ImageReveal`) before writing a new one. If an existing primitive is close but lacks a feature, extend it via props — do not fork or duplicate it.
9. **Readability & Selectability**: All text content must be completely legible, selectable, and accessible at rest. No animation may leave copy at opacity `< 1`, hidden, or blurred in its resting/final state.
10. **Performance Budget**:
    - Home page Largest Contentful Paint (LCP) must remain under **2.5s** on Fast 3G network throttling.
    - Total JavaScript bundle for the home route must stay under **400kb** gzipped.
    - Report measured bundle/performance impact after each change.

---

## CHANGELOG

| Date | Prompt # | Files Touched | Bundle Delta |
| :--- | :--- | :--- | :--- |
| 2026-08-30 | Prompt 1 | `src/components/animations/SmoothScroll.tsx`, `src/lib/hooks/use-is-desktop.ts`, `src/components/animations/{ImageReveal,TextReveal,Reveal}.tsx` (deleted duplicates) | 0 KB (cleaned duplicate code, no new dependencies) |
| 2026-08-30 | Prompt 2 | `src/components/home/hero/HeroScene.tsx`, `src/components/home/hero/HeroCanvas.tsx`, `src/components/home/Hero.tsx`, `src/components/ui/Container.tsx`, `src/components/effects/WaterRipple.tsx` (deleted) | Initial home bundle: +0 KB (Three.js isolated in 220.4 KB gzipped async chunk loaded on desktop only) |
| 2026-08-30 | Prompt 3 | `src/components/home/{Intro,QuickCredibility,ServicesPreview,HowWeHelp,Philosophy,BrandsVentures,CTA}.tsx`, `src/components/ui/MagneticButton.tsx` | +4.8 KB gzipped across home client modules (zero new dependencies) |
| 2026-08-30 | Prompt 4 | `src/components/projects/{ProjectGrid,ProjectCard,ProjectsHero}.tsx`, `src/app/projects/page.tsx` | +1.6 KB gzipped across projects modules (zero new dependencies) |
| 2026-08-30 | Prompt 5 | `src/components/projects/{ProjectBanner,ProjectHeader,ProjectDetails,ProjectGallery}.tsx`, `src/app/projects/[slug]/page.tsx` | +0.6 KB gzipped across project detail client modules (zero new dependencies) |
| 2026-08-30 | Prompt 6 | `src/components/services/{ServiceList,ServiceBlueprint,ServicesHero,ServicesCTA}.tsx`, `src/app/services/page.tsx` | -7.5 KB gzipped across services client modules (zero new dependencies) |
| 2026-08-30 | Prompt 7 | `src/components/about/{AboutIntro,WhoWeAre,WhatWeUnderstand,HowWeWork,WhyChoose,WhoWeWorkWith,ClosingCTA}.tsx` | +2.7 KB gzipped across about client modules (zero new dependencies) |
| 2026-08-30 | Prompt 8 | `src/components/founder/{FounderHero,ExperienceSummary,AdvisoryApproach,AssociatedVentures,FounderCTA}.tsx` | +3.0 KB gzipped across founder client modules (zero new dependencies) |
| 2026-08-30 | Prompt 9 | `src/components/forms/ContactForm.tsx`, `src/components/contact/{ContactHero,ContactInfo,WhatHappensNext,ContactClosingCTA}.tsx` | +23.8 KB gzipped across contact client modules (zero new dependencies) |
| 2026-08-30 | Prompt 10 | `src/components/blog/{BlogHero,FeaturedArticle,BlogGrid,ReadingProgressBar,BlogBanner,ArticleContent,BlogCTA}.tsx`, `src/app/blog/page.tsx`, `src/app/blog/[slug]/page.tsx` | +38.1 KB gzipped across blog client modules (zero new dependencies) |
| 2026-08-30 | Prompt 11 | `src/components/layout/{Navbar,MobileMenu,Footer,PageTransition}.tsx`, `src/app/layout.tsx` | -39.5 KB gzipped (bundle optimization & tree-shaking across shared client chunks) |

---

## QA LOG (2026-08-30)

### 1. Performance Audit
- **Route First-Load JS (Gzipped)**:
  - `home (/)`: **305.1 KB** (Passes < 400 KB budget, **23.7% under ceiling**)
  - `/about`: **297.0 KB**
  - `/services`: **288.7 KB**
  - `/projects`: **292.3 KB**
  - `/founder`: **296.7 KB**
  - `/contact`: **366.0 KB**
  - `/blog`: **290.6 KB**
- **Three.js Chunk Isolation**: Verified `Three.js` (220.4 KB gzipped) is strictly isolated in its own async chunk (`23ehi702gwxn3.js`) and is loaded exclusively on desktop (`>= 768px`) via `HeroCanvas.tsx`. It appears in **zero** routes' first-load JS.
- **Layout-Triggering Animations**: Verified all continuous scroll animations, hairlines, and parallax effects use GPU-composited `transform` (`scaleX`, `scaleY`, `scale`, `x`, `y`, `rotateX`, `rotateY`, `skewX`) and `opacity`. Layout `height: auto` transitions are restricted exclusively to accordion containers (`ContactForm` validation errors, `ServiceList` deliverable rows) with `AnimatePresence`.
- **Permanent `will-change` Clean-Up**: Audited and removed all permanent `will-change` CSS declarations across 28 component instances.
- **Observer & RAF Clean-Up**:
  - `HowWeWork.tsx`: `IntersectionObserver` disconnected on unmount.
  - `ArticleContent.tsx`: `IntersectionObserver` disconnects on unmount and unobserves elements upon entrance.
  - `SmoothScroll.tsx`: `gsap.ticker.remove(updateTicker)`, `lenis.off("scroll", ...)`, and `lenis.destroy()` on unmount.
  - All GSAP ScrollTriggers scoped inside `useGSAP()` with automatic reversion.

### 2. Correctness Audit
- **Scroll Listeners**: Audited `src/` — zero raw `window.addEventListener("scroll")` calls exist. Fixed legacy `useScrollProgress.ts` to read directly from `useLenis()`.
- **Server Component Integrity**: Verified all public routes (`/`, `/about`, `/services`, `/projects`, `/projects/[slug]`, `/founder`, `/contact`, `/blog`, `/blog/[slug]`) remain 100% Server Components with zero `"use client"` directives in their `page.tsx` files.
- **Incremental Static Regeneration (ISR)**: Verified `export const revalidate = 3600;` on `/projects`, `/projects/[slug]`, `/blog`, and `/blog/[slug]`. Build-time `generateStaticParams()` confirmed operational.
- **Mobile 375px Viewport**: Verified full responsive viewport containment (`overflow-hidden`, touch-safe drag galleries, responsive typography).

### 3. Accessibility Audit
- **Contrast & Legibility**: All text at rest sits at opacity `1.0` and remains selectable in the DOM.
- **Form Error Announcements**: `ContactForm.tsx` validation errors include `role="alert"` and `aria-live="polite"`.
- **Focus Trapping**: `MobileMenu.tsx` traps Tab/Shift-Tab focus inside the active dialog and restores focus to `#mobile-menu-toggle` upon `Escape`.
- **Lightbox Keyboard Navigation**: `ProjectGallery.tsx` supports `Escape` to close and Left/Right Arrow keys for slide navigation.
- **Reduced Motion**: Verified `useReducedMotion()` across all animated components, rendering static final states immediately when enabled.
- **Flashing Thresholds**: Zero animations exceed 3 flashes per second.

