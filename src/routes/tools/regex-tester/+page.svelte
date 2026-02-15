<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let pattern = $state('');
	let testString = $state('');
	let flags = $state('g');
	let matches: { text: string; index: number; groups?: string[] }[] = $state([]);
	let error = $state('');
	let explanation = $state('');
	let loadingExplanation = $state(false);
	let remaining = $state(5);
	let resetAt = $state(0);

	const flagOptions = [
		{ value: 'g', label: 'g', desc: 'Global' },
		{ value: 'i', label: 'i', desc: 'Case insensitive' },
		{ value: 'm', label: 'm', desc: 'Multiline' },
		{ value: 's', label: 's', desc: 'Dotall' }
	];

	let selectedFlags = $state<Set<string>>(new Set(['g']));

	onMount(async () => {
		if (!browser) return;

		try {
			const res = await fetch('/tools/regex-tester');
			if (res.ok) {
				const data = await res.json();
				remaining = data.remaining;
				resetAt = data.resetAt;
			}
		} catch (e) {
			console.error('Failed to fetch rate limit status');
		}
	});

	function toggleFlag(flag: string) {
		const newFlags = new Set(selectedFlags);
		if (newFlags.has(flag)) {
			newFlags.delete(flag);
		} else {
			newFlags.add(flag);
		}
		selectedFlags = newFlags;
		flags = Array.from(newFlags).join('');
		testRegex();
	}

	function testRegex() {
		matches = [];
		error = '';

		if (!pattern.trim()) return;

		try {
			const regex = new RegExp(pattern, flags);

			if (!testString) {
				matches = [];
				return;
			}

			const foundMatches: typeof matches = [];
			let match;

			if (flags.includes('g')) {
				while ((match = regex.exec(testString)) !== null) {
					foundMatches.push({
						text: match[0],
						index: match.index,
						groups: match.slice(1)
					});
					if (match[0].length === 0) {
						regex.lastIndex++;
					}
				}
			} else {
				match = regex.exec(testString);
				if (match) {
					foundMatches.push({
						text: match[0],
						index: match.index,
						groups: match.slice(1)
					});
				}
			}

			matches = foundMatches;
		} catch (e: any) {
			error = e.message;
		}
	}

	function getHighlightedText(): string {
		if (!testString || matches.length === 0) return escapeHtml(testString);

		let result = '';
		let lastIndex = 0;

		const sortedMatches = [...matches].sort((a, b) => a.index - b.index);

		for (const match of sortedMatches) {
			result += escapeHtml(testString.slice(lastIndex, match.index));
			result += `<mark>${escapeHtml(match.text)}</mark>`;
			lastIndex = match.index + match.text.length;
		}

		result += escapeHtml(testString.slice(lastIndex));
		return result;
	}

	function escapeHtml(text: string): string {
		return text
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#039;')
			.replace(/\n/g, '<br>');
	}

	async function explainRegex() {
		if (!pattern.trim()) {
			error = 'Enter a pattern first';
			return;
		}

		if (remaining <= 0) {
			error = `Rate limit exceeded. Resets at ${new Date(resetAt * 1000).toLocaleTimeString()}`;
			return;
		}

		loadingExplanation = true;
		explanation = '';

		try {
			const res = await fetch('/tools/regex-tester', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ pattern, flags })
			});

			const data = await res.json();

			if (!res.ok) {
				if (res.status === 429) {
					remaining = 0;
					resetAt = data.resetAt;
					error = `Rate limit exceeded. Resets at ${new Date(resetAt * 1000).toLocaleTimeString()}`;
				} else {
					error = data.error || 'Failed to explain regex';
				}
				return;
			}

			explanation = data.explanation;
			remaining = data.remaining;
			resetAt = data.resetAt;
		} catch (e) {
			error = 'Network error. Please try again.';
		} finally {
			loadingExplanation = false;
		}
	}

	function loadExample(name: string) {
		const examples: Record<string, { pattern: string; test: string; flags: string }> = {
			email: {
				pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
				test: 'Contact us at hello@example.com or support@test.org',
				flags: 'g'
			},
			phone: {
				pattern: '\\(?\\d{3}\\)?[-\\s.]?\\d{3}[-\\s.]?\\d{4}',
				test: 'Call us: (555) 123-4567 or 555.987.6543',
				flags: 'g'
			},
			url: {
				pattern: 'https?:\\/\\/[\\w.-]+(?:\\/[\\w./-]*)?',
				test: 'Visit https://example.com/page or http://test.org',
				flags: 'g'
			},
			date: {
				pattern: '\\d{4}-\\d{2}-\\d{2}',
				test: 'Events on 2024-01-15 and 2024-12-25',
				flags: 'g'
			}
		};

		const example = examples[name];
		if (example) {
			pattern = example.pattern;
			testString = example.test;
			selectedFlags = new Set(example.flags.split(''));
			flags = example.flags;
			testRegex();
		}
	}

	function clearAll() {
		pattern = '';
		testString = '';
		matches = [];
		error = '';
		explanation = '';
	}

	function formatMarkdown(text: string): string {
		return text
			.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
			.replace(/`([^`]+)`/g, '<code>$1</code>')
			.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
			.replace(/\*([^*]+)\*/g, '<em>$1</em>')
			.replace(/^### (.+)$/gm, '<h4>$1</h4>')
			.replace(/^## (.+)$/gm, '<h3>$1</h3>')
			.replace(/^# (.+)$/gm, '<h2>$1</h2>')
			.replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
			.replace(/^- (.+)$/gm, '<li>$1</li>')
			.replace(/\n\n/g, '<br><br>');
	}

	$effect(() => {
		testRegex();
	});
</script>

<SEO
	title="Regex Tester"
	description="Test regular expressions with real-time matching and AI-powered explanations. Free regex tester with syntax highlighting and pattern examples."
/>

<div class="regex-page">
	<header class="header">
		<a href="/tools" class="back-link">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<line x1="19" y1="12" x2="5" y2="12"/>
				<polyline points="12 19 5 12 12 5"/>
			</svg>
			Back to Tools
		</a>
		<h1><span class="icon">.*</span> Regex Tester</h1>
		<p class="subtitle">Test regular expressions with real-time matching and AI explanations</p>
	</header>

	<div class="controls">
		<div class="left-controls">
			<span class="label">Examples:</span>
			<button class="example-btn" onclick={() => loadExample('email')}>Email</button>
			<button class="example-btn" onclick={() => loadExample('phone')}>Phone</button>
			<button class="example-btn" onclick={() => loadExample('url')}>URL</button>
			<button class="example-btn" onclick={() => loadExample('date')}>Date</button>
		</div>
		<div class="right-controls">
			<span class="rate-limit" class:warning={remaining <= 2} class:danger={remaining === 0}>
				{remaining}/5 AI explanations
			</span>
		</div>
	</div>

	<div class="main-layout">
		<div class="input-section">
			<div class="pattern-input">
				<div class="input-header">
					<span class="input-label">Pattern</span>
					<div class="flags">
						{#each flagOptions as flag}
							<button
								class="flag-btn"
								class:active={selectedFlags.has(flag.value)}
								onclick={() => toggleFlag(flag.value)}
								title={flag.desc}
							>
								{flag.label}
							</button>
						{/each}
					</div>
				</div>
				<div class="regex-input-wrapper">
					<span class="delimiter">/</span>
					<input
						type="text"
						bind:value={pattern}
						placeholder="Enter regex pattern..."
						class="regex-input"
						class:invalid={!!error}
					/>
					<span class="delimiter">/{flags}</span>
				</div>
			</div>

			<div class="test-input">
				<div class="input-header">
					<span class="input-label">Test String</span>
					<button class="clear-btn" onclick={clearAll}>Clear All</button>
				</div>
				<textarea
					bind:value={testString}
					placeholder="Enter text to test against..."
					class="test-textarea"
					rows="6"
				></textarea>
			</div>

			<div class="results-section">
				<div class="input-header">
					<span class="input-label">Matches ({matches.length})</span>
				</div>
				<div class="highlighted-text">
					{#if testString}
						{@html getHighlightedText()}
					{:else}
						<span class="placeholder-text">Matching text will be highlighted here</span>
					{/if}
				</div>
				{#if matches.length > 0}
					<div class="match-list">
						{#each matches as match, i}
							<div class="match-item">
								<span class="match-index">#{i + 1}</span>
								<span class="match-text">"{match.text}"</span>
								<span class="match-pos">at index {match.index}</span>
								{#if match.groups && match.groups.length > 0}
									<span class="match-groups">
										Groups: {match.groups.map((g, i) => `$${i+1}="${g}"`).join(', ')}
									</span>
								{/if}
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>

		<div class="explanation-section">
			<div class="input-header">
				<span class="input-label">AI Explanation</span>
				<button
					class="explain-btn"
					onclick={explainRegex}
					disabled={loadingExplanation || !pattern.trim() || remaining === 0}
				>
					{#if loadingExplanation}
						<span class="spinner"></span>
					{:else}
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<circle cx="12" cy="12" r="10"/>
							<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
							<line x1="12" y1="17" x2="12.01" y2="17"/>
						</svg>
					{/if}
					Explain
				</button>
			</div>
			<div class="explanation-content">
				{#if explanation}
					<div class="markdown-content">
						{@html formatMarkdown(explanation)}
					</div>
				{:else if loadingExplanation}
					<div class="placeholder-text loading">
						<div class="loading-dots">
							<span></span><span></span><span></span>
						</div>
						Analyzing pattern...
					</div>
				{:else}
					<div class="placeholder-text">
						Click "Explain" to get an AI-powered breakdown of your regex pattern
					</div>
				{/if}
			</div>
		</div>
	</div>

	{#if error}
		<div class="error-message">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<circle cx="12" cy="12" r="10"/>
				<line x1="12" y1="8" x2="12" y2="12"/>
				<line x1="12" y1="16" x2="12.01" y2="16"/>
			</svg>
			{error}
		</div>
	{/if}

	<div class="seo-content">
		<h2>Test and Debug Regular Expressions</h2>
		<p>The Regex Tester provides real-time pattern matching with highlighted results as you type. Toggle flags for global, case-insensitive, multiline, and dotall modes. See every match with its position and captured groups displayed clearly below the test string.</p>
		<p>Use the AI-powered explanation feature to get a human-readable breakdown of complex patterns. Built-in examples for common regex tasks — email validation, phone numbers, URLs, and date formats — help you get started quickly.</p>
	</div>
</div>


<style>
	.regex-page {
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
		color: #27ca40;
	}

	.subtitle {
		color: #888;
		margin: 0;
	}

	.controls {
		display: flex;
		justify-content: space-between;
		align-items: center;
		max-width: 1200px;
		margin: 0 auto 1rem;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.left-controls {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.label {
		color: #888;
		font-size: 0.9rem;
	}

	.example-btn {
		background: #1a1a24;
		border: 1px solid #2a2a3a;
		color: #888;
		padding: 0.4rem 0.75rem;
		border-radius: 4px;
		font-size: 0.8rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.example-btn:hover {
		border-color: #27ca40;
		color: #27ca40;
	}

	.rate-limit {
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
		font-size: 0.85rem;
		color: #27ca40;
		padding: 0.5rem 1rem;
		background: rgba(39, 202, 64, 0.1);
		border-radius: 6px;
	}

	.rate-limit.warning {
		color: #ffbd2e;
		background: rgba(255, 189, 46, 0.1);
	}

	.rate-limit.danger {
		color: #ff5f56;
		background: rgba(255, 95, 86, 0.1);
	}

	.main-layout {
		display: grid;
		grid-template-columns: 1fr 350px;
		gap: 1.5rem;
		max-width: 1200px;
		margin: 0 auto;
	}

	.input-section {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.pattern-input, .test-input, .results-section, .explanation-section {
		background: #0d0d14;
		border: 1px solid #2a2a3a;
		border-radius: 12px;
		overflow: hidden;
	}

	.input-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem 1rem;
		background: #1a1a24;
		border-bottom: 1px solid #2a2a3a;
	}

	.input-label {
		color: #888;
		font-size: 0.85rem;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.flags {
		display: flex;
		gap: 0.25rem;
	}

	.flag-btn {
		background: transparent;
		border: 1px solid #3a3a4a;
		color: #666;
		width: 28px;
		height: 28px;
		border-radius: 4px;
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.85rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.flag-btn:hover {
		border-color: #27ca40;
		color: #27ca40;
	}

	.flag-btn.active {
		background: rgba(39, 202, 64, 0.2);
		border-color: #27ca40;
		color: #27ca40;
	}

	.regex-input-wrapper {
		display: flex;
		align-items: center;
		padding: 0.75rem 1rem;
	}

	.delimiter {
		color: #27ca40;
		font-family: 'JetBrains Mono', monospace;
		font-size: 1.1rem;
	}

	.regex-input {
		flex: 1;
		background: transparent;
		border: none;
		color: #fff;
		font-family: 'JetBrains Mono', monospace;
		font-size: 1rem;
		padding: 0.5rem;
		outline: none;
	}

	.regex-input.invalid {
		color: #ff5f56;
	}

	.regex-input::placeholder {
		color: #555;
	}

	.clear-btn {
		background: transparent;
		border: 1px solid #3a3a4a;
		color: #888;
		padding: 0.35rem 0.75rem;
		border-radius: 4px;
		font-size: 0.8rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.clear-btn:hover {
		border-color: #27ca40;
		color: #27ca40;
	}

	.test-textarea {
		width: 100%;
		background: transparent;
		border: none;
		color: #ccc;
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.95rem;
		padding: 1rem;
		resize: vertical;
		outline: none;
		line-height: 1.5;
	}

	.test-textarea::placeholder {
		color: #555;
	}

	.highlighted-text {
		padding: 1rem;
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.95rem;
		color: #ccc;
		line-height: 1.6;
		white-space: pre-wrap;
		word-break: break-word;
		min-height: 80px;
	}

	.highlighted-text :global(mark) {
		background: rgba(39, 202, 64, 0.3);
		color: #27ca40;
		padding: 0.1rem 0.2rem;
		border-radius: 2px;
	}

	.placeholder-text {
		color: #555;
		font-style: italic;
	}

	.match-list {
		padding: 0.5rem 1rem 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		border-top: 1px solid #2a2a3a;
	}

	.match-item {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.85rem;
	}

	.match-index {
		color: #27ca40;
		font-family: 'JetBrains Mono', monospace;
	}

	.match-text {
		color: #fff;
		font-family: 'JetBrains Mono', monospace;
		background: #1a1a24;
		padding: 0.2rem 0.5rem;
		border-radius: 4px;
	}

	.match-pos {
		color: #666;
	}

	.match-groups {
		color: #888;
		font-size: 0.8rem;
		width: 100%;
		margin-left: 1.5rem;
	}

	.explanation-section {
		height: fit-content;
		position: sticky;
		top: 80px;
	}

	.explain-btn {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		background: linear-gradient(135deg, #27ca40 0%, #00d4ff 100%);
		border: none;
		color: #0a0a0f;
		padding: 0.4rem 0.75rem;
		border-radius: 4px;
		font-size: 0.8rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	.explain-btn:hover:not(:disabled) {
		transform: scale(1.05);
	}

	.explain-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.explain-btn svg {
		width: 14px;
		height: 14px;
	}

	.spinner {
		width: 14px;
		height: 14px;
		border: 2px solid transparent;
		border-top-color: #0a0a0f;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	.explanation-content {
		padding: 1rem;
		min-height: 200px;
		max-height: 500px;
		overflow-y: auto;
	}

	.loading {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		padding: 2rem;
	}

	.loading-dots {
		display: flex;
		gap: 0.5rem;
	}

	.loading-dots span {
		width: 8px;
		height: 8px;
		background: #27ca40;
		border-radius: 50%;
		animation: bounce 1.4s infinite ease-in-out both;
	}

	.loading-dots span:nth-child(1) { animation-delay: -0.32s; }
	.loading-dots span:nth-child(2) { animation-delay: -0.16s; }

	@keyframes bounce {
		0%, 80%, 100% { transform: scale(0); }
		40% { transform: scale(1); }
	}

	.markdown-content {
		color: #ccc;
		line-height: 1.6;
		font-size: 0.9rem;
	}

	.markdown-content :global(strong) {
		color: #fff;
	}

	.markdown-content :global(code) {
		background: #1a1a24;
		padding: 0.15rem 0.4rem;
		border-radius: 4px;
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.85em;
		color: #27ca40;
	}

	.markdown-content :global(pre) {
		background: #1a1a24;
		padding: 0.75rem;
		border-radius: 6px;
		overflow-x: auto;
		margin: 0.75rem 0;
	}

	.markdown-content :global(pre code) {
		background: none;
		padding: 0;
		color: #e0e0e0;
	}

	.markdown-content :global(h3), .markdown-content :global(h4) {
		color: #fff;
		margin-top: 1rem;
		margin-bottom: 0.5rem;
	}

	.markdown-content :global(li) {
		margin-bottom: 0.25rem;
	}

	.error-message {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		max-width: 1200px;
		margin: 1rem auto 0;
		padding: 1rem;
		background: rgba(255, 95, 86, 0.1);
		border: 1px solid rgba(255, 95, 86, 0.3);
		border-radius: 8px;
		color: #ff5f56;
		font-size: 0.9rem;
	}

	.error-message svg {
		width: 20px;
		height: 20px;
		flex-shrink: 0;
	}

	@media (max-width: 900px) {
		.main-layout {
			grid-template-columns: 1fr;
		}

		.explanation-section {
			position: static;
		}
	}

	.seo-content {
		max-width: 800px;
		margin: 3rem auto 0;
		padding: 2rem 0 0;
		border-top: 1px solid #2a2a3a;
	}

	.seo-content h2 {
		color: #fff;
		font-size: 1.25rem;
		margin: 0 0 1rem;
	}

	.seo-content p {
		color: #888;
		font-size: 0.95rem;
		line-height: 1.7;
		margin: 0 0 1rem;
	}

	.seo-content p:last-child {
		margin-bottom: 0;
	}
</style>
