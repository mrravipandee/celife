"use client";

import React from "react";
import { Search } from "lucide-react";

interface InquiryToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  dateFilter: string;
  onDateChange: (value: string) => void;
  sortOrder: string;
  onSortChange: (value: string) => void;
}

export function InquiryToolbar({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  dateFilter,
  onDateChange,
  sortOrder,
  onSortChange,
}: InquiryToolbarProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center bg-[#050505] border border-white/5 p-4 rounded-xs select-none">
      {/* Search Input Box */}
      <div className="relative flex-1 max-w-md group">
        <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-white/40 group-focus-within:text-primary transition-colors">
          <Search size={14} />
        </span>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search inquiries..."
          className="w-full pl-9 pr-4 py-2 text-xs font-sans bg-black border border-white/5 rounded-xs text-white placeholder-white/30 outline-none transition-all duration-300 focus:border-primary/40 focus:ring-1 focus:ring-primary/20"
        />
      </div>

      {/* Dropdown Filters Group */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Status Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-[9px] uppercase tracking-wider text-white/40 font-sans">Status</span>
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="px-3 py-2 text-xs font-sans bg-black border border-white/5 rounded-xs text-white/85 hover:text-white hover:border-white/10 outline-none cursor-pointer transition-all duration-300 focus:border-primary/40"
          >
            <option value="all">All</option>
            <option value="new">New</option>
            <option value="in-progress">In Progress</option>
            <option value="contacted">Contacted</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {/* Date Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-[9px] uppercase tracking-wider text-white/40 font-sans">Date</span>
          <select
            value={dateFilter}
            onChange={(e) => onDateChange(e.target.value)}
            className="px-3 py-2 text-xs font-sans bg-black border border-white/5 rounded-xs text-white/85 hover:text-white hover:border-white/10 outline-none cursor-pointer transition-all duration-300 focus:border-primary/40"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-[9px] uppercase tracking-wider text-white/40 font-sans">Sort</span>
          <select
            value={sortOrder}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-3 py-2 text-xs font-sans bg-black border border-white/5 rounded-xs text-white/85 hover:text-white hover:border-white/10 outline-none cursor-pointer transition-all duration-300 focus:border-primary/40"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>
    </div>
  );
}
