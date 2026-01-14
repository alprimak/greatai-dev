<script lang="ts">
	const products = [
		{
			name: 'AskTurret',
			description: 'AI-powered trading terminal. Natural language interface for market data, analytics, and trade execution. Built for speed and reliability.',
			url: 'https://askturret.com',
			tags: ['AI', 'Trading', 'Finance', 'TypeScript', 'React'],
			status: 'Active',
			icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>'
		},
		{
			name: 'AskTurret Grid',
			description: 'Standalone high-performance data grid component. Handles millions of rows with sub-millisecond updates. Built for trading and analytics.',
			url: 'https://grid.askturret.com',
			tags: ['Data Grid', 'Performance', 'TypeScript', 'Rust'],
			status: 'Active',
			icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>'
		},
	];
</script>

<svelte:head>
	<title>Products | greatAI.dev</title>
	<meta name="description" content="Products and tools I've built for finance and data-intensive applications." />
</svelte:head>

<div class="products-page">
	<header class="page-header">
		<h1><span class="accent">#</span> Products</h1>
		<p class="tagline">Tools I've built for finance and data-intensive applications.</p>
	</header>

	<ul class="product-grid">
		{#each products as product}
			<li>
				<a href={product.url} target="_blank" rel="noopener" class="product-card">
					<div class="card-icon">
						{@html product.icon}
					</div>
					<div class="card-content">
						<div class="product-header">
							<h2>
								{product.name}
								<svg class="external-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
								</svg>
							</h2>
							<span class="status">{product.status}</span>
						</div>
						<p>{product.description}</p>
						<div class="tags">
							{#each product.tags as tag}
								<span class="tag">{tag}</span>
							{/each}
						</div>
					</div>
				</a>
			</li>
		{/each}
	</ul>
</div>

<style>
	.products-page {
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

	.tagline {
		font-size: 1.1rem;
		color: var(--text-secondary);
		max-width: 600px;
		line-height: 1.6;
		margin: 0;
	}

	.product-grid {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.product-card {
		display: flex;
		gap: 1.5rem;
		padding: 1.5rem;
		background: linear-gradient(135deg, var(--bg-card) 0%, var(--bg-card-hover) 100%);
		border: 1px solid var(--border);
		border-radius: 12px;
		text-decoration: none;
		transition: all 0.3s ease;
		position: relative;
		overflow: hidden;
	}

	.product-card::before {
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

	.product-card:hover {
		border-color: var(--border-hover);
		transform: translateY(-2px);
		box-shadow: var(--shadow);
	}

	.product-card:hover::before {
		opacity: 1;
	}

	.card-icon {
		width: 48px;
		height: 48px;
		background: rgba(39, 202, 64, 0.1);
		border-radius: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.card-icon :global(svg) {
		width: 26px;
		height: 26px;
		color: var(--accent);
	}

	.card-content {
		flex: 1;
		min-width: 0;
	}

	.product-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 0.75rem;
	}

	.product-card h2 {
		margin: 0;
		font-size: 1.25rem;
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
		color: var(--text-primary);
		display: flex;
		align-items: center;
		gap: 0.5rem;
		transition: color 0.2s;
	}

	.product-card:hover h2 {
		color: var(--accent);
	}

	.external-icon {
		width: 16px;
		height: 16px;
		opacity: 0.5;
		transition: opacity 0.2s;
	}

	.product-card:hover .external-icon {
		opacity: 1;
	}

	.status {
		font-size: 0.75rem;
		padding: 0.25rem 0.75rem;
		background: rgba(39, 202, 64, 0.1);
		color: var(--accent);
		border-radius: 20px;
		font-weight: 500;
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
		flex-shrink: 0;
	}

	.product-card p {
		margin: 0 0 1rem 0;
		color: var(--text-secondary);
		line-height: 1.6;
	}

	.tags {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.tag {
		padding: 0.25rem 0.6rem;
		background: rgba(39, 202, 64, 0.1);
		color: var(--accent);
		border-radius: 4px;
		font-size: 0.75rem;
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
	}

	@media (max-width: 720px) {
		.products-page {
			padding: 1rem;
		}

		.page-header h1 {
			font-size: 1.5rem;
		}

		.tagline {
			font-size: 1rem;
		}

		.product-card {
			flex-direction: column;
			gap: 1rem;
			padding: 1.25rem;
		}

		.card-icon {
			width: 44px;
			height: 44px;
		}

		.card-icon :global(svg) {
			width: 22px;
			height: 22px;
		}

		.product-header {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.5rem;
		}

		.product-card h2 {
			font-size: 1.1rem;
		}
	}
</style>
