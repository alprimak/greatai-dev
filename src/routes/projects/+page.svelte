<script lang="ts">
	const products = [
		{
			name: 'AskTurret',
			description: 'AI-powered trading terminal. Natural language interface for market data, analytics, and trade execution. Built for speed and reliability.',
			url: 'https://askturret.com',
			tags: ['AI', 'Trading', 'Finance', 'TypeScript', 'React'],
			status: 'Active',
		},
		{
			name: 'AskTurret Grid',
			description: 'Standalone high-performance data grid component. Handles millions of rows with sub-millisecond updates. Built for trading and analytics.',
			url: 'https://grid.askturret.com',
			tags: ['Data Grid', 'Performance', 'TypeScript', 'Rust'],
			status: 'Active',
		},
	];
</script>

<svelte:head>
	<title>Products | greatAI.dev</title>
	<meta name="description" content="Products and tools I've built for finance and data-intensive applications." />
</svelte:head>

<section class="hero">
	<h1>Products</h1>
	<p class="tagline">Tools I've built for finance and data-intensive applications.</p>
</section>

<ul class="project-list">
	{#each products as product}
		<li class="project-card">
			<div class="project-header">
				<h2>
					<a href={product.url} target="_blank" rel="noopener">
						{product.name}
						<svg class="external-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
						</svg>
					</a>
				</h2>
				<span class="status">{product.status}</span>
			</div>
			<p>{product.description}</p>
			<div class="tags">
				{#each product.tags as tag}
					<span class="tag">{tag}</span>
				{/each}
			</div>
		</li>
	{/each}
</ul>

<style>
	.hero {
		margin-bottom: 3rem;
	}
	.hero h1 {
		font-size: 2.5rem;
		margin-bottom: 1rem;
	}
	.hero .tagline {
		font-size: 1.25rem;
		color: rgb(var(--gray));
		max-width: 600px;
		line-height: 1.6;
	}
	.project-list {
		list-style: none;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}
	.project-card {
		padding: 1.5rem;
		border-radius: 12px;
		background: var(--bg-secondary);
		border: 1px solid rgba(var(--gray), 0.2);
		transition: all 0.2s ease;
	}
	.project-card:hover {
		border-color: rgb(var(--accent));
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(var(--gray), 0.15);
	}
	.project-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 0.75rem;
	}
	.project-card h2 {
		margin: 0;
		font-size: 1.5rem;
	}
	.project-card h2 a {
		text-decoration: none;
		color: rgb(var(--black));
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
	}
	.project-card h2 a:hover {
		color: rgb(var(--accent));
	}
	.external-icon {
		width: 18px;
		height: 18px;
		opacity: 0.5;
	}
	.project-card h2 a:hover .external-icon {
		opacity: 1;
	}
	.status {
		font-size: 0.75rem;
		padding: 0.25rem 0.75rem;
		background: rgba(34, 197, 94, 0.1);
		color: rgb(34, 197, 94);
		border-radius: 20px;
		font-weight: 500;
	}
	.project-card p {
		margin: 0 0 1.25rem 0;
		color: rgb(var(--gray));
		line-height: 1.6;
	}
	.tags {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}
	.tag {
		padding: 0.25rem 0.75rem;
		background: rgba(var(--accent), 0.1);
		color: rgb(var(--accent));
		border-radius: 4px;
		font-size: 0.8rem;
	}
	@media (max-width: 720px) {
		.hero h1 {
			font-size: 1.75rem;
		}
		.hero .tagline {
			font-size: 1rem;
		}
		.project-card {
			padding: 1.25rem;
		}
		.project-header {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.5rem;
		}
		.project-card h2 {
			font-size: 1.25rem;
		}
	}
</style>
