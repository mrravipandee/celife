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
    <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center bg-white border border-[#E1E8E2] p-4 rounded-lg shadow-xs select-none">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md group">
        <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-[#68756D] group-focus-within:text-[#123C2D] transition-colors">
          <Search size={15} />
        </span>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search articles by title or keyword..."
          className="w-full pl-9 pr-4 py-2 text-xs font-sans bg-[#F6F8F5] border border-[#E1E8E2] rounded-md text-[#17201B] placeholder-[#68756D]/60 outline-none transition-all duration-200 focus:bg-white focus:border-[#123C2D] focus:ring-2 focus:ring-[#123C2D]/10"
        />
      </div>

      {/* Filters group */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-sans font-medium text-[#68756D]">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="px-3 py-1.5 text-xs font-sans bg-[#F6F8F5] border border-[#E1E8E2] rounded-md text-[#17201B] hover:border-[#123C2D]/40 outline-none cursor-pointer transition-colors focus:border-[#123C2D] focus:bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-sans font-medium text-[#68756D]">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="px-3 py-1.5 text-xs font-sans bg-[#F6F8F5] border border-[#E1E8E2] rounded-md text-[#17201B] hover:border-[#123C2D]/40 outline-none cursor-pointer transition-colors focus:border-[#123C2D] focus:bg-white"
          >
            <option value="all">All Categories</option>
            <option value="Nutraceuticals">Nutraceuticals</option>
            <option value="Herbal Science">Herbal Science</option>
            <option value="Clinical Formulations">Clinical Formulations</option>
            <option value="Wellness & Lifestyle">Wellness & Lifestyle</option>
            <option value="Research & Quality">Research & Quality</option>
          </select>
        </div>

        {/* Sort Order */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-sans font-medium text-[#68756D]">Sort:</span>
          <select
            value={sortOrder}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-3 py-1.5 text-xs font-sans bg-[#F6F8F5] border border-[#E1E8E2] rounded-md text-[#17201B] hover:border-[#123C2D]/40 outline-none cursor-pointer transition-colors focus:border-[#123C2D] focus:bg-white"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>
    </div>
  );
}
