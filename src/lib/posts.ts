export interface PostMetadata {
	title: string;
	description: string;
	pubDate: string;
	updatedDate?: string;
	tags?: string[];
	heroImage?: string;
}

export interface Post {
	slug: string;
	metadata: PostMetadata;
}

export async function getPosts(): Promise<Post[]> {
	const modules = import.meta.glob<{ metadata: PostMetadata }>('/src/lib/posts/*.md');

	const posts: Post[] = [];

	for (const [path, resolver] of Object.entries(modules)) {
		const { metadata } = await resolver();
		const slug = path.replace('/src/lib/posts/', '').replace('.md', '');
		posts.push({ slug, metadata });
	}

	// Sort by date descending
	posts.sort((a, b) => new Date(b.metadata.pubDate).getTime() - new Date(a.metadata.pubDate).getTime());

	return posts;
}

export async function getPost(slug: string): Promise<{ metadata: PostMetadata; default: any } | null> {
	try {
		const post = await import(`./posts/${slug}.md`);
		return post;
	} catch {
		return null;
	}
}
