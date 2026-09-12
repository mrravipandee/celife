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
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="text-xs uppercase tracking-wider text-primary font-semibold">New</span>
        </div>
      );
    }
    if (s === "in-progress" || s === "review") {
      return (
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C9A24A]" />
          <span className="text-xs uppercase tracking-wider text-[#C9A24A] font-semibold">In Progress</span>
        </div>
      );
    }
    if (s === "contacted") {
      return (
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
          <span className="text-xs uppercase tracking-wider text-white/60 font-medium">Contacted</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
        <span className="text-xs uppercase tracking-wider text-white/50 font-medium">Closed</span>
      </div>
    );
  };

  return (
    <div className="bg-[#050505] border border-white/5 p-6 rounded-xs space-y-6 select-none flex flex-col justify-between">
      {/* Header section */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <h3 className="text-sm font-serif font-medium tracking-wider text-white">
          Recent Inquiries
        </h3>
        <Link
          href="/dashboard/inquiries"
          className="text-xs uppercase tracking-[0.15em] text-white/60 hover:text-primary transition-colors flex items-center gap-1 font-medium"
        >
          <span>View all</span>
          <ArrowRight size={11} />
        </Link>
      </div>

      {/* Inquiry Rows or Empty State */}
      {displayInquiries.length === 0 ? (
        <div className="py-8 text-center space-y-2">
          <Inbox size={24} className="mx-auto text-white/20" />
          <p className="text-sm text-white/60 font-sans">No consultation requests received yet.</p>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-20px" }}
          className="divide-y divide-white/5"
        >
          {displayInquiries.map((inq) => (
            <motion.div
              key={inq.id}
              variants={itemVariants}
            >
              <Link
                href="/dashboard/inquiries"
                className="flex items-center justify-between py-3.5 group cursor-pointer px-2 -mx-2 hover:bg-white/[0.02] rounded-xs transition-colors duration-300 block"
              >
                {/* Left: Name and Inquiry Detail */}
                <div className="flex flex-col gap-0.5 max-w-[50%]">
                  <span className="text-sm font-sans font-semibold text-white tracking-wide group-hover:text-primary transition-colors">
                    {inq.name}
                  </span>
                  <span className="text-xs text-white/60 font-sans tracking-wide truncate">
                    {inq.type}
                  </span>
                </div>

                {/* Right: metadata (time, status icon, click indicator) */}
                <div className="flex items-center gap-4 sm:gap-8">
                  <span className="text-xs font-sans text-white/60 tracking-wider whitespace-nowrap font-medium">
                    {inq.timeAgo}
                  </span>
                  <div className="w-24 flex justify-start">
                    {renderStatus(inq.status)}
                  </div>
                  <ArrowRight
                    size={13}
                    className="text-white/30 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300"
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

