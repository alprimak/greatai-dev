import { json, error } from '@sveltejs/kit';
import Anthropic from '@anthropic-ai/sdk';
import { checkRateLimit, getRateLimitStatus } from '$lib/ratelimit';
import type { RequestHandler } from './$types';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

const SYSTEM_PROMPT = `You are a code simplification expert. Your task is to take the provided code and return a cleaner, more maintainable version while preserving all functionality.

Rules:
1. Preserve ALL functionality - the code must work exactly the same
2. Improve readability and clarity
3. Remove unnecessary complexity
4. Use consistent naming conventions
5. Simplify conditionals and loops where possible
6. Remove dead code and unused variables
7. Add brief comments only where logic is non-obvious
8. Keep the same programming language
9. Return ONLY the simplified code, no explanations

If the input is not valid code or is too short to simplify, return the original input unchanged.`;

function getClientIp(request: Request): string {
	// Try various headers used by reverse proxies
	const forwarded = request.headers.get('x-forwarded-for');
	if (forwarded) {
		return forwarded.split(',')[0].trim();
	}

	const realIp = request.headers.get('x-real-ip');
	if (realIp) {
		return realIp;
	}

	const cfConnectingIp = request.headers.get('cf-connecting-ip');
	if (cfConnectingIp) {
		return cfConnectingIp;
	}

	// Fallback
	return 'unknown';
}

// GET - Check rate limit status
export const GET: RequestHandler = async ({ request }) => {
	const ip = getClientIp(request);
	const status = await getRateLimitStatus(ip, 'code-simplifier');

	return json({
		remaining: status.remaining,
		limit: 5,
		resetAt: status.resetAt
	});
};

// POST - Simplify code
export const POST: RequestHandler = async ({ request }) => {
	if (!ANTHROPIC_API_KEY) {
		throw error(500, 'API not configured');
	}

	const ip = getClientIp(request);

	// Check rate limit
	const rateLimit = await checkRateLimit(ip, 'code-simplifier');

	if (!rateLimit.allowed) {
		return json(
			{
				error: 'Rate limit exceeded',
				remaining: 0,
				resetAt: rateLimit.resetAt
			},
			{ status: 429 }
		);
	}

	// Parse request
	let body: { code: string; language?: string };
	try {
		body = await request.json();
	} catch {
		throw error(400, 'Invalid JSON');
	}

	if (!body.code || typeof body.code !== 'string') {
		throw error(400, 'Missing or invalid code');
	}

	if (body.code.length > 50000) {
		throw error(400, 'Code too long (max 50,000 characters)');
	}

	if (body.code.trim().length < 10) {
		throw error(400, 'Code too short');
	}

	try {
		const client = new Anthropic({
			apiKey: ANTHROPIC_API_KEY
		});

		const languageHint = body.language ? `\n\nLanguage: ${body.language}` : '';

		const message = await client.messages.create({
			model: 'claude-sonnet-4-20250514',
			max_tokens: 8192,
			system: SYSTEM_PROMPT,
			messages: [
				{
					role: 'user',
					content: `Simplify this code:${languageHint}\n\n\`\`\`\n${body.code}\n\`\`\``
				}
			]
		});

		// Extract text from response
		const textBlock = message.content.find(block => block.type === 'text');
		if (!textBlock || textBlock.type !== 'text') {
			throw error(500, 'Invalid response from AI');
		}

		let simplifiedCode = textBlock.text;

		// Remove markdown code blocks if present
		const codeBlockMatch = simplifiedCode.match(/```[\w]*\n?([\s\S]*?)```/);
		if (codeBlockMatch) {
			simplifiedCode = codeBlockMatch[1].trim();
		}

		return json({
			simplified: simplifiedCode,
			remaining: rateLimit.remaining,
			resetAt: rateLimit.resetAt,
			tokensUsed: {
				input: message.usage.input_tokens,
				output: message.usage.output_tokens
			}
		});
	} catch (e) {
		console.error('Code simplification failed:', e);

		if (e instanceof Anthropic.APIError) {
			throw error(500, `AI service error: ${e.message}`);
		}

		throw error(500, 'Failed to simplify code');
	}
};
