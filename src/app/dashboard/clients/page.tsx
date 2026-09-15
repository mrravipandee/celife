"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Search, Building2, Briefcase, MapPin, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { LoadingState } from "@/components/ui/LoadingState";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { getCaseStudiesClient } from "@/lib/services/case-studies-client";
import { getProjectsClient } from "@/lib/services/projects-client";
import { CaseStudy } from "@/types/case-study";
import { Project } from "@/types/project";

export interface AggregatedClient {
  id: string;
  name: string;
  industry: string;
  location: string;
  services: string[];
  projectsCount: number;
  caseStudySlug?: string;
  caseStudyTitle?: string;
  projectSlug?: string;
}

export default function ClientsDashboardPage() {
  const prefersReduced = useReducedMotion();

  const [clients, setClients] = useState<AggregatedClient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    let active = true;

    const fetchClientsData = async () => {
      try {
        const [caseStudiesRes, projectsRes] = await Promise.all([
          getCaseStudiesClient({ limit: 100 }).catch(() => ({ data: [] as CaseStudy[], pagination: { total: 0 } })),
          getProjectsClient().catch(() => [] as Project[]),
        ]);

        if (!active) return;

        const caseStudiesList = Array.isArray(caseStudiesRes.data) ? caseStudiesRes.data : [];
        const projectsList = Array.isArray(projectsRes) ? projectsRes : [];

        const clientMap = new Map<string, AggregatedClient>();

        // 1. Ingest Case Study clients
        caseStudiesList.forEach((cs) => {
          const clientName = cs.client?.name?.trim();
          if (clientName) {
            const key = clientName.toLowerCase();
            clientMap.set(key, {
              id: `client-cs-${cs.id}`,
              name: clientName,
              industry: cs.client.industry || cs.propertyType || "Hospitality",
              location: cs.location || "Global",
              services: cs.services || [],
              projectsCount: 1,
              caseStudySlug: cs.slug,
              caseStudyTitle: cs.title,
            });
          }
        });

        // 2. Ingest Projects as client engagements
        projectsList.forEach((proj) => {
          const projTitle = proj.title?.trim();
          if (projTitle) {
            const key = projTitle.toLowerCase();
            const existing = clientMap.get(key);
            if (existing) {
              existing.projectsCount += 1;
              existing.services = Array.from(new Set([...existing.services, ...(proj.services || [])]));
            } else {
              clientMap.set(key, {
                id: `client-proj-${proj.id || proj.slug}`,
                name: projTitle,
                industry: proj.category || "Hospitality",
                location: proj.location || "Global",
                services: proj.services || [],
                projectsCount: 1,
                projectSlug: proj.slug,
              });
            }
          }
        });

        setClients(Array.from(clientMap.values()));
      } catch (err: unknown) {
        console.error("Failed to load clients:", err);
        if (active) {
          setError("Failed to load client relationships.");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    fetchClientsData();

    return () => {
      active = false;
    };
  }, [refreshTrigger]);

  const uniqueIndustries = useMemo(() => {
    const set = new Set(clients.map((c) => c.industry).filter(Boolean));
    return Array.from(set);
  }, [clients]);

  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      const matchSearch =
        !searchTerm.trim() ||
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchIndustry = industryFilter === "all" || c.industry.toLowerCase() === industryFilter.toLowerCase();

      return matchSearch && matchIndustry;
    });
  }, [clients, searchTerm, industryFilter]);

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    setRefreshTrigger((t) => t + 1);
  };

  if (error) {
    return (
      <ErrorState
        title="Unable to load Clients Directory"
        description="Could not connect to database records to retrieve client relationships. Please retry."
        onRetry={handleRetry}
      />
    );
  }

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
      {/* 1. Header */}
      <div className="border-b border-[#E1E8E2] pb-6">
        <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-[#123C2D] font-sans font-semibold mb-1">
          <span>DASHBOARD</span>
          <span>/</span>
          <span>CLIENTS & PARTNERS</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#17201B] tracking-tight">
              Client & Partner Directory
            </h2>
            <p className="text-xs text-[#68756D] font-sans mt-0.5">
              Active wellness clinics, distributor networks, and healthcare partners.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white border border-[#E1E8E2] px-4 py-2 rounded-md flex items-center gap-2 shadow-xs">
              <Building2 size={14} className="text-[#123C2D]" />
              <span className="text-xs font-serif font-bold text-[#17201B]">{clients.length}</span>
              <span className="text-[11px] uppercase tracking-wider text-[#68756D] font-sans font-medium">Partners</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Search and Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#68756D]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by partner name, sector, or city..."
            className="w-full bg-white border border-[#E1E8E2] pl-9 pr-4 py-2 text-xs text-[#17201B] placeholder-[#68756D]/60 rounded-md outline-none focus:border-[#123C2D] focus:ring-2 focus:ring-[#123C2D]/10 transition-colors font-sans shadow-xs"
          />
        </div>

        {/* Industry Filter */}
        {uniqueIndustries.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <button
              type="button"
              onClick={() => setIndustryFilter("all")}
              className={`px-3 py-1.5 text-xs font-sans rounded-md transition-colors cursor-pointer shrink-0 font-medium ${
                industryFilter === "all"
                  ? "bg-[#123C2D] text-white"
                  : "bg-white border border-[#E1E8E2] text-[#68756D] hover:text-[#17201B] hover:bg-[#F0F4F0] shadow-xs"
              }`}
            >
              All Sectors
            </button>
            {uniqueIndustries.map((ind) => (
              <button
                key={ind}
                type="button"
                onClick={() => setIndustryFilter(ind)}
                className={`px-3 py-1.5 text-xs font-sans rounded-md transition-colors cursor-pointer shrink-0 font-medium ${
                  industryFilter.toLowerCase() === ind.toLowerCase()
                    ? "bg-[#123C2D] text-white"
                    : "bg-white border border-[#E1E8E2] text-[#68756D] hover:text-[#17201B] hover:bg-[#F0F4F0] shadow-xs"
                }`}
              >
                {ind}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3. Table / Loading / Empty */}
      {isLoading ? (
        <LoadingState variant="table" columnsCount={5} rowsCount={4} />
      ) : filteredClients.length > 0 ? (
        <div className="bg-white border border-[#E1E8E2] rounded-lg overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-sans text-xs">
              <thead>
                <tr className="border-b border-[#E1E8E2] text-[11px] uppercase tracking-[0.14em] text-[#123C2D] bg-[#F0F4F0] font-semibold">
                  <th className="py-3.5 px-5">Partner / Client</th>
                  <th className="py-3.5 px-5">Sector</th>
                  <th className="py-3.5 px-5">Location</th>
                  <th className="py-3.5 px-5">Engagements</th>
                  <th className="py-3.5 px-5 text-right">Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E1E8E2]">
                {filteredClients.map((client) => (
                  <tr
                    key={client.id}
                    className="hover:bg-[#F6F8F5] transition-colors duration-150 group"
                  >
                    {/* Brand Name */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-[#F0F4F0] border border-[#E1E8E2] flex items-center justify-center text-[#123C2D] font-sans font-bold text-xs">
                          {client.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-semibold text-[#17201B] group-hover:text-[#123C2D] transition-colors block">
                            {client.name}
                          </span>
                          {client.caseStudyTitle && (
                            <span className="text-xs text-[#68756D] truncate max-w-xs block">
                              {client.caseStudyTitle}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Sector */}
                    <td className="py-4 px-5 text-[#68756D]">
                      <div className="flex items-center gap-1.5">
                        <Briefcase size={12} className="text-[#68756D]" />
                        <span>{client.industry}</span>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-4 px-5 text-[#68756D]">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={12} className="text-[#68756D]" />
                        <span>{client.location}</span>
                      </div>
                    </td>

                    {/* Services Tags */}
                    <td className="py-4 px-5">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {client.services.slice(0, 2).map((srv, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] px-2 py-0.5 bg-[#F0F4F0] text-[#123C2D] rounded-md border border-[#E1E8E2] font-medium"
                          >
                            {srv}
                          </span>
                        ))}
                        {client.services.length > 2 && (
                          <span className="text-[11px] text-[#68756D] px-1 py-0.5">
                            +{client.services.length - 2}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Link */}
                    <td className="py-4 px-5 text-right">
                      {client.caseStudySlug ? (
                        <Link
                          href={`/dashboard/case-studies`}
                          className="inline-flex items-center gap-1 text-xs text-[#123C2D] font-medium hover:underline"
                        >
                          <span>Case Study</span>
                          <ArrowUpRight size={13} />
                        </Link>
                      ) : client.projectSlug ? (
                        <Link
                          href={`/dashboard/projects`}
                          className="inline-flex items-center gap-1 text-xs text-[#123C2D] font-medium hover:underline"
                        >
                          <span>Project</span>
                          <ArrowUpRight size={13} />
                        </Link>
                      ) : (
                        <span className="text-[#68756D]/40">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          title="No Clients Found"
          description="Client engagements from projects and case studies will automatically appear here."
        />
      )}
    </motion.div>
  );
}
