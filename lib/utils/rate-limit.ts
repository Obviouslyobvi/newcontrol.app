/**
 * Sliding-window in-memory rate limiter, keyed per organization (or IP).
 * Serverless note: each warm instance keeps its own window, which is fine
 * at launch scale. Move to Upstash Redis when traffic justifies it.
 */

type Window = { timestamps: number[] };

const windows = new Map<string, Window>();

export type RateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
};

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const win = windows.get(key) ?? { timestamps: [] };
  win.timestamps = win.timestamps.filter((t) => now - t < windowMs);

  const allowed = win.timestamps.length < limit;
  if (allowed) {
    win.timestamps.push(now);
    windows.set(key, win);
  }

  const oldest = win.timestamps[0] ?? now;
  return {
    allowed,
    limit,
    remaining: Math.max(0, limit - win.timestamps.length),
    resetAt: oldest + windowMs,
  };
}

export const RATE_LIMITS = {
  generation: { limit: 10, windowMs: 60 * 60 * 1000 },
  generationTrial: { limit: 3, windowMs: 60 * 60 * 1000 },
  export: { limit: 20, windowMs: 60 * 60 * 1000 },
  api: { limit: 100, windowMs: 60 * 1000 },
  upload: { limit: 10, windowMs: 60 * 60 * 1000 },
  auth: { limit: 10, windowMs: 60 * 1000 },
} as const;

export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  const headers: Record<string, string> = {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
  };
  if (!result.allowed) {
    headers["Retry-After"] = String(
      Math.max(1, Math.ceil((result.resetAt - Date.now()) / 1000))
    );
  }
  return headers;
}
