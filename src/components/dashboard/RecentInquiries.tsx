"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Inbox } from "lucide-react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { mockInquiries } from "@/data/dashboard";

export interface DashboardInquiry {
  id: string;
  name: string;
  type: string;
  timeAgo: string;
  status: string;
}

interface RecentInquiriesProps {
  inquiries?: DashboardInquiry[];
}

export function RecentInquiries({ inquiries }: RecentInquiriesProps) {
  const prefersReduced = useReducedMotion();
  const displayInquiries = inquiries && inquiries.length > 0 ? inquiries : (inquiries ? [] : mockInquiries);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReduced ? 0.05 : 0.4,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  const renderStatus = (status: string) => {
    const s = status.toLowerCase();
    if (s === "new") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-[#ED1C24] border border-red-200">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ED1C24] animate-pulse" />
          New
        </span>
      );
    }
    if (s === "in-progress" || s === "review") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-[#B7791F] border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B7791F]" />
          In Progress
        </span>
      );
    }
    if (s === "contacted") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          Contacted
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-700 border border-gray-200">
        <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
        Closed
      </span>
    );
  };

  return (
    <div className="bg-white border border-[#E1E8E2] p-6 rounded-lg space-y-6 select-none flex flex-col justify-between shadow-xs">
      {/* Header section */}
      <div className="flex items-center justify-between border-b border-[#E1E8E2] pb-4">
        <h3 className="text-base font-bold text-[#17201B]">
          Recent Enquiries
        </h3>
        <Link
          href="/dashboard/inquiries"
          className="text-xs uppercase tracking-[0.14em] text-[#123C2D] hover:underline transition-colors flex items-center gap-1 font-semibold"
        >
          <span>View all</span>
          <ArrowRight size={13} />
        </Link>
      </div>

      {/* Inquiry Rows or Empty State */}
      {displayInquiries.length === 0 ? (
        <div className="py-8 text-center space-y-2">
          <Inbox size={24} className="mx-auto text-[#68756D]/40" />
          <p className="text-xs text-[#68756D] font-sans">No consultation requests received yet.</p>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-20px" }}
          className="divide-y divide-[#E1E8E2]"
        >
          {displayInquiries.map((inq) => (
            <motion.div
              key={inq.id}
              variants={itemVariants}
            >
              <Link
                href="/dashboard/inquiries"
                className="flex items-center justify-between py-3 group cursor-pointer px-3 rounded-md hover:bg-[#F6F8F5] transition-colors duration-150 block"
              >
                {/* Left: Name and Inquiry Detail */}
                <div className="flex flex-col gap-0.5 max-w-[50%]">
                  <span className="text-xs font-sans font-semibold text-[#17201B] group-hover:text-[#123C2D] transition-colors">
                    {inq.name}
                  </span>
                  <span className="text-[11px] text-[#68756D] font-sans truncate">
                    {inq.type}
                  </span>
                </div>

                {/* Right: metadata (time, status icon, click indicator) */}
                <div className="flex items-center gap-4 sm:gap-6">
                  <span className="text-xs font-sans text-[#68756D] whitespace-nowrap">
                    {inq.timeAgo}
                  </span>
                  <div className="w-24 flex justify-start">
                    {renderStatus(inq.status)}
                  </div>
                  <ArrowRight
                    size={14}
                    className="text-[#68756D]/40 group-hover:text-[#123C2D] group-hover:translate-x-1 transition-all duration-150"
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

