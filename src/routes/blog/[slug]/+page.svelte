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

<main>
	<article>
		<div class="prose">
			<a href="/blog" class="back-link">
				<span>&larr;</span> Back to blog
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
</main>

<style>
	main {
		width: calc(100% - 2em);
		max-width: 100%;
		margin: 0;
	}
	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 2rem;
		color: rgb(var(--gray));
		text-decoration: none;
		font-size: 0.9rem;
		transition: color 0.2s;
	}
	.back-link:hover {
		color: rgb(var(--accent));
	}
	.prose {
		width: 720px;
		max-width: calc(100% - 2em);
		margin: auto;
		padding: 1em;
		color: rgb(var(--gray-dark));
	}
	.article-header {
		margin-bottom: 2.5rem;
		padding-bottom: 2rem;
		border-bottom: 1px solid rgba(var(--gray), 0.2);
	}
	.article-header h1 {
		margin: 0 0 1rem 0;
		font-size: 2.5rem;
		line-height: 1.2;
	}
	.article-meta {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
		margin-bottom: 1rem;
	}
	.date {
		color: rgb(var(--gray));
		font-size: 0.9rem;
	}
	.last-updated-on {
		font-style: italic;
		color: rgb(var(--gray));
		font-size: 0.85rem;
	}
	.tags {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}
	.tag {
		font-size: 0.75rem;
		padding: 0.25rem 0.75rem;
		background: rgba(var(--accent), 0.1);
		color: rgb(var(--accent));
		border-radius: 20px;
		text-transform: lowercase;
	}
	.description {
		color: rgb(var(--gray));
		font-size: 1.15rem;
		line-height: 1.6;
		margin: 0;
	}
	.content :global(h2) {
		margin-top: 2.5rem;
		margin-bottom: 1rem;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid rgba(var(--gray), 0.15);
	}
	.content :global(h3) {
		margin-top: 2rem;
		margin-bottom: 0.75rem;
	}
	.content :global(pre) {
		margin: 1.5rem 0;
		padding: 1.25rem;
		border-radius: 8px;
		background: #1e1e1e !important;
		overflow-x: auto;
	}
	.content :global(code) {
		font-size: 0.9em;
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
	}
	.content :global(p code) {
		background: rgba(var(--gray-light), 0.8);
		padding: 0.2rem 0.4rem;
		border-radius: 4px;
		font-size: 0.85em;
	}
	:global(.dark) .content :global(p code) {
		background: rgba(var(--gray-light), 0.3);
	}
	.content :global(ul),
	.content :global(ol) {
		margin: 1.5rem 0;
		padding-left: 1.5rem;
	}
	.content :global(li) {
		margin-bottom: 0.5rem;
	}
	.content :global(blockquote) {
		margin: 1.5rem 0;
		padding: 1rem 1.5rem;
		background: rgba(var(--gray-light), 0.3);
		border-left: 4px solid rgb(var(--accent));
		border-radius: 0 8px 8px 0;
	}
	.content :global(blockquote p) {
		margin: 0;
	}
	.content :global(strong) {
		color: rgb(var(--black));
	}
	.content :global(hr) {
		margin: 2.5rem 0;
		border: none;
		border-top: 1px solid rgba(var(--gray), 0.2);
	}
	@media (max-width: 720px) {
		.prose {
			padding: 0.5em;
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
			margin-left: -0.5em;
			margin-right: -0.5em;
			padding: 1rem;
			border-radius: 0;
			font-size: 0.8em;
		}
	}
</style>
