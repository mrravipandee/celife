"use client";

import React, { useState, useEffect, useRef, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  Loader2,
  Lock,
  Settings,
  LogOut,
  ShieldAlert,
  ArrowLeft,
} from "lucide-react";

interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface SearchResultItem {
  id: string;
  title: string;
  subtitle?: string;
  category: "Project" | "Blog" | "Case Study" | "Inquiry" | "Service";
  href: string;
}

interface TopbarProps {
  onMenuToggle: () => void;
}

export function Topbar({ onMenuToggle }: TopbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const prefersReduced = useReducedMotion();
  const [, startTransition] = useTransition();

  // Active Session State
  const [user, setUser] = useState<SessionUser | null>(null);

  // Dropdown UI States
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Search UI States
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [selectedSearchIndex, setSelectedSearchIndex] = useState(-1);

  // Popover DOM Refs for Click Outside
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const profileContainerRef = useRef<HTMLDivElement>(null);
  const notificationsContainerRef = useRef<HTMLDivElement>(null);

  // Mobile search state and refs
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const mobileProfileRef = useRef<HTMLDivElement>(null);
  const mobileNotificationsRef = useRef<HTMLDivElement>(null);

  // 1. Fetch Session user profile on mount
  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error();
      })
      .then((body) => {
        if (body.success && body.data?.authenticated) {
          setUser(body.data.user);
        }
      })
      .catch(() => {
        // Fallback silently if not loaded
      });
  }, []);

  // Compute initials dynamically (e.g. "Ravi Pandey" -> "RP")
  const userInitials = React.useMemo(() => {
    if (!user?.name) return "AD";
    const parts = user.name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }, [user]);

  // 2. Global Keyboard Shortcut Cmd/Ctrl + K to focus search
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsSearchFocused(true);
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  const handleSearchQueryChange = (val: string) => {
    setSearchQuery(val);
    if (!val.trim()) {
      setSearchResults([]);
      setIsSearchLoading(false);
      setSelectedSearchIndex(-1);
    } else {
      setIsSearchLoading(true);
    }
  };

  // 3. Search input query debounce search
  useEffect(() => {
    if (!searchQuery.trim()) {
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        const query = searchQuery.trim().toLowerCase();

        // Query endpoints concurrently
        const [blogsRes, caseStudiesRes, enquiriesRes, projectsRes, servicesRes] = await Promise.all([
          fetch(`/api/blogs?search=${encodeURIComponent(query)}&limit=4`).then((r) => r.json().catch(() => ({ success: false }))),
          fetch(`/api/case-studies?search=${encodeURIComponent(query)}&limit=4`).then((r) => r.json().catch(() => ({ success: false }))),
          fetch(`/api/enquiries?search=${encodeURIComponent(query)}&limit=4`).then((r) => r.json().catch(() => ({ success: false }))),
          fetch("/api/projects").then((r) => r.json().catch(() => ({ success: false }))),
          fetch("/api/services").then((r) => r.json().catch(() => ({ success: false }))),
        ]);

        const items: SearchResultItem[] = [];

        // 1. Projects client-side filter
        if (projectsRes.success && Array.isArray(projectsRes.data)) {
          const matchedProjects = projectsRes.data
            .filter((p: { title: string; category?: string }) =>
              p.title.toLowerCase().includes(query) ||
              (p.category && p.category.toLowerCase().includes(query))
            )
            .slice(0, 3);
          matchedProjects.forEach((p: { id: string; title: string; category?: string }) => {
            items.push({
              id: p.id,
              title: p.title,
              subtitle: p.category || "Project Details",
              category: "Project",
              href: `/dashboard/projects/${p.id}`,
            });
          });
        }

        // 2. Services client-side filter
        if (servicesRes.success && Array.isArray(servicesRes.data)) {
          const matchedServices = servicesRes.data
            .filter((s: { name: string; category?: string }) =>
              s.name.toLowerCase().includes(query) ||
              (s.category && s.category.toLowerCase().includes(query))
            )
            .slice(0, 3);
          matchedServices.forEach((s: { id: string; name: string; category?: string }) => {
            items.push({
              id: s.id,
              title: s.name,
              subtitle: s.category || "Hospitality Service",
              category: "Service",
              href: `/dashboard/services/${s.id}`,
            });
          });
        }

        // 3. Blogs matches
        if (blogsRes.success && Array.isArray(blogsRes.data)) {
          blogsRes.data.forEach((b: { id: string; title: string; category?: string }) => {
            items.push({
              id: b.id,
              title: b.title,
              subtitle: b.category || "Articles",
              category: "Blog",
              href: `/dashboard/blog/${b.id}/edit`,
            });
          });
        }

        // 4. Case Studies matches
        if (caseStudiesRes.success && Array.isArray(caseStudiesRes.data)) {
          caseStudiesRes.data.forEach((cs: { id: string; title: string; propertyType?: string }) => {
            items.push({
              id: cs.id,
              title: cs.title,
              subtitle: cs.propertyType || "Case Study",
              category: "Case Study",
              href: `/dashboard/case-studies/${cs.id}/edit`,
            });
          });
        }

        // 5. Inquiries matches
        if (enquiriesRes.success && Array.isArray(enquiriesRes.data)) {
          enquiriesRes.data.forEach((e: { id: string; name: string; company?: string }) => {
            items.push({
              id: e.id,
              title: `Inquiry from ${e.name}`,
              subtitle: e.company || "Consultation Request",
              category: "Inquiry",
              href: "/dashboard/inquiries",
            });
          });
        }

        setSearchResults(items);
        setSelectedSearchIndex(items.length > 0 ? 0 : -1);
      } catch (err) {
        console.error("Global search error:", err);
      } finally {
        setIsSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // 4. Keyboard Navigation inside Search Results List
  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (searchResults.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedSearchIndex((prev) => (prev + 1) % searchResults.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedSearchIndex((prev) => (prev - 1 + searchResults.length) % searchResults.length);
    } else if (e.key === "Enter") {
      if (selectedSearchIndex >= 0 && selectedSearchIndex < searchResults.length) {
        e.preventDefault();
        const selected = searchResults[selectedSearchIndex];
        router.push(selected.href);
        setIsSearchFocused(false);
        setSearchQuery("");
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsSearchFocused(false);
      setSearchQuery("");
      searchInputRef.current?.blur();
    }
  };

  // 5. Click outside listeners to dismiss dropdown elements
  useEffect(() => {
    const handleGlobalClick = (event: MouseEvent) => {
      const target = event.target as Node;

      if (searchContainerRef.current && !searchContainerRef.current.contains(target)) {
        setIsSearchFocused(false);
      }
      if (
        profileContainerRef.current && !profileContainerRef.current.contains(target) &&
        (!mobileProfileRef.current || !mobileProfileRef.current.contains(target))
      ) {
        setIsProfileOpen(false);
      }
      if (
        notificationsContainerRef.current && !notificationsContainerRef.current.contains(target) &&
        (!mobileNotificationsRef.current || !mobileNotificationsRef.current.contains(target))
      ) {
        setIsNotificationsOpen(false);
      }
    };

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSearchFocused(false);
        setIsProfileOpen(false);
        setIsNotificationsOpen(false);
        setIsMobileSearchOpen(false);
      }
    };

    window.addEventListener("mousedown", handleGlobalClick);
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => {
      window.removeEventListener("mousedown", handleGlobalClick);
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, []);

  // Logout Trigger handler
  const handleLogoutClick = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });
      if (res.ok) {
        startTransition(() => {
          router.push("/login");
          router.refresh();
        });
      }
    } catch (err) {
      console.error("Logout query error:", err);
    }
  };

  // Group search results helper
  const groupedResults = React.useMemo(() => {
    const groups: Record<string, SearchResultItem[]> = {};
    searchResults.forEach((item) => {
      const cat = item.category;
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
    });
    return groups;
  }, [searchResults]);

  // Helper to resolve page title and breadcrumb based on route
  const getRouteDetails = () => {
    if (pathname.startsWith("/dashboard/products")) {
      return { title: "Product Formulations", breadcrumb: "Celife / Products" };
    }
    if (pathname.startsWith("/dashboard/categories")) {
      return { title: "Categories", breadcrumb: "Celife / Categories" };
    }
    if (pathname.startsWith("/dashboard/homepage")) {
      return { title: "Homepage CMS", breadcrumb: "Celife / Homepage" };
    }
    if (pathname.startsWith("/dashboard/pages/about")) {
      return { title: "About Page CMS", breadcrumb: "Celife / About" };
    }
    if (pathname.startsWith("/dashboard/inquiries")) {
      return { title: "Inquiries", breadcrumb: "Celife / Inquiries" };
    }
    if (pathname.startsWith("/dashboard/blog")) {
      return { title: "Blog Articles", breadcrumb: "Celife / Blog" };
    }
    if (pathname.startsWith("/dashboard/settings")) {
      return { title: "Settings", breadcrumb: "Celife / Settings" };
    }

    switch (pathname) {
      case "/dashboard":
        return { title: "Overview", breadcrumb: "Celife / Dashboard" };
      default:
        return { title: "Dashboard", breadcrumb: "Celife / Dashboard" };
    }
  };

  const { title, breadcrumb } = getRouteDetails();

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between w-full h-[80px] bg-[#FFFFFF] border-b border-[#E1E8E2] px-4 md:px-8 select-none">

      {/* ==========================================
          DESKTOP LAYOUT (visible on md screens up)
         ========================================== */}
      <div className="hidden md:flex items-center justify-between w-full relative">

        {/* Left: Title & Breadcrumbs */}
        <div className="flex flex-col justify-center">
          <span className="text-xs uppercase tracking-[0.12em] text-[#68756D] font-sans font-medium mb-0.5">
            {breadcrumb}
          </span>
          <h1 className="text-xl font-bold tracking-tight text-[#17201B]">
            {title}
          </h1>
        </div>

        {/* Right Actions Block */}
        <div className="flex items-center gap-4 lg:gap-6">

          {/* Global Search Interface Box */}
          <div ref={searchContainerRef} className="relative group z-50">
            <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-[#68756D] group-focus-within:text-[#123C2D] transition-colors">
              <Search size={14} />
            </span>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchQueryChange(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search dashboard... (Cmd+K)"
              className="w-52 xl:w-72 pl-9 pr-8 py-2 text-xs font-sans bg-[#F6F8F5] border border-[#E1E8E2] rounded-xs text-[#17201B] placeholder-[#68756D] outline-none transition-all duration-200 focus:border-[#123C2D] focus:bg-white focus:ring-1 focus:ring-[#123C2D]/10"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => handleSearchQueryChange("")}
                className="absolute right-2.5 top-2.5 text-[10px] font-sans text-[#68756D] hover:text-[#17201B] transition-colors cursor-pointer"
              >
                Clear
              </button>
            )}

            {/* Dropdown Results Box */}
            <AnimatePresence>
              {isSearchFocused && (searchQuery.trim() !== "" || isSearchLoading) && (
                <motion.div
                  initial={{ opacity: 0, y: prefersReduced ? 0 : 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: prefersReduced ? 0.05 : 0.2, ease: "easeOut" }}
                  className="absolute right-0 mt-2 w-84 max-h-[360px] overflow-y-auto bg-[#FFFFFF] border border-[#E1E8E2] rounded-xs shadow-xl z-50 p-3.5 space-y-3"
                >
                  {isSearchLoading ? (
                    <div className="flex items-center justify-center py-8 gap-2">
                      <Loader2 className="animate-spin text-[#123C2D]" size={15} />
                      <span className="text-xs text-[#68756D] font-sans font-medium">
                        Querying database...
                      </span>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="space-y-3 font-sans text-left">
                      {Object.entries(groupedResults).map(([cat, list]) => (
                        <div key={cat} className="space-y-1">
                          <span className="text-[11px] font-semibold text-[#123C2D] uppercase tracking-[0.14em] block pl-2 mb-1">
                            {cat}s
                          </span>
                          <div className="space-y-0.5">
                            {list.map((item) => {
                              const overallIdx = searchResults.findIndex((r) => r.id === item.id && r.category === item.category);
                              const active = overallIdx === selectedSearchIndex;

                              return (
                                <button
                                  key={`${item.category}-${item.id}`}
                                  type="button"
                                  onClick={() => {
                                    router.push(item.href);
                                    setIsSearchFocused(false);
                                    setSearchQuery("");
                                  }}
                                  onMouseEnter={() => setSelectedSearchIndex(overallIdx)}
                                  className={`w-full text-left px-2.5 py-2 rounded-xs flex flex-col gap-0.5 border outline-none transition-colors cursor-pointer ${active
                                    ? "bg-[#F0F4F0] border-[#E1E8E2] text-[#17201B]"
                                    : "border-transparent text-[#17201B] hover:bg-[#F6F8F5]"
                                    }`}
                                >
                                  <span className="text-xs font-semibold truncate">{item.title}</span>
                                  {item.subtitle && (
                                    <span className="text-[11px] text-[#68756D] truncate">{item.subtitle}</span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 space-y-1">
                      <ShieldAlert className="mx-auto text-[#68756D] mb-1" size={18} />
                      <p className="text-xs uppercase tracking-wider text-[#17201B] font-sans font-semibold">
                        No matches found
                      </p>
                      <p className="text-xs text-[#68756D] font-sans">
                        Verify spelling and query filters.
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notifications Trigger */}
          <div ref={notificationsContainerRef} className="relative z-50">
            <button
              type="button"
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              aria-label="View notifications"
              className={`relative p-2 rounded-xs transition-colors cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-[#123C2D]/50 ${isNotificationsOpen ? "text-[#123C2D] bg-[#F0F4F0]" : "text-[#68756D] hover:text-[#17201B] hover:bg-[#F6F8F5]"
                }`}
            >
              <Bell size={16} />
            </button>

            {/* Notifications Popover */}
            <AnimatePresence>
              {isNotificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: prefersReduced ? 0 : 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: prefersReduced ? 0.05 : 0.2, ease: "easeOut" }}
                  className="absolute right-0 mt-2 w-72 bg-[#FFFFFF] border border-[#E1E8E2] rounded-xs shadow-xl p-4 text-center select-none font-sans"
                >
                  <span className="text-xs uppercase tracking-[0.14em] text-[#68756D] block border-b border-[#E1E8E2] pb-2 mb-3 font-semibold">
                    Notifications
                  </span>
                  <div className="py-5">
                    <p className="text-xs font-semibold text-[#17201B] mb-0.5">
                      You&apos;re all caught up
                    </p>
                    <p className="text-xs text-[#68756D]">
                      No new notifications.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile Dropdown Trigger */}
          <div ref={profileContainerRef} className="relative z-50 flex items-center gap-3 border-l border-[#E1E8E2] pl-4 lg:pl-6 py-1">
            <div className="flex items-center justify-center w-8 h-8 rounded-full border border-[#123C2D]/20 bg-[#123C2D]/10 text-xs font-sans font-bold text-[#123C2D] select-none">
              {userInitials}
            </div>
            <button
              type="button"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-1.5 text-xs font-sans text-[#17201B] hover:text-[#123C2D] transition-colors cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-[#123C2D]/50 py-0.5"
            >
              <span className="font-semibold">{user?.name || "Admin"}</span>
              <ChevronDown
                size={13}
                className={`text-[#68756D] transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Profile Dropdown Menu */}
            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: prefersReduced ? 1 : 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: prefersReduced ? 1 : 0.95 }}
                  transition={{ duration: prefersReduced ? 0.05 : 0.15, ease: "easeOut" }}
                  className="absolute right-0 mt-2 w-56 bg-[#FFFFFF] border border-[#E1E8E2] rounded-xs shadow-xl p-2 select-none z-50 text-left font-sans mt-[110px]"
                >
                  {/* Account Header info */}
                  <div className="px-3 py-2 border-b border-[#E1E8E2] mb-1.5">
                    <span className="text-xs font-semibold text-[#17201B] tracking-wide block truncate">
                      {user?.name || "Celife Admin"}
                    </span>
                    <span className="text-[11px] text-[#68756D] block truncate">
                      {user?.email || "admin@celife.in"}
                    </span>
                    <div className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-xs bg-[#123C2D]/10 border border-[#123C2D]/20 text-[10px] font-bold text-[#123C2D] tracking-wider uppercase">
                      <Lock size={10} /> {user?.role || "Admin"}
                    </div>
                  </div>

                  {/* Actions Links */}
                  <Link
                    href="/dashboard/settings"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#17201B] hover:bg-[#F6F8F5] rounded-xs transition-colors"
                  >
                    <Settings size={14} className="text-[#68756D]" />
                    <span>Settings</span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogoutClick}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#C0392B] hover:bg-red-50 rounded-xs transition-colors text-left cursor-pointer border border-transparent outline-none"
                  >
                    <LogOut size={14} className="text-[#C0392B]" />
                    <span>Log Out</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* ==========================================
          MOBILE LAYOUT (visible below md screens)
         ========================================== */}
      <div className="flex md:hidden items-center justify-between w-full relative">
        {/* Left: Mobile Drawer Trigger Toggle */}
        <button
          type="button"
          onClick={onMenuToggle}
          aria-label="Open navigation menu"
          className="p-2 -ml-2 text-[#17201B] hover:bg-[#F6F8F5] rounded-xs transition-colors cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-[#123C2D]/50"
        >
          <Menu size={20} />
        </button>

        {/* Center: Brand Logo */}
        <div className="flex items-center gap-1.5 select-none">
          <span className="w-2 h-2 rounded-full bg-[#ED1C24]" />
          <span className="tracking-wider font-bold text-[#17201B] text-base">
            CELIFE
          </span>
        </div>

        {/* Right: Search, Notifications & Profile Avatar */}
        <div className="flex items-center gap-1.5">

          {/* Mobile Search Button */}
          <button
            type="button"
            onClick={() => setIsMobileSearchOpen(true)}
            aria-label="Search"
            className="p-2 text-[#68756D] hover:text-[#17201B] hover:bg-[#F6F8F5] rounded-xs transition-colors cursor-pointer outline-none"
          >
            <Search size={16} />
          </button>

          {/* Mobile Bell Button */}
          <div ref={mobileNotificationsRef} className="relative flex items-center">
            <button
              type="button"
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              aria-label="View notifications"
              className={`p-2 rounded-xs transition-colors cursor-pointer outline-none ${isNotificationsOpen ? "text-[#123C2D] bg-[#F0F4F0]" : "text-[#68756D] hover:text-[#17201B] hover:bg-[#F6F8F5]"
                }`}
            >
              <Bell size={16} />
            </button>

            {/* Popover content rendered on mobile */}
            <AnimatePresence>
              {isNotificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: prefersReduced ? 0 : 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: prefersReduced ? 0.05 : 0.2, ease: "easeOut" }}
                  className="absolute right-0 top-10 w-64 bg-[#FFFFFF] border border-[#E1E8E2] rounded-xs shadow-xl p-4 text-center select-none font-sans z-50"
                >
                  <span className="text-xs uppercase tracking-[0.14em] text-[#68756D] block border-b border-[#E1E8E2] pb-2 mb-3 font-semibold">
                    Notifications
                  </span>
                  <div className="py-4">
                    <p className="text-xs font-semibold text-[#17201B] mb-0.5">
                      You&apos;re all caught up
                    </p>
                    <p className="text-xs text-[#68756D]">
                      No new notifications.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Profile Trigger */}
          <div ref={mobileProfileRef} className="relative flex items-center">
            <button
              type="button"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              aria-label="Toggle profile menu"
              className="flex items-center justify-center w-7 h-7 rounded-full border border-[#123C2D]/20 bg-[#123C2D]/10 text-xs font-sans font-bold text-[#123C2D] select-none cursor-pointer outline-none"
            >
              {userInitials}
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: prefersReduced ? 1 : 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: prefersReduced ? 1 : 0.95 }}
                  transition={{ duration: prefersReduced ? 0.05 : 0.15, ease: "easeOut" }}
                  className="absolute right-0 top-10 w-52 bg-[#FFFFFF] border border-[#E1E8E2] rounded-xs shadow-xl p-2 select-none z-50 text-left font-sans"
                >
                  <div className="px-3 py-2 border-b border-[#E1E8E2] mb-1.5">
                    <span className="text-xs font-semibold text-[#17201B] tracking-wide block truncate">
                      {user?.name || "Celife Admin"}
                    </span>
                    <span className="text-[11px] text-[#68756D] block truncate">
                      {user?.email || "admin@celife.in"}
                    </span>
                    <div className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded-xs bg-[#123C2D]/10 border border-[#123C2D]/20 text-[10px] font-bold text-[#123C2D] tracking-wider uppercase">
                      <Lock size={10} /> {user?.role || "Admin"}
                    </div>
                  </div>

                  <Link
                    href="/dashboard/settings"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#17201B] hover:bg-[#F6F8F5] rounded-xs transition-colors"
                  >
                    <Settings size={14} className="text-[#68756D]" />
                    <span>Settings</span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogoutClick}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#C0392B] hover:bg-red-50 rounded-xs transition-colors text-left cursor-pointer border border-transparent outline-none"
                  >
                    <LogOut size={14} className="text-[#C0392B]" />
                    <span>Log Out</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* Full-width Search Overlay for Mobile */}
      <AnimatePresence>
        {isMobileSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: prefersReduced ? 0.05 : 0.2, ease: "easeOut" }}
            className="fixed inset-0 bg-[#FFFFFF] z-[60] flex flex-col p-4 space-y-4"
          >
            {/* Top input bar */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsMobileSearchOpen(false);
                  handleSearchQueryChange("");
                }}
                className="p-2 text-[#68756D] hover:text-[#17201B] outline-none cursor-pointer"
                aria-label="Close search overlay"
              >
                <ArrowLeft size={18} />
              </button>

              <div className="relative flex-grow">
                <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-[#68756D]">
                  <Search size={14} />
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchQueryChange(e.target.value)}
                  placeholder="Search dashboard..."
                  className="w-full pl-9 pr-8 py-2.5 text-xs font-sans bg-[#F6F8F5] border border-[#E1E8E2] rounded-xs text-[#17201B] placeholder-[#68756D] outline-none focus:border-[#123C2D]"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => handleSearchQueryChange("")}
                    className="absolute right-2.5 top-2.5 text-xs font-sans text-[#68756D] hover:text-[#17201B] cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Results Scroll Area */}
            <div className="flex-grow overflow-y-auto max-h-[calc(100vh-80px)] scrollbar-none">
              {isSearchLoading ? (
                <div className="flex items-center justify-center py-16 gap-2">
                  <Loader2 className="animate-spin text-[#123C2D]" size={16} />
                  <span className="text-xs text-[#68756D] font-sans">
                    Searching...
                  </span>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-4 font-sans pb-12">
                  {Object.entries(groupedResults).map(([cat, list]) => (
                    <div key={cat} className="space-y-1">
                      <span className="text-xs font-semibold text-[#123C2D] uppercase tracking-[0.14em] block pl-2 mb-1">
                        {cat}s
                      </span>
                      <div className="space-y-1">
                        {list.map((item) => (
                          <button
                            key={`${item.category}-${item.id}`}
                            type="button"
                            onClick={() => {
                              router.push(item.href);
                              setIsMobileSearchOpen(false);
                              handleSearchQueryChange("");
                            }}
                            className="w-full text-left px-3 py-2.5 rounded-xs bg-[#F6F8F5] border border-[#E1E8E2] flex flex-col gap-0.5 text-[#17201B] hover:bg-[#F0F4F0] cursor-pointer"
                          >
                            <span className="text-xs font-semibold truncate">{item.title}</span>
                            {item.subtitle && (
                              <span className="text-[11px] text-[#68756D] truncate">{item.subtitle}</span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : searchQuery.trim() !== "" ? (
                <div className="text-center py-16 space-y-1">
                  <ShieldAlert className="mx-auto text-[#68756D] mb-2" size={20} />
                  <p className="text-xs uppercase tracking-wider text-[#17201B] font-sans font-semibold">
                    No results found
                  </p>
                  <p className="text-xs text-[#68756D] font-sans">
                    Verify spelling and search filters.
                  </p>
                </div>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </header>
  );
}
