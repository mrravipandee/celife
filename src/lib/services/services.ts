import { Service } from "@/types/service";

export interface ServiceMutationResponse {
  id: string;
  slug: string;
  status: string;
}

export async function getServices(): Promise<Service[]> {
  const res = await fetch("/api/services");
  if (!res.ok) {
    throw new Error(`Failed to fetch services. Status: ${res.status}`);
  }
  const body = await res.json();
  return body.data;
}

export const getServicesClient = getServices;

export async function getService(id: string): Promise<Service> {
  const res = await fetch(`/api/services/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch service details. Status: ${res.status}`);
  }
  const body = await res.json();
  return body.data;
}

export async function createService(payload: Partial<Service>): Promise<ServiceMutationResponse> {
  const res = await fetch("/api/services", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = await res.json();
  if (!res.ok) {
    throw new Error(body.error?.message || "Failed to create service.");
  }
  return body.data;
}

export async function updateService(
  id: string,
  payload: Partial<Service>
): Promise<ServiceMutationResponse> {
  const res = await fetch(`/api/services/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = await res.json();
  if (!res.ok) {
    throw new Error(body.error?.message || "Failed to update service.");
  }
  return body.data;
}

export async function deleteService(id: string): Promise<void> {
  const res = await fetch(`/api/services/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error?.message || "Failed to delete service.");
  }
}
