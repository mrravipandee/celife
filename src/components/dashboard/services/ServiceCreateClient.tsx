"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ServiceForm } from "./ServiceForm";
import { Service } from "@/types/service";
import { createService, getServices } from "@/lib/services/services";

export function ServiceCreateClient() {
  const router = useRouter();
  const [, startTransition] = useTransition();

  // Fetch the current max displayOrder from live data so new services get a correct default
  const [nextOrder, setNextOrder] = useState<number>(1);

  useEffect(() => {
    getServices()
      .then((data) => {
        const maxOrder = data.length > 0 ? Math.max(...data.map((s) => s.displayOrder)) : 0;
        setNextOrder(maxOrder + 1);
      })
      .catch(() => {
        // Fallback silently — form still works, user can adjust order manually
        setNextOrder(1);
      });
  }, []);

  const handleSave = async (service: Service, status: "draft" | "active") => {
    try {
      // Omit temporary client id and updatedAt so MongoDB populates them
      const payload: Partial<Service> = { ...service };
      delete payload.id;
      delete payload.updatedAt;

      const data = await createService(payload);
      startTransition(() => {
        const query = status === "active" ? "published=true" : "saved=true";
        // Navigate to the edit detail page of the newly created service using MongoDB ID
        router.push(`/dashboard/services/${data.id}?${query}`);
      });
    } catch (err: unknown) {
      console.error("Failed to create service:", err);
      throw err; // Propagate error back to form to cancel success states
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/services");
  };

  return (
    <ServiceForm
      mode="create"
      nextOrder={nextOrder}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
}
