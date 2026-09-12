"use client";

import React from "react";
import { Search } from "lucide-react";

interface CaseStudyToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  sectorFilter: string;
  onSectorChange: (value: string) => void;
  sortOrder: string;
  onSortChange: (value: string) => void;
}

export function CaseStudyToolbar({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  sectorFilter,
  onSectorChange,
  sortOrder,
  onSortChange,
}: CaseStudyToolbarProps) {
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
          placeholder="Search case studies..."
          className="w-full pl-9 pr-4 py-2 text-xs font-sans bg-black border border-white/5 rounded-xs text-white placeholder-white/30 outline-none transition-all duration-300 focus:border-primary/40 focus:ring-1 focus:ring-primary/20"
        />
      </div>

      {/* Filters Group */}
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
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        {/* Sector Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-[9px] uppercase tracking-wider text-white/40 font-sans">Sector</span>
          <select
            value={sectorFilter}
            onChange={(e) => onSectorChange(e.target.value)}
            className="px-3 py-2 text-xs font-sans bg-black border border-white/5 rounded-xs text-white/85 hover:text-white hover:border-white/10 outline-none cursor-pointer transition-all duration-300 focus:border-primary/40"
          >
            <option value="all">All Sectors</option>
            <option value="Hotel">Hotel</option>
            <option value="Restaurant">Restaurant</option>
            <option value="Resort">Resort</option>
            <option value="Café / QSR">Café / QSR</option>
            <option value="Hospitality Investment">Hospitality Investment</option>
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
