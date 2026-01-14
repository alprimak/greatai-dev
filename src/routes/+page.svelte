<script lang="ts">
	import { SITE_TITLE, SITE_DESCRIPTION } from '$lib/config';

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
	<title>{SITE_TITLE}</title>
	<meta name="description" content={SITE_DESCRIPTION} />
</svelte:head>

<div class="home-page">
	<section class="hero">
		<div class="terminal-header">
			<div class="terminal-dots">
				<span class="dot red"></span>
				<span class="dot yellow"></span>
				<span class="dot green"></span>
			</div>
			<span class="terminal-title">~/greatai.dev</span>
		</div>
		<div class="hero-content">
			<h1>
				<span class="prompt">$</span> Technical insights on <span class="gradient-text">AI</span>, <span class="gradient-text">trading systems</span>, and <span class="gradient-text">high-performance software</span>
			</h1>
			<p class="hero-description">Exploring the intersection of artificial intelligence, financial technology, and software engineering.</p>
		</div>
	</section>

	<section class="posts">
		<div class="section-header">
			<h2><span class="accent">#</span> Latest Posts</h2>
			<a href="/blog" class="view-all">View all <span class="arrow">&rarr;</span></a>
		</div>
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

	<section class="cta-section">
		<div class="cta-card">
			<h3><span class="accent">&gt;</span> Explore AI Tools</h3>
			<p>Try out free developer tools powered by AI - code simplifier, token calculator, and more.</p>
			<a href="/tools" class="cta-button">
				Browse Tools
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<line x1="5" y1="12" x2="19" y2="12"/>
					<polyline points="12 5 19 12 12 19"/>
				</svg>
			</a>
		</div>
	</section>
</div>

<style>
	.home-page {
		max-width: 960px;
		margin: 0 auto;
		padding: 2rem 1rem 4rem;
	}

	/* Hero Section */
	.hero {
		background: linear-gradient(135deg, var(--bg-card) 0%, var(--bg-card-hover) 100%);
		border: 1px solid var(--border);
		border-radius: 16px;
		overflow: hidden;
		margin-bottom: 3rem;
	}

	.terminal-header {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.75rem 1rem;
		background: var(--bg-secondary);
		border-bottom: 1px solid var(--border);
	}

	.terminal-dots {
		display: flex;
		gap: 0.5rem;
	}

	.dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
	}

	.dot.red { background: #ff5f56; }
	.dot.yellow { background: #ffbd2e; }
	.dot.green { background: var(--accent); }

	.terminal-title {
		color: var(--text-muted);
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
		font-size: 0.85rem;
	}

	.hero-content {
		padding: 2.5rem 2rem;
	}

	.hero h1 {
		font-size: 1.75rem;
		line-height: 1.4;
		margin: 0 0 1rem;
		color: var(--text-primary);
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
		font-weight: 500;
	}

	.prompt {
		color: var(--accent);
		margin-right: 0.5rem;
	}

	.gradient-text {
		background: var(--accent-gradient);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.hero-description {
		color: var(--text-secondary);
		font-size: 1.1rem;
		margin: 0;
		max-width: 600px;
	}

	/* Posts Section */
	.posts {
		margin-bottom: 3rem;
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
	}

	.section-header h2 {
		font-size: 1.5rem;
		margin: 0;
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
		color: var(--text-primary);
	}

	.accent {
		color: var(--accent);
	}

	.view-all {
		color: var(--text-secondary);
		text-decoration: none;
		font-size: 0.95rem;
		transition: color 0.2s;
	}

	.view-all:hover {
		color: var(--accent);
	}

	.view-all .arrow {
		display: inline-block;
		transition: transform 0.2s;
	}

	.view-all:hover .arrow {
		transform: translateX(4px);
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

	/* CTA Section */
	.cta-section {
		margin-top: 2rem;
	}

	.cta-card {
		background: linear-gradient(135deg, var(--bg-card) 0%, var(--bg-card-hover) 100%);
		border: 1px solid var(--border);
		border-radius: 12px;
		padding: 2rem;
		text-align: center;
	}

	.cta-card h3 {
		font-size: 1.25rem;
		margin: 0 0 0.75rem;
		color: var(--text-primary);
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
	}

	.cta-card p {
		color: var(--text-secondary);
		margin: 0 0 1.5rem;
		max-width: 500px;
		margin-left: auto;
		margin-right: auto;
	}

	.cta-button {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		background: var(--accent-gradient);
		color: var(--bg-primary);
		padding: 0.75rem 1.5rem;
		border-radius: 8px;
		text-decoration: none;
		font-weight: 600;
		transition: all 0.3s;
	}

	.cta-button:hover {
		transform: scale(1.05);
		box-shadow: var(--shadow-glow);
	}

	.cta-button svg {
		width: 18px;
		height: 18px;
	}

	/* Responsive */
	@media (max-width: 720px) {
		.home-page {
			padding: 1rem;
		}

		.hero-content {
			padding: 1.5rem;
		}

		.hero h1 {
			font-size: 1.25rem;
		}

		.hero-description {
			font-size: 1rem;
		}

		.section-header {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.75rem;
		}

		.card-content {
			padding: 1rem;
		}

		.title {
			font-size: 1.1rem;
		}

		.cta-card {
			padding: 1.5rem;
		}
	}
</style>
