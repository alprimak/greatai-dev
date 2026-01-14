import type { APIRoute } from 'astro';
import { kv } from '@vercel/kv';

export const prerender = false;

interface ReactionData {
  likes: number;
  dislikes: number;
}

function getKeys(slug: string) {
  return {
    likes: `reactions:${slug}:likes`,
    dislikes: `reactions:${slug}:dislikes`,
  };
}

export const GET: APIRoute = async ({ params, request }) => {
  const slug = params.slug;
  if (!slug) {
    return new Response(JSON.stringify({ error: 'Missing slug' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const keys = getKeys(slug);

  try {
    const [likes, dislikes] = await Promise.all([
      kv.get<number>(keys.likes),
      kv.get<number>(keys.dislikes),
    ]);

    // Only return likes publicly, dislikes are internal
    const isAdmin = request.headers.get('x-admin-key') === import.meta.env.REACTIONS_ADMIN_KEY;

    const response: { likes: number; dislikes?: number } = {
      likes: likes ?? 0,
    };

    if (isAdmin) {
      response.dislikes = dislikes ?? 0;
    }

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to get reactions:', error);
    return new Response(JSON.stringify({ error: 'Failed to get reactions' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async ({ params, request }) => {
  const slug = params.slug;
  if (!slug) {
    return new Response(JSON.stringify({ error: 'Missing slug' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body: { type: 'like' | 'dislike' };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (body.type !== 'like' && body.type !== 'dislike') {
    return new Response(JSON.stringify({ error: 'Invalid reaction type' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const keys = getKeys(slug);
  const key = body.type === 'like' ? keys.likes : keys.dislikes;

  try {
    const newCount = await kv.incr(key);

    // Only return likes count publicly
    return new Response(JSON.stringify({ likes: body.type === 'like' ? newCount : undefined, success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to save reaction:', error);
    return new Response(JSON.stringify({ error: 'Failed to save reaction' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
