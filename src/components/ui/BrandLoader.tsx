"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";

interface BrandLoaderProps {
  onComplete?: () => void;
  durationMs?: number; // default ~2300ms
}

export function BrandLoader({ onComplete, durationMs = 2300 }: BrandLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isMounted, setIsMounted] = useState(true);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // Lock scroll during loading
    const originalOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    // Progress animation using requestAnimationFrame for 60fps smoothness
    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const rawProgress = Math.min(elapsed / durationMs, 1);

      // Smooth easing (easeOutCubic)
      const easedProgress = Math.min(
        100,
        Math.floor((1 - Math.pow(1 - rawProgress, 3)) * 100)
      );

      setProgress(easedProgress);

      if (rawProgress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        // Complete: small hold at 100%, then trigger smooth exit
        setProgress(100);
        setTimeout(() => {
          setIsExiting(true);
          setTimeout(() => {
            setIsMounted(false);
            // Restore scroll
            document.body.style.overflow = originalOverflow;
            document.documentElement.style.overflow = originalHtmlOverflow;
            window.dispatchEvent(new Event("resize"));
            onComplete?.();
          }, 500); // 500ms fade/slide exit
        }, 200);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      document.body.style.overflow = originalOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, [durationMs, onComplete]);

  if (!isMounted) return null;

  // Dynamic phase label based on progress
  let phaseText = "Extracting standardized bioactives...";
  if (progress > 35 && progress <= 70) {
    phaseText = "Harmonizing Ayurvedic botanical synergy...";
  } else if (progress > 70 && progress <= 95) {
    phaseText = "Formulating evidence-guided wellness...";
  } else if (progress > 95) {
    phaseText = "Welcome to Celife Health Solutions";
  }

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading Celife Health Solutions"
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#FAF8F5] select-none transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isExiting
          ? "opacity-0 -translate-y-5 scale-[0.99] pointer-events-none blur-[2px]"
          : "opacity-100 translate-y-0 scale-100"
      }`}
    >
      {/* Ambient Botanical Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,_rgba(18,60,45,0.06)_0%,_rgba(201,162,74,0.04)_45%,_transparent_75%)] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center px-6 max-w-sm w-full text-center">
        {/* Animated Botanical Emblem */}
        <div className="relative w-16 h-16 mb-5 flex items-center justify-center">
          {/* Subtle breathing glow */}
          <div className="absolute inset-0 rounded-full bg-[#123C2D]/5 blur-lg animate-pulse" />

          <svg
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-14 h-14 relative z-10"
            aria-hidden="true"
          >
            {/* Outer botanical curve */}
            <path
              d="M18 3C18 3 7 9 7 20C7 26.6274 12.3726 32 19 32C25.6274 32 31 26.6274 31 20C31 9 20 3 20 3"
              stroke="#123C2D"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-[drawStroke_1.4s_ease-out_forwards]"
              style={{
                strokeDasharray: 90,
                strokeDashoffset: 90,
              }}
            />
            {/* Inner vascular leaf stems */}
            <path
              d="M18 10V27M18 16L23 13M18 21L13 18"
              stroke="#68756D"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="animate-[drawStem_1.1s_ease-out_0.3s_forwards]"
              style={{
                strokeDasharray: 35,
                strokeDashoffset: 35,
              }}
            />
            {/* Terracotta Clay Accent Dot */}
            <circle
              cx="18"
              cy="8"
              r="2.8"
              fill="#C9A24A"
              className="animate-[popDot_0.5s_cubic-bezier(0.34,1.56,0.64,1)_0.6s_forwards]"
              style={{
                transformOrigin: "18px 8px",
                opacity: 0,
                transform: "scale(0.5)",
              }}
            />
          </svg>
        </div>

        {/* Brand Logo */}
        <div className="mb-2 relative">
          <Image
            src="/celife-brand.png"
            alt="Celife Health Solutions"
            width={180}
            height={55}
            priority
            className="h-10 sm:h-11 w-auto object-contain drop-shadow-sm"
          />
        </div>

        {/* Brand Tagline */}
        <p className="text-[10px] sm:text-[11px] font-sans font-semibold uppercase tracking-[0.28em] text-[#68756D] mb-7">
          Botanical & Nutraceutical Formulations
        </p>

        {/* Luxury Progress Bar & Percentage */}
        <div className="w-64 sm:w-72 flex flex-col items-center gap-2.5">
          {/* Progress Track */}
          <div className="w-full h-[3px] bg-[#E3E8E3] rounded-full overflow-hidden relative shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-[#123C2D] via-[#C9A24A] to-[#123C2D] rounded-full transition-all duration-75 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Micro Status & Numeric Percentage */}
          <div className="w-full flex items-center justify-between text-[11px] font-sans font-medium text-[#7A8780] pt-0.5">
            <span className="text-left transition-opacity duration-300 text-[10.5px] sm:text-[11px] text-[#637169]">
              {phaseText}
            </span>
            <span className="font-mono text-[#123C2D] font-semibold tabular-nums shrink-0 ml-2">
              {progress}%
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes drawStroke {
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes drawStem {
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes popDot {
          0% {
            opacity: 0;
            transform: scale(0.5);
          }
          70% {
            opacity: 1;
            transform: scale(1.2);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}

