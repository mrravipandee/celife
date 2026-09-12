import React, { Suspense } from "react";
import { ProjectDetailClient } from "@/components/dashboard/projects/ProjectDetailClient";
import { Loader2 } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { id } = await params;
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-12 text-white/40 select-none">
          <Loader2 className="animate-spin" size={16} />
        </div>
      }
    >
      <ProjectDetailClient id={id} />
    </Suspense>
  );
}
