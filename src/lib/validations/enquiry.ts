import { z } from "zod";
import { PROJECT_TYPES, PROJECT_STAGES, BUSINESS_STATUSES, ENQUIRY_STATUSES } from "@/types/enquiry";

export const createEnquirySchema = z
  .object({
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
    productId: z.string().trim().optional().or(z.literal("")),
    productSlug: z.string().trim().max(200).optional().or(z.literal("")),
    productNameSnapshot: z.string().trim().max(200).optional().or(z.literal("")),
    productCategory: z.string().trim().max(150).optional().or(z.literal("")),
    product: z
      .string()
      .trim()
      .max(200)
      .optional()
      .or(z.literal("")),
    company: z
      .string()
      .trim()
      .max(150, { message: "Company name cannot exceed 150 characters." })
      .optional()
      .or(z.literal("")),
    city: z
      .string()
      .trim()
      .max(150, { message: "City cannot exceed 150 characters." })
      .optional()
      .or(z.literal("")),
    location: z
      .string()
      .trim()
      .max(150, { message: "Location cannot exceed 150 characters." })
      .optional()
      .or(z.literal("")),
    projectType: z
      .enum(PROJECT_TYPES, {
        message: "Please select a valid enquiry type.",
      })
      .default("Product Enquiry")
      .optional(),
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
      .min(5, { message: "Message must be at least 5 characters." })
      .max(3000, { message: "Message cannot exceed 3000 characters." }),
    // Anti-bot honeypot fields
    _hp: z.string().optional(),
    honeypot: z.string().optional(),
    website_url: z.string().optional(),
    website: z.string().optional(),
  })
  .strict();

export type CreateEnquiryInput = z.infer<typeof createEnquirySchema>;

export const productEnquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Please enter your name." })
    .max(100),
  phone: z
    .string()
    .trim()
    .min(6, { message: "Please enter a valid phone number." })
    .max(30),
  email: z
    .string()
    .trim()
    .email({ message: "Please enter a valid email address." })
    .lowercase(),
  productId: z.string().trim().optional().or(z.literal("")),
  productSlug: z.string().trim().max(200).optional().or(z.literal("")),
  productNameSnapshot: z.string().trim().max(200).optional().or(z.literal("")),
  productCategory: z.string().trim().max(150).optional().or(z.literal("")),
  product: z
    .string()
    .trim()
    .min(1, { message: "Please specify the product." }),
  message: z
    .string()
    .trim()
    .min(5, { message: "Please enter your enquiry message (at least 5 characters)." })
    .max(3000),
  company: z.string().trim().optional().or(z.literal("")),
  city: z.string().trim().optional().or(z.literal("")),
  location: z.string().trim().optional().or(z.literal("")),
  // Honeypot field for anti-bot
  website_url: z.string().optional(),
});

export type ProductEnquiryInput = z.infer<typeof productEnquirySchema>;

export const updateEnquirySchema = z
  .object({
    status: z
      .enum(ENQUIRY_STATUSES, {
        message: "Please select a valid status.",
      })
      .optional(),
    notes: z
      .string()
      .max(5000, { message: "Notes cannot exceed 5000 characters." })
      .optional(),
  })
  .strict();

export type UpdateEnquiryInput = z.infer<typeof updateEnquirySchema>;

