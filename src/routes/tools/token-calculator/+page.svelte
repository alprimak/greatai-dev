<script lang="ts">
	import { browser } from '$app/environment';

	let text = $state('');
	let isCode = $state(false);

	// Token estimation ratios (characters per token)
	const models = [
		{
			name: 'Claude 3.5/4',
			provider: 'Anthropic',
			charsPerToken: { text: 4.0, code: 3.2 },
			contextWindow: 200000,
			inputCost: 3.0,  // per 1M tokens
			outputCost: 15.0
		},
		{
			name: 'Claude 3 Haiku',
			provider: 'Anthropic',
			charsPerToken: { text: 4.0, code: 3.2 },
			contextWindow: 200000,
			inputCost: 0.25,
			outputCost: 1.25
		},
		{
			name: 'GPT-4o',
			provider: 'OpenAI',
			charsPerToken: { text: 4.0, code: 3.5 },
			contextWindow: 128000,
			inputCost: 2.5,
			outputCost: 10.0
		},
		{
			name: 'GPT-4o Mini',
			provider: 'OpenAI',
			charsPerToken: { text: 4.0, code: 3.5 },
			contextWindow: 128000,
			inputCost: 0.15,
			outputCost: 0.6
		},
		{
			name: 'Gemini 1.5 Pro',
			provider: 'Google',
			charsPerToken: { text: 4.0, code: 3.3 },
			contextWindow: 2000000,
			inputCost: 1.25,
			outputCost: 5.0
		},
		{
			name: 'Llama 3.1 70B',
			provider: 'Meta',
			charsPerToken: { text: 4.2, code: 3.5 },
			contextWindow: 128000,
			inputCost: 0.88,
			outputCost: 0.88
		}
	];

	function countStats(input: string) {
		if (!input) {
			return { chars: 0, words: 0, lines: 0 };
		}
		return {
			chars: input.length,
			words: input.trim().split(/\s+/).filter(w => w.length > 0).length,
			lines: input.split('\n').length
		};
	}

	function estimateTokens(chars: number, model: typeof models[0]) {
		const ratio = isCode ? model.charsPerToken.code : model.charsPerToken.text;
		return Math.ceil(chars / ratio);
	}

	function formatCost(tokens: number, costPerMillion: number): string {
		const cost = (tokens / 1_000_000) * costPerMillion;
		if (cost < 0.0001) return '<$0.0001';
		if (cost < 0.01) return `$${cost.toFixed(4)}`;
		return `$${cost.toFixed(4)}`;
	}

	function formatNumber(n: number): string {
		return n.toLocaleString();
	}

	$effect(() => {
		// Auto-detect code based on common patterns
		if (text.includes('function ') || text.includes('const ') || text.includes('import ') ||
		    text.includes('def ') || text.includes('class ') || text.includes('fn ') ||
		    text.includes('pub ') || text.includes('package ') || text.includes('#include')) {
			isCode = true;
		}
	});

	const stats = $derived(countStats(text));
</script>

<svelte:head>
	<title>Token Calculator | greatAI.dev</title>
	<meta name="description" content="Count tokens for Claude, GPT-4, Gemini, and other AI models. Free real-time token calculator." />
</svelte:head>

