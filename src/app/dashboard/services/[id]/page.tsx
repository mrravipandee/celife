import React, { Suspense } from "react";
import { ServiceDetailClient } from "@/components/dashboard/services/ServiceDetailClient";
import { Loader2 } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { id } = await params;
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-12 text-white/40 select-none">
          <Loader2 className="animate-spin" size={16} />
        </div>
      }
    >
      <ServiceDetailClient id={id} />
    </Suspense>
  );
}
