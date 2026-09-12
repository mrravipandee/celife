"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BackendCaseStudy } from "@/types/case-study";
import { getCaseStudyClient, updateCaseStudyClient } from "@/lib/services/case-studies-client";
import { CaseStudyForm } from "./CaseStudyEditor";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";

interface CaseStudyEditClientProps {
  id: string;
}

export function CaseStudyEditClient({ id }: CaseStudyEditClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const [caseStudy, setCaseStudy] = useState<BackendCaseStudy | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Monitor URL search parameter redirects for triggering saved toast banners
  useEffect(() => {
    if (searchParams.get("saved") === "true") {
      setTimeout(() => setToastMessage("✓ Case study created successfully"), 0);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchCaseStudy = async () => {
      try {
        const data = await getCaseStudyClient(id);
        setCaseStudy(data);
      } catch (err: unknown) {
        console.error("Failed to load case study details:", err);
        const msg = err instanceof Error ? err.message : "Failed to load case study.";
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCaseStudy();
  }, [id]);

  const handleSave = async (updated: Partial<BackendCaseStudy>) => {
    try {
      await updateCaseStudyClient(id, updated);
      startTransition(() => {
        router.push("/dashboard/case-studies?saved=true");
      });
    } catch (err: unknown) {
      console.error("Failed to save case study:", err);
      throw err;
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/case-studies");
  };

  // Loading skeleton editor view
  if (isLoading) {
    return <LoadingState variant="form" />;
  }

  // Error view layout
  if (error || !caseStudy) {
    const is404 = error?.includes("404");
    const isAuthError = error?.includes("401") || error?.includes("403");

    return (
      <ErrorState
        title={is404 ? "Case Study Not Found" : "Unable to load case study details"}
        description={
          is404
            ? "The case study you are trying to edit does not exist or has been removed."
            : isAuthError
            ? "You don't have permission to edit this resource. Please re-authenticate."
            : "A database error or connection issue occurred while retrieving the details."
        }
        retryVariant="solid"
        onRetry={
          is404
            ? undefined
            : () => {
                setIsLoading(true);
                setError(null);
                getCaseStudyClient(id)
                  .then((data) => {
                    setCaseStudy(data);
                    setIsLoading(false);
                  })
                  .catch((err: unknown) => {
                    console.error(err);
                    setError(err instanceof Error ? err.message : "Failed to load case study.");
                    setIsLoading(false);
                  });
              }
        }
      >
        <Link
          href="/dashboard/case-studies"
          className="flex items-center gap-2 px-5 py-2.5 text-[9px] uppercase tracking-[0.2em] font-sans bg-transparent border border-white/10 text-white hover:border-primary hover:text-primary transition-all duration-300 rounded-xs outline-none"
        >
          <ArrowLeft size={12} />
          <span>Back to Case Studies</span>
        </Link>
      </ErrorState>
    );
  }

  return (
    <>
      <CaseStudyForm
        mode="edit"
        initialCaseStudy={caseStudy}
        onSave={handleSave}
        onCancel={handleCancel}
      />
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center justify-center pointer-events-auto">
          <div className="flex items-center gap-2.5 border shadow-2xl px-5 py-3 rounded-xs text-[10px] uppercase tracking-widest font-sans font-semibold text-white select-none bg-[#0A0A0A] border-white/10">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C9A24A]" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </>
  );
}
