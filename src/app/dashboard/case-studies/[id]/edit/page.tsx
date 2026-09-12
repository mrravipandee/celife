import React, { Suspense } from "react";
import { CaseStudyEditClient } from "@/components/dashboard/case-studies/CaseStudyEditClient";
import { Loader2 } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCaseStudyPage({ params }: PageProps) {
  const { id } = await params;
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-12 text-white/40 select-none">
          <Loader2 className="animate-spin" size={16} />
        </div>
      }
    >
      <CaseStudyEditClient id={id} />
    </Suspense>
  );
}
