"use client";

import React from "react";
import { motion } from "motion/react";
import { ArrowRight, Package } from "lucide-react";
import { Inquiry, EnquiryStatus } from "@/types/enquiry";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface InquiryTableProps {
  inquiries: Inquiry[];
  onSelectInquiry: (inquiry: Inquiry) => void;
}

export function InquiryTable({
  inquiries,
  onSelectInquiry,
}: InquiryTableProps) {
  const prefersReduced = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReduced ? 0 : 0.04,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReduced ? 0.05 : 0.3,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  const renderStatusDot = (status: EnquiryStatus) => {
    switch (status) {
      case "new":
        return (
          <div className="flex items-center gap-1.5 font-semibold text-[#FF7A7A]">
            <span className="w-2 h-2 rounded-full bg-[#ED1C24] animate-pulse" />
            <span className="text-[10px] uppercase tracking-wider font-semibold">New</span>
          </div>
        );
      case "contacted":
        return (
          <div className="flex items-center gap-1.5 font-semibold text-blue-300">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            <span className="text-[10px] uppercase tracking-wider font-semibold">Contacted</span>
          </div>
        );
      case "in-progress":
        return (
          <div className="flex items-center gap-1.5 font-semibold text-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="text-[10px] uppercase tracking-wider font-semibold">In Progress</span>
          </div>
        );
      case "closed":
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white/40">
            <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
            <span className="text-[10px] uppercase tracking-wider font-semibold">Closed</span>
          </div>
        );
    }
  };

  return (
    <div className="w-full select-none">
      {/* DESKTOP TABLE */}
      <div className="hidden md:block w-full overflow-hidden border border-white/10 bg-[#0E1B15] rounded-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-[11px] uppercase tracking-[0.16em] text-[#81998D] font-sans font-semibold bg-[#0A1410]">
              <th className="py-3.5 px-5">Product</th>
              <th className="py-3.5 px-5">Name & Phone</th>
              <th className="py-3.5 px-5">Email</th>
              <th className="py-3.5 px-5">Message</th>
              <th className="py-3.5 px-5">Date</th>
              <th className="py-3.5 px-5">Status</th>
              <th className="py-3.5 px-5 text-right">Action</th>
            </tr>
          </thead>
          <motion.tbody
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-20px" }}
            className="divide-y divide-white/5 font-sans"
          >
            {inquiries.map((inq) => (
              <motion.tr
                key={inq.id}
                variants={rowVariants}
                onClick={() => onSelectInquiry(inq)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelectInquiry(inq);
                  }
                }}
                className="group cursor-pointer hover:bg-white/5 transition-colors duration-200 outline-none"
              >
                {/* Product */}
                <td className="py-4 px-5">
                  {inq.product ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#123C2D] text-[#C4D5C7] rounded-xs text-[10px] font-semibold uppercase tracking-wider border border-white/10">
                      <Package size={10} />
                      <span className="truncate max-w-[130px]">{inq.product}</span>
                    </span>
                  ) : (
                    <span className="text-white/40 text-[11px]">General Enquiry</span>
                  )}
                </td>

                {/* Name & Phone */}
                <td className="py-4 px-5">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-semibold text-white group-hover:text-[#C4D5C7] transition-colors">
                      {inq.name}
                    </span>
                    <span className="text-[11px] text-white/50 tracking-wide">
                      {inq.phone || "—"}
                    </span>
                  </div>
                </td>

                {/* Email */}
                <td className="py-4 px-5 text-xs text-white/70">
                  {inq.email}
                </td>

                {/* Message excerpt */}
                <td className="py-4 px-5 text-xs text-white/50 max-w-[200px] truncate">
                  {inq.message || "—"}
                </td>

                {/* Date */}
                <td className="py-4 px-5 text-xs text-white/60">
                  {inq.date}
                </td>

                {/* Status indicator */}
                <td className="py-4 px-5">
                  {renderStatusDot(inq.status)}
                </td>

                {/* Arrow */}
                <td className="py-4 px-5 text-right">
                  <div className="flex justify-end">
                    <ArrowRight
                      size={14}
                      className="text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all duration-200"
                    />
                  </div>
                </td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </div>

      {/* MOBILE LIST CARD GRID */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="block md:hidden space-y-3 font-sans"
      >
        {inquiries.map((inq) => (
          <motion.button
            key={inq.id}
            variants={rowVariants}
            type="button"
            onClick={() => onSelectInquiry(inq)}
            className="w-full text-left p-4 bg-[#0E1B15] border border-white/10 rounded-xs transition-colors hover:border-white/20 group cursor-pointer outline-none relative overflow-hidden space-y-3"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wide">
                    {inq.name}
                  </h4>
                  {inq.product && (
                    <span className="px-1.5 py-0.5 bg-[#123C2D] text-[#C4D5C7] text-[9px] rounded-xs font-semibold uppercase">
                      {inq.product}
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-white/50 block">
                  {inq.email} · {inq.phone}
                </span>
              </div>
              {renderStatusDot(inq.status)}
            </div>

            {inq.message && (
              <p className="text-xs text-white/60 line-clamp-2 italic bg-black/20 p-2 rounded-xs border border-white/5">
                &ldquo;{inq.message}&rdquo;
              </p>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] text-white/40">
              <span>{inq.date}</span>
              <ArrowRight size={12} className="text-white/40 group-hover:text-white" />
            </div>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
