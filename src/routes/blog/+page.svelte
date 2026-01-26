<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';

	let { data } = $props();

	function formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}
</script>

<SEO
	title="Blog"
	description="Technical articles on AI, trading systems, high-performance data grids, and software engineering by Alexander Primak."
/>

<div class="blog-page">
	<header class="page-header">
		<h1><span class="accent">#</span> Blog</h1>
		<p class="subtitle">Technical articles on AI, trading systems, and software engineering</p>
	</header>

	<section class="posts">
		<ul class="post-grid">
			{#each data.posts as post}
				<li>
					<a href="/blog/{post.slug}" class="post-card">
						<div class="card-content">
							<h3 class="title">{post.metadata.title}</h3>
							<p class="description">{post.metadata.description}</p>
							<div class="meta">
								<span class="date">{formatDate(post.metadata.pubDate)}</span>
								{#if post.metadata.tags && post.metadata.tags.length > 0}
									<div class="tags">
										{#each post.metadata.tags as tag}
											<span class="tag">{tag}</span>
										{/each}
									</div>
								{/if}
							</div>
						</div>
					</a>
				</li>
			{/each}
		</ul>
	</section>
</div>

<style>
	.blog-page {
		max-width: 960px;
		margin: 0 auto;
		padding: 2rem 1rem 4rem;
	}

	.page-header {
		margin-bottom: 2.5rem;
	}

	.page-header h1 {
		font-size: 2rem;
		margin: 0 0 0.5rem;
		color: var(--text-primary);
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
	}

	.accent {
		color: var(--accent);
	}

	.subtitle {
		color: var(--text-secondary);
		margin: 0;
		font-size: 1.1rem;
	}

	.post-grid {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.post-card {
		display: block;
		background: linear-gradient(135deg, var(--bg-card) 0%, var(--bg-card-hover) 100%);
		border: 1px solid var(--border);
		border-radius: 12px;
		text-decoration: none;
		transition: all 0.3s ease;
		position: relative;
		overflow: hidden;
	}

	.post-card::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 2px;
		background: var(--accent-gradient);
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	.post-card:hover {
		border-color: var(--border-hover);
		transform: translateY(-2px);
		box-shadow: var(--shadow);
	}

	.post-card:hover::before {
		opacity: 1;
	}

	.card-content {
		padding: 1.5rem;
	}

	.title {
		margin: 0 0 0.5rem;
		color: var(--text-primary);
		font-size: 1.25rem;
		font-weight: 600;
		line-height: 1.3;
		transition: color 0.2s;
	}

	.post-card:hover .title {
		color: var(--accent);
	}

	.description {
		margin: 0 0 1rem;
		color: var(--text-secondary);
		font-size: 0.95rem;
		line-height: 1.5;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.meta {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.date {
		color: var(--text-muted);
		font-size: 0.85rem;
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
	}

	.tags {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.tag {
		font-size: 0.75rem;
		padding: 0.25rem 0.6rem;
		background: rgba(39, 202, 64, 0.1);
		color: var(--accent);
		border-radius: 4px;
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
	}

	@media (max-width: 720px) {
		.blog-page {
			padding: 1rem;
		}

		.page-header h1 {
			font-size: 1.5rem;
		}

		.card-content {
			padding: 1rem;
		}

		.title {
			font-size: 1.1rem;
		}
	}
</style>
