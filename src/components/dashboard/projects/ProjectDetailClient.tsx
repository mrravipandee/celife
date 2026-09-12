"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Project } from "@/types/project";
import { getProjectClient, updateProjectClient, deleteProjectClient } from "@/lib/services/projects-client";
import { ProjectForm } from "./ProjectForm";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";

interface ProjectDetailClientProps {
  id: string;
}

export function ProjectDetailClient({ id }: ProjectDetailClientProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await getProjectClient(id);
        setProject(data);
      } catch (err: unknown) {
        console.error("Failed to load project details:", err);
        const msg = err instanceof Error ? err.message : "Failed to load project.";
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      setIsLoading(true);
      setError(null);
      fetchProject();
    }, 0);
    return () => clearTimeout(timer);
  }, [id]);

  const handleSave = async (updated: Project) => {
    try {
      const payload: Partial<Project> = { ...updated };
      delete payload._id;
      delete payload.createdAt;
      delete payload.updatedAt;

      await updateProjectClient(id, payload);
      startTransition(() => {
        router.push("/dashboard/projects?saved=true");
      });
    } catch (err: unknown) {
      console.error("Failed to save project:", err);
      throw err; // Propagate error back to form
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/projects");
  };

  const handleDelete = async () => {
    try {
      await deleteProjectClient(id);
      startTransition(() => {
        router.push("/dashboard/projects?deleted=true");
      });
    } catch (err: unknown) {
      console.error("Failed to delete project:", err);
      throw err;
    }
  };

  // Loading skeleton editor view
  if (isLoading) {
    return <LoadingState variant="form" />;
  }

  // Error / 404 view layout
  if (error || !project) {
    const is404 = error?.includes("404");
    const isAuthError = error?.includes("401") || error?.includes("403");

    return (
      <ErrorState
        title={is404 ? "Project Not Found" : "Unable to load project details"}
        description={
          is404
            ? "The project you are trying to edit does not exist or has been removed."
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
                getProjectClient(id)
                  .then((data) => {
                    setProject(data);
                    setIsLoading(false);
                  })
                  .catch((err: unknown) => {
                    console.error(err);
                    setError(err instanceof Error ? err.message : "Failed to load project.");
                    setIsLoading(false);
                  });
              }
        }
      >
        <Link
          href="/dashboard/projects"
          className="flex items-center gap-2 px-5 py-2.5 text-[9px] uppercase tracking-[0.2em] font-sans bg-transparent border border-white/10 text-white hover:border-primary hover:text-primary transition-all duration-300 rounded-xs outline-none"
        >
          <ArrowLeft size={12} />
          <span>Back to Projects</span>
        </Link>
      </ErrorState>
    );
  }

  return (
    <ProjectForm
      mode="edit"
      initialProject={project}
      onSave={handleSave}
      onCancel={handleCancel}
      onDelete={handleDelete}
    />
  );
}
