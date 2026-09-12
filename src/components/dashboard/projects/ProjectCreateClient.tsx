"use client";

import React, { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Project } from "@/types/project";
import { createProjectClient } from "@/lib/services/projects-client";
import { ProjectForm } from "./ProjectForm";

export function ProjectCreateClient() {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const handleSave = async (newProject: Project) => {
    try {
      const payload: Partial<Project> = { ...newProject };
      delete payload._id;
      delete payload.createdAt;
      delete payload.updatedAt;

      const res = await createProjectClient(payload);
      startTransition(() => {
        router.push(`/dashboard/projects/${res.id}?saved=true`);
      });
    } catch (err: unknown) {
      console.error("Failed to create project:", err);
      throw err; // Propagate error back to form
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/projects");
  };

  return (
    <ProjectForm
      mode="create"
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
}
