export const CASE_STUDY_STATUSES = ["draft", "published", "archived"] as const;
export type CaseStudyStatus = (typeof CASE_STUDY_STATUSES)[number];

export const PROPERTY_TYPES = [
  "Hotel",
  "Resort",
  "Restaurant",
  "Café",
  "QSR",
  "Bar / Lounge",
  "Banquet Hall",
  "Bakery",
  "Cloud Kitchen",
  "Motel",
  "Business Hotel",
  "Boutique Hotel",
  "Highway Hospitality",
  "Pilgrimage Hospitality",
  "Other",
] as const;
export type PropertyType = (typeof PROPERTY_TYPES)[number];

export const CASE_STUDY_PROJECT_TYPES = [
  "Concept Development",
  "Pre-Opening",
  "Operations Audit",
  "Turnaround",
  "Revenue Improvement",
  "Cost Optimization",
  "Menu Engineering",
  "Branding",
  "Marketing",
  "Staffing",
  "Financial Planning",
  "Business Strategy",
  "Hospitality Advisory",
  "Other",
] as const;
export type CaseStudyProjectType = (typeof CASE_STUDY_PROJECT_TYPES)[number];

export const CASE_STUDY_SERVICES = [
  "Hospitality Advisory",
  "Operations",
  "Pre-Opening",
  "Financial Planning",
  "Cost Control",
  "Menu Engineering",
  "Staffing",
  "Marketing",
  "Branding",
  "Revenue Management",
  "Business Strategy",
  "Audit",
  "Turnaround",
] as const;
export type CaseStudyService = (typeof CASE_STUDY_SERVICES)[number];

export interface ICaseStudyCoverImage {
  url: string;
  alt: string;
}

export interface ICaseStudyClient {
  name: string;
  industry?: string;
}

export interface ICaseStudyResult {
  metric: string;
  value: string;
  description?: string;
}

export interface ICaseStudySEO {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
}

export interface BackendCaseStudy {
  id?: string;
  _id?: { toString(): string };
  title: string;
  slug: string;
  client: ICaseStudyClient;
  location: string;
  propertyType: PropertyType;
  projectType: CaseStudyProjectType;
  overview: string;
  challenge: string;
  solution: string;
  results: ICaseStudyResult[];
  services: string[];
  coverImage: ICaseStudyCoverImage;
  gallery?: ICaseStudyCoverImage[];
  status: CaseStudyStatus;
  publishedAt?: string;
  seo?: ICaseStudySEO;
  createdAt: string;
  updatedAt: string;
}

export type CaseStudy = BackendCaseStudy;


