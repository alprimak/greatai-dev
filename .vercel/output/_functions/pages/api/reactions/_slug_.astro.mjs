import { kv } from '@vercel/kv';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
function getKeys(slug) {
  return {
    likes: `reactions:${slug}:likes`,
    dislikes: `reactions:${slug}:dislikes`
  };
}
const GET = async ({ params, request }) => {
  const slug = params.slug;
  if (!slug) {
    return new Response(JSON.stringify({ error: "Missing slug" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const keys = getKeys(slug);
  try {
    const [likes, dislikes] = await Promise.all([
      kv.get(keys.likes),
      kv.get(keys.dislikes)
    ]);
    const isAdmin = request.headers.get("x-admin-key") === undefined                                   ;
    const response = {
      likes: likes ?? 0
    };
    if (isAdmin) {
      response.dislikes = dislikes ?? 0;
    }
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Failed to get reactions:", error);
    return new Response(JSON.stringify({ error: "Failed to get reactions" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const POST = async ({ params, request }) => {
  const slug = params.slug;
  if (!slug) {
    return new Response(JSON.stringify({ error: "Missing slug" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  if (body.type !== "like" && body.type !== "dislike") {
    return new Response(JSON.stringify({ error: "Invalid reaction type" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const keys = getKeys(slug);
  const key = body.type === "like" ? keys.likes : keys.dislikes;
  try {
    const newCount = await kv.incr(key);
    return new Response(JSON.stringify({ likes: body.type === "like" ? newCount : void 0, success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Failed to save reaction:", error);
    return new Response(JSON.stringify({ error: "Failed to save reaction" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
