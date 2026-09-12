import "server-only";
import { headers } from "next/headers";

interface RateLimitRecord {
  timestamps: number[];
}

const MAX_CACHE_SIZE = 5000;

export const rateLimitCache = new Map<string, RateLimitRecord>();

// Prevent memory leak by periodically cleaning up stale cache entries
if (typeof global !== "undefined") {
  // Store interval on global to prevent duplicate registrations in development hot-reload
  const globalAny = global as unknown as { rateLimitInterval?: NodeJS.Timeout };
  if (!globalAny.rateLimitInterval) {
    globalAny.rateLimitInterval = setInterval(() => {
      const now = Date.now();
      for (const [key, record] of rateLimitCache.entries()) {
        record.timestamps = record.timestamps.filter((ts) => now - ts < 15 * 60 * 1000);
        if (record.timestamps.length === 0) {
          rateLimitCache.delete(key);
        }
      }
    }, 5 * 60 * 1000);
    
    if (globalAny.rateLimitInterval.unref) {
      globalAny.rateLimitInterval.unref();
    }
  }
}

/**
 * Enforce upper bound on cache to guarantee memory footprint remains tiny under heavy traffic.
 */
function pruneCacheIfNeeded() {
  if (rateLimitCache.size >= MAX_CACHE_SIZE) {
    // Evict oldest 100 keys
    const iterator = rateLimitCache.keys();
    for (let i = 0; i < 100; i++) {
      const next = iterator.next();
      if (next.done) break;
      rateLimitCache.delete(next.value);
    }
  }
}

/**
 * Check if the rate limit is already exceeded without incrementing.
 */
export function isRateLimited(
  key: string,
  limit: number,
  windowMs: number
): boolean {
  const now = Date.now();
  const record = rateLimitCache.get(key);
  if (!record) return false;

  const activeTimestamps = record.timestamps.filter((ts) => now - ts < windowMs);
  return activeTimestamps.length >= limit;
}

/**
 * Check if the request exceeds the rate limit.
 * @param key Unique key for identifying the client (e.g. rate-limit:ip:endpoint)
 * @param limit Maximum number of allowed requests in the time window
 * @param windowMs Time window in milliseconds
 */
export async function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<{ success: boolean; remaining: number }> {
  const now = Date.now();
  const existing = rateLimitCache.get(key);
  const record = existing || { timestamps: [] };

  // Filter timestamps within the current window
  record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  if (record.timestamps.length >= limit) {
    return { success: false, remaining: 0 };
  }

  record.timestamps.push(now);

  if (!existing) {
    pruneCacheIfNeeded();
  }

  rateLimitCache.set(key, record);

  return { success: true, remaining: limit - record.timestamps.length };
}

/**
 * Helper to retrieve client IP from headers.
 */
export async function getClientIp(): Promise<string> {
  try {
    const headerList = await headers();
    const cfIp = headerList.get("cf-connecting-ip");
    if (cfIp) return cfIp.trim();

    const realIp = headerList.get("x-real-ip");
    if (realIp) return realIp.trim();

    const xForwardedFor = headerList.get("x-forwarded-for");
    if (xForwardedFor) {
      return xForwardedFor.split(",")[0].trim();
    }
  } catch {
    // headers() might throw outside Next.js request context (e.g. static rendering)
  }
  return "127.0.0.1";
}

