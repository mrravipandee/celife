"use client";

import React, { useState, useEffect, useRef, Component, ErrorInfo } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useIsDesktop } from "@/lib/hooks/use-is-desktop";

// ─── Static Fallback Image (Brand Aligned) ──────────────────────────────────

function FallbackImage() {
  return (
    <div className="absolute inset-0 z-0">
      <Image
        // CHANGED: Replaced hotel-lobby with a botanical/clinical image
        src="/images/hero/botanical-extract.jpg"
        alt="Celife Botanical Formulations"
        fill
        sizes="100vw"
        priority
        className="object-cover brightness-105"
      />
      {/* Soft overlay to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FDFDFD]/80 via-transparent to-[#FDFDFD]/90" />
    </div>
  );
}

// ─── WebGL Error Boundary ────────────────────────────────────────────────────

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class WebGLErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn("HeroCanvas WebGL fallback activated due to render error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// ─── Dynamic Import for Three.js Scene ───────────────────────────────────────

const LazyHeroScene = dynamic(
  () => import("./HeroScene").then((mod) => mod.HeroScene),
  {
    ssr: false,
    loading: () => <FallbackImage />,
  }
);

// ─── WebGL Context Availability Probe ─────────────────────────────────────────

function isWebGLAvailable(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

// ─── Main HeroCanvas Component ───────────────────────────────────────────────

interface HeroCanvasProps {
  children?: React.ReactNode; // ADDED: Allows text overlay
}

export function HeroCanvas({ children }: HeroCanvasProps) {
  const isDesktop = useIsDesktop();
  const preferReduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  const [inView, setInView] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);
  const [webGLSupported] = useState(() => isWebGLAvailable());

  // ... (IntersectionObserver and Page Visibility API remain exactly the same) ...
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !isDesktop || preferReduced) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [isDesktop, preferReduced]);

  useEffect(() => {
    const handleVisibilityChange = () => setTabVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const isActive = inView && tabVisible;
  const showFallback = !isDesktop || preferReduced || !webGLSupported;

  return (
    <div ref={containerRef} className="relative w-full min-h-[85vh] flex items-center overflow-hidden bg-[#FDFDFD]">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        {showFallback ? (
          <FallbackImage />
        ) : (
          <WebGLErrorBoundary fallback={<FallbackImage />}>
            <LazyHeroScene isActive={isActive} />
          </WebGLErrorBoundary>
        )}
      </div>

      {/* Content Overlay Layer */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 py-20 pointer-events-none">
        <div className="pointer-events-auto max-w-2xl">
          {children}
        </div>
      </div>
    </div>
  );
}