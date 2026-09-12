import { z } from "zod";

export const paginationQuerySchema = z.object({
  page: z
    .preprocess(
      (val) => parseInt(val as string || "1", 10),
      z.number().int().min(1, { message: "Page must be at least 1" })
    )
    .default(1),
  limit: z
    .preprocess(
      (val) => parseInt(val as string || "12", 10),
      z.number().int().min(1, { message: "Limit must be at least 1" }).max(100, { message: "Limit cannot exceed 100" })
    )
    .default(12),
});

export const searchQuerySchema = z
  .string()
  .trim()
  .max(100, { message: "Search query is too long (maximum 100 characters)" })
  .optional()
  .or(z.literal(""));
