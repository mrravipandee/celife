import { BackendBlog } from "@/types/blog";

export interface BlogsFetchResponse {
  success: boolean;
  data: BackendBlog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function getBlogsClient(params: {
  page?: number;
  limit?: number;
  status?: string;
  category?: string;
  search?: string;
} = {}): Promise<BlogsFetchResponse> {
  const query = new URLSearchParams();
  if (params.page !== undefined) query.set("page", params.page.toString());
  if (params.limit !== undefined) query.set("limit", params.limit.toString());
  if (params.status && params.status !== "all") query.set("status", params.status);
  if (params.category && params.category !== "all") query.set("category", params.category);
  if (params.search && params.search.trim()) query.set("search", params.search.trim());

  const res = await fetch(`/api/blogs?${query.toString()}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch blogs. Status: ${res.status}`);
  }
  const body = await res.json();
  if (!body.success) {
    throw new Error(body.error?.message || body.error || "Failed to fetch blogs");
  }
  return body;
}

export async function getBlogClient(id: string): Promise<BackendBlog> {
  const res = await fetch(`/api/blogs/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch blog post details. Status: ${res.status}`);
  }
  const body = await res.json();
  if (!body.success) {
    throw new Error(body.error?.message || body.error || "Failed to load blog");
  }
  return body.data;
}

export async function createBlogClient(payload: Partial<BackendBlog>): Promise<{ id: string; slug: string }> {
  const res = await fetch("/api/blogs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || !body.success) {
    throw new Error(body.error?.message || body.error || "Failed to create blog post");
  }
  return body.data;
}

export async function updateBlogClient(id: string, payload: Partial<BackendBlog>): Promise<void> {
  const res = await fetch(`/api/blogs/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || !body.success) {
    throw new Error(body.error?.message || body.error || "Failed to update blog post");
  }
}

export async function deleteBlogClient(id: string): Promise<void> {
  const res = await fetch(`/api/blogs/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error?.message || body.error || "Failed to delete blog");
  }
}

export interface UploadBlogImageResponse {
  url: string;
  publicId: string;
}

export async function uploadBlogImageClient(
  file: File
): Promise<UploadBlogImageResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/blogs/upload", {
    method: "POST",
    body: formData,
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok || !body.success) {
    const errorMsg =
      body.error?.message ||
      body.error ||
      body.message ||
      `Upload failed (status: ${res.status})`;
    throw new Error(errorMsg);
  }

  return body.image;
}

