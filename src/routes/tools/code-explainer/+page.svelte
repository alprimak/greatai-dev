<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let code = $state('');
	let explanation = $state('');
	let language = $state('typescript');
	let depth = $state('detailed');
	let loading = $state(false);
	let error = $state('');
	let remaining = $state(5);
	let resetAt = $state(0);

	let inputEditor: any = null;
	let monaco: any = null;

	const languages = [
		{ value: 'typescript', label: 'TypeScript' },
		{ value: 'javascript', label: 'JavaScript' },
		{ value: 'python', label: 'Python' },
		{ value: 'rust', label: 'Rust' },
		{ value: 'go', label: 'Go' },
		{ value: 'java', label: 'Java' },
		{ value: 'csharp', label: 'C#' },
		{ value: 'cpp', label: 'C++' },
		{ value: 'ruby', label: 'Ruby' },
		{ value: 'php', label: 'PHP' },
		{ value: 'swift', label: 'Swift' },
		{ value: 'kotlin', label: 'Kotlin' },
		{ value: 'sql', label: 'SQL' },
		{ value: 'bash', label: 'Bash/Shell' }
	];

	const depthOptions = [
		{ value: 'brief', label: 'Brief', desc: '2-3 sentence summary' },
		{ value: 'detailed', label: 'Detailed', desc: 'Full explanation' },
		{ value: 'line_by_line', label: 'Line-by-Line', desc: 'Step through each part' }
	];

	onMount(async () => {
		if (!browser) return;

		try {
			const res = await fetch('/tools/code-explainer');
			if (res.ok) {
				const data = await res.json();
				remaining = data.remaining;
				resetAt = data.resetAt;
			}
		} catch (e) {
			console.error('Failed to fetch rate limit status');
		}

		const monacoModule = await import('monaco-editor');
		monaco = monacoModule;

		monaco.editor.defineTheme('greatai-dark', {
			base: 'vs-dark',
			inherit: true,
			rules: [],
			colors: {
				'editor.background': '#0d0d14',
				'editor.foreground': '#e0e0e0',
				'editorLineNumber.foreground': '#4a4a5a',
				'editorCursor.foreground': '#27ca40',
				'editor.selectionBackground': '#27ca4033'
			}
		});

		const inputContainer = document.getElementById('code-editor');
		if (inputContainer) {
			inputEditor = monaco.editor.create(inputContainer, {
				value: '',
				language: language,
				theme: 'greatai-dark',
				minimap: { enabled: false },
				fontSize: 14,
				lineNumbers: 'on',
				scrollBeyondLastLine: false,
				automaticLayout: true,
				padding: { top: 16, bottom: 16 },
				wordWrap: 'on'
			});

			inputEditor.onDidChangeModelContent(() => {
				code = inputEditor.getValue();
			});
		}

		return () => {
			inputEditor?.dispose();
		};
	});

	function updateLanguage(newLang: string) {
		language = newLang;
		if (monaco && inputEditor) {
			monaco.editor.setModelLanguage(inputEditor.getModel(), newLang);
		}
	}

	async function explainCode() {
		if (!code.trim()) {
			error = 'Please enter some code to explain';
			return;
		}

		if (remaining <= 0) {
			error = `Rate limit exceeded. Resets at ${new Date(resetAt * 1000).toLocaleTimeString()}`;
			return;
		}

		loading = true;
		error = '';
		explanation = '';

		try {
			const res = await fetch('/tools/code-explainer', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ code, language, depth })
			});

			const data = await res.json();

			if (!res.ok) {
				if (res.status === 429) {
					remaining = 0;
					resetAt = data.resetAt;
					error = `Rate limit exceeded. Resets at ${new Date(resetAt * 1000).toLocaleTimeString()}`;
				} else {
					error = data.error || 'Failed to explain code';
				}
				return;
			}

			explanation = data.explanation;
			remaining = data.remaining;
			resetAt = data.resetAt;
		} catch (e) {
			error = 'Network error. Please try again.';
		} finally {
			loading = false;
		}
	}

	function clearAll() {
		code = '';
		explanation = '';
		error = '';
		if (inputEditor) inputEditor.setValue('');
	}

	function formatMarkdown(text: string): string {
		return text
			.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
			.replace(/`([^`]+)`/g, '<code>$1</code>')
			.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
			.replace(/\*([^*]+)\*/g, '<em>$1</em>')
			.replace(/^### (.+)$/gm, '<h4>$1</h4>')
			.replace(/^## (.+)$/gm, '<h3>$1</h3>')
			.replace(/^# (.+)$/gm, '<h2>$1</h2>')
			.replace(/^- (.+)$/gm, '<li>$1</li>')
			.replace(/\n\n/g, '<br><br>');
	}
</script>

<svelte:head>
	<title>Code Explainer | greatAI.dev</title>
	<meta name="description" content="Get AI-powered explanations of any code. Understand unfamiliar code quickly with detailed breakdowns." />
</svelte:head>

<div class="explainer-page">
	<header class="header">
		<a href="/tools" class="back-link">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<line x1="19" y1="12" x2="5" y2="12"/>
				<polyline points="12 19 5 12 12 5"/>
			</svg>
			Back to Tools
		</a>
		<h1><span class="icon">&#128218;</span> Code Explainer</h1>
		<p class="subtitle">Paste code and get a clear, educational explanation of what it does</p>
	</header>

	<div class="controls">
		<div class="left-controls">
			<label>
				<span>Language:</span>
				<select onchange={(e) => updateLanguage(e.currentTarget.value)} value={language}>
					{#each languages as lang}
						<option value={lang.value}>{lang.label}</option>
					{/each}
				</select>
			</label>
			<label>
				<span>Depth:</span>
				<select bind:value={depth}>
					{#each depthOptions as opt}
						<option value={opt.value}>{opt.label} - {opt.desc}</option>
					{/each}
				</select>
			</label>
		</div>
		<div class="right-controls">
			<span class="rate-limit" class:warning={remaining <= 2} class:danger={remaining === 0}>
				{remaining}/5 requests remaining
			</span>
		</div>
	</div>

	<div class="main-content">
		<div class="input-section">
			<div class="panel-header">
				<span class="panel-title">Code Input</span>
				<button class="clear-btn" onclick={clearAll} disabled={loading}>Clear</button>
			</div>
			<div id="code-editor" class="editor"></div>
			<button
				class="explain-btn"
				onclick={explainCode}
				disabled={loading || remaining === 0 || !code.trim()}
			>
				{#if loading}
					<span class="spinner"></span>
					Explaining...
				{:else}
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<circle cx="12" cy="12" r="10"/>
						<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
						<line x1="12" y1="17" x2="12.01" y2="17"/>
					</svg>
					Explain Code
				{/if}
			</button>
		</div>

		<div class="output-section">
			<div class="panel-header">
				<span class="panel-title">Explanation</span>
			</div>
			<div class="explanation-content">
				{#if explanation}
					<div class="markdown-content">
						{@html formatMarkdown(explanation)}
					</div>
				{:else if loading}
					<div class="placeholder loading-placeholder">
						<div class="loading-dots">
							<span></span><span></span><span></span>
						</div>
						Analyzing code...
					</div>
				{:else}
					<div class="placeholder">
						Explanation will appear here after you click "Explain Code"
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
</div>


<style>
	.explainer-page {
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
		gap: 1rem;
		flex-wrap: wrap;
	}

	.left-controls label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: #888;
		font-size: 0.9rem;
	}

	.left-controls select {
		background: #1a1a24;
		border: 1px solid #2a2a3a;
		color: #fff;
		padding: 0.5rem 1rem;
		border-radius: 6px;
		font-size: 0.9rem;
		cursor: pointer;
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

	.main-content {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1.5rem;
		max-width: 1200px;
		margin: 0 auto;
	}

	.input-section, .output-section {
		background: #0d0d14;
		border: 1px solid #2a2a3a;
		border-radius: 12px;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	.panel-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem 1rem;
		background: #1a1a24;
		border-bottom: 1px solid #2a2a3a;
	}

	.panel-title {
		color: #888;
		font-size: 0.85rem;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.5px;
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

	.editor {
		height: 350px;
		flex-shrink: 0;
	}

	.explain-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		background: linear-gradient(135deg, #27ca40 0%, #00d4ff 100%);
		border: none;
		color: #0a0a0f;
		padding: 1rem 1.5rem;
		margin: 1rem;
		border-radius: 8px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s;
	}

	.explain-btn:hover:not(:disabled) {
		transform: scale(1.02);
		box-shadow: 0 0 20px rgba(39, 202, 64, 0.4);
	}

	.explain-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.explain-btn svg {
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
		to { transform: rotate(360deg); }
	}

	.explanation-content {
		flex: 1;
		padding: 1.5rem;
		overflow-y: auto;
		min-height: 400px;
	}

	.placeholder {
		color: #666;
		font-style: italic;
		text-align: center;
		padding: 2rem;
	}

	.loading-placeholder {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
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
		line-height: 1.7;
	}

	.markdown-content :global(h2),
	.markdown-content :global(h3),
	.markdown-content :global(h4) {
		color: #fff;
		margin-top: 1.5rem;
		margin-bottom: 0.75rem;
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
	}

	.markdown-content :global(h2) { font-size: 1.25rem; }
	.markdown-content :global(h3) { font-size: 1.1rem; }
	.markdown-content :global(h4) { font-size: 1rem; }

	.markdown-content :global(code) {
		background: #1a1a24;
		padding: 0.15rem 0.4rem;
		border-radius: 4px;
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
		font-size: 0.9em;
		color: #27ca40;
	}

	.markdown-content :global(pre) {
		background: #1a1a24;
		padding: 1rem;
		border-radius: 8px;
		overflow-x: auto;
		margin: 1rem 0;
		border: 1px solid #2a2a3a;
	}

	.markdown-content :global(pre code) {
		background: none;
		padding: 0;
		color: #e0e0e0;
	}

	.markdown-content :global(strong) {
		color: #fff;
	}

	.markdown-content :global(ul) {
		padding-left: 1.5rem;
		margin: 1rem 0;
	}

	.markdown-content :global(li) {
		margin-bottom: 0.5rem;
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
		.main-content {
			grid-template-columns: 1fr;
		}

		.editor {
			height: 250px;
		}

		.explanation-content {
			min-height: 300px;
		}
	}
</style>
