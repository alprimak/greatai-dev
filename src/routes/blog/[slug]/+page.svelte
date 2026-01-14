<script lang="ts">
	import { SITE_TITLE } from '$lib/config';
	import Reactions from '$lib/components/Reactions.svelte';

	let { data } = $props();

	function formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>{data.metadata.title} | {SITE_TITLE}</title>
	<meta name="description" content={data.metadata.description} />
</svelte:head>

<div class="blog-post">
	<article>
		<div class="prose">
			<a href="/blog" class="back-link">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<line x1="19" y1="12" x2="5" y2="12"/>
					<polyline points="12 19 5 12 12 5"/>
				</svg>
				Back to blog
			</a>
			<header class="article-header">
				<div class="article-meta">
					<span class="date">{formatDate(data.metadata.pubDate)}</span>
					{#if data.metadata.tags && data.metadata.tags.length > 0}
						<div class="tags">
							{#each data.metadata.tags as tag}
								<span class="tag">{tag}</span>
							{/each}
						</div>
					{/if}
				</div>
				<h1>{data.metadata.title}</h1>
				<p class="description">{data.metadata.description}</p>
				{#if data.metadata.updatedDate}
					<p class="last-updated-on">
						Last updated on {formatDate(data.metadata.updatedDate)}
					</p>
				{/if}
			</header>
			<div class="content">
				<data.content />
			</div>
			<Reactions slug={data.slug} />
		</div>
	</article>
</div>

<style>
	.blog-post {
		width: 100%;
		max-width: 100%;
		margin: 0;
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 2rem;
		color: var(--text-muted);
		text-decoration: none;
		font-size: 0.9rem;
		transition: color 0.2s;
	}

	.back-link svg {
		width: 18px;
		height: 18px;
	}

	.back-link:hover {
		color: var(--accent);
	}

	.prose {
		width: 720px;
		max-width: calc(100% - 2em);
		margin: 0 auto;
		padding: 2rem 1rem 4rem;
	}

	.article-header {
		margin-bottom: 2.5rem;
		padding-bottom: 2rem;
		border-bottom: 1px solid var(--border);
	}

	.article-header h1 {
		margin: 0 0 1rem 0;
		font-size: 2.25rem;
		line-height: 1.2;
		color: var(--text-primary);
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
	}

	.article-meta {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
		margin-bottom: 1rem;
	}

	.date {
		color: var(--text-muted);
		font-size: 0.9rem;
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
	}

	.last-updated-on {
		font-style: italic;
		color: var(--text-muted);
		font-size: 0.85rem;
		margin: 1rem 0 0;
	}

	.tags {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.tag {
		font-size: 0.75rem;
		padding: 0.25rem 0.75rem;
		background: rgba(39, 202, 64, 0.1);
		color: var(--accent);
		border-radius: 20px;
		text-transform: lowercase;
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
	}

	.description {
		color: var(--text-secondary);
		font-size: 1.15rem;
		line-height: 1.6;
		margin: 0;
	}

	/* Content Styles */
	.content :global(h2) {
		margin-top: 2.5rem;
		margin-bottom: 1rem;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid var(--border);
		color: var(--text-primary);
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
	}

	.content :global(h3) {
		margin-top: 2rem;
		margin-bottom: 0.75rem;
		color: var(--text-primary);
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
	}

	.content :global(p) {
		color: var(--text-secondary);
		line-height: 1.8;
	}

	.content :global(pre) {
		margin: 1.5rem 0;
		padding: 1.25rem;
		border-radius: 12px;
		background: #0d0d14 !important;
		border: 1px solid var(--border);
		overflow-x: auto;
	}

	.content :global(code) {
		font-size: 0.9em;
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
	}

	.content :global(p code),
	.content :global(li code) {
		background: var(--bg-card);
		border: 1px solid var(--border);
		padding: 0.15rem 0.4rem;
		border-radius: 4px;
		font-size: 0.85em;
		color: var(--accent);
	}

	.content :global(ul),
	.content :global(ol) {
		margin: 1.5rem 0;
		padding-left: 1.5rem;
		color: var(--text-secondary);
	}

	.content :global(li) {
		margin-bottom: 0.5rem;
		line-height: 1.7;
	}

	.content :global(blockquote) {
		margin: 1.5rem 0;
		padding: 1rem 1.5rem;
		background: var(--bg-card);
		border-left: 4px solid var(--accent);
		border-radius: 0 8px 8px 0;
	}

	.content :global(blockquote p) {
		margin: 0;
		color: var(--text-secondary);
	}

	.content :global(strong) {
		color: var(--text-primary);
	}

	.content :global(a) {
		color: var(--accent);
		text-decoration: none;
		border-bottom: 1px solid transparent;
		transition: border-color 0.2s;
	}

	.content :global(a:hover) {
		border-bottom-color: var(--accent);
	}

	.content :global(hr) {
		margin: 2.5rem 0;
		border: none;
		border-top: 1px solid var(--border);
	}

	.content :global(img) {
		border-radius: 8px;
		border: 1px solid var(--border);
	}

	.content :global(table) {
		width: 100%;
		border-collapse: collapse;
		margin: 1.5rem 0;
	}

	.content :global(th),
	.content :global(td) {
		padding: 0.75rem 1rem;
		border: 1px solid var(--border);
		text-align: left;
	}

	.content :global(th) {
		background: var(--bg-card);
		color: var(--text-primary);
		font-weight: 600;
	}

	@media (max-width: 720px) {
		.prose {
			padding: 1rem;
		}

		.back-link {
			margin-bottom: 1.5rem;
		}

		.article-header {
			margin-bottom: 1.5rem;
			padding-bottom: 1.5rem;
		}

		.article-header h1 {
			font-size: 1.5rem;
			line-height: 1.3;
		}

		.description {
			font-size: 1rem;
		}

		.content :global(h2) {
			font-size: 1.4rem;
			margin-top: 2rem;
		}

		.content :global(h3) {
			font-size: 1.2rem;
			margin-top: 1.5rem;
		}

		.content :global(pre) {
			margin-left: -1rem;
			margin-right: -1rem;
			padding: 1rem;
			border-radius: 0;
			border-left: none;
			border-right: none;
			font-size: 0.8em;
		}
	}
</style>
