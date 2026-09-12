import { BackendCaseStudy } from "@/types/case-study";

export interface CaseStudiesFetchResponse {
  success: boolean;
  data: BackendCaseStudy[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function getCaseStudiesClient(params: {
  page?: number;
  limit?: number;
  status?: string;
  propertyType?: string;
  projectType?: string;
  location?: string;
  search?: string;
} = {}): Promise<CaseStudiesFetchResponse> {
  const query = new URLSearchParams();
  if (params.page !== undefined) query.set("page", params.page.toString());
  if (params.limit !== undefined) query.set("limit", params.limit.toString());
  if (params.status && params.status !== "all") query.set("status", params.status);
  if (params.propertyType && params.propertyType !== "all") query.set("propertyType", params.propertyType);
  if (params.projectType && params.projectType !== "all") query.set("projectType", params.projectType);
  if (params.location && params.location.trim()) query.set("location", params.location.trim());
  if (params.search && params.search.trim()) query.set("search", params.search.trim());

  const res = await fetch(`/api/case-studies?${query.toString()}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch case studies. Status: ${res.status}`);
  }
  const body = await res.json();
  if (!body.success) {
    throw new Error(body.error?.message || body.error || "Failed to fetch case studies");
  }
  return body;
}

export async function getCaseStudyClient(id: string): Promise<BackendCaseStudy> {
  const res = await fetch(`/api/case-studies/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch case study details. Status: ${res.status}`);
  }
  const body = await res.json();
  if (!body.success) {
    throw new Error(body.error?.message || body.error || "Failed to load case study");
  }
  return body.data;
}

export async function createCaseStudyClient(payload: Partial<BackendCaseStudy>): Promise<{ id: string; slug: string }> {
  const res = await fetch("/api/case-studies", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || !body.success) {
    throw new Error(body.error?.message || body.error || "Failed to create case study");
  }
  return body.data;
}

export async function updateCaseStudyClient(id: string, payload: Partial<BackendCaseStudy>): Promise<void> {
  const res = await fetch(`/api/case-studies/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || !body.success) {
    throw new Error(body.error?.message || body.error || "Failed to update case study");
  }
}

export async function deleteCaseStudyClient(id: string): Promise<void> {
  const res = await fetch(`/api/case-studies/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error?.message || body.error || "Failed to delete case study");
  }
}
