import { MetadataRoute } from "next";
import { getProjects } from "@/lib/services/projects";
import { siteConfig } from "@/config/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  const staticRoutes = ["", "/about", "/services/consulting-services", "/services/hospitality-audit", "/projects", "/contact"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  try {
    const projects = await getProjects();
    const projectRoutes = projects.map((project) => ({
      url: `${baseUrl}/projects/${project.slug}`,
      lastModified: project.updatedAt ? new Date(project.updatedAt) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
    return [...staticRoutes, ...projectRoutes];
  } catch (error) {
    console.error("Sitemap compilation project fetch failure:", error);
    return staticRoutes;
  }
}
