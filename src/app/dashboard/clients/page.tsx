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
      <div className="border-b border-white/5 pb-6">
        <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.2em] text-white/40 font-sans mb-1">
          <span>DASHBOARD</span>
          <span>/</span>
          <span className="text-white/60">CLIENTS</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-serif text-white tracking-wide">
              Client Directory
            </h2>
            <p className="text-xs text-white/50 font-sans tracking-wide mt-1">
              Active hotel partners, restaurant operators, and corporate hospitality engagements.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-[#050505] border border-white/5 px-4 py-2 rounded-xs flex items-center gap-2">
              <Building2 size={12} className="text-primary" />
              <span className="text-xs font-serif text-white">{clients.length}</span>
              <span className="text-[9px] uppercase tracking-wider text-white/40 font-sans">Brands</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Search and Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by client brand, sector, or city..."
            className="w-full bg-[#050505] border border-white/10 pl-9 pr-4 py-2.5 text-xs text-white placeholder-white/30 rounded-xs outline-none focus:border-primary/50 transition-colors font-sans"
          />
        </div>

        {/* Industry Filter */}
        {uniqueIndustries.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <button
              type="button"
              onClick={() => setIndustryFilter("all")}
              className={`px-3 py-1.5 text-[9px] uppercase tracking-wider font-sans rounded-xs transition-colors cursor-pointer shrink-0 ${
                industryFilter === "all"
                  ? "bg-primary text-black font-semibold"
                  : "bg-[#050505] border border-white/5 text-white/60 hover:text-white"
              }`}
            >
              All Sectors
            </button>
            {uniqueIndustries.map((ind) => (
              <button
                key={ind}
                type="button"
                onClick={() => setIndustryFilter(ind)}
                className={`px-3 py-1.5 text-[9px] uppercase tracking-wider font-sans rounded-xs transition-colors cursor-pointer shrink-0 ${
                  industryFilter.toLowerCase() === ind.toLowerCase()
                    ? "bg-primary text-black font-semibold"
                    : "bg-[#050505] border border-white/5 text-white/60 hover:text-white"
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
        <div className="bg-[#050505] border border-white/5 rounded-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-sans text-xs">
              <thead>
                <tr className="border-b border-white/5 text-[9px] uppercase tracking-[0.2em] text-white/40">
                  <th className="py-4 px-6 font-medium">Client / Brand</th>
                  <th className="py-4 px-6 font-medium">Sector</th>
                  <th className="py-4 px-6 font-medium">Location</th>
                  <th className="py-4 px-6 font-medium">Engagements</th>
                  <th className="py-4 px-6 font-medium text-right">Portfolio Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredClients.map((client) => (
                  <tr
                    key={client.id}
                    className="hover:bg-white/[0.02] transition-colors duration-200 group"
                  >
                    {/* Brand Name */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xs bg-white/5 border border-white/10 flex items-center justify-center text-primary font-serif text-xs">
                          {client.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-medium text-white group-hover:text-primary transition-colors block">
                            {client.name}
                          </span>
                          {client.caseStudyTitle && (
                            <span className="text-[10px] text-white/40 truncate max-w-xs block">
                              {client.caseStudyTitle}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Sector */}
                    <td className="py-4 px-6 text-white/70">
                      <div className="flex items-center gap-1.5">
                        <Briefcase size={11} className="text-white/30" />
                        <span>{client.industry}</span>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-4 px-6 text-white/60">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={11} className="text-white/30" />
                        <span>{client.location}</span>
                      </div>
                    </td>

                    {/* Services Tags */}
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {client.services.slice(0, 2).map((srv, idx) => (
                          <span
                            key={idx}
                            className="text-[9px] uppercase tracking-wider px-2 py-0.5 bg-white/5 text-white/60 rounded-xs border border-white/5"
                          >
                            {srv}
                          </span>
                        ))}
                        {client.services.length > 2 && (
                          <span className="text-[9px] text-white/30 px-1 py-0.5">
                            +{client.services.length - 2}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Link */}
                    <td className="py-4 px-6 text-right">
                      {client.caseStudySlug ? (
                        <Link
                          href={`/dashboard/case-studies`}
                          className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-white/40 hover:text-primary transition-colors"
                        >
                          <span>Case Study</span>
                          <ArrowUpRight size={12} />
                        </Link>
                      ) : client.projectSlug ? (
                        <Link
                          href={`/dashboard/projects`}
                          className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-white/40 hover:text-primary transition-colors"
                        >
                          <span>Project</span>
                          <ArrowUpRight size={12} />
                        </Link>
                      ) : (
                        <span className="text-white/20">—</span>
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
