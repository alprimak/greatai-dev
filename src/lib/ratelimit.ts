import { kv } from '@vercel/kv';

const RATE_LIMIT = 5; // requests per window
const WINDOW_MS = 60 * 60 * 1000; // 1 hour in milliseconds
const WINDOW_SECONDS = 60 * 60; // 1 hour in seconds

export interface RateLimitResult {
	allowed: boolean;
	remaining: number;
	resetAt: number; // Unix timestamp in seconds
}

export async function checkRateLimit(ip: string, tool: string): Promise<RateLimitResult> {
	const key = `ratelimit:${tool}:${ip}`;
	const now = Math.floor(Date.now() / 1000);

	try {
		// Get current count and TTL
		const [count, ttl] = await Promise.all([
			kv.get<number>(key),
			kv.ttl(key)
		]);

		const currentCount = count ?? 0;

		if (currentCount >= RATE_LIMIT) {
			// Rate limited
			const resetAt = ttl > 0 ? now + ttl : now + WINDOW_SECONDS;
			return {
				allowed: false,
				remaining: 0,
				resetAt
			};
		}

		// Increment counter
		if (currentCount === 0) {
			// First request in window - set with expiry
			await kv.set(key, 1, { ex: WINDOW_SECONDS });
		} else {
			// Increment existing counter
			await kv.incr(key);
		}

		return {
			allowed: true,
			remaining: RATE_LIMIT - currentCount - 1,
			resetAt: ttl > 0 ? now + ttl : now + WINDOW_SECONDS
		};
	} catch (error) {
		console.error('Rate limit check failed:', error);
		// Fail open - allow request if rate limiting fails
		return {
			allowed: true,
			remaining: RATE_LIMIT,
			resetAt: now + WINDOW_SECONDS
		};
	}
}

export async function getRateLimitStatus(ip: string, tool: string): Promise<RateLimitResult> {
	const key = `ratelimit:${tool}:${ip}`;
	const now = Math.floor(Date.now() / 1000);

	try {
		const [count, ttl] = await Promise.all([
			kv.get<number>(key),
			kv.ttl(key)
		]);

		const currentCount = count ?? 0;
		const resetAt = ttl > 0 ? now + ttl : now + WINDOW_SECONDS;

		return {
			allowed: currentCount < RATE_LIMIT,
			remaining: Math.max(0, RATE_LIMIT - currentCount),
			resetAt
		};
	} catch (error) {
		console.error('Rate limit status check failed:', error);
		return {
			allowed: true,
			remaining: RATE_LIMIT,
			resetAt: now + WINDOW_SECONDS
		};
	}
}
