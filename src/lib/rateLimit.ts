//  * In-memory rate limiter — no external dependencies.
//  * Uses a sliding window per IP address.
//  * For multi-instance deployments, we need to swap the Map for a Redis store.
 

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

const store = new Map<string, RateLimitEntry>();    // key = action + IP ("login:192.168.1.1")

// Clean up stale entries every 10 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now - entry.windowStart > 15 * 60 * 1000) {
      store.delete(key);
    }
  }
}, 10 * 60 * 1000);

interface RateLimitOptions {
  /** Max requests allowed within the window */
  limit: number;
  /** Window duration in milliseconds */
  windowMs: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
}

export function rateLimit(ip: string, key: string, options: RateLimitOptions): RateLimitResult {
  const { limit, windowMs } = options;
  const storeKey = `${key}:${ip}`;   //key = route identifier ("login")
  const now = Date.now();

  const entry = store.get(storeKey);

  // No entry or window has expired — start fresh
  if (!entry || now - entry.windowStart >= windowMs) {
    store.set(storeKey, { count: 1, windowStart: now });
    return { allowed: true, remaining: limit - 1, retryAfterMs: 0 };
  }

  // Within window
  if (entry.count < limit) {
    entry.count++;
    return { allowed: true, remaining: limit - entry.count, retryAfterMs: 0 };
  }

  // Limit exceeded
  const retryAfterMs = windowMs - (now - entry.windowStart);
  return { allowed: false, remaining: 0, retryAfterMs };
}

// Extract the real client IP from Next.js request headers 
export function getIP(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}
