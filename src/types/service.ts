export type ServiceStatus = "active" | "draft" | "hidden";

export interface Service {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  category: string;
  displayOrder: number;
  status: ServiceStatus;
  featured: boolean;
  heroLabel: string;
  description: string;
  keyPoints: string[];
  updatedAt: string;
}
