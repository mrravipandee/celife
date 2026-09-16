"use client";

import React, { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface BrandLoaderProps {
  onComplete?: () => void;
}

export function BrandLoader({ onComplete }: BrandLoaderProps) {
  const preferReduced = useReducedMotion();
  const [isExiting, setIsExiting] = useState(false);
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    if (preferReduced) {
      const timer = setTimeout(() => {
        setIsMounted(false);
        onComplete?.();
      }, 100);
      return () => clearTimeout(timer);
    }

    const minTime = 800; // minimum display ms for perceived intention
    const maxTime = 1600; // maximum display cap

    const exitTimer = setTimeout(() => {
      setIsExiting(true);
      const removeTimer = setTimeout(() => {
        setIsMounted(false);
        onComplete?.();
      }, 400); // 400ms exit transition
      return () => clearTimeout(removeTimer);
    }, Math.min(Math.max(minTime, 850), maxTime));

    return () => clearTimeout(exitTimer);
  }, [preferReduced, onComplete]);

  if (!isMounted) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading Celife Health Solutions"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[var(--bone)] transition-all duration-400 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
        isExiting ? "opacity-0 -translate-y-3 pointer-events-none" : "opacity-100 translate-y-0"
      }`}
    >
      <div className="flex flex-col items-center gap-7">
        {/* Animated Botanical Leaf Mark */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          <svg
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
            aria-hidden="true"
          >
            {/* Outer botanical curve with stroke-dash draw */}
            <path
              d="M18 3C18 3 7 9 7 20C7 26.6274 12.3726 32 19 32C25.6274 32 31 26.6274 31 20C31 9 20 3 20 3"
              stroke="var(--forest)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={preferReduced ? "" : "animate-[drawStroke_1.1s_ease-out_forwards]"}
              style={{
                strokeDasharray: 90,
                strokeDashoffset: preferReduced ? 0 : 90,
              }}
            />
            {/* Inner vascular stem */}
            <path
              d="M18 10V27M18 16L23 13M18 21L13 18"
              stroke="var(--sage)"
              strokeWidth="1.5"
              strokeLinecap="round"
              className={preferReduced ? "" : "animate-[drawStem_0.9s_ease-out_0.3s_forwards]"}
              style={{
                strokeDasharray: 35,
                strokeDashoffset: preferReduced ? 0 : 35,
              }}
            />
            {/* Terracotta Clay Accent Dot */}
            <circle
              cx="18"
              cy="8"
              r="2.8"
              fill="var(--clay)"
              className={preferReduced ? "" : "animate-[popDot_0.5s_cubic-bezier(0.34,1.56,0.64,1)_0.65s_forwards]"}
              style={{
                transformOrigin: "18px 8px",
                opacity: preferReduced ? 1 : 0,
                transform: preferReduced ? "scale(1)" : "scale(0.5)",
              }}
            />
          </svg>
        </div>

        {/* Wordmark with staggered letter reveal */}
        <div className="flex items-center gap-1.5 overflow-hidden">
          {["C", "E", "L", "I", "F", "E"].map((char, i) => (
            <span
              key={i}
              className={`text-[13px] font-sans font-bold tracking-[0.22em] text-[var(--ink)] inline-block ${
                preferReduced ? "" : "animate-[letterFade_0.4s_ease-out_forwards]"
              }`}
              style={{
                animationDelay: `${i * 45 + 300}ms`,
                opacity: preferReduced ? 1 : 0,
                transform: preferReduced ? "none" : "translateY(8px)",
              }}
            >
              {char}
            </span>
          ))}
        </div>

        {/* 1px Hairline Progress Rail (120px wide) */}
        <div className="w-[120px] h-[1px] bg-[var(--line)] overflow-hidden relative mt-1">
          <div
            className={`h-full bg-[var(--forest)] ${
              preferReduced ? "w-full" : "animate-[progressFill_1.2s_cubic-bezier(0.2,0.8,0.2,1)_forwards]"
            }`}
            style={{ width: preferReduced ? "100%" : "0%" }}
          />
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
            transform: scale(1.15);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes letterFade {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes progressFill {
          0% {
            width: 0%;
          }
          50% {
            width: 65%;
          }
          100% {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
