"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { X, Mail, Phone, CheckSquare, Trash2, Loader2, ExternalLink, Save, Check, MapPin, Building2, FileText, Clock } from "lucide-react";
import { Inquiry, EnquiryStatus as InquiryStatus } from "@/types/enquiry";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface InquiryDrawerProps {
  inquiry: Inquiry | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (id: string, status: InquiryStatus) => void;
  onNotesUpdate?: (id: string, notes: string) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

export function InquiryDrawer({
  inquiry,
  isOpen,
  onClose,
  onStatusUpdate,
  onNotesUpdate,
  onDelete,
}: InquiryDrawerProps) {
  const prefersReduced = useReducedMotion();
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Internal Notes State
  const [prevInquiryId, setPrevInquiryId] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);

  // Sync internal notes state whenever a new inquiry is selected
  if (inquiry && inquiry.id !== prevInquiryId) {
    setPrevInquiryId(inquiry.id);
    setNotes(inquiry.notes || "");
    setNotesSaved(false);
  }

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

  const handleSaveNotes = async () => {
    if (!inquiry || !onNotesUpdate) return;
    setIsSavingNotes(true);
    try {
      await onNotesUpdate(inquiry.id, notes);
      setNotesSaved(true);
      setTimeout(() => setNotesSaved(false), 3000);
    } catch (err) {
      console.error("Failed to save notes:", err);
    } finally {
      setIsSavingNotes(false);
    }
  };

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
        ease: [0.16, 1, 0.3, 1] as const,
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
      case "resolved":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Resolved
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

  const productTargetSlug = inquiry?.productSlug || (inquiry?.product ? inquiry.product.toLowerCase().replace(/[^a-z0-9]+/g, "-") : null);

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
            className="fixed top-0 bottom-0 right-0 w-full sm:max-w-md md:w-[480px] bg-white border-l border-[#E1E8E2] shadow-2xl flex flex-col focus:outline-none z-55 select-none"
          >
            {/* Header row */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#E1E8E2]">
              <div className="space-y-0.5">
                <span className="text-[11px] uppercase tracking-[0.14em] text-[#123C2D] font-sans font-semibold block">
                  ENQUIRY DOSSIER
                </span>
                <h3 className="text-base font-serif font-bold text-[#17201B]">
                  {inquiry.product ? `Product Enquiry: ${inquiry.product}` : "General Consultation Request"}
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
                    {inquiry.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                  </div>
                  {renderStatusBadge(inquiry.status)}
                </div>

                <div className="space-y-1">
                  <h4 className="text-base font-sans font-bold text-[#17201B]">
                    {inquiry.name}
                  </h4>
                  <div className="flex flex-col gap-0.5 text-xs text-[#68756D] font-sans">
                    <span className="text-[#17201B] font-medium">{inquiry.email}</span>
                    <span>{inquiry.phone}</span>
                  </div>
                </div>
              </div>

              {/* Organization & Location */}
              {(inquiry.company || inquiry.city || inquiry.location) && (
                <div className="space-y-3 pt-5 text-xs font-sans">
                  {inquiry.company && (
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.14em] text-[#68756D] block font-semibold flex items-center gap-1.5 mb-0.5">
                        <Building2 size={12} className="text-[#123C2D]" />
                        ORGANIZATION / CLINIC
                      </span>
                      <p className="text-[#17201B] font-medium pl-4">{inquiry.company}</p>
                    </div>
                  )}

                  {(inquiry.city || inquiry.location) && (
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.14em] text-[#68756D] block font-semibold flex items-center gap-1.5 mb-0.5">
                        <MapPin size={12} className="text-[#123C2D]" />
                        CITY / LOCATION
                      </span>
                      <p className="text-[#17201B] font-medium pl-4">{inquiry.city || inquiry.location}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Product Enquired with Live Link */}
              {inquiry.product && (
                <div className="space-y-2 pt-5">
                  <span className="text-[10px] uppercase tracking-[0.14em] text-[#123C2D] font-sans block font-semibold">
                    PRODUCT ENQUIRED
                  </span>
                  <div className="bg-[#F0F4F0] border border-[#E1E8E2] p-3.5 rounded-md flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-sans text-[#123C2D] font-bold">
                        {inquiry.product}
                      </p>
                      {inquiry.productCategory && (
                        <span className="text-[11px] text-[#68756D] font-sans">
                          {inquiry.productCategory}
                        </span>
                      )}
                    </div>

                    {productTargetSlug && (
                      <Link
                        href={`/products/${productTargetSlug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-sans text-[#123C2D] hover:underline font-semibold shrink-0 bg-white px-2.5 py-1 rounded border border-[#E1E8E2] shadow-xs"
                      >
                        <span>View Spec Sheet</span>
                        <ExternalLink size={11} />
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {/* Inquiry message */}
              <div className="space-y-1.5 pt-5">
                <span className="text-[10px] uppercase tracking-[0.14em] text-[#68756D] font-sans block font-semibold flex items-center gap-1.5">
                  <FileText size={12} />
                  CUSTOMER MESSAGE
                </span>
                <p className="text-xs font-sans text-[#17201B] leading-relaxed whitespace-pre-line bg-[#F6F8F5] p-3.5 rounded-md border border-[#E1E8E2]">
                  {inquiry.message}
                </p>
              </div>

              {/* Internal Admin Notes Section */}
              <div className="space-y-2 pt-5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-[0.14em] text-[#123C2D] font-sans font-semibold block">
                    INTERNAL ADMIN NOTES (PRIVATE)
                  </span>
                  {notesSaved && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-sans text-emerald-700 font-medium">
                      <Check size={12} />
                      <span>Saved</span>
                    </span>
                  )}
                </div>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add internal notes (e.g., Called client on 20 Sept, sent sample kit, waiting for clinic response)..."
                  className="w-full text-xs font-sans p-3 bg-white border border-[#E1E8E2] rounded-md text-[#17201B] placeholder-[#68756D]/60 outline-none focus:border-[#123C2D] focus:ring-1 focus:ring-[#123C2D]/20 transition-all resize-y"
                />
                {onNotesUpdate && (
                  <button
                    type="button"
                    onClick={handleSaveNotes}
                    disabled={isSavingNotes || notes === (inquiry.notes || "")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans font-semibold rounded bg-[#123C2D] text-white hover:bg-[#294F3D] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors shadow-xs"
                  >
                    {isSavingNotes ? (
                      <>
                        <Loader2 size={12} className="animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save size={12} />
                        <span>Save Notes</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Timeline */}
              <div className="space-y-1.5 pt-5 text-[11px] font-sans text-[#68756D]">
                <span className="text-[10px] uppercase tracking-[0.14em] text-[#68756D] font-sans block font-semibold flex items-center gap-1.5">
                  <Clock size={12} />
                  TIMELINE
                </span>
                <p>
                  Submitted: {inquiry.date} at {inquiry.time}
                </p>
                {inquiry.updatedAt && (
                  <p>
                    Last Modified: {new Date(inquiry.updatedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })} at {new Date(inquiry.updatedAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                )}
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
                  className="w-full bg-white border border-[#E1E8E2] text-xs text-[#17201B] py-2 px-3 rounded-md outline-none focus:border-[#123C2D] transition-colors font-sans cursor-pointer shadow-xs font-medium"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`mailto:${inquiry.email}?subject=Celife Health Solutions Consultation - ${inquiry.product || 'Healthcare Enquiry'}`}
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

              {inquiry.status !== "contacted" && inquiry.status !== "resolved" && inquiry.status !== "closed" && (
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

