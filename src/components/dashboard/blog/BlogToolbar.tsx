"use client";

import React from "react";
import { Search } from "lucide-react";

interface BlogToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  sortOrder: string;
  onSortChange: (value: string) => void;
}

export function BlogToolbar({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  categoryFilter,
  onCategoryChange,
  sortOrder,
  onSortChange,
}: BlogToolbarProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center bg-[#050505] border border-white/5 p-4 rounded-xs select-none">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md group">
        <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-white/40 group-focus-within:text-primary transition-colors">
          <Search size={14} />
        </span>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search articles..."
          className="w-full pl-9 pr-4 py-2 text-xs font-sans bg-black border border-white/5 rounded-xs text-white placeholder-white/30 outline-none transition-all duration-300 focus:border-primary/40 focus:ring-1 focus:ring-primary/20"
        />
      </div>

      {/* Filters group */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Status Filter */}
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

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <span className="text-[9px] uppercase tracking-wider text-white/40 font-sans">Category</span>
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="px-3 py-2 text-xs font-sans bg-black border border-white/5 rounded-xs text-white/85 hover:text-white hover:border-white/10 outline-none cursor-pointer transition-all duration-300 focus:border-primary/40"
          >
            <option value="all">All</option>
            <option value="Hospitality">Hospitality</option>
            <option value="Operations">Operations</option>
            <option value="Restaurant">Restaurant</option>
            <option value="Marketing">Marketing</option>
            <option value="Resort">Resort</option>
          </select>
        </div>

        {/* Sort Order */}
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
