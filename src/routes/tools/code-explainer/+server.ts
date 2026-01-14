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
	const { remaining, resetAt } = await getRateLimitStatus(ip, 'code-explainer');
	return json({ remaining, resetAt });
};

export const POST: RequestHandler = async ({ request }) => {
	const ip = request.headers.get('x-forwarded-for') || 'anonymous';
	const { allowed, remaining, resetAt } = await checkRateLimit(ip, 'code-explainer');

	if (!allowed) {
		return json({ error: 'Rate limit exceeded', remaining: 0, resetAt }, { status: 429 });
	}

	try {
		const { code, language, depth } = await request.json();

		if (!code || code.trim().length === 0) {
			return json({ error: 'No code provided' }, { status: 400 });
		}

		if (code.length > 10000) {
			return json({ error: 'Code too long (max 10000 characters)' }, { status: 400 });
		}

		const depthInstructions = {
			brief: 'Give a brief 2-3 sentence summary of what this code does.',
			detailed: 'Explain this code in detail, covering the main logic, data flow, and purpose of each significant section.',
			line_by_line: 'Provide a line-by-line or block-by-block explanation of this code, explaining what each part does.'
		};

		const instruction = depthInstructions[depth as keyof typeof depthInstructions] || depthInstructions.detailed;

		const message = await anthropic.messages.create({
			model: 'claude-sonnet-4-20250514',
			max_tokens: 2000,
			messages: [
				{
					role: 'user',
					content: `You are a code explanation assistant. ${instruction}

Language: ${language}

Code:
\`\`\`${language}
${code}
\`\`\`

Provide a clear, educational explanation. Use markdown formatting for readability. If there are any potential issues, edge cases, or improvements, mention them briefly at the end.`
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
		console.error('Code explanation error:', error);
		return json({ error: 'Failed to explain code' }, { status: 500 });
	}
};
