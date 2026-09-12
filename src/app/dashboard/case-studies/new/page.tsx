import React, { Suspense } from "react";
import { CaseStudyCreateClient } from "@/components/dashboard/case-studies/CaseStudyCreateClient";
import { Loader2 } from "lucide-react";

export default function NewCaseStudyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-12 text-white/40 select-none">
          <Loader2 className="animate-spin" size={16} />
        </div>
      }
    >
      <CaseStudyCreateClient />
    </Suspense>
  );
}
