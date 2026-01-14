import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	try {
		const post = await import(`../../../lib/posts/${params.slug}.md`);
		return {
			content: post.default,
			metadata: post.metadata,
			slug: params.slug
		};
	} catch {
		throw error(404, `Post not found: ${params.slug}`);
	}
};
