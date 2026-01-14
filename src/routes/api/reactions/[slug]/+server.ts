import { json, error } from '@sveltejs/kit';
import { kv } from '@vercel/kv';
import type { RequestHandler } from './$types';

function getKeys(slug: string) {
	return {
		likes: `reactions:${slug}:likes`,
		dislikes: `reactions:${slug}:dislikes`
	};
}

export const GET: RequestHandler = async ({ params }) => {
	const slug = params.slug;
	if (!slug) {
		throw error(400, 'Missing slug');
	}

	const keys = getKeys(slug);

	try {
		const [likes, dislikes] = await Promise.all([
			kv.get<number>(keys.likes),
			kv.get<number>(keys.dislikes)
		]);

		return json({
			likes: likes ?? 0
			// dislikes hidden from public
		});
	} catch (e) {
		console.error('Failed to get reactions:', e);
		throw error(500, 'Failed to get reactions');
	}
};

export const POST: RequestHandler = async ({ params, request }) => {
	const slug = params.slug;
	if (!slug) {
		throw error(400, 'Missing slug');
	}

	let body: { type: 'like' | 'dislike' };
	try {
		body = await request.json();
	} catch {
		throw error(400, 'Invalid JSON');
	}

	if (body.type !== 'like' && body.type !== 'dislike') {
		throw error(400, 'Invalid reaction type');
	}

	const keys = getKeys(slug);
	const key = body.type === 'like' ? keys.likes : keys.dislikes;

	try {
		const newCount = await kv.incr(key);

		return json({
			likes: body.type === 'like' ? newCount : undefined,
			success: true
		});
	} catch (e) {
		console.error('Failed to save reaction:', e);
		throw error(500, 'Failed to save reaction');
	}
};
