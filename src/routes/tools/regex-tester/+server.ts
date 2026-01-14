import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import Anthropic from '@anthropic-ai/sdk';
import { env } from '$env/dynamic/private';
import { checkRateLimit, getRateLimitStatus } from '$lib/ratelimit';

const anthropic = new Anthropic({
	apiKey: env.ANTHROPIC_API_KEY
});

export const GET: RequestHandler = async ({ request }) => {
	const ip = request.headers.get('x-forwarded-for') || 'anonymous';
	const { remaining, resetAt } = await getRateLimitStatus(ip, 'regex-tester');
	return json({ remaining, resetAt });
};

export const POST: RequestHandler = async ({ request }) => {
	const ip = request.headers.get('x-forwarded-for') || 'anonymous';
	const { allowed, remaining, resetAt } = await checkRateLimit(ip, 'regex-tester');

	if (!allowed) {
		return json({ error: 'Rate limit exceeded', remaining: 0, resetAt }, { status: 429 });
	}

	try {
		const { pattern, flags } = await request.json();

		if (!pattern || pattern.trim().length === 0) {
			return json({ error: 'No pattern provided' }, { status: 400 });
		}

		if (pattern.length > 500) {
			return json({ error: 'Pattern too long (max 500 characters)' }, { status: 400 });
		}

		const message = await anthropic.messages.create({
			model: 'claude-sonnet-4-20250514',
			max_tokens: 1000,
			messages: [
				{
					role: 'user',
					content: `Explain this regular expression in plain English. Be concise but thorough.

Pattern: \`${pattern}\`
Flags: \`${flags || 'none'}\`

Format your response as:
1. **Summary**: One sentence overview of what this regex matches
2. **Breakdown**: Explain each part of the pattern
3. **Examples**: Give 2-3 examples of strings that would match and 1-2 that wouldn't

Keep the explanation beginner-friendly.`
				}
			]
		});

		const explanation = message.content[0].type === 'text' ? message.content[0].text : '';

		return json({
			explanation,
			remaining,
			resetAt
		});
	} catch (error) {
		console.error('Regex explanation error:', error);
		return json({ error: 'Failed to explain regex' }, { status: 500 });
	}
};
