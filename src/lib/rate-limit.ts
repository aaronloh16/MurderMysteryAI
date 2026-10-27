import 'server-only';

import { Redis } from '@upstash/redis';

/**
 * Fixed-window counters for per-IP rate limits and global daily budgets.
 *
 * With Upstash Redis configured (UPSTASH_REDIS_REST_URL/TOKEN, or the
 * KV_REST_API_URL/TOKEN names the Vercel Marketplace integration injects)
 * counts are shared across every function instance. Without it, counts live
 * in memory per instance: fine for local dev and a low-traffic demo, and
 * documented as such.
 */

const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
const redis = url && token ? new Redis({ url, token }) : null;

const memory = new Map<string, { count: number; resetAt: number }>();

async function hit(key: string, windowSeconds: number): Promise<{ count: number; resetAt: number }> {
  const windowStart = Math.floor(Date.now() / 1000 / windowSeconds) * windowSeconds;
  const resetAt = (windowStart + windowSeconds) * 1000;
  const k = `mm:${key}:${windowStart}`;

  if (redis) {
    try {
      const count = await redis.incr(k);
      if (count === 1) await redis.expire(k, windowSeconds + 60);
      return { count, resetAt };
    } catch (err) {
      // Fail open on infra trouble; the per-instance memory window still applies.
      console.error('[rate-limit] redis unavailable, using memory', err);
    }
  }

  const entry = memory.get(k);
  if (!entry || entry.resetAt <= Date.now()) {
    if (memory.size > 5000) {
      for (const [mk, v] of memory) if (v.resetAt <= Date.now()) memory.delete(mk);
    }
    const fresh = { count: 1, resetAt };
    memory.set(k, fresh);
    return fresh;
  }
  entry.count += 1;
  return entry;
}

export interface LimitResult {
  ok: boolean;
  retryAfterSeconds: number;
}

export async function rateLimit(key: string, max: number, windowSeconds: number): Promise<LimitResult> {
  const { count, resetAt } = await hit(key, windowSeconds);
  return {
    ok: count <= max,
    retryAfterSeconds: Math.max(1, Math.ceil((resetAt - Date.now()) / 1000)),
  };
}

/** Consumes one unit of a global daily budget. Returns false once it is spent. */
export async function spendDailyBudget(name: string, max: number): Promise<boolean> {
  const { count } = await hit(`budget:${name}`, 86_400);
  return count <= max;
}

export const sharedLimiter = Boolean(redis);
