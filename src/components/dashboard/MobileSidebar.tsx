"use client";

import React, { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const prefersReduced = useReducedMotion();
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Keyboard navigation & body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    // Simple focus trap: focus close button when menu opens
    if (closeButtonRef.current) {
      closeButtonRef.current.focus();
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // Motion variants
  const backdropVariants = {
    closed: { opacity: 0 },
    open: {
      opacity: 1,
      transition: {
        duration: prefersReduced ? 0.05 : 0.4,
        ease: "easeOut" as const,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: prefersReduced ? 0.05 : 0.3,
        ease: "easeIn" as const,
      },
    },
  };

  const drawerVariants = {
    closed: { x: "-100%" },
    open: {
      x: 0,
      transition: {
        duration: prefersReduced ? 0.05 : 0.4,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
    exit: {
      x: "-100%",
      transition: {
        duration: prefersReduced ? 0.05 : 0.3,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden" role="none">
          {/* Backdrop Overlay */}
          <motion.div
            variants={backdropVariants}
            initial="closed"
            animate="open"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
            aria-hidden="true"
          />

          {/* Drawer Navigation Container */}
          <motion.div
            ref={drawerRef}
            variants={drawerVariants}
            initial="closed"
            animate="open"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-label="Admin Navigation Menu"
            className="fixed top-0 bottom-0 left-0 w-[280px] bg-[#FFFFFF] border-r border-[#E1E8E2] flex flex-col shadow-2xl focus:outline-none"
          >
            {/* Header close block (overlapping the sidebar top) */}
            <div className="absolute top-5 right-3.5 z-50">
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                aria-label="Close navigation menu"
                className="p-1.5 rounded-xs border border-[#E1E8E2] bg-[#F6F8F5] text-[#68756D] hover:text-[#17201B] hover:bg-[#F0F4F0] transition-all outline-none focus-visible:ring-1 focus-visible:ring-[#123C2D]/50 cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* Sidebar content */}
            <Sidebar className="w-full border-r-0 h-full" onLinkClick={onClose} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
