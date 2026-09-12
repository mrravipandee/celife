export interface Project {
  _id?: string;
  id?: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  location: string;
  coverImage: string;
  gallery: string[];
  year: number;
  services: string[];
  featured: boolean;
  status?: "active" | "draft";
  createdAt?: string;
  updatedAt?: string;
}

