import { z } from "zod";

const envSchema = z.object({
  MONGODB_URI: z
    .string()
    .url({ message: "MONGODB_URI must be a valid connection URL" }),
  AUTH_SECRET: z
    .string()
    .min(16, { message: "AUTH_SECRET must be at least 16 characters for security" }),
  NEXT_PUBLIC_SITE_URL: z
    .string()
    .url({ message: "NEXT_PUBLIC_SITE_URL must be a valid URL" }),
});

const isBuildTime = process.env.NEXT_PHASE === "phase-production-build";

const fallbackEnv = {
  MONGODB_URI: "mongodb://localhost:27017/thedco_fallback",
  AUTH_SECRET: "placeholder-secret-for-build-time-safety",
  NEXT_PUBLIC_SITE_URL: "https://thedco.com",
};

const parsed = envSchema.safeParse({
  MONGODB_URI: process.env.MONGODB_URI || (isBuildTime ? fallbackEnv.MONGODB_URI : undefined),
  AUTH_SECRET: process.env.AUTH_SECRET || (isBuildTime ? fallbackEnv.AUTH_SECRET : undefined),
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || (isBuildTime ? fallbackEnv.NEXT_PUBLIC_SITE_URL : undefined),
});

if (!parsed.success) {
  console.error("❌ Environment validation failed:", JSON.stringify(parsed.error.flatten().fieldErrors, null, 2));
  throw new Error("Missing or invalid critical environment variables");
}

export const env = parsed.data;
