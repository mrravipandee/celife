import { Project } from "@/types/project";

export interface ProjectMutationResponse {
  id: string;
  slug: string;
}

export async function getProjectsClient(): Promise<Project[]> {
  const res = await fetch("/api/projects");
  if (!res.ok) {
    throw new Error(`Failed to fetch projects. Status: ${res.status}`);
  }
  const body = await res.json();
  if (!body.success) {
    throw new Error(body.error || "Failed to fetch projects");
  }
  return body.data;
}

export async function getProjectClient(id: string): Promise<Project> {
  const res = await fetch(`/api/projects/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch project details. Status: ${res.status}`);
  }
  const body = await res.json();
  if (!body.success) {
    throw new Error(body.error?.message || "Failed to fetch project");
  }
  return body.data;
}

export async function createProjectClient(
  payload: Partial<Project>
): Promise<ProjectMutationResponse> {
  const res = await fetch("/api/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = await res.json();
  if (!res.ok) {
    throw new Error(body.error?.message || "Failed to create project.");
  }
  return body.data;
}

export async function updateProjectClient(
  id: string,
  payload: Partial<Project>
): Promise<ProjectMutationResponse> {
  const res = await fetch(`/api/projects/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = await res.json();
  if (!res.ok) {
    throw new Error(body.error?.message || "Failed to update project.");
  }
  return body.data;
}

export async function deleteProjectClient(id: string): Promise<void> {
  const res = await fetch(`/api/projects/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error?.message || "Failed to delete project.");
  }
}
