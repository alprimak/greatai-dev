import { getPosts } from '$lib/posts';
import { SITE_URL } from '$lib/config';
import type { RequestHandler } from './$types';

export const prerender = true;

function formatDateISO(dateStr: string): string {
	const date = new Date(dateStr);
	return date.toISOString().split('T')[0];
}

export const GET: RequestHandler = async () => {
	const posts = await getPosts();

	const staticPages = [
		{ url: '', priority: '1.0', changefreq: 'weekly', lastmod: '2026-02-15' },
		{ url: '/blog', priority: '0.9', changefreq: 'daily', lastmod: '2026-02-15' },
		{ url: '/tools', priority: '0.8', changefreq: 'weekly', lastmod: '2026-02-15' },
		{ url: '/projects', priority: '0.8', changefreq: 'monthly', lastmod: '2026-02-01' },
		{ url: '/about', priority: '0.7', changefreq: 'monthly', lastmod: '2026-02-01' },
		{ url: '/tools/code-simplifier', priority: '0.7', changefreq: 'monthly', lastmod: '2026-02-15' },
		{ url: '/tools/code-explainer', priority: '0.7', changefreq: 'monthly', lastmod: '2026-02-15' },
		{ url: '/tools/prompt-optimizer', priority: '0.7', changefreq: 'monthly', lastmod: '2026-02-15' },
		{ url: '/tools/token-calculator', priority: '0.7', changefreq: 'monthly', lastmod: '2026-02-15' },
		{ url: '/tools/json-formatter', priority: '0.7', changefreq: 'monthly', lastmod: '2026-02-15' },
		{ url: '/tools/regex-tester', priority: '0.7', changefreq: 'monthly', lastmod: '2026-02-15' },
		{ url: '/tools/base64', priority: '0.7', changefreq: 'monthly', lastmod: '2026-02-15' },
		{ url: '/tools/timestamp', priority: '0.7', changefreq: 'monthly', lastmod: '2026-02-15' }
	];

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages
	.map(
		(page) => `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
	)
	.join('\n')}
${posts
	.map(
		(post) => `  <url>
    <loc>${SITE_URL}/blog/${post.slug}</loc>
    <lastmod>${formatDateISO(post.metadata.updatedDate || post.metadata.pubDate)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
	)
	.join('\n')}
</urlset>`;

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=3600'
		}
	});
};
