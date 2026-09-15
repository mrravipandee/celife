"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, Mail, Phone, CheckSquare, Trash2, Loader2 } from "lucide-react";
import { Inquiry, EnquiryStatus as InquiryStatus } from "@/types/enquiry";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface InquiryDrawerProps {
  inquiry: Inquiry | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (id: string, status: InquiryStatus) => void;
  onDelete?: (id: string) => Promise<void>;
}

export function InquiryDrawer({
  inquiry,
  isOpen,
  onClose,
  onStatusUpdate,
  onDelete,
}: InquiryDrawerProps) {
  const prefersReduced = useReducedMotion();
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);


  // Esc key closure and body scroll locking
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    if (closeButtonRef.current) {
      closeButtonRef.current.focus();
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // Motion transitions
  const backdropVariants = {
    closed: { opacity: 0 },
    open: {
      opacity: 1,
      transition: {
        duration: prefersReduced ? 0.05 : 0.35,
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
    closed: { x: "100%" },
    open: {
      x: 0,
      transition: {
        duration: prefersReduced ? 0.05 : 0.4,
        ease: [0.16, 1, 0.3, 1] as const, // Custom cubic-bezier matching easeOut
      },
    },
    exit: {
      x: "100%",
      transition: {
        duration: prefersReduced ? 0.05 : 0.3,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  const renderStatusBadge = (status: InquiryStatus) => {
    switch (status) {
      case "new":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-[#ED1C24] border border-red-200">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ED1C24] animate-pulse" />
            New
          </span>
        );
      case "in-progress":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-[#B7791F] border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B7791F]" />
            In Progress
          </span>
        );
      case "contacted":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            Contacted
          </span>
        );
      case "closed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-700 border border-gray-200">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
            Closed
          </span>
        );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && inquiry && (
        <div className="fixed inset-0 z-50 flex justify-end" role="none">
          {/* Backdrop dimming */}
          <motion.div
            variants={backdropVariants}
            initial="closed"
            animate="open"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs cursor-pointer"
            aria-hidden="true"
          />

          {/* Drawer container */}
          <motion.div
            ref={drawerRef}
            variants={drawerVariants}
            initial="closed"
            animate="open"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-label="Inquiry Details Panel"
            className="fixed top-0 bottom-0 right-0 w-full sm:max-w-md md:w-[460px] bg-white border-l border-[#E1E8E2] shadow-2xl flex flex-col focus:outline-none z-55 select-none"
          >
            {/* Header row */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#E1E8E2]">
              <div className="space-y-0.5">
                <span className="text-[11px] uppercase tracking-[0.14em] text-[#123C2D] font-sans font-semibold block">
                  ENQUIRY DETAILS
                </span>
                <h3 className="text-base font-serif font-bold text-[#17201B]">
                  Consultation Request
                </h3>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                aria-label="Close details panel"
                className="p-1.5 rounded-md border border-[#E1E8E2] bg-[#F6F8F5] text-[#68756D] hover:text-[#17201B] hover:bg-[#E1E8E2] transition-colors outline-none cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* Content areas */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 divide-y divide-[#E1E8E2]">
              
              {/* Profile Card and Status */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-[#E1E8E2] bg-[#F0F4F0] text-xs font-sans font-bold text-[#123C2D]">
                    {inquiry.name.split(" ").map(w => w[0]).join("")}
                  </div>
                  {renderStatusBadge(inquiry.status)}
                </div>

                <div className="space-y-0.5">
                  <h4 className="text-sm font-sans font-bold text-[#17201B]">
                    {inquiry.name}
                  </h4>
                  <span className="text-xs text-[#68756D] font-sans block">
                    {inquiry.email}
                  </span>
                  <span className="text-xs text-[#68756D] font-sans block">
                    {inquiry.phone}
                  </span>
                </div>
              </div>

              {/* Company / Business */}
              {inquiry.company && (
                <div className="space-y-1.5 pt-5">
                  <span className="text-[10px] uppercase tracking-[0.14em] text-[#68756D] font-sans block font-semibold">
                    ORGANIZATION / CLINIC
                  </span>
                  <p className="text-xs font-sans text-[#17201B] leading-normal font-medium">
                    {inquiry.company}
                  </p>
                </div>
              )}

              {/* Product Enquired */}
              {inquiry.product && (
                <div className="space-y-1.5 pt-5">
                  <span className="text-[10px] uppercase tracking-[0.14em] text-[#123C2D] font-sans block font-semibold">
                    PRODUCT ENQUIRED
                  </span>
                  <p className="text-xs font-sans text-[#123C2D] font-semibold bg-[#F0F4F0] border border-[#E1E8E2] px-3.5 py-2 rounded-md">
                    {inquiry.product}
                  </p>
                </div>
              )}

              {/* Inquiry Type */}
              <div className="space-y-1.5 pt-5">
                <span className="text-[10px] uppercase tracking-[0.14em] text-[#68756D] font-sans block font-semibold">
                  ENQUIRY CATEGORY
                </span>
                <p className="text-xs font-sans text-[#17201B] leading-normal">
                  {inquiry.type}
                </p>
              </div>

              {/* Inquiry message */}
              <div className="space-y-1.5 pt-5">
                <span className="text-[10px] uppercase tracking-[0.14em] text-[#68756D] font-sans block font-semibold">
                  MESSAGE
                </span>
                <p className="text-xs font-sans text-[#17201B] leading-relaxed max-w-sm whitespace-pre-line bg-[#F6F8F5] p-3 rounded-md border border-[#E1E8E2]">
                  {inquiry.message}
                </p>
              </div>

              {/* Date submitted */}
              <div className="space-y-1.5 pt-5">
                <span className="text-[10px] uppercase tracking-[0.14em] text-[#68756D] font-sans block font-semibold">
                  SUBMITTED
                </span>
                <p className="text-xs font-sans text-[#68756D] leading-normal">
                  {inquiry.date} at {inquiry.time}
                </p>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="p-4 bg-[#F6F8F5] border-t border-[#E1E8E2] space-y-4">
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase tracking-[0.14em] text-[#68756D] font-sans block font-semibold">
                  Update Status
                </span>
                <select
                  value={inquiry.status}
                  onChange={(e) => onStatusUpdate(inquiry.id, e.target.value as InquiryStatus)}
                  className="w-full bg-white border border-[#E1E8E2] text-xs text-[#17201B] py-2 px-3 rounded-md outline-none focus:border-[#123C2D] transition-colors font-sans cursor-pointer shadow-xs"
                >
                  <option value="new">New</option>
                  <option value="in-progress">In Progress</option>
                  <option value="contacted">Contacted</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`mailto:${inquiry.email}?subject=Celife Health Solutions Consultation`}
                  className="flex items-center justify-center gap-2 py-2 text-xs font-sans font-medium bg-white border border-[#E1E8E2] text-[#17201B] hover:bg-[#F0F4F0] transition-colors rounded-md shadow-xs"
                >
                  <Mail size={13} className="text-[#68756D]" />
                  <span>Email</span>
                </a>
                <a
                  href={`tel:${inquiry.phone.replace(/\s+/g, "")}`}
                  className="flex items-center justify-center gap-2 py-2 text-xs font-sans font-medium bg-white border border-[#E1E8E2] text-[#17201B] hover:bg-[#F0F4F0] transition-colors rounded-md shadow-xs"
                >
                  <Phone size={13} className="text-[#68756D]" />
                  <span>Call</span>
                </a>
              </div>
              
              {inquiry.status !== "contacted" && inquiry.status !== "closed" && (
                <button
                  type="button"
                  onClick={() => onStatusUpdate(inquiry.id, "contacted")}
                  className="w-full flex items-center justify-center gap-2 py-2 text-xs font-sans font-medium bg-[#123C2D] text-white hover:bg-[#294F3D] transition-colors rounded-md cursor-pointer shadow-xs"
                >
                  <CheckSquare size={13} />
                  <span>Mark as Contacted</span>
                </button>
              )}

              {onDelete && (
                <div className="pt-2 border-t border-[#E1E8E2]">
                  {showDeleteConfirm ? (
                    <div className="space-y-2">
                      <p className="text-xs text-[#C0392B] font-sans text-center">
                        Permanently delete this enquiry?
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setShowDeleteConfirm(false)}
                          disabled={isDeleting}
                          className="py-1.5 text-xs font-sans bg-white border border-[#E1E8E2] text-[#68756D] hover:text-[#17201B] rounded-md cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          disabled={isDeleting}
                          onClick={async () => {
                            setIsDeleting(true);
                            try {
                              await onDelete(inquiry.id);
                              setShowDeleteConfirm(false);
                              onClose();
                            } catch (err) {
                              console.error(err);
                              setIsDeleting(false);
                            }
                          }}
                          className="flex items-center justify-center gap-1.5 py-1.5 text-xs font-sans bg-[#C0392B] text-white hover:bg-[#C0392B]/90 rounded-md cursor-pointer"
                        >
                          {isDeleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                          <span>Confirm</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-sans text-[#C0392B] hover:bg-red-50 transition-colors rounded-md cursor-pointer"
                    >
                      <Trash2 size={13} />
                      <span>Delete Enquiry</span>
                    </button>
                  )}
                </div>
              )}
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

