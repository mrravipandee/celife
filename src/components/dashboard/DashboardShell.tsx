"use client";

import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { MobileSidebar } from "./MobileSidebar";

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="dashboard-shell min-h-screen bg-[#F6F8F5] text-[#17201B] antialiased font-sans">
      {/* 1. Desktop Fixed Sidebar */}
      <div className="hidden md:block fixed inset-y-0 left-0 w-[260px] h-screen z-30">
        <Sidebar className="w-full h-full" />
      </div>

      {/* 2. Mobile Drawer Sidebar Overlay */}
      <MobileSidebar isOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} />

      {/* 3. Main Viewport Wrapper */}
      <div className="flex flex-col min-h-screen md:pl-[260px]">
        {/* Top Header Panel */}
        <Topbar onMenuToggle={() => setIsMobileOpen(true)} />

        {/* Content Section Container */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 xl:px-12 py-8 bg-[#F6F8F5]">
          {children}
        </main>
      </div>
    </div>
  );
}
