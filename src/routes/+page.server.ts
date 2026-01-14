import { getPosts } from '$lib/posts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const posts = await getPosts();
	return { posts: posts.slice(0, 5) }; // Latest 5 posts
};
