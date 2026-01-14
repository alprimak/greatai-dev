<script lang="ts">
	const tools = [
		{
			name: 'Code Simplifier',
			description: 'Paste your code and get a cleaner, more maintainable version. Powered by Claude.',
			href: '/tools/code-simplifier',
			icon: 'simplify',
			status: 'live',
			rateLimit: '5 requests/hour'
		},
		{
			name: 'Code Explainer',
			description: 'Get AI-powered explanations of any code. Choose brief, detailed, or line-by-line.',
			href: '/tools/code-explainer',
			icon: 'explain',
			status: 'live',
			rateLimit: '5 requests/hour'
		},
		{
			name: 'Token Calculator',
			description: 'Count tokens for Claude, GPT-4, and other models. Real-time counting as you type.',
			href: '/tools/token-calculator',
			icon: 'tokens',
			status: 'live',
			rateLimit: 'Unlimited'
		},
		{
			name: 'JSON Formatter',
			description: 'Format, validate, minify, and sort JSON with syntax highlighting.',
			href: '/tools/json-formatter',
			icon: 'json',
			status: 'live',
			rateLimit: 'Unlimited'
		},
		{
			name: 'Regex Tester',
			description: 'Test regular expressions with real-time matching and AI-powered explanations.',
			href: '/tools/regex-tester',
			icon: 'regex',
			status: 'live',
			rateLimit: '5 AI explanations/hour'
		},
		{
			name: 'Prompt Optimizer',
			description: 'Improve your prompts for better AI responses.',
			href: '/tools/prompt-optimizer',
			icon: 'optimize',
			status: 'coming-soon'
		}
	];
</script>

<svelte:head>
	<title>AI Tools | greatAI.dev</title>
	<meta name="description" content="Free AI developer tools: code simplifier, token calculator, model comparison, and more." />
</svelte:head>

