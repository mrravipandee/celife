"use client";

import React, { useState, useEffect, useRef, Component, ErrorInfo } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useIsDesktop } from "@/lib/hooks/use-is-desktop";

// ─── Static Fallback Image ───────────────────────────────────────────────────

function FallbackImage() {
  return (
    <div className="absolute inset-0 z-0">
      <Image
        src="/images/hero/hotel-lobby.jpg"
        alt="THE DCO Luxury Hotel Lobby"
        fill
        sizes="100vw"
        priority
        className="object-cover"
      />
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

export function HeroCanvas() {
  const isDesktop = useIsDesktop();
  const preferReduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  const [inView, setInView] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);
  const [webGLSupported] = useState(() => isWebGLAvailable());

  // IntersectionObserver to pause rendering when hero is scrolled out of viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !isDesktop || preferReduced) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isDesktop, preferReduced]);

  // Page visibility API listener to pause rendering when tab is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      setTabVisible(document.visibilityState === "visible");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Fallback 1: Mobile/Tablet (<768px) -> Zero Three.js JS or WebGL requested
  // Fallback 2: Reduced motion requested -> Render static image immediately
  // Fallback 3: No WebGL support -> Render static image
  if (!isDesktop || preferReduced || !webGLSupported) {
    return <FallbackImage />;
  }

  const isActive = inView && tabVisible;

  return (
    <div ref={containerRef} className="absolute inset-0 z-0">
      <WebGLErrorBoundary fallback={<FallbackImage />}>
        <LazyHeroScene isActive={isActive} />
      </WebGLErrorBoundary>
    </div>
  );
}
