import { z } from "zod";

// ─── Settings PATCH schema ────────────────────────────────────────────────────

const contactSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }).or(z.literal("")).optional(),
  phone: z.string().trim().max(30, { message: "Phone number too long" }).optional(),
  address: z.string().trim().max(200, { message: "Address too long" }).optional(),
  website: z
    .string()
    .trim()
    .url({ message: "Must be a valid URL" })
    .or(z.literal(""))
    .optional(),
});

const socialSchema = z.object({
  linkedin: z
    .string()
    .trim()
    .url({ message: "Must be a valid LinkedIn URL" })
    .or(z.literal(""))
    .optional(),
  instagram: z
    .string()
    .trim()
    .url({ message: "Must be a valid Instagram URL" })
    .or(z.literal(""))
    .optional(),
  youtube: z
    .string()
    .trim()
    .url({ message: "Must be a valid YouTube URL" })
    .or(z.literal(""))
    .optional(),
  facebook: z
    .string()
    .trim()
    .url({ message: "Must be a valid Facebook URL" })
    .or(z.literal(""))
    .optional(),
});

const notificationsSchema = z.object({
  newInquiryEmail: z.boolean().optional(),
  weeklyDigest: z.boolean().optional(),
  systemAlerts: z.boolean().optional(),
});

export const settingsPatchSchema = z
  .object({
    contact: contactSchema.optional(),
    social: socialSchema.optional(),
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
