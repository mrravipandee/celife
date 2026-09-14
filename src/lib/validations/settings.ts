import { z } from "zod";

// ─── Settings PATCH schema ────────────────────────────────────────────────────

const brandSchema = z.object({
  companyName: z.string().trim().min(1).max(100).optional(),
  logo: z.string().trim().optional(),
  favicon: z.string().trim().optional(),
  tagline: z.string().trim().max(200).optional(),
});

const contactSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }).or(z.literal("")).optional(),
  phone: z.string().trim().max(40, { message: "Phone number too long" }).optional(),
  address: z.string().trim().max(300, { message: "Address too long" }).optional(),
  website: z.string().trim().or(z.literal("")).optional(),
  whatsapp: z.string().trim().max(40).optional(),
  businessHours: z.string().trim().max(150).optional(),
  googleMaps: z.string().trim().optional(),
});

const socialSchema = z.object({
  linkedin: z.string().trim().or(z.literal("")).optional(),
  instagram: z.string().trim().or(z.literal("")).optional(),
  youtube: z.string().trim().or(z.literal("")).optional(),
  facebook: z.string().trim().or(z.literal("")).optional(),
});

const footerSchema = z.object({
  description: z.string().trim().max(500).optional(),
  copyright: z.string().trim().max(200).optional(),
  disclaimer: z.string().trim().max(500).optional(),
});

const seoSchema = z.object({
  defaultTitle: z.string().trim().max(150).optional(),
  defaultDescription: z.string().trim().max(300).optional(),
  defaultOgImage: z.string().trim().optional(),
});

const notificationsSchema = z.object({
  newInquiryEmail: z.boolean().optional(),
  weeklyDigest: z.boolean().optional(),
  systemAlerts: z.boolean().optional(),
});

export const settingsPatchSchema = z
  .object({
    brand: brandSchema.optional(),
    contact: contactSchema.optional(),
    social: socialSchema.optional(),
    footer: footerSchema.optional(),
    seo: seoSchema.optional(),
    notifications: notificationsSchema.optional(),
  })
  .strict();

export type SettingsPatchData = z.infer<typeof settingsPatchSchema>;

// ─── Password change schema ───────────────────────────────────────────────────

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, { message: "Current password is required" }),
    newPassword: z
      .string()
      .min(8, { message: "New password must be at least 8 characters" })
      .max(128, { message: "Password cannot exceed 128 characters" }),
    confirmPassword: z.string().min(1, { message: "Please confirm your new password" }),
  })
  .strict()
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ChangePasswordData = z.infer<typeof changePasswordSchema>;
