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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-[#ED1C24] border border-red-200">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ED1C24] animate-pulse" />
            New
          </span>
        );
      case "contacted":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            Contacted
          </span>
        );
      case "in-progress":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-[#B7791F] border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B7791F]" />
            In Progress
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

  return (
    <div className="w-full select-none">
      {/* DESKTOP TABLE */}
      <div className="hidden md:block w-full overflow-hidden border border-[#E1E8E2] bg-white rounded-lg shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E1E8E2] text-[11px] uppercase tracking-[0.14em] text-[#123C2D] font-sans font-semibold bg-[#F0F4F0]">
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
            className="divide-y divide-[#E1E8E2] font-sans"
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
                className="group cursor-pointer hover:bg-[#F6F8F5] transition-colors duration-200 outline-none"
              >
                {/* Product */}
                <td className="py-4 px-5">
                  {inq.product ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#F0F4F0] text-[#123C2D] rounded-md text-xs font-semibold border border-[#E1E8E2]">
                      <Package size={13} className="text-[#123C2D]" />
                      <span className="truncate max-w-[140px]">{inq.product}</span>
                    </span>
                  ) : (
                    <span className="text-[#68756D] text-xs">General Enquiry</span>
                  )}
                </td>

                {/* Name & Phone */}
                <td className="py-4 px-5">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-semibold text-[#17201B] group-hover:text-[#123C2D] transition-colors">
                      {inq.name}
                    </span>
                    <span className="text-[11px] text-[#68756D]">
                      {inq.phone || "—"}
                    </span>
                  </div>
                </td>

                {/* Email */}
                <td className="py-4 px-5 text-xs text-[#68756D]">
                  {inq.email}
                </td>

                {/* Message excerpt */}
                <td className="py-4 px-5 text-xs text-[#68756D] max-w-[200px] truncate">
                  {inq.message || "—"}
                </td>

                {/* Date */}
                <td className="py-4 px-5 text-xs text-[#68756D]">
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
                      className="text-[#68756D]/40 group-hover:text-[#123C2D] group-hover:translate-x-1 transition-all duration-200"
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
            className="w-full text-left p-4 bg-white border border-[#E1E8E2] rounded-lg transition-colors hover:border-[#123C2D]/40 shadow-xs group cursor-pointer outline-none relative overflow-hidden space-y-3"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-xs font-bold text-[#17201B]">
                    {inq.name}
                  </h4>
                  {inq.product && (
                    <span className="px-2 py-0.5 bg-[#F0F4F0] text-[#123C2D] border border-[#E1E8E2] text-[10px] rounded-md font-semibold">
                      {inq.product}
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-[#68756D] block">
                  {inq.email} · {inq.phone}
                </span>
              </div>
              {renderStatusDot(inq.status)}
            </div>

            {inq.message && (
              <p className="text-xs text-[#17201B]/80 line-clamp-2 italic bg-[#F6F8F5] p-2.5 rounded-md border border-[#E1E8E2]">
                &ldquo;{inq.message}&rdquo;
              </p>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-[#E1E8E2] text-[11px] text-[#68756D]">
              <span>{inq.date}</span>
              <ArrowRight size={13} className="text-[#68756D] group-hover:text-[#123C2D]" />
            </div>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
