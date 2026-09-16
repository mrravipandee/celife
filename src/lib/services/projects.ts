import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";
import { Project as ProjectType } from "@/types/project";
import { cache } from "react";

interface RawProjectDoc {
  _id?: { toString(): string };
  title: string;
  slug: string;
  description: string;
  category: string;
  location: string;
  coverImage: string;
  gallery?: string[];
  year: number;
  services?: string[];
  featured?: boolean;
  createdAt?: { toISOString(): string };
  updatedAt?: { toISOString(): string };
}

function getISODate(val: Date | { toISOString(): string } | string | undefined): string {
  if (!val) return "";
  if (val instanceof Date) return val.toISOString();
  if (typeof val === "object" && typeof val.toISOString === "function") {
    return val.toISOString();
  }
  if (typeof val === "string") return val;
  return "";
}

// Helper to map raw mongoose lean document to client safe serializable plain object
function serializeProject(doc: RawProjectDoc): ProjectType {
  return {
    _id: doc._id?.toString(),
    title: doc.title,
    slug: doc.slug,
    description: doc.description,
    category: doc.category,
    location: doc.location,
    coverImage: doc.coverImage,
    gallery: doc.gallery || [],
    year: doc.year,
    services: doc.services || [],
    featured: doc.featured || false,
    createdAt: getISODate(doc.createdAt as unknown as Date | string),
    updatedAt: getISODate(doc.updatedAt as unknown as Date | string),
  };
}

export const getProjects = cache(async (): Promise<ProjectType[]> => {
  try {
    await connectToDatabase();
    const docs = await Project.find({}).sort({ createdAt: -1 }).lean();
    return docs.map(serializeProject);
  } catch (error) {
    console.warn("getProjects notice, using fallback:", (error as Error)?.message || error);
    return [];
  }
});

export const getFeaturedProjects = cache(async (): Promise<ProjectType[]> => {
  try {
    await connectToDatabase();
    const docs = await Project.find({ featured: true }).sort({ createdAt: -1 }).lean();
    return docs.map(serializeProject);
  } catch (error) {
    console.warn("getFeaturedProjects notice, using fallback:", (error as Error)?.message || error);
    return [];
  }
});

export const getProjectBySlug = cache(async (slug: string): Promise<ProjectType | null> => {
  try {
    await connectToDatabase();
    const doc = await Project.findOne({ slug }).lean();
    if (!doc) return null;
    return serializeProject(doc);
  } catch (error) {
    console.warn("getProjectBySlug notice, using fallback:", (error as Error)?.message || error);
    return null;
  }
});
