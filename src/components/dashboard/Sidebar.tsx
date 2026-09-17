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
import Image from "next/image";

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
      { label: "Enquiries", href: "/dashboard/inquiries", icon: MessageSquare },
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
  {
    title: "SYSTEM",
    items: [
      { label: "Site Settings", href: "/dashboard/settings", icon: Settings },
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
        "flex flex-col h-full bg-[#FFFFFF] border-r border-[#E1E8E2] w-[260px] text-[#17201B] select-none",
        className
      )}
    >
      {/* Brand Header */}
      <div className="flex flex-col justify-center px-6 py-5 border-b border-[#E1E8E2] bg-[#FFFFFF]">
        <Link
          href="/"
          target="_blank"
          onClick={onLinkClick}
          className="group flex items-center justify-between"
        >
          <div className="flex items-center">
            <Image src="/celife-brand.png" alt="Logo" width={180} height={60} className="w-auto h-11 object-contain" />
          </div>
          <ExternalLink
            size={14}
            className="text-[#68756D] group-hover:text-[#17201B] transition-colors"
          />
        </Link>
      </div>

      {/* Navigation Areas */}
      <nav className="flex-1 overflow-y-auto py-5 px-3.5 space-y-6">
        {navigationSections.map((section) => (
          <div key={section.title} className="space-y-1.5">
            <h3 className="px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6F8F80]">
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
                        "relative flex items-center gap-3 px-3 py-2 text-xs font-medium font-sans rounded-xs transition-all duration-150 group outline-none",
                        active
                          ? "bg-[#F0F4F0] text-[#123C2D] font-semibold shadow-2xs"
                          : "text-[#68756D] hover:text-[#17201B] hover:bg-[#F6F8F5]"
                      )}
                    >
                      {active && (
                        <span className="absolute left-0 top-1 bottom-1 w-[3px] bg-[#123C2D] rounded-r-xs" />
                      )}

                      <Icon
                        className={cn(
                          "transition-colors duration-150 shrink-0",
                          active
                            ? "text-[#123C2D]"
                            : "text-[#6F8F80] group-hover:text-[#17201B]"
                        )}
                        size={16}
                      />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Divider */}
      <div className="h-[1px] bg-[#E1E8E2]" />

      {/* User info */}
      <div className="p-3.5 bg-[#FFFFFF]">
        <div className="flex items-center gap-2.5 p-2 bg-[#F6F8F5] border border-[#E1E8E2] rounded-xs">
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[#123C2D]/10 text-xs font-sans font-semibold text-[#123C2D] select-none border border-[#123C2D]/20 shrink-0">
            CL
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-sans font-semibold text-[#17201B] truncate">
              Celife Admin
            </span>
            <span className="text-[10px] font-sans text-[#68756D] truncate">
              Content Manager
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
