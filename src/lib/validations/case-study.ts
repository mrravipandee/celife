import { z } from "zod";
import {
  CASE_STUDY_STATUSES,
  PROPERTY_TYPES,
  CASE_STUDY_PROJECT_TYPES,
  CASE_STUDY_SERVICES,
} from "@/types/case-study";
import { seoSchema } from "./blog";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const createCaseStudySchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, { message: "Title must be at least 5 characters." })
    .max(200, { message: "Title cannot exceed 200 characters." }),
  slug: z
    .string()
    .trim()
    .lowercase()
    .max(220, { message: "Slug cannot exceed 220 characters." })
    .regex(slugRegex, {
      message: "Slug must be URL-safe (lowercase letters, numbers, and hyphens only, no spaces or consecutive hyphens).",
    }),
  client: z.object({
    name: z
      .string()
      .trim()
      .min(1, { message: "Client name is required." })
      .max(150, { message: "Client name cannot exceed 150 characters." }),
    industry: z
      .string()
      .trim()
      .max(100, { message: "Industry description cannot exceed 100 characters." })
      .optional()
      .or(z.literal("")),
  }).strict(),
  location: z
    .string()
    .trim()
    .min(1, { message: "Location is required." })
    .max(150, { message: "Location cannot exceed 150 characters." }),
  propertyType: z.enum(PROPERTY_TYPES, {
    message: "Please select a valid property type.",
  }),
  projectType: z.enum(CASE_STUDY_PROJECT_TYPES, {
    message: "Please select a valid project type.",
  }),
  overview: z
    .string()
    .trim()
    .min(50, { message: "Overview must be at least 50 characters." })
    .max(5000, { message: "Overview cannot exceed 5000 characters." }),
  challenge: z
    .string()
    .trim()
    .min(30, { message: "Challenge must be at least 30 characters." })
    .max(5000, { message: "Challenge cannot exceed 5000 characters." }),
  solution: z
    .string()
    .trim()
    .min(30, { message: "Solution must be at least 30 characters." })
    .max(10000, { message: "Solution cannot exceed 10,000 characters." }),
  results: z
    .array(
      z.object({
        metric: z
          .string()
          .trim()
          .min(1, { message: "Metric is required." })
          .max(100, { message: "Metric cannot exceed 100 characters." }),
        value: z
          .string()
          .trim()
          .min(1, { message: "Value is required." })
          .max(100, { message: "Value cannot exceed 100 characters." }),
        description: z
          .string()
          .trim()
          .max(300, { message: "Description cannot exceed 300 characters." })
          .optional()
          .or(z.literal("")),
      }).strict()
    )
    .max(10, { message: "You can specify at most 10 results metrics." })
    .optional()
    .default([]),
  services: z
    .array(z.enum(CASE_STUDY_SERVICES))
    .min(1, { message: "Please specify at least 1 service provided." })
    .max(15, { message: "You can specify at most 15 services." }),
  coverImage: z.object({
    url: z.string().url({ message: "Cover image must be a valid URL." }),
    alt: z
      .string()
      .trim()
      .min(1, { message: "Alt text is required for the cover image." })
      .max(200, { message: "Alt text cannot exceed 200 characters." }),
  }).strict(),
  gallery: z
    .array(
      z.object({
        url: z.string().url({ message: "Gallery image must be a valid URL." }),
        alt: z
          .string()
          .trim()
          .min(1, { message: "Alt text is required for the gallery image." })
          .max(200, { message: "Alt text cannot exceed 200 characters." }),
      }).strict()
    )
    .max(20, { message: "You can specify at most 20 gallery images." })
    .optional()
    .default([]),
  status: z
    .enum(CASE_STUDY_STATUSES, {
      message: "Invalid status value.",
    })
    .optional(),
  publishedAt: z
    .preprocess(
      (val) => (val ? new Date(val as string) : undefined),
      z.date().optional()
    )
    .optional(),
  seo: seoSchema.optional(),
}).strict();

export const updateCaseStudySchema = createCaseStudySchema.partial();

export type CreateCaseStudyInput = z.infer<typeof createCaseStudySchema>;
export type UpdateCaseStudyInput = z.infer<typeof updateCaseStudySchema>;
