"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  MessageSquare,
  Compass,
  FileText,
  BookOpen,
  Settings,
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
    ],
  },
  {
    title: "BUSINESS",
    items: [
      { label: "Projects", href: "/dashboard/projects", icon: Briefcase },
      { label: "Clients", href: "/dashboard/clients", icon: Users },
      { label: "Inquiries", href: "/dashboard/inquiries", icon: MessageSquare },
    ],
  },
  {
    title: "CONTENT",
    items: [
      { label: "Services", href: "/dashboard/services", icon: Compass },
      { label: "Blog", href: "/dashboard/blog", icon: FileText },
      { label: "Case Studies", href: "/dashboard/case-studies", icon: BookOpen },
    ],
  },
];

interface SidebarProps {
  className?: string;
  onLinkClick?: () => void;
}

export function Sidebar({ className, onLinkClick }: SidebarProps) {
  const pathname = usePathname();

  // Helper to determine if a link is active
  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-[#050505] border-r border-white/5 w-[240px] md:w-[260px] text-white select-none",
        className
      )}
    >
      {/* Brand Header */}
      <div className="flex flex-col justify-center px-6 py-7 border-b border-white/5">
        <Link
          href="/"
          onClick={onLinkClick}
          className="text-xl font-serif tracking-widest text-white block"
        >
          THE DCO
        </Link>
        <span className="text-xs uppercase tracking-[0.16em] text-white/60 font-sans mt-1">
          HOSPITALITY ADVISORY
        </span>
      </div>

      {/* Navigation Areas */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-7">
        {navigationSections.map((section) => (
          <div key={section.title} className="space-y-2">
            <h3 className="px-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/65">
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
                        "relative flex items-center gap-3 px-3 py-2.5 text-sm font-medium font-sans rounded-sm transition-all duration-300 group outline-none focus-visible:ring-1 focus-visible:ring-primary/50",
                        active
                          ? "bg-primary/5 text-white"
                          : "text-white/70 hover:text-white hover:bg-white/5"
                      )}
                    >
                      {/* Gold left indicator line */}
                      {active && (
                        <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-primary" />
                      )}

                      <Icon
                        className={cn(
                          "transition-colors duration-300",
                          active
                            ? "text-primary"
                            : "text-white/40 group-hover:text-white/80"
                        )}
                        size={15}
                      />
                      <span className="tracking-wide">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Divider */}
      <div className="h-[1px] bg-white/5" />

      {/* Settings & User info */}
      <div className="p-4 space-y-4">
        {/* Settings Button */}
        <div>
          <Link
            href="/dashboard/settings"
            onClick={onLinkClick}
            aria-current={isActive("/dashboard/settings") ? "page" : undefined}
            className={cn(
              "relative flex items-center gap-3 px-3 py-2.5 text-sm font-medium font-sans rounded-sm transition-all duration-300 group outline-none focus-visible:ring-1 focus-visible:ring-primary/50",
              isActive("/dashboard/settings")
                ? "bg-primary/5 text-white"
                : "text-white/70 hover:text-white hover:bg-white/5"
            )}
          >
            {isActive("/dashboard/settings") && (
              <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-primary" />
            )}
            <Settings
              className={cn(
                "transition-colors duration-300",
                isActive("/dashboard/settings")
                  ? "text-primary"
                  : "text-white/40 group-hover:text-white/80"
              )}
              size={15}
            />
            <span className="tracking-wide">Settings</span>
          </Link>
        </div>

        {/* User Info (Bottom of Sidebar) */}
        <div className="flex items-center gap-3 px-3 py-2 border-t border-white/5 pt-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white/10 bg-white/5 text-xs font-sans font-semibold text-white select-none">
            AD
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-sans font-semibold text-white tracking-wide">
              Admin
            </span>
            <span className="text-xs font-sans text-white/60 tracking-wider">
              Administrator
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
