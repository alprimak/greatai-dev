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
	const { remaining, resetAt } = await getRateLimitStatus(ip, 'prompt-optimizer');
	return json({ remaining, resetAt });
};

export const POST: RequestHandler = async ({ request }) => {
	const ip = request.headers.get('x-forwarded-for') || 'anonymous';
	const { allowed, remaining, resetAt } = await checkRateLimit(ip, 'prompt-optimizer');

	if (!allowed) {
		return json({ error: 'Rate limit exceeded', remaining: 0, resetAt }, { status: 429 });
	}

	try {
		const { prompt, goal, model } = await request.json();

		if (!prompt || prompt.trim().length === 0) {
			return json({ error: 'No prompt provided' }, { status: 400 });
		}

		if (prompt.length > 5000) {
			return json({ error: 'Prompt too long (max 5000 characters)' }, { status: 400 });
		}

		const targetModel = model || 'Claude';
		const goalContext = goal ? `\nThe user's goal: ${goal}` : '';

		const message = await anthropic.messages.create({
			model: 'claude-sonnet-4-20250514',
			max_tokens: 2000,
			messages: [
				{
					role: 'user',
					content: `You are an expert prompt engineer. Analyze and improve the following prompt for use with ${targetModel}.${goalContext}

Original prompt:
"""
${prompt}
"""

Provide:
1. **Analysis**: Brief analysis of the original prompt's strengths and weaknesses (2-3 sentences)
2. **Improved Prompt**: A rewritten, optimized version of the prompt that:
   - Is clearer and more specific
   - Includes relevant context
   - Has better structure
   - Uses effective prompting techniques (e.g., role assignment, step-by-step instructions, examples if helpful)
3. **Key Changes**: Bullet list of the main improvements made

Format the improved prompt in a code block so it's easy to copy.`
				}
			]
		});

		const result = message.content[0].type === 'text' ? message.content[0].text : '';

		return json({
			result,
			remaining,
			resetAt
		});
	} catch (error) {
		console.error('Prompt optimization error:', error);
		return json({ error: 'Failed to optimize prompt' }, { status: 500 });
	}
};
