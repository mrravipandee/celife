"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { StatCard } from "@/components/dashboard/StatCard";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import {
  Package,
  MessageSquare,
  Clock,
  FileText,
  PlusCircle,
  Eye,
  Home,
  Settings,
  ArrowUpRight,
  AlertCircle,
} from "lucide-react";

import { getEnquiriesClient } from "@/lib/services/enquiries-client";
import { getBlogsClient } from "@/lib/services/blogs-client";
import { Inquiry } from "@/types/enquiry";
import { Product } from "@/types/product";

interface DashboardStats {
  totalProducts: number;
  totalInquiries: number;
  newInquiries: number;
  inProgressInquiries: number;
  publishedBlogs: number;
}

export default function DashboardOverviewPage() {
  const prefersReduced = useReducedMotion();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentInquiries, setRecentInquiries] = useState<Inquiry[]>([]);
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    let active = true;

    const fetchDashboardData = async () => {
      try {
        const [
          productsRes,
          enquiriesAllRes,
          enquiriesNewRes,
          enquiriesInProgressRes,
          blogsRes,
        ] = await Promise.all([
          fetch("/api/products").then((r) => (r.ok ? r.json() : { data: [] })),
          getEnquiriesClient({ limit: 6 }).catch(() => ({
            data: [] as Inquiry[],
            pagination: { total: 0, page: 1, limit: 6, totalPages: 1 },
          })),
          getEnquiriesClient({ status: "new", limit: 1 }).catch(() => ({
            data: [] as Inquiry[],
            pagination: { total: 0, page: 1, limit: 1, totalPages: 1 },
          })),
          getEnquiriesClient({ status: "in-progress", limit: 1 }).catch(() => ({
            data: [] as Inquiry[],
            pagination: { total: 0, page: 1, limit: 1, totalPages: 1 },
          })),
          getBlogsClient({ status: "published", limit: 1 }).catch(() => ({
            data: [],
            pagination: { total: 0, page: 1, limit: 1, totalPages: 1 },
          })),
        ]);

        if (!active) return;

        const productsList = productsRes?.data || [];
        const totalProducts = productsList.length;
        const totalInquiries = enquiriesAllRes.pagination?.total || 0;
        const newInquiries = enquiriesNewRes.pagination?.total || 0;
        const inProgressInquiries = enquiriesInProgressRes.pagination?.total || 0;
        const publishedBlogs = blogsRes.pagination?.total || 0;

        setStats({
          totalProducts,
          totalInquiries,
          newInquiries,
          inProgressInquiries,
          publishedBlogs,
        });

        setRecentProducts(productsList.slice(0, 4));
        setRecentInquiries(Array.isArray(enquiriesAllRes.data) ? enquiriesAllRes.data.slice(0, 5) : []);
      } catch (err: unknown) {
        console.error("Dashboard overview fetch error:", err);
        if (active) {
          setError("Failed to load dashboard overview data.");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    fetchDashboardData();

    return () => {
      active = false;
    };
  }, [refreshTrigger]);

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    setRefreshTrigger((t) => t + 1);
  };

  if (isLoading) {
    return <LoadingState variant="card" />;
  }

  if (error) {
    return (
      <ErrorState
        title="Unable to load Dashboard Overview"
        description="Could not connect to the backend database to retrieve metrics. Please verify your session."
        onRetry={handleRetry}
      />
    );
  }

  const statCards = [
    {
      id: "total-products",
      label: "Total Products",
      value: String(stats?.totalProducts || 0).padStart(2, "0"),
      change: "Active in formulation catalogue",
      icon: Package,
    },
    {
      id: "total-inquiries",
      label: "Total Enquiries",
      value: String(stats?.totalInquiries || 0).padStart(2, "0"),
      change: "Received across all channels",
      icon: MessageSquare,
    },
    {
      id: "new-inquiries",
      label: "New Enquiries",
      value: String(stats?.newInquiries || 0).padStart(2, "0"),
      change: "Awaiting initial review",
      icon: AlertCircle,
    },
    {
      id: "in-progress-inquiries",
      label: "In Progress",
      value: String(stats?.inProgressInquiries || 0).padStart(2, "0"),
      change: "Under active consultation",
      icon: Clock,
    },
    {
      id: "published-blogs",
      label: "Published Articles",
      value: String(stats?.publishedBlogs || 0).padStart(2, "0"),
      change: "Healthcare & wellness insights",
      icon: FileText,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: prefersReduced ? 0 : 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: prefersReduced ? 0.05 : 0.4,
        ease: [0.16, 1, 0.3, 1] as const,
      }}
      className="space-y-8 pb-12 select-none"
    >
      {/* 1. Celife Header & Quick Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ED1C24]" />
            <span className="text-[11px] uppercase tracking-[0.24em] font-sans font-semibold text-[#81998D]">
              Celife Health Solutions CMS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight mt-1">
            Website Content & Catalogue Overview
          </h1>
          <p className="text-xs sm:text-sm text-white/60 font-sans mt-1">
            Manage your public formulations, sections, enquiries, and brand settings.
          </p>
        </div>

        {/* Quick Actions Strip */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/dashboard/products/new"
            className="px-4 py-2.5 bg-[#123C2D] hover:bg-[#294F3D] text-white text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors flex items-center gap-2 border border-white/10 shadow-xs"
          >
            <PlusCircle size={14} />
            <span>Add Product</span>
          </Link>
          <Link
            href="/dashboard/inquiries"
            className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors flex items-center gap-2 border border-white/10"
          >
            <Eye size={14} />
            <span>View Enquiries</span>
          </Link>
          <Link
            href="/dashboard/homepage"
            className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors flex items-center gap-2 border border-white/10"
          >
            <Home size={14} />
            <span>Edit Homepage</span>
          </Link>
          <Link
            href="/dashboard/settings"
            className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors flex items-center gap-2 border border-white/10"
          >
            <Settings size={14} />
            <span>Edit Settings</span>
          </Link>
        </div>
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((stat, idx) => (
          <StatCard
            key={stat.id}
            index={idx}
            label={stat.label}
            value={stat.value}
            change={stat.change}
          />
        ))}
      </div>

      {/* 3. Middle Section: Recent Product Enquiries & Catalog Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Enquiries (7 cols) */}
        <div className="lg:col-span-7 bg-[#0E1B15] border border-white/10 rounded-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h2 className="text-base font-serif font-bold text-white">
                Recent Product Enquiries
              </h2>
              <span className="text-xs text-white/50 font-sans">
                Real-time submissions from the public enquiry desk
              </span>
            </div>
            <Link
              href="/dashboard/inquiries"
              className="text-xs text-[#81998D] hover:text-white transition-colors flex items-center gap-1 font-medium"
            >
              <span>View All</span>
              <ArrowUpRight size={13} />
            </Link>
          </div>

          {recentInquiries.length === 0 ? (
            <div className="py-8 text-center text-xs text-white/50">
              No enquiries recorded yet. Submissions from the public enquiry desk will appear here.
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {recentInquiries.map((inq) => {
                const dateStr = inq.createdAt
                  ? new Date(inq.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "Recently";

                return (
                  <div key={inq.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <strong className="text-sm font-sans font-medium text-white truncate">
                          {inq.name}
                        </strong>
                        {inq.product && (
                          <span className="text-[10px] px-2 py-0.5 bg-[#123C2D] text-[#C4D5C7] rounded-xs font-semibold uppercase tracking-wider shrink-0">
                            {inq.product}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-white/60 truncate font-sans">
                        {inq.email} · {inq.phone}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span
                        className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-xs tracking-wider ${
                          inq.status === "new"
                            ? "bg-[#ED1C24]/20 text-[#FF7A7A]"
                            : inq.status === "in-progress"
                            ? "bg-amber-500/20 text-amber-300"
                            : inq.status === "contacted"
                            ? "bg-blue-500/20 text-blue-300"
                            : "bg-emerald-500/20 text-emerald-300"
                        }`}
                      >
                        {inq.status}
                      </span>
                      <span className="text-[11px] text-white/40 font-sans hidden sm:inline">
                        {dateStr}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Product Catalog Highlights (5 cols) */}
        <div className="lg:col-span-5 bg-[#0E1B15] border border-white/10 rounded-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h2 className="text-base font-serif font-bold text-white">
                Catalogue Formulations
              </h2>
              <span className="text-xs text-white/50 font-sans">
                Formulations active in the website catalogue
              </span>
            </div>
            <Link
              href="/dashboard/products"
              className="text-xs text-[#81998D] hover:text-white transition-colors flex items-center gap-1 font-medium"
            >
              <span>Manage</span>
              <ArrowUpRight size={13} />
            </Link>
          </div>

          {recentProducts.length === 0 ? (
            <div className="py-8 text-center text-xs text-white/50">
              No products found.
            </div>
          ) : (
            <div className="space-y-3">
              {recentProducts.map((p) => (
                <div
                  key={p.id}
                  className="p-3 bg-white/5 rounded-xs border border-white/5 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <strong className="text-sm font-serif font-bold text-white block truncate">
                      {p.name}
                    </strong>
                    <span className="text-xs text-[#81998D] block truncate font-sans">
                      {p.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-xs tracking-wider ${
                        p.published
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-white/10 text-white/50"
                      }`}
                    >
                      {p.published ? "Published" : "Draft"}
                    </span>
                    <Link
                      href={`/dashboard/products/${p.id}/edit`}
                      className="px-2.5 py-1 text-xs text-white/80 hover:text-white bg-white/10 rounded-xs transition-colors"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* 4. Quick CMS Guide / Notice Card */}
      <div className="p-6 bg-gradient-to-r from-[#0E1B15] to-[#123C2D]/40 border border-white/10 rounded-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <h3 className="text-sm font-serif font-bold text-white">
              Public Website Sync Active
            </h3>
          </div>
          <p className="text-xs text-white/70 font-sans leading-relaxed">
            All edits made to Products, Categories, Homepage, and About page revalidate on-demand immediately.
          </p>
        </div>

        <Link
          href="/"
          target="_blank"
          className="px-4 py-2 bg-white text-[#123C2D] hover:bg-[#F4F5EF] text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors flex items-center gap-2 shrink-0 shadow-xs"
        >
          <span>View Public Site</span>
          <ArrowUpRight size={13} />
        </Link>
      </div>
    </motion.div>
  );
}