<div class="calculator-page">
	<header class="header">
		<a href="/tools" class="back-link">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<line x1="19" y1="12" x2="5" y2="12"/>
				<polyline points="12 19 5 12 12 5"/>
			</svg>
			Back to Tools
		</a>
		<h1><span class="icon">&#128290;</span> Token Calculator</h1>
		<p class="subtitle">Estimate token counts and costs across different AI models</p>
	</header>

	<div class="main-content">
		<div class="input-section">
			<div class="input-header">
				<span class="label">Enter text or code</span>
				<label class="code-toggle">
					<input type="checkbox" bind:checked={isCode} />
					<span>Code mode</span>
				</label>
			</div>
			<textarea
				bind:value={text}
				placeholder="Paste your text or code here to count tokens..."
				spellcheck="false"
			></textarea>
			<div class="quick-stats">
				<div class="stat">
					<span class="stat-value">{formatNumber(stats.chars)}</span>
					<span class="stat-label">Characters</span>
				</div>
				<div class="stat">
					<span class="stat-value">{formatNumber(stats.words)}</span>
					<span class="stat-label">Words</span>
				</div>
				<div class="stat">
					<span class="stat-value">{formatNumber(stats.lines)}</span>
					<span class="stat-label">Lines</span>
				</div>
			</div>
		</div>

		<div class="results-section">
			<h2>Token Estimates by Model</h2>
			<p class="disclaimer">Estimates based on average characters per token. Actual counts may vary.</p>

			<div class="models-grid">
				{#each models as model}
					{@const tokens = estimateTokens(stats.chars, model)}
					{@const percentOfContext = ((tokens / model.contextWindow) * 100).toFixed(2)}
					<div class="model-card">
						<div class="model-header">
							<span class="model-name">{model.name}</span>
							<span class="model-provider">{model.provider}</span>
						</div>
						<div class="token-count">
							<span class="count">{formatNumber(tokens)}</span>
							<span class="count-label">tokens</span>
						</div>
						<div class="context-bar">
							<div
								class="context-fill"
								style="width: {Math.min(parseFloat(percentOfContext), 100)}%"
								class:warning={parseFloat(percentOfContext) > 50}
								class:danger={parseFloat(percentOfContext) > 80}
							></div>
						</div>
						<div class="context-info">
							{percentOfContext}% of {formatNumber(model.contextWindow)} context
						</div>
						<div class="cost-info">
							<div class="cost-row">
								<span>Input cost:</span>
								<span>{formatCost(tokens, model.inputCost)}</span>
							</div>
							<div class="cost-row">
								<span>Output cost:</span>
								<span>{formatCost(tokens, model.outputCost)}</span>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>

<style>
	.calculator-page {
		min-height: calc(100vh - 200px);
		background: linear-gradient(180deg, #0a0a0f 0%, #12121a 100%);
		padding: 1.5rem;
		margin: -1em;
		margin-top: 0;
	}

	.header {
		max-width: 1200px;
		margin: 0 auto 1.5rem;
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		color: #888;
		text-decoration: none;
		font-size: 0.9rem;
		margin-bottom: 1rem;
		transition: color 0.2s;
	}

	.back-link:hover {
		color: #27ca40;
	}

	.back-link svg {
		width: 18px;
		height: 18px;
	}

	.header h1 {
		color: #fff;
		font-size: 1.75rem;
		margin: 0 0 0.5rem;
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
	}

	.icon {
		margin-right: 0.5rem;
	}

	.subtitle {
		color: #888;
		margin: 0;
	}

	.main-content {
		max-width: 1200px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: 1fr 1.5fr;
		gap: 2rem;
	}

	.input-section {
		position: sticky;
		top: 2rem;
		height: fit-content;
	}

	.input-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.75rem;
	}

	.label {
		color: #888;
		font-size: 0.9rem;
	}

	.code-toggle {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: #888;
		font-size: 0.85rem;
		cursor: pointer;
	}

	.code-toggle input {
		accent-color: #27ca40;
	}

	textarea {
		width: 100%;
		height: 300px;
		background: #0d0d14;
		border: 1px solid #2a2a3a;
		border-radius: 12px;
		color: #e0e0e0;
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
		font-size: 0.9rem;
		padding: 1rem;
		resize: vertical;
		transition: border-color 0.2s;
	}

	textarea:focus {
		outline: none;
		border-color: #27ca40;
	}

	textarea::placeholder {
		color: #4a4a5a;
	}

	.quick-stats {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
		margin-top: 1rem;
	}

	.stat {
		background: #1a1a24;
		border: 1px solid #2a2a3a;
		border-radius: 8px;
		padding: 1rem;
		text-align: center;
	}

	.stat-value {
		display: block;
		font-size: 1.5rem;
		font-weight: 600;
		color: #fff;
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
	}

	.stat-label {
		display: block;
		font-size: 0.75rem;
		color: #888;
		margin-top: 0.25rem;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.results-section h2 {
		color: #fff;
		font-size: 1.25rem;
		margin: 0 0 0.5rem;
	}

	.disclaimer {
		color: #666;
		font-size: 0.8rem;
		margin: 0 0 1.5rem;
	}

	.models-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 1rem;
	}

	.model-card {
		background: linear-gradient(135deg, #1a1a24 0%, #15151f 100%);
		border: 1px solid #2a2a3a;
		border-radius: 12px;
		padding: 1.25rem;
		transition: border-color 0.2s;
	}

	.model-card:hover {
		border-color: #3a3a4a;
	}

	.model-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.model-name {
		color: #fff;
		font-weight: 600;
	}

	.model-provider {
		font-size: 0.75rem;
		color: #888;
		background: #2a2a3a;
		padding: 0.2rem 0.5rem;
		border-radius: 4px;
	}

	.token-count {
		margin-bottom: 1rem;
	}

	.count {
		font-size: 2rem;
		font-weight: 700;
		color: #27ca40;
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
	}

	.count-label {
		font-size: 0.85rem;
		color: #888;
		margin-left: 0.5rem;
	}

	.context-bar {
		height: 6px;
		background: #2a2a3a;
		border-radius: 3px;
		overflow: hidden;
		margin-bottom: 0.5rem;
	}

	.context-fill {
		height: 100%;
		background: linear-gradient(90deg, #27ca40, #00d4ff);
		border-radius: 3px;
		transition: width 0.3s ease;
	}

	.context-fill.warning {
		background: linear-gradient(90deg, #ffbd2e, #ff9500);
	}

	.context-fill.danger {
		background: linear-gradient(90deg, #ff5f56, #ff2d20);
	}

	.context-info {
		font-size: 0.75rem;
		color: #666;
		margin-bottom: 1rem;
	}

	.cost-info {
		border-top: 1px solid #2a2a3a;
		padding-top: 0.75rem;
	}

	.cost-row {
		display: flex;
		justify-content: space-between;
		font-size: 0.8rem;
		color: #888;
		margin-bottom: 0.25rem;
	}

	.cost-row span:last-child {
		color: #27ca40;
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
	}

	@media (max-width: 900px) {
		.main-content {
			grid-template-columns: 1fr;
		}

		.input-section {
			position: static;
		}

		textarea {
			height: 200px;
		}
	}
</style>
