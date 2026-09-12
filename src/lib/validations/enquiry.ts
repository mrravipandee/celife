import { z } from "zod";
import { PROJECT_TYPES, PROJECT_STAGES, BUSINESS_STATUSES } from "@/types/enquiry";

export const createEnquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(100, { message: "Name cannot exceed 100 characters." }),
  email: z
    .string()
    .trim()
    .email({ message: "Please enter a valid email address." })
    .lowercase(),
  phone: z
    .string()
    .trim()
    .min(6, { message: "Please enter a valid phone number." })
    .max(30, { message: "Phone number cannot exceed 30 characters." }),
  company: z
    .string()
    .trim()
    .max(150, { message: "Company name cannot exceed 150 characters." })
    .optional()
    .or(z.literal("")),
  projectType: z.enum(PROJECT_TYPES, {
    message: "Please select a valid project type.",
  }),
  location: z
    .string()
    .trim()
    .max(150, { message: "Location cannot exceed 150 characters." })
    .optional()
    .or(z.literal("")),
  projectStage: z
    .enum(PROJECT_STAGES)
    .optional()
    .or(z.literal("")),
  businessStatus: z
    .enum(BUSINESS_STATUSES)
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, { message: "Message must be at least 10 characters." })
    .max(3000, { message: "Message cannot exceed 3000 characters." }),
  website: z
    .string()
    .optional(),
}).strict();

export type CreateEnquiryInput = z.infer<typeof createEnquirySchema>;

import { ENQUIRY_STATUSES } from "@/types/enquiry";

export const updateEnquirySchema = z.object({
  status: z.enum(ENQUIRY_STATUSES, {
    message: "Please select a valid status.",
  }),
}).strict();

export type UpdateEnquiryInput = z.infer<typeof updateEnquirySchema>;

