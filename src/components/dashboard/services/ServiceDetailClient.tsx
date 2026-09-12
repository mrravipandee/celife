"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Service } from "@/types/service";
import { getService, updateService, deleteService } from "@/lib/services/services";
import { ServiceForm } from "./ServiceForm";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";

interface ServiceDetailClientProps {
  id: string;
}

export function ServiceDetailClient({ id }: ServiceDetailClientProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  // Mongoose loaded service state
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const data = await getService(id);
        setService(data);
      } catch (err: unknown) {
        console.error("Failed to load service detail:", err);
        const msg = err instanceof Error ? err.message : "Failed to load service.";
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      setIsLoading(true);
      setError(null);
      fetchService();
    }, 0);
    return () => clearTimeout(timer);
  }, [id]);

  const handleSave = async (updated: Service, status: "draft" | "active") => {
    try {
      // Exclude updatedAt from payload since DB updates this via timestamps
      const payload: Partial<Service> = { ...updated };
      delete payload.updatedAt;
      await updateService(id, payload);
      startTransition(() => {
        // Branch redirect so the correct success toast fires on the listing page
        const query = status === "active" ? "published=true" : "saved=true";
        router.push(`/dashboard/services?${query}`);
      });
    } catch (err: unknown) {
      console.error("Failed to save service:", err);
      throw err; // Propagate to ServiceForm to display error states
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/services");
  };

  const handleDelete = async () => {
    try {
      await deleteService(id);
      startTransition(() => {
        router.push("/dashboard/services?deleted=true");
      });
    } catch (err: unknown) {
      console.error("Failed to delete service:", err);
      throw err;
    }
  };

  // Pulse skeleton editor layout
  if (isLoading) {
    return <LoadingState variant="form" />;
  }

  // Error page layout
  if (error || !service) {
    const is404 = error?.includes("404");
    const isAuthError = error?.includes("401") || error?.includes("403");

    return (
      <ErrorState
        title={is404 ? "Service Not Found" : "Unable to load service details"}
        description={
          is404
            ? "The service you are trying to edit does not exist or has been removed."
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
                getService(id)
                  .then((data) => {
                    setService(data);
                    setIsLoading(false);
                  })
                  .catch((err: unknown) => {
                    console.error(err);
                    setError(err instanceof Error ? err.message : "Failed to load service.");
                    setIsLoading(false);
                  });
              }
        }
      >
        <Link
          href="/dashboard/services"
          className="flex items-center gap-2 px-5 py-2.5 text-[9px] uppercase tracking-[0.2em] font-sans bg-transparent border border-white/10 text-white hover:border-primary hover:text-primary transition-all duration-300 rounded-xs outline-none"
        >
          <ArrowLeft size={12} />
          <span>Back to Services</span>
        </Link>
      </ErrorState>
    );
  }

  return (
    <ServiceForm
      mode="edit"
      initialService={service}
      onSave={handleSave}
      onCancel={handleCancel}
      onDelete={handleDelete}
    />
  );
}
