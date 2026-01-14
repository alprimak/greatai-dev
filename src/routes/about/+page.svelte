<script lang="ts">
	import { AUTHOR, SOCIAL_LINKS } from '$lib/config';
</script>

<svelte:head>
	<title>About | greatAI.dev</title>
	<meta name="description" content="About {AUTHOR} - Software engineer specializing in AI and high-performance data infrastructure for finance." />
</svelte:head>

<div class="about-page">
	<section class="hero">
		<div class="terminal-header">
			<div class="terminal-dots">
				<span class="dot red"></span>
				<span class="dot yellow"></span>
				<span class="dot green"></span>
			</div>
			<span class="terminal-title">~/about</span>
		</div>
		<div class="hero-content">
			<h1><span class="prompt">$</span> whoami</h1>
			<p class="tagline">
				I'm {AUTHOR}, a software engineer specializing in high-performance data infrastructure and AI systems for finance.
			</p>
		</div>
	</section>

	<div class="content-grid">
		<div class="section-card">
			<div class="card-icon">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
				</svg>
			</div>
			<h2><span class="accent">#</span> What I Build</h2>
			<p>
				Software where performance and correctness both matter. Currently focused on
				<a href="https://askturret.com">AskTurret</a> — an AI-powered trading terminal with natural language
				interface for market data and analytics.
			</p>
		</div>

		<div class="section-card">
			<div class="card-icon">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<polyline points="16 18 22 12 16 6"/>
					<polyline points="8 6 2 12 8 18"/>
				</svg>
			</div>
			<h2><span class="accent">#</span> Background</h2>
			<p>
				Years of experience building trading systems, analytics platforms, and data-intensive applications.
				I write about the technical patterns that actually work in production — not theory, but battle-tested approaches.
			</p>
		</div>

		<div class="section-card">
			<div class="card-icon">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<circle cx="12" cy="12" r="10"/>
					<polygon points="10 8 16 12 10 16 10 8"/>
				</svg>
			</div>
			<h2><span class="accent">#</span> This Site</h2>
			<p>
				greatai.dev is where I share technical deep-dives on data grids, AI integration,
				and building software for finance. No fluff, just practical insights from shipping real products.
			</p>
		</div>
	</div>

	<section class="connect-section">
		<h2><span class="accent">&gt;</span> Connect</h2>
		<div class="social-grid">
			<a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener" class="social-link">
				<svg viewBox="0 0 16 16" fill="currentColor">
					<path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
				</svg>
				<div>
					<div class="label">LinkedIn</div>
					<div class="desc">Technical posts & updates</div>
				</div>
			</a>
			<a href={SOCIAL_LINKS.twitter} target="_blank" rel="noopener" class="social-link">
				<svg viewBox="0 0 16 16" fill="currentColor">
					<path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
				</svg>
				<div>
					<div class="label">Twitter/X</div>
					<div class="desc">Quick thoughts</div>
				</div>
			</a>
			<a href={SOCIAL_LINKS.github} target="_blank" rel="noopener" class="social-link">
				<svg viewBox="0 0 16 16" fill="currentColor">
					<path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
				</svg>
				<div>
					<div class="label">GitHub</div>
					<div class="desc">Code & projects</div>
				</div>
			</a>
		</div>
	</section>
</div>

<style>
	.about-page {
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
		margin-bottom: 2.5rem;
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
		padding: 2rem;
	}

	.hero h1 {
		font-size: 1.75rem;
		margin: 0 0 1rem;
		color: var(--text-primary);
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
	}

	.prompt {
		color: var(--accent);
		margin-right: 0.5rem;
	}

	.tagline {
		font-size: 1.1rem;
		color: var(--text-secondary);
		max-width: 600px;
		line-height: 1.6;
		margin: 0;
	}

	/* Content Grid */
	.content-grid {
		display: grid;
		gap: 1.5rem;
	}

	.section-card {
		background: linear-gradient(135deg, var(--bg-card) 0%, var(--bg-card-hover) 100%);
		border: 1px solid var(--border);
		border-radius: 12px;
		padding: 1.5rem;
		position: relative;
		overflow: hidden;
		transition: all 0.3s ease;
	}

	.section-card::before {
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

	.section-card:hover {
		border-color: var(--border-hover);
		transform: translateY(-2px);
		box-shadow: var(--shadow);
	}

	.section-card:hover::before {
		opacity: 1;
	}

	.card-icon {
		width: 40px;
		height: 40px;
		background: rgba(39, 202, 64, 0.1);
		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 1rem;
	}

	.card-icon svg {
		width: 22px;
		height: 22px;
		color: var(--accent);
	}

	.section-card h2 {
		margin: 0 0 0.75rem 0;
		font-size: 1.15rem;
		color: var(--text-primary);
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
	}

	.accent {
		color: var(--accent);
	}

	.section-card p {
		margin: 0;
		color: var(--text-secondary);
		line-height: 1.7;
	}

	.section-card a {
		color: var(--accent);
		text-decoration: none;
		border-bottom: 1px solid transparent;
		transition: border-color 0.2s;
	}

	.section-card a:hover {
		border-bottom-color: var(--accent);
	}

	/* Connect Section */
	.connect-section {
		margin-top: 2.5rem;
	}

	.connect-section h2 {
		margin-bottom: 1.5rem;
		font-size: 1.25rem;
		color: var(--text-primary);
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
	}

	.social-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
	}

	.social-link {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem 1.25rem;
		background: linear-gradient(135deg, var(--bg-card) 0%, var(--bg-card-hover) 100%);
		border-radius: 12px;
		border: 1px solid var(--border);
		text-decoration: none;
		transition: all 0.3s ease;
	}

	.social-link:hover {
		border-color: var(--border-hover);
		transform: translateY(-2px);
		box-shadow: var(--shadow);
	}

	.social-link svg {
		width: 24px;
		height: 24px;
		color: var(--text-muted);
		transition: color 0.2s;
	}

	.social-link:hover svg {
		color: var(--accent);
	}

	.social-link .label {
		font-weight: 500;
		color: var(--text-primary);
	}

	.social-link .desc {
		font-size: 0.85rem;
		color: var(--text-muted);
	}

	@media (max-width: 720px) {
		.about-page {
			padding: 1rem;
		}

		.hero-content {
			padding: 1.5rem;
		}

		.hero h1 {
			font-size: 1.35rem;
		}

		.tagline {
			font-size: 1rem;
		}

		.section-card {
			padding: 1.25rem;
		}
	}
</style>
