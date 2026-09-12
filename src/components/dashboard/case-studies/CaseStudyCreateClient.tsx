"use client";

import React, { useTransition } from "react";
import { useRouter } from "next/navigation";
import { BackendCaseStudy } from "@/types/case-study";
import { createCaseStudyClient } from "@/lib/services/case-studies-client";
import { CaseStudyForm } from "./CaseStudyEditor";

export function CaseStudyCreateClient() {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const handleSave = async (payload: Partial<BackendCaseStudy>) => {
    try {
      const res = await createCaseStudyClient(payload);
      startTransition(() => {
        router.push(`/dashboard/case-studies/${res.id}/edit?saved=true`);
      });
    } catch (err: unknown) {
      console.error("Failed to create case study:", err);
      throw err;
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/case-studies");
  };

  return (
    <CaseStudyForm
      mode="create"
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
}
