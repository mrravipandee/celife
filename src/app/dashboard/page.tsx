"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentInquiries, DashboardInquiry } from "@/components/dashboard/RecentInquiries";
import { ActiveProjects, DashboardProject } from "@/components/dashboard/ActiveProjects";
import { BusinessOverview } from "@/components/dashboard/BusinessOverview";
import { RecentActivity, DashboardActivity } from "@/components/dashboard/RecentActivity";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";

import { getProjectsClient } from "@/lib/services/projects-client";
import { getEnquiriesClient } from "@/lib/services/enquiries-client";
import { getBlogsClient } from "@/lib/services/blogs-client";
import { getCaseStudiesClient } from "@/lib/services/case-studies-client";
import { getServicesClient } from "@/lib/services/services";
import { Project } from "@/types/project";
import { Inquiry } from "@/types/enquiry";
import { Service } from "@/types/service";

interface DashboardStats {
  activeProjects: number;
  totalProjects: number;
  totalServices: number;
  newInquiries: number;
  totalInquiries: number;
  publishedBlogs: number;
  publishedCaseStudies: number;
}

export default function DashboardOverviewPage() {
  const prefersReduced = useReducedMotion();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentInquiries, setRecentInquiries] = useState<DashboardInquiry[]>([]);
  const [activeProjects, setActiveProjects] = useState<DashboardProject[]>([]);
  const [recentActivities, setRecentActivities] = useState<DashboardActivity[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    let active = true;

    const fetchDashboardData = async () => {
      try {
        const [
          projectsData,
          enquiriesRes,
          newEnquiriesRes,
          blogsRes,
          caseStudiesRes,
          servicesData,
        ] = await Promise.all([
          getProjectsClient().catch(() => [] as Project[]),
          getEnquiriesClient({ limit: 5 }).catch(() => ({ data: [] as Inquiry[], pagination: { total: 0, page: 1, limit: 5, totalPages: 1 } })),
          getEnquiriesClient({ status: "new", limit: 1 }).catch(() => ({ data: [] as Inquiry[], pagination: { total: 0, page: 1, limit: 1, totalPages: 1 } })),
          getBlogsClient({ status: "published", limit: 1 }).catch(() => ({ data: [], pagination: { total: 0, page: 1, limit: 1, totalPages: 1 } })),
          getCaseStudiesClient({ status: "published", limit: 1 }).catch(() => ({ data: [], pagination: { total: 0, page: 1, limit: 1, totalPages: 1 } })),
          getServicesClient().catch(() => [] as Service[]),
        ]);

        if (!active) return;

        const projectsList: Project[] = Array.isArray(projectsData) ? projectsData : [];
        const activeProjectsList = projectsList.filter((p: Project) => p.status === "active" || !p.status);
        const totalProjectsCount = projectsList.length;

        const servicesList: Service[] = Array.isArray(servicesData) ? servicesData : [];
        const totalServicesCount = servicesList.length;

        const totalInquiriesCount = enquiriesRes.pagination?.total || 0;
        const newInquiriesCount = newEnquiriesRes.pagination?.total || 0;

        const blogsCount = blogsRes.pagination?.total || 0;
        const caseStudiesCount = caseStudiesRes.pagination?.total || 0;

        setStats({
          activeProjects: activeProjectsList.length,
          totalProjects: totalProjectsCount,
          totalServices: totalServicesCount,
          newInquiries: newInquiriesCount,
          totalInquiries: totalInquiriesCount,
          publishedBlogs: blogsCount,
          publishedCaseStudies: caseStudiesCount,
        });

        // 1. Map Recent Inquiries
        const rawInquiries: Inquiry[] = Array.isArray(enquiriesRes.data) ? enquiriesRes.data : [];
        const mappedInquiries: DashboardInquiry[] = rawInquiries.slice(0, 4).map((inq: Inquiry) => {
          let timeAgo = "Recently";
          if (inq.createdAt) {
            const date = new Date(inq.createdAt);
            timeAgo = date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
          }
          return {
            id: inq.id,
            name: inq.name,
            type: inq.type || inq.projectType || "Advisory Inquiry",
            timeAgo,
            status: inq.status,
          };
        });
        setRecentInquiries(mappedInquiries);

        // 2. Map Active Projects
        const mappedProjects: DashboardProject[] = activeProjectsList.slice(0, 4).map((p: Project, idx: number) => ({
          id: p.id || p._id || `proj-${idx}`,
          index: String(idx + 1).padStart(2, "0"),
          name: p.title,
          category: p.category || "Hospitality",
          status: (p.status || "active").toUpperCase(),
        }));
        setActiveProjects(mappedProjects);

        // 3. Construct chronological Activity Feed from live entities
        const activities: DashboardActivity[] = [];

        rawInquiries.slice(0, 3).forEach((inq: Inquiry) => {
          activities.push({
            id: `act-inq-${inq.id}`,
            message: `New consultation inquiry from ${inq.name}`,
            timestamp: inq.createdAt
              ? new Date(inq.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })
              : "Recent",
          });
        });


        projectsList.slice(0, 2).forEach((proj: Project) => {
          activities.push({
            id: `act-proj-${proj.id || proj._id}`,
            message: `Project "${proj.title}" active in portfolio`,
            timestamp: proj.updatedAt
              ? new Date(proj.updatedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })
              : "Updated",
          });
        });

        setRecentActivities(activities.slice(0, 4));

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
        description="Could not connect to the backend database to retrieve metrics. Please verify your session and network."
        onRetry={handleRetry}
      />
    );
  }

  const statCardsData = [
    {
      id: "active-projects",
      label: "Active Projects",
      value: String(stats?.activeProjects || 0).padStart(2, "0"),
      change: `${stats?.totalProjects || 0} total portfolio`,
    },
    {
      id: "total-services",
      label: "Advisory Practices",
      value: String(stats?.totalServices || 0).padStart(2, "0"),
      change: "Active advisory practices",
    },
    {
      id: "new-inquiries",
      label: "New Inquiries",
      value: String(stats?.newInquiries || 0).padStart(2, "0"),
      change: `${stats?.totalInquiries || 0} total consultation requests`,
    },
    {
      id: "published-insights",
      label: "Articles & Case Studies",
      value: String((stats?.publishedBlogs || 0) + (stats?.publishedCaseStudies || 0)).padStart(2, "0"),
      change: `${stats?.publishedBlogs || 0} blogs · ${stats?.publishedCaseStudies || 0} case studies`,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: prefersReduced ? 0 : 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: prefersReduced ? 0.05 : 0.6,
        ease: [0.16, 1, 0.3, 1] as const,
      }}
      className="space-y-8 pb-12 select-none"
    >
      {/* 1. Header Section */}
      <DashboardHeader />

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCardsData.map((stat, idx) => (
          <StatCard
            key={stat.id}
            index={idx}
            label={stat.label}
            value={stat.value}
            change={stat.change}
          />
        ))}
      </div>

      {/* 3. Middle Section: Recent Inquiries & Active Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentInquiries inquiries={recentInquiries} />
        <ActiveProjects projects={activeProjects} />
      </div>

      {/* 4. Lower Section: Business Overview & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BusinessOverview />
        <RecentActivity activities={recentActivities} />
      </div>
    </motion.div>
  );
}


