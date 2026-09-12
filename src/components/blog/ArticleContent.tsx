"use client";

import React, { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface ArticleContentProps {
  content: string;
}

export function ArticleContent({ content }: ArticleContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const preferReduced = useReducedMotion();

  useEffect(() => {
    if (preferReduced || !containerRef.current) return;

    const elements = containerRef.current.querySelectorAll<HTMLElement>(".article-block");
    if (!elements || elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            target.style.opacity = "1";
            target.style.transform = "translateY(0px)";
            observer.unobserve(target); // Unobserve immediately to prevent memory leak
          }
        });
      },
      { rootMargin: "0px 0px -40px 0px", threshold: 0.1 }
    );

    elements.forEach((el) => {
      // Set initial low-amplitude state
      el.style.opacity = "0.6";
      el.style.transform = "translateY(12px)";
      el.style.transition = "opacity 300ms ease-out, transform 300ms ease-out";
      observer.observe(el);
    });

    return () => {
      observer.disconnect(); // Clean disconnection on unmount
    };
  }, [content, preferReduced]);

  const renderMarkdown = (text: string) => {
    return text.split("\n").map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return null;

      if (trimmed.startsWith("# ")) {
        return (
          <h1
            key={idx}
            className="article-block text-3xl md:text-5xl font-serif text-white mt-12 mb-6 font-bold leading-tight uppercase select-text"
          >
            {trimmed.replace("# ", "")}
          </h1>
        );
      }

      if (trimmed.startsWith("## ")) {
        return (
          <h2
            key={idx}
            className="article-block text-xl md:text-2xl font-serif text-white mt-10 mb-4 font-semibold leading-tight uppercase tracking-wider select-text"
          >
            {trimmed.replace("## ", "")}
          </h2>
        );
      }

      if (trimmed.startsWith("* ")) {
        return (
          <li
            key={idx}
            className="article-block list-disc list-inside text-base md:text-lg text-white/80 leading-relaxed font-sans ml-4 my-2 select-text"
          >
            {trimmed.replace("* ", "")}
          </li>
        );
      }

      return (
        <p
          key={idx}
          className="article-block text-base md:text-lg text-white/80 leading-relaxed font-sans font-light my-5 select-text"
        >
          {line}
        </p>
      );
    });
  };

  return (
    <div ref={containerRef} className="space-y-2 select-text">
      {renderMarkdown(content)}
    </div>
  );
}
