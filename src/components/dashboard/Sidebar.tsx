"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Home,
  FileEdit,
  MessageSquare,
  FileText,
  Settings,
  ExternalLink,
} from "lucide-react";

export interface NavigationItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
}

export interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

export const navigationSections: NavigationSection[] = [
  {
    title: "OVERVIEW",
    items: [
      { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
      { label: "Inquiries", href: "/dashboard/inquiries", icon: MessageSquare },
    ],
  },
  {
    title: "PRODUCT CATALOG",
    items: [
      { label: "Products", href: "/dashboard/products", icon: Package },
      { label: "Categories", href: "/dashboard/categories", icon: FolderTree },
    ],
  },
  {
    title: "WEBSITE CONTENT",
    items: [
      { label: "Homepage CMS", href: "/dashboard/homepage", icon: Home },
      { label: "About Page CMS", href: "/dashboard/pages/about", icon: FileEdit },
      { label: "Blog Posts", href: "/dashboard/blog", icon: FileText },
    ],
  },
];

interface SidebarProps {
  className?: string;
  onLinkClick?: () => void;
}

export function Sidebar({ className, onLinkClick }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-[#0E1B15] border-r border-white/10 w-[240px] md:w-[260px] text-white select-none",
        className
      )}
    >
      {/* Brand Header */}
      <div className="flex flex-col justify-center px-6 py-6 border-b border-white/10 bg-[#0A1410]">
        <Link
          href="/"
          target="_blank"
          onClick={onLinkClick}
          className="group flex items-center justify-between"
        >
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#ED1C24]" />
              <span className="text-lg font-serif font-bold text-white tracking-tight">
                Celife
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#81998D] font-sans font-semibold">
                CMS
              </span>
            </div>
            <span className="text-[10px] uppercase tracking-[0.18em] text-white/50 font-sans mt-0.5 block">
              Health Solutions Admin
            </span>
          </div>
          <ExternalLink
            size={13}
            className="text-white/40 group-hover:text-white transition-colors"
          />
        </Link>
      </div>

      {/* Navigation Areas */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-7">
        {navigationSections.map((section) => (
          <div key={section.title} className="space-y-2">
            <h3 className="px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#81998D]">
              {section.title}
            </h3>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      onClick={onLinkClick}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative flex items-center gap-3 px-3 py-2.5 text-sm font-medium font-sans rounded-xs transition-all duration-200 group outline-none",
                        active
                          ? "bg-[#123C2D] text-white font-semibold shadow-xs"
                          : "text-white/70 hover:text-white hover:bg-white/5"
                      )}
                    >
                      {active && (
                        <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#81998D] rounded-r-xs" />
                      )}

                      <Icon
                        className={cn(
                          "transition-colors duration-200 shrink-0",
                          active
                            ? "text-[#C4D5C7]"
                            : "text-white/40 group-hover:text-white/80"
                        )}
                        size={16}
                      />
                      <span className="tracking-wide text-xs">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Divider */}
      <div className="h-[1px] bg-white/10" />

      {/* Settings & User info */}
      <div className="p-4 space-y-3 bg-[#0A1410]">
        {/* Settings Button */}
        <div>
          <Link
            href="/dashboard/settings"
            onClick={onLinkClick}
            aria-current={isActive("/dashboard/settings") ? "page" : undefined}
            className={cn(
              "relative flex items-center gap-3 px-3 py-2.5 text-sm font-medium font-sans rounded-xs transition-all duration-200 group outline-none",
              isActive("/dashboard/settings")
                ? "bg-[#123C2D] text-white font-semibold shadow-xs"
                : "text-white/70 hover:text-white hover:bg-white/5"
            )}
          >
            {isActive("/dashboard/settings") && (
              <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#81998D] rounded-r-xs" />
            )}
            <Settings
              className={cn(
                "transition-colors duration-200 shrink-0",
                isActive("/dashboard/settings")
                  ? "text-[#C4D5C7]"
                  : "text-white/40 group-hover:text-white/80"
              )}
              size={16}
            />
            <span className="tracking-wide text-xs">Site Settings</span>
          </Link>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3 px-3 py-2 border-t border-white/5 pt-3">
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[#123C2D] text-xs font-sans font-semibold text-[#C4D5C7] select-none border border-white/10">
            CL
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-sans font-semibold text-white tracking-wide">
              Celife Admin
            </span>
            <span className="text-[10px] font-sans text-white/50">
              Content Manager
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