<div class="tools-page">
	<header class="hero">
		<div class="terminal-header">
			<span class="dot red"></span>
			<span class="dot yellow"></span>
			<span class="dot green"></span>
			<span class="title">~/greatai.dev/tools</span>
		</div>
		<h1><span class="prompt">$</span> AI Developer Tools</h1>
		<p class="tagline">Free tools for developers working with AI. No signup required.</p>
	</header>

	<div class="tools-grid">
		{#each tools as tool}
			<a
				href={tool.status === 'live' ? tool.href : '#'}
				class="tool-card"
				class:coming-soon={tool.status === 'coming-soon'}
			>
				<div class="tool-icon">
					{#if tool.icon === 'simplify'}
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
							<polyline points="7.5 4.21 12 6.81 16.5 4.21"/>
							<polyline points="7.5 19.79 7.5 14.6 3 12"/>
							<polyline points="21 12 16.5 14.6 16.5 19.79"/>
							<polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
							<line x1="12" y1="22.08" x2="12" y2="12"/>
						</svg>
					{:else if tool.icon === 'explain'}
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<circle cx="12" cy="12" r="10"/>
							<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
							<line x1="12" y1="17" x2="12.01" y2="17"/>
						</svg>
					{:else if tool.icon === 'tokens'}
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<circle cx="12" cy="12" r="10"/>
							<path d="M12 6v6l4 2"/>
						</svg>
					{:else if tool.icon === 'json'}
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1"/>
							<path d="M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1"/>
						</svg>
					{:else if tool.icon === 'regex'}
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M17 3v10"/>
							<path d="m12.67 5.5 8.66 5"/>
							<path d="m12.67 10.5 8.66-5"/>
							<path d="M9 17a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2z"/>
						</svg>
					{:else if tool.icon === 'optimize'}
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
						</svg>
					{/if}
				</div>
				<div class="tool-content">
					<h2>
						{tool.name}
						{#if tool.status === 'coming-soon'}
							<span class="badge coming-soon-badge">Coming Soon</span>
						{/if}
					</h2>
					<p>{tool.description}</p>
					{#if tool.rateLimit}
						<span class="rate-limit">{tool.rateLimit}</span>
					{/if}
				</div>
				<div class="tool-arrow">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<line x1="5" y1="12" x2="19" y2="12"/>
						<polyline points="12 5 19 12 12 19"/>
					</svg>
				</div>
			</a>
		{/each}
	</div>
</div>

<style>
	.tools-page {
		min-height: calc(100vh - 200px);
		background: linear-gradient(180deg, #0a0a0f 0%, #12121a 100%);
		padding: 2rem;
		margin: -1em;
		margin-top: 0;
	}

	.hero {
		max-width: 800px;
		margin: 0 auto 3rem;
		text-align: center;
	}

	.terminal-header {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		background: #1a1a24;
		padding: 0.5rem 1rem;
		border-radius: 8px 8px 0 0;
		margin-bottom: 0;
	}

	.dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
	}

	.dot.red { background: #ff5f56; }
	.dot.yellow { background: #ffbd2e; }
	.dot.green { background: #27ca40; }

	.terminal-header .title {
		color: #888;
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
		font-size: 0.85rem;
		margin-left: 0.5rem;
	}

	.hero h1 {
		font-size: 2.5rem;
		color: #fff;
		margin: 1.5rem 0 1rem;
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
	}

	.prompt {
		color: #27ca40;
	}

	.tagline {
		color: #888;
		font-size: 1.1rem;
		max-width: 500px;
		margin: 0 auto;
	}

	.tools-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
		gap: 1.5rem;
		max-width: 1000px;
		margin: 0 auto;
	}

	.tool-card {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1.5rem;
		background: linear-gradient(135deg, #1a1a24 0%, #15151f 100%);
		border: 1px solid #2a2a3a;
		border-radius: 12px;
		text-decoration: none;
		transition: all 0.3s ease;
		position: relative;
		overflow: hidden;
	}

	.tool-card::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 2px;
		background: linear-gradient(90deg, #27ca40, #00d4ff);
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	.tool-card:hover {
		border-color: #3a3a4a;
		transform: translateY(-2px);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
	}

	.tool-card:hover::before {
		opacity: 1;
	}

	.tool-card.coming-soon {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.tool-card.coming-soon:hover {
		transform: none;
		border-color: #2a2a3a;
	}

	.tool-icon {
		flex-shrink: 0;
		width: 48px;
		height: 48px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, #27ca40 0%, #00d4ff 100%);
		border-radius: 10px;
	}

	.tool-icon svg {
		width: 24px;
		height: 24px;
		color: #0a0a0f;
	}

	.tool-content {
		flex: 1;
	}

	.tool-content h2 {
		color: #fff;
		font-size: 1.25rem;
		margin: 0 0 0.5rem;
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.tool-content p {
		color: #888;
		font-size: 0.9rem;
		margin: 0 0 0.5rem;
		line-height: 1.5;
	}

	.badge {
		font-size: 0.65rem;
		padding: 0.2rem 0.5rem;
		border-radius: 4px;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.coming-soon-badge {
		background: #ffbd2e;
		color: #0a0a0f;
	}

	.rate-limit {
		display: inline-block;
		font-size: 0.75rem;
		color: #27ca40;
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
	}

	.tool-arrow {
		flex-shrink: 0;
		opacity: 0;
		transform: translateX(-10px);
		transition: all 0.3s ease;
	}

	.tool-arrow svg {
		width: 20px;
		height: 20px;
		color: #27ca40;
	}

	.tool-card:hover .tool-arrow {
		opacity: 1;
		transform: translateX(0);
	}

	.tool-card.coming-soon .tool-arrow {
		display: none;
	}

	@media (max-width: 720px) {
		.tools-page {
			padding: 1rem;
		}

		.hero h1 {
			font-size: 1.75rem;
		}

		.tools-grid {
			grid-template-columns: 1fr;
		}

		.tool-card {
			padding: 1rem;
		}

		.tool-icon {
			width: 40px;
			height: 40px;
		}

		.tool-icon svg {
			width: 20px;
			height: 20px;
		}
	}
</style>
