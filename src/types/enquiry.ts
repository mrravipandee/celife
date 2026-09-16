export const ENQUIRY_STATUSES = ["new", "contacted", "in-progress", "closed"] as const;
export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];

export const PROJECT_TYPES = [
  "Product Enquiry",
  "Healthcare & Wellness",
  "Nutraceutical Formulation",
  "Distribution / Partnership",
  "Hotel",
  "Restaurant",
  "Resort",
  "Café",
  "QSR",
  "Banquet / Events",
  "Cloud Kitchen",
  "Hospitality Investment",
  "Existing Business Improvement",
  "Other",
] as const;
export type ProjectType = (typeof PROJECT_TYPES)[number];

export const PROJECT_STAGES = [
  "Concept",
  "Planning",
  "Pre-Opening",
  "Operating",
  "Expansion",
] as const;
export type ProjectStage = (typeof PROJECT_STAGES)[number];

export const BUSINESS_STATUSES = [
  "Planning a New Project",
  "Currently Operating",
  "Renovation / Expansion",
  "Looking for Improvement",
  "Investment Planning",
] as const;
export type BusinessStatus = (typeof BUSINESS_STATUSES)[number];

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  productId?: string;
  productNameSnapshot?: string;
  product?: string;
  company?: string;
  projectType: ProjectType;
  type?: string;
  location?: string;
  projectStage?: ProjectStage;
  businessStatus?: BusinessStatus;
  message: string;
  status: EnquiryStatus;
  date?: string;
  time?: string;
  createdAt: string;
  updatedAt: string;
}

