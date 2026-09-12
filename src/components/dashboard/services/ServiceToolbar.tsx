"use client";

import React from "react";
import { Search, X } from "lucide-react";

interface ServiceToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  sortOrder: string;
  onSortChange: (value: string) => void;
  isFilterActive: boolean;
  onClearFilters: () => void;
}

export function ServiceToolbar({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  categoryFilter,
  onCategoryChange,
  sortOrder,
  onSortChange,
  isFilterActive,
  onClearFilters,
}: ServiceToolbarProps) {
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
          placeholder="Search services..."
          className="w-full pl-9 pr-4 py-2 text-xs font-sans bg-black border border-white/5 rounded-xs text-white placeholder-white/30 outline-none transition-all duration-300 focus:border-primary/40 focus:ring-1 focus:ring-primary/20"
        />
      </div>

      {/* Filters & Actions Group */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Category Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-[9px] uppercase tracking-wider text-white/40 font-sans">Category</span>
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="px-3 py-2 text-xs font-sans bg-black border border-white/5 rounded-xs text-white/85 hover:text-white hover:border-white/10 outline-none cursor-pointer transition-all duration-300 focus:border-primary/40"
          >
            <option value="all">All Categories</option>
            <option value="Operations">Operations</option>
            <option value="Finance">Finance</option>
            <option value="Restaurant Advisory">Restaurant Advisory</option>
            <option value="Development">Development</option>
            <option value="Brand & Marketing">Brand & Marketing</option>
            <option value="People & Operations">People & Operations</option>
            <option value="Business Strategy">Business Strategy</option>
          </select>
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-[9px] uppercase tracking-wider text-white/40 font-sans">Status</span>
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="px-3 py-2 text-xs font-sans bg-black border border-white/5 rounded-xs text-white/85 hover:text-white hover:border-white/10 outline-none cursor-pointer transition-all duration-300 focus:border-primary/40"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="hidden">Archived</option>
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
            <option value="order">Display Order</option>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="a-z">A–Z</option>
            <option value="z-a">Z–A</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        {isFilterActive && (
          <button
            type="button"
            onClick={onClearFilters}
            className="flex items-center gap-1 px-3 py-2 border border-[#C9A24A]/20 text-[#C9A24A] hover:bg-[#C9A24A]/10 text-[9px] uppercase tracking-widest font-sans font-semibold rounded-xs transition-colors outline-none cursor-pointer"
          >
            <X size={10} />
            <span>Clear Filters</span>
          </button>
        )}
      </div>
    </div>
  );
}
