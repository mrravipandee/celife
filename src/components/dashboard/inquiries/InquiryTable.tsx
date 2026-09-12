"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Inquiry, EnquiryStatus as InquiryStatus } from "@/types/enquiry";

interface InquiryTableProps {
  inquiries: Inquiry[];
  onSelectInquiry: (inquiry: Inquiry) => void;
}

export function InquiryTable({ inquiries, onSelectInquiry }: InquiryTableProps) {
  const prefersReduced = useReducedMotion();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.04,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReduced ? 0.05 : 0.35,
        ease: "easeOut" as const,
      },
    },
  };

  const renderStatusDot = (status: InquiryStatus) => {
    switch (status) {
      case "new":
        return (
          <div className="flex items-center gap-1.5 font-semibold text-primary">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="text-xs uppercase tracking-wider font-semibold">New</span>
          </div>
        );
      case "in-progress":
        return (
          <div className="flex items-center gap-1.5 font-semibold text-[#C9A24A]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A24A]" />
            <span className="text-xs uppercase tracking-wider font-semibold">In Progress</span>
          </div>
        );
      case "contacted":
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white/60">
            <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
            <span className="text-xs uppercase tracking-wider font-semibold">Contacted</span>
          </div>
        );
      case "closed":
        return (
          <div className="flex items-center gap-1.5 font-semibold text-white/40">
            <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
            <span className="text-xs uppercase tracking-wider font-semibold">Closed</span>
          </div>
        );
    }
  };

  return (
    <div className="w-full select-none">
      
      {/* ==========================================
          DESKTOP TABLE (visible on md screens up)
          ========================================== */}
      <div className="hidden md:block w-full overflow-hidden border border-white/5 bg-[#050505] rounded-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 text-xs uppercase tracking-[0.18em] text-white/60 font-semibold">
              <th className="py-4 px-6 font-semibold">Contact</th>
              <th className="py-4 px-6 font-semibold">Company / Business</th>
              <th className="py-4 px-6 font-semibold">Inquiry Type</th>
              <th className="py-4 px-6 font-semibold">Date</th>
              <th className="py-4 px-6 font-semibold">Status</th>
              <th className="py-4 px-6 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <motion.tbody
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-20px" }}
            className="divide-y divide-white/5"
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
                className="group cursor-pointer hover:bg-white/[0.025] transition-colors duration-300 outline-none focus-visible:bg-white/[0.05]"
              >
                {/* Contact name & email */}
                <td className="py-4 px-6">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-sans font-semibold text-white/80 group-hover:text-white transition-colors duration-300">
                      {inq.name}
                    </span>
                    <span className="text-xs text-white/50 font-sans tracking-wide">
                      {inq.email}
                    </span>
                  </div>
                </td>

                {/* Company details */}
                <td className="py-4 px-6 text-sm text-white/70 font-sans tracking-wide">
                  {inq.company}
                </td>

                {/* Inquiry category */}
                <td className="py-4 px-6 text-sm text-white/70 font-sans tracking-wide">
                  {inq.type}
                </td>

                {/* Date formatted */}
                <td className="py-4 px-6 text-sm text-white/60 font-sans tracking-wide">
                  {inq.date}
                </td>

                {/* Dot indicator status */}
                <td className="py-4 px-6">
                  {renderStatusDot(inq.status)}
                </td>

                {/* Click indicator right arrow */}
                <td className="py-4 px-6 text-right">
                  <div className="flex justify-end">
                    <ArrowRight
                      size={14}
                      className="text-white/20 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300"
                    />
                  </div>
                </td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </div>

      {/* ==========================================
          MOBILE LIST CARD GRID (visible below md screens)
          ========================================== */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="block md:hidden space-y-4"
      >
        {inquiries.map((inq) => (
          <motion.button
            key={inq.id}
            variants={rowVariants}
            type="button"
            onClick={() => onSelectInquiry(inq)}
            className="w-full text-left p-5 bg-[#050505] border border-white/5 rounded-xs transition-colors duration-300 hover:border-white/10 group cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-primary/50 relative overflow-hidden"
          >
            {/* Soft top indicator glow on hover */}
            <span className="absolute top-0 left-0 right-0 h-[1px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

            <div className="flex flex-col space-y-3">
              {/* Header row */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-sans font-bold text-white/85 group-hover:text-white uppercase tracking-wider transition-colors">
                    {inq.name}
                  </h4>
                  <span className="text-xs text-white/50 font-sans block tracking-wide">
                    {inq.email}
                  </span>
                </div>
                {renderStatusDot(inq.status)}
              </div>

              {/* Middle company detail lines */}
              <div className="text-xs font-sans text-white/60 space-y-1 border-l border-white/10 pl-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-white/40 uppercase text-xs tracking-wide">Org:</span>
                  <span className="text-white/80 font-medium">{inq.company}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-white/40 uppercase text-xs tracking-wide">Type:</span>
                  <span className="text-white/80 font-medium">{inq.type}</span>
                </div>
              </div>

              {/* Bottom footer details */}
              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <span className="text-xs font-sans text-white/50 tracking-wider">
                  {inq.date}
                </span>
                <ArrowRight
                  size={13}
                  className="text-white/30 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300"
                />
              </div>
            </div>
          </motion.button>
        ))}
      </motion.div>

    </div>
  );
}
