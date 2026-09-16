"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { ProductImage } from "@/types/product";
import { ZoomIn, X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductImageGalleryProps {
  productName: string;
  primaryImage?: string;
  images?: ProductImage[];
  gallery?: string[];
  className?: string;
}

export function ProductImageGallery({
  productName,
  primaryImage,
  images = [],
  gallery = [],
  className,
}: ProductImageGalleryProps) {
  const fallbackPrimary = primaryImage || images[0]?.url || "/images/products/vitafiv-syrup.jpg";

  // Normalize gallery images to up to 5 items
  const normalizedImages: ProductImage[] = React.useMemo(() => {
    if (images && images.length > 0) {
      return images.slice(0, 5);
    }
    if (gallery && gallery.length > 0) {
      return [
        { url: fallbackPrimary, alt: `${productName} main pack`, type: "main", order: 1 },
        ...gallery.filter((url) => url !== fallbackPrimary).map((url, idx) => ({
          url,
          alt: `${productName} view ${idx + 2}`,
          type: idx === 0 ? "front" : idx === 1 ? "back" : idx === 2 ? "bottle" : "graphic",
          order: idx + 2,
        })),
      ].slice(0, 5);
    }
    return [{ url: fallbackPrimary, alt: `${productName} packaging`, type: "main", order: 1 }];
  }, [images, gallery, fallbackPrimary, productName]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const currentImage = normalizedImages[selectedIndex] || normalizedImages[0];

  // Magnifier State
  const [isHovering, setIsHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, percentX: 50, percentY: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Lightbox State
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Touch swipe support for mobile lightbox
  const touchStartXRef = useRef<number | null>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
      setIsHovering(false);
      return;
    }

    const percentX = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const percentY = Math.max(0, Math.min(100, (y / rect.height) * 100));

    setMousePos({ x, y, percentX, percentY });
  }, []);

  const handleMouseEnter = () => {
    // Only enable magnifier on non-touch desktop devices
    if (typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches) {
      setIsHovering(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const nextImage = useCallback(() => {
    setLightboxIndex((prev) => (prev + 1) % normalizedImages.length);
  }, [normalizedImages.length]);

  const prevImage = useCallback(() => {
    setLightboxIndex((prev) => (prev - 1 + normalizedImages.length) % normalizedImages.length);
  }, [normalizedImages.length]);

  // Keyboard navigation inside lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, nextImage, prevImage]);

  // Touch Swipe for mobile lightbox
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;

    if (diff > 50) {
      nextImage();
    } else if (diff < -50) {
      prevImage();
    }
    touchStartXRef.current = null;
  };

  const lensSize = 140; // Diameter of circular magnifier lens in pixels

  return (
    <div className={cn("space-y-4 select-none", className)}>
      {/* 1. Main Display Plinth with Desktop Magnifier */}
      <div className="bg-[var(--paper)] border border-[var(--line)] rounded-[6px] p-3 sm:p-5 shadow-xs relative">
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={() => openLightbox(selectedIndex)}
          className="relative aspect-[4/3] sm:aspect-[1/1] w-full rounded-[4px] overflow-hidden bg-[var(--bone)]/60 cursor-zoom-in group"
          role="button"
          tabIndex={0}
          aria-label={`Open full image viewer for ${productName} - ${currentImage.alt}`}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openLightbox(selectedIndex);
            }
          }}
        >
          <Image
            src={currentImage.url}
            alt={currentImage.alt || productName}
            fill
            priority={selectedIndex === 0}
            loading={selectedIndex === 0 ? "eager" : "lazy"}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain object-center transition-opacity duration-300"
          />

          {/* Desktop Circular Magnifier Lens */}
          {isHovering && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute rounded-full border-2 border-white shadow-2xl overflow-hidden hidden md:block"
              style={{
                width: `${lensSize}px`,
                height: `${lensSize}px`,
                left: `${Math.max(0, Math.min(containerRef.current ? containerRef.current.clientWidth - lensSize : 0, mousePos.x - lensSize / 2))}px`,
                top: `${Math.max(0, Math.min(containerRef.current ? containerRef.current.clientHeight - lensSize : 0, mousePos.y - lensSize / 2))}px`,
                backgroundImage: `url(${currentImage.url})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "260%",
                backgroundPosition: `${mousePos.percentX}% ${mousePos.percentY}%`,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.4), inset 0 0 10px rgba(0,0,0,0.15)",
              }}
            />
          )}

          {/* Corner Quick-Action Badges */}
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-sans font-medium opacity-80 group-hover:opacity-100 transition-opacity">
              <ZoomIn size={13} className="text-emerald-300" />
              <span>Click to expand</span>
            </span>
          </div>

          <div className="absolute top-3 right-3">
            <span className="px-2 py-0.5 rounded bg-black/40 backdrop-blur-sm text-white/80 text-[10px] uppercase font-mono tracking-wider">
              {currentImage.type || `Slot ${selectedIndex + 1}`}
            </span>
          </div>
        </div>
      </div>

      {/* 2. 5-Slot Thumbnail Gallery Strip */}
      {normalizedImages.length > 1 && (
        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {normalizedImages.map((thumb, idx) => {
            const isSelected = selectedIndex === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={cn(
                  "relative aspect-[1/1] rounded-[4px] overflow-hidden border p-1 bg-[var(--paper)] transition-all cursor-pointer group",
                  isSelected
                    ? "border-[var(--forest)] ring-2 ring-[var(--forest)]/50 shadow-sm"
                    : "border-[var(--line)] hover:border-[var(--sage)] opacity-80 hover:opacity-100"
                )}
                aria-label={`Select ${thumb.type || `image ${idx + 1}`}`}
                aria-pressed={isSelected}
              >
                <div className="relative w-full h-full bg-[var(--bone)]/40 rounded-[2px] overflow-hidden">
                  <Image
                    src={thumb.url}
                    alt={thumb.alt || `${productName} thumbnail ${idx + 1}`}
                    fill
                    loading="lazy"
                    sizes="80px"
                    className="object-contain object-center group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <span className="sr-only">{thumb.alt}</span>
                <span className="absolute bottom-0.5 inset-x-0 text-center text-[9px] font-sans uppercase tracking-wider text-black/60 bg-white/80 backdrop-blur-xs py-0.5 truncate px-1">
                  {thumb.type || `View ${idx + 1}`}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* 3. Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Image gallery viewer for ${productName}`}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-fade-in"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Lightbox Header Bar */}
          <div className="flex items-center justify-between text-white border-b border-white/10 pb-3">
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-widest text-emerald-400 font-mono">
                {lightboxIndex + 1} / {normalizedImages.length}
              </span>
              <span className="text-sm font-serif font-semibold text-white/90 truncate max-w-[200px] sm:max-w-md">
                {productName} — {normalizedImages[lightboxIndex]?.type || "Gallery View"}
              </span>
            </div>

            <button
              onClick={closeLightbox}
              className="p-2 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
              aria-label="Close lightbox (Escape)"
            >
              <X size={22} />
            </button>
          </div>

          {/* Lightbox Main Stage */}
          <div className="relative flex-1 flex items-center justify-center p-2 sm:p-8">
            {/* Prev Button */}
            {normalizedImages.length > 1 && (
              <button
                onClick={prevImage}
                className="absolute left-2 sm:left-4 z-10 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/15 transition-all cursor-pointer"
                aria-label="Previous image (Left Arrow)"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            {/* Current Full Image */}
            <div className="relative w-full h-full max-w-4xl max-h-[75vh] flex items-center justify-center">
              <Image
                src={normalizedImages[lightboxIndex]?.url || currentImage.url}
                alt={normalizedImages[lightboxIndex]?.alt || productName}
                fill
                className="object-contain select-none"
                sizes="(max-width: 1200px) 100vw, 1200px"
                priority
              />
            </div>

            {/* Next Button */}
            {normalizedImages.length > 1 && (
              <button
                onClick={nextImage}
                className="absolute right-2 sm:right-4 z-10 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/15 transition-all cursor-pointer"
                aria-label="Next image (Right Arrow)"
              >
                <ChevronRight size={24} />
              </button>
            )}
          </div>

          {/* Lightbox Bottom Strip: Caption & Thumbnails */}
          <div className="flex flex-col items-center gap-3 pt-3 border-t border-white/10">
            <p className="text-xs text-white/70 font-sans text-center max-w-xl truncate">
              {normalizedImages[lightboxIndex]?.alt || `${productName} packaging`}
            </p>

            {normalizedImages.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto py-1">
                {normalizedImages.map((thumb, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setLightboxIndex(idx)}
                    className={cn(
                      "relative w-12 h-12 rounded overflow-hidden border cursor-pointer transition-all shrink-0",
                      lightboxIndex === idx
                        ? "border-emerald-400 ring-2 ring-emerald-400/50"
                        : "border-white/20 opacity-50 hover:opacity-100"
                    )}
                  >
                    <Image
                      src={thumb.url}
                      alt={thumb.alt}
                      fill
                      sizes="48px"
                      className="object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
