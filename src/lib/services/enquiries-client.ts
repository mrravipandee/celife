import { Inquiry, EnquiryStatus } from "@/types/enquiry";

export interface EnquiriesFetchResponse {
  success: boolean;
  data: Inquiry[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface EnquiryMutationResponse {
  success: boolean;
  data: {
    id: string;
    status: EnquiryStatus;
    notes?: string;
  };
  message?: string;
}

export async function getEnquiriesClient(params: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  productSlug?: string;
} = {}): Promise<EnquiriesFetchResponse> {
  const query = new URLSearchParams();
  if (params.page !== undefined) query.set("page", params.page.toString());
  if (params.limit !== undefined) query.set("limit", params.limit.toString());
  if (params.status && params.status !== "all") query.set("status", params.status);
  if (params.search && params.search.trim()) query.set("search", params.search.trim());
  if (params.productSlug && params.productSlug !== "all") query.set("productSlug", params.productSlug);

  const res = await fetch(`/api/enquiries?${query.toString()}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch inquiries. Status: ${res.status}`);
  }
  const body = await res.json();
  if (!body.success) {
    throw new Error(body.error?.message || body.error || "Failed to fetch inquiries");
  }
  return body;
}

export async function updateEnquiryStatusClient(
  id: string,
  status: EnquiryStatus
): Promise<EnquiryMutationResponse> {
  return updateEnquiryClient(id, { status });
}

export async function updateEnquiryClient(
  id: string,
  payload: { status?: EnquiryStatus; notes?: string }
): Promise<EnquiryMutationResponse> {
  const res = await fetch(`/api/enquiries/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = await res.json();
  if (!res.ok) {
    throw new Error(body.error?.message || body.error || "Failed to update inquiry");
  }
  return body;
}

export async function deleteEnquiryClient(id: string): Promise<void> {
  const res = await fetch(`/api/enquiries/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error?.message || body.error || "Failed to delete inquiry");
  }
}
