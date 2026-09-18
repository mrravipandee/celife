"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

interface BrandLoaderProps {
  onComplete?: () => void;
  durationMs?: number; // default ~2200ms
}

export function BrandLoader({ onComplete, durationMs = 2200 }: BrandLoaderProps) {
  const [phase, setPhase] = useState<"enter" | "active" | "exit" | "done">("enter");

  useEffect(() => {
    // Lock scroll while brand loader is active
    const originalOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    // 1. Transition to active state
    const activeTimer = setTimeout(() => {
      setPhase("active");
    }, 150);

    // 2. Trigger exit animation at durationMs
    const exitTimer = setTimeout(() => {
      setPhase("exit");
    }, durationMs);

    // 3. Cleanup & unmount after exit transition completes (600ms)
    const doneTimer = setTimeout(() => {
      setPhase("done");
      document.body.style.overflow = originalOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      window.dispatchEvent(new Event("resize"));
      onComplete?.();
    }, durationMs + 650);

    return () => {
      clearTimeout(activeTimer);
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
      document.body.style.overflow = originalOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, [durationMs, onComplete]);

  if (phase === "done") return null;

  const isExiting = phase === "exit";

  return (
    <div
      role="status"
      aria-label="Celife Health Solutions"
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#FAF8F5] select-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isExiting
          ? "opacity-0 -translate-y-5 scale-[1.02] pointer-events-none blur-[4px]"
          : "opacity-100 translate-y-0 scale-100"
      }`}
    >
      {/* Ambient Radial Bloom */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(18,60,45,0.06)_0%,_rgba(201,162,74,0.04)_40%,_transparent_70%)] pointer-events-none animate-pulse" />

      {/* Center Brand Showcase */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        {/* Soft Golden/Botanical Aura behind logo */}
        <div className="absolute -inset-8 rounded-full bg-gradient-to-tr from-[#123C2D]/5 via-[#C9A24A]/10 to-transparent blur-2xl pointer-events-none" />

        {/* Logo Container with Smooth Entrance & Shimmer Light Sweep */}
        <div className="relative overflow-hidden py-2 px-4 rounded-xl">
          <div className="animate-[logoEnter_0.9s_cubic-bezier(0.16,1,0.3,1)_forwards]">
            <Image
              src="/celife-brand.png"
              alt="Celife Health Solutions"
              width={260}
              height={85}
              priority
              className="h-14 sm:h-16 md:h-20 w-auto object-contain drop-shadow-[0_2px_12px_rgba(18,60,45,0.08)]"
            />
          </div>

          {/* Luxury Light Sweep Shimmer across the logo */}
          <div
            className="absolute inset-0 -translate-x-full animate-[shimmerSweep_2.2s_infinite_ease-in-out_0.4s] pointer-events-none bg-gradient-to-r from-transparent via-white/50 to-transparent"
            style={{ transform: "skewX(-25deg)" }}
          />
        </div>

        {/* Elegant Minimal Brand Tagline */}
        <div className="mt-5 overflow-hidden">
          <p className="text-[10px] sm:text-[11.5px] font-sans font-semibold uppercase tracking-[0.32em] text-[#637169] opacity-0 animate-[fadeUp_0.8s_cubic-bezier(0.16,1,0.3,1)_0.35s_forwards]">
            Botanical & Nutraceutical Formulations
          </p>
        </div>

        {/* Subtle breathing accent line */}
        <div className="mt-4 w-12 h-[1.5px] bg-gradient-to-r from-transparent via-[#C9A24A]/60 to-transparent opacity-0 animate-[fadeUp_0.8s_ease-out_0.55s_forwards]" />
      </div>

      <style jsx>{`
        @keyframes logoEnter {
          0% {
            opacity: 0;
            transform: scale(0.9) translateY(8px);
            filter: blur(8px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
            filter: blur(0px);
          }
        }

        @keyframes shimmerSweep {
          0% {
            transform: translateX(-150%) skewX(-25deg);
          }
          45%, 100% {
            transform: translateX(200%) skewX(-25deg);
          }
        }

        @keyframes fadeUp {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}


