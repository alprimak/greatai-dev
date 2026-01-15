<script lang="ts">
	let prompt = $state('');
	let goal = $state('');
	let model = $state('Claude');
	let result = $state('');
	let loading = $state(false);
	let error = $state('');
	let remaining = $state<number | null>(null);
	let resetAt = $state<number | null>(null);

	const models = ['Claude', 'GPT-4', 'Gemini', 'Llama', 'General'];

	const examples = [
		{
			name: 'Vague Request',
			prompt: 'Write code for a website',
			goal: 'Build a landing page'
		},
		{
			name: 'Missing Context',
			prompt: 'Fix this bug in my code',
			goal: 'Debug a function'
		},
		{
			name: 'Too Broad',
			prompt: 'Explain machine learning',
			goal: 'Learn the basics'
		},
		{
			name: 'No Structure',
			prompt: 'I need help with my project its about making an app for tracking expenses and I want it to be simple but also have charts',
			goal: 'Plan an expense tracker app'
		}
	];

	async function fetchRateLimit() {
		try {
			const res = await fetch('/tools/prompt-optimizer');
			const data = await res.json();
			remaining = data.remaining;
			resetAt = data.resetAt;
		} catch {
			// Ignore
		}
	}

	async function optimize() {
		if (!prompt.trim()) {
			error = 'Please enter a prompt to optimize';
			return;
		}

		loading = true;
		error = '';
		result = '';

		try {
			const res = await fetch('/tools/prompt-optimizer', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ prompt, goal, model })
			});

			const data = await res.json();

			if (!res.ok) {
				error = data.error || 'Failed to optimize prompt';
				return;
			}

			result = data.result;
			remaining = data.remaining;
			resetAt = data.resetAt;
		} catch {
			error = 'Network error. Please try again.';
		} finally {
			loading = false;
		}
	}

	function loadExample(ex: (typeof examples)[0]) {
		prompt = ex.prompt;
		goal = ex.goal;
		result = '';
		error = '';
	}

	function formatMarkdown(text: string): string {
		return text
			.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
			.replace(/`([^`]+)`/g, '<code>$1</code>')
			.replace(/```(\w*)\n?([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
			.replace(/^- (.*)/gm, '<li>$1</li>')
			.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
			.replace(/\n\n/g, '</p><p>')
			.replace(/^(.+)$/gm, (match) => {
				if (
					match.startsWith('<') ||
					match.startsWith('-') ||
					match.startsWith('#')
				)
					return match;
				return match;
			});
	}

	$effect(() => {
		fetchRateLimit();
	});
</script>

<svelte:head>
	<title>Prompt Optimizer | greatAI.dev</title>
	<meta
		name="description"
		content="Improve your AI prompts with expert analysis and optimization. Get better results from Claude, GPT-4, and other LLMs."
	/>
</svelte:head>

<div class="tool-page">
	<header class="hero">
		<a href="/tools" class="back-link">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<line x1="19" y1="12" x2="5" y2="12" />
				<polyline points="12 19 5 12 12 5" />
			</svg>
			Back to Tools
		</a>
		<h1><span class="prompt-symbol">$</span> Prompt Optimizer</h1>
		<p class="tagline">Transform vague prompts into effective AI instructions</p>
		{#if remaining !== null}
			<div class="rate-limit-badge">
				<span class="count">{remaining}</span> optimizations remaining
			</div>
		{/if}
	</header>

	<div class="main-content">
		<div class="input-section">
			<div class="examples">
				<span class="examples-label">Try an example:</span>
				{#each examples as ex}
					<button class="example-btn" onclick={() => loadExample(ex)}>
						{ex.name}
					</button>
				{/each}
			</div>

			<div class="form-group">
				<label for="prompt">Your Prompt</label>
				<textarea
					id="prompt"
					bind:value={prompt}
					placeholder="Paste your prompt here..."
					rows="6"
				></textarea>
				<span class="char-count">{prompt.length} / 5000</span>
			</div>

			<div class="form-row">
				<div class="form-group">
					<label for="goal">Goal (optional)</label>
					<input
						type="text"
						id="goal"
						bind:value={goal}
						placeholder="What are you trying to achieve?"
					/>
				</div>
				<div class="form-group">
					<label for="model">Target Model</label>
					<select id="model" bind:value={model}>
						{#each models as m}
							<option value={m}>{m}</option>
						{/each}
					</select>
				</div>
			</div>

			<button
				class="optimize-btn"
				onclick={optimize}
				disabled={loading || !prompt.trim()}
			>
				{#if loading}
					<span class="spinner"></span>
					Optimizing...
				{:else}
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
					</svg>
					Optimize Prompt
				{/if}
			</button>

			{#if error}
				<div class="error">{error}</div>
			{/if}
		</div>

		{#if result}
			<div class="result-section">
				<h2>Optimization Result</h2>
				<div class="result-content">
					{@html formatMarkdown(result)}
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.tool-page {
		min-height: calc(100vh - 200px);
		background: linear-gradient(180deg, #0a0a0f 0%, #12121a 100%);
		padding: 2rem;
		margin: -1em;
		margin-top: 0;
	}

	.hero {
		max-width: 800px;
		margin: 0 auto 2rem;
		text-align: center;
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		color: #888;
		text-decoration: none;
		font-size: 0.9rem;
		margin-bottom: 1.5rem;
		transition: color 0.2s;
	}

	.back-link:hover {
		color: #27ca40;
	}

	.back-link svg {
		width: 16px;
		height: 16px;
	}

	.hero h1 {
		font-size: 2.5rem;
		color: #fff;
		margin: 0 0 0.5rem;
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
	}

	.prompt-symbol {
		color: #27ca40;
	}

	.tagline {
		color: #888;
		font-size: 1.1rem;
		margin: 0 0 1rem;
	}

	.rate-limit-badge {
		display: inline-block;
		background: #1a1a24;
		border: 1px solid #2a2a3a;
		border-radius: 20px;
		padding: 0.5rem 1rem;
		font-size: 0.85rem;
		color: #888;
	}

	.rate-limit-badge .count {
		color: #27ca40;
		font-weight: 600;
	}

	.main-content {
		max-width: 900px;
		margin: 0 auto;
	}

	.input-section {
		background: linear-gradient(135deg, #1a1a24 0%, #15151f 100%);
		border: 1px solid #2a2a3a;
		border-radius: 12px;
		padding: 1.5rem;
		margin-bottom: 1.5rem;
	}

	.examples {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 1.5rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid #2a2a3a;
	}

	.examples-label {
		color: #888;
		font-size: 0.85rem;
	}

	.example-btn {
		background: #0a0a0f;
		border: 1px solid #2a2a3a;
		border-radius: 6px;
		padding: 0.4rem 0.8rem;
		color: #888;
		font-size: 0.8rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.example-btn:hover {
		border-color: #27ca40;
		color: #27ca40;
	}

	.form-group {
		margin-bottom: 1rem;
		position: relative;
	}

	.form-group label {
		display: block;
		color: #fff;
		font-size: 0.9rem;
		margin-bottom: 0.5rem;
		font-weight: 500;
	}

	.form-group textarea,
	.form-group input,
	.form-group select {
		width: 100%;
		background: #0a0a0f;
		border: 1px solid #2a2a3a;
		border-radius: 8px;
		padding: 0.75rem;
		color: #fff;
		font-size: 0.95rem;
		font-family: inherit;
		transition: border-color 0.2s;
	}

	.form-group textarea {
		resize: vertical;
		min-height: 120px;
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
		font-size: 0.9rem;
		line-height: 1.5;
	}

	.form-group textarea:focus,
	.form-group input:focus,
	.form-group select:focus {
		outline: none;
		border-color: #27ca40;
	}

	.char-count {
		position: absolute;
		bottom: 0.5rem;
		right: 0.75rem;
		font-size: 0.75rem;
		color: #666;
	}

	.form-row {
		display: grid;
		grid-template-columns: 1fr 200px;
		gap: 1rem;
	}

	.optimize-btn {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 1rem;
		background: linear-gradient(135deg, #27ca40 0%, #00d4ff 100%);
		border: none;
		border-radius: 8px;
		color: #0a0a0f;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s;
		margin-top: 0.5rem;
	}

	.optimize-btn:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 8px 32px rgba(39, 202, 64, 0.3);
	}

	.optimize-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.optimize-btn svg {
		width: 20px;
		height: 20px;
	}

	.spinner {
		width: 18px;
		height: 18px;
		border: 2px solid transparent;
		border-top-color: #0a0a0f;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.error {
		background: rgba(255, 95, 86, 0.1);
		border: 1px solid #ff5f56;
		border-radius: 8px;
		padding: 1rem;
		color: #ff5f56;
		margin-top: 1rem;
		font-size: 0.9rem;
	}

	.result-section {
		background: linear-gradient(135deg, #1a1a24 0%, #15151f 100%);
		border: 1px solid #2a2a3a;
		border-radius: 12px;
		padding: 1.5rem;
	}

	.result-section h2 {
		color: #fff;
		font-size: 1.25rem;
		margin: 0 0 1rem;
		padding-bottom: 0.75rem;
		border-bottom: 1px solid #2a2a3a;
	}

	.result-content {
		color: #ccc;
		line-height: 1.7;
	}

	.result-content :global(strong) {
		color: #fff;
		font-weight: 600;
	}

	.result-content :global(code) {
		background: #0a0a0f;
		padding: 0.2em 0.4em;
		border-radius: 4px;
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
		font-size: 0.9em;
		color: #27ca40;
	}

	.result-content :global(pre) {
		background: #0a0a0f;
		border: 1px solid #2a2a3a;
		border-radius: 8px;
		padding: 1rem;
		overflow-x: auto;
		margin: 1rem 0;
	}

	.result-content :global(pre code) {
		background: none;
		padding: 0;
		color: #fff;
		font-size: 0.85rem;
		line-height: 1.5;
		white-space: pre-wrap;
	}

	.result-content :global(ul) {
		margin: 0.75rem 0;
		padding-left: 1.5rem;
	}

	.result-content :global(li) {
		margin: 0.4rem 0;
		color: #aaa;
	}

	.result-content :global(p) {
		margin: 0.75rem 0;
	}

	@media (max-width: 720px) {
		.tool-page {
			padding: 1rem;
		}

		.hero h1 {
			font-size: 1.75rem;
		}

		.form-row {
			grid-template-columns: 1fr;
		}

		.examples {
			flex-direction: column;
			align-items: flex-start;
		}
	}
</style>
