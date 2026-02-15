<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let inputCode = $state('');
	let outputCode = $state('');
	let language = $state('typescript');
	let loading = $state(false);
	let error = $state('');
	let remaining = $state(5);
	let resetAt = $state(0);

	let inputEditor: any = null;
	let outputEditor: any = null;
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
		{ value: 'kotlin', label: 'Kotlin' }
	];

	onMount(async () => {
		if (!browser) return;

		// Fetch initial rate limit status
		try {
			const res = await fetch('/tools/code-simplifier');
			if (res.ok) {
				const data = await res.json();
				remaining = data.remaining;
				resetAt = data.resetAt;
			}
		} catch (e) {
			console.error('Failed to fetch rate limit status');
		}

		// Dynamic import of Monaco
		const monacoModule = await import('monaco-editor');
		monaco = monacoModule;

		// Configure Monaco theme
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

		// Create input editor
		const inputContainer = document.getElementById('input-editor');
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
				inputCode = inputEditor.getValue();
			});
		}

		// Create output editor (read-only)
		const outputContainer = document.getElementById('output-editor');
		if (outputContainer) {
			outputEditor = monaco.editor.create(outputContainer, {
				value: '// Simplified code will appear here',
				language: language,
				theme: 'greatai-dark',
				minimap: { enabled: false },
				fontSize: 14,
				lineNumbers: 'on',
				scrollBeyondLastLine: false,
				automaticLayout: true,
				padding: { top: 16, bottom: 16 },
				wordWrap: 'on',
				readOnly: true
			});
		}

		return () => {
			inputEditor?.dispose();
			outputEditor?.dispose();
		};
	});

	function updateLanguage(newLang: string) {
		language = newLang;
		if (monaco && inputEditor) {
			monaco.editor.setModelLanguage(inputEditor.getModel(), newLang);
		}
		if (monaco && outputEditor) {
			monaco.editor.setModelLanguage(outputEditor.getModel(), newLang);
		}
	}

	async function simplifyCode() {
		if (!inputCode.trim()) {
			error = 'Please enter some code to simplify';
			return;
		}

		if (remaining <= 0) {
			error = `Rate limit exceeded. Resets at ${new Date(resetAt * 1000).toLocaleTimeString()}`;
			return;
		}

		loading = true;
		error = '';

		try {
			const res = await fetch('/tools/code-simplifier', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ code: inputCode, language })
			});

			const data = await res.json();

			if (!res.ok) {
				if (res.status === 429) {
					remaining = 0;
					resetAt = data.resetAt;
					error = `Rate limit exceeded. Resets at ${new Date(resetAt * 1000).toLocaleTimeString()}`;
				} else {
					error = data.error || 'Failed to simplify code';
				}
				return;
			}

			outputCode = data.simplified;
			remaining = data.remaining;
			resetAt = data.resetAt;

			if (outputEditor) {
				outputEditor.setValue(data.simplified);
			}
		} catch (e) {
			error = 'Network error. Please try again.';
		} finally {
			loading = false;
		}
	}

	function copyOutput() {
		if (outputCode) {
			navigator.clipboard.writeText(outputCode);
		}
	}

	function clearAll() {
		inputCode = '';
		outputCode = '';
		error = '';
		if (inputEditor) inputEditor.setValue('');
		if (outputEditor) outputEditor.setValue('// Simplified code will appear here');
	}
</script>

<SEO
	title="Code Simplifier"
	description="Simplify and clean up your code using AI. Supports TypeScript, Python, Rust, Go, and 8 more languages. Free tool powered by Claude."
/>

<div class="simplifier-page">
	<header class="header">
		<a href="/tools" class="back-link">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<line x1="19" y1="12" x2="5" y2="12"/>
				<polyline points="12 19 5 12 12 5"/>
			</svg>
			Back to Tools
		</a>
		<h1><span class="icon">&#x2728;</span> Code Simplifier</h1>
		<p class="subtitle">Paste your code and get a cleaner, more maintainable version</p>
		<p class="attribution">
			Inspired by <a href="https://github.com/anthropics/claude-code" target="_blank" rel="noopener">Boris Cherny's</a> code-simplifier agent for Claude Code.
		</p>
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
		</div>
		<div class="right-controls">
			<span class="rate-limit" class:warning={remaining <= 2} class:danger={remaining === 0}>
				{remaining}/5 requests remaining
			</span>
		</div>
	</div>

	<div class="editors-container">
		<div class="editor-panel">
			<div class="panel-header">
				<span class="panel-title">Input</span>
				<button class="clear-btn" onclick={clearAll} disabled={loading}>Clear</button>
			</div>
			<div id="input-editor" class="editor"></div>
		</div>

		<div class="action-column">
			<button
				class="simplify-btn"
				onclick={simplifyCode}
				disabled={loading || remaining === 0 || !inputCode.trim()}
			>
				{#if loading}
					<span class="spinner"></span>
					Simplifying...
				{:else}
					Simplify
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<line x1="5" y1="12" x2="19" y2="12"/>
						<polyline points="12 5 19 12 12 19"/>
					</svg>
				{/if}
			</button>
		</div>

		<div class="editor-panel">
			<div class="panel-header">
				<span class="panel-title">Output</span>
				<button class="copy-btn" onclick={copyOutput} disabled={!outputCode}>
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
						<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
					</svg>
					Copy
				</button>
			</div>
			<div id="output-editor" class="editor"></div>
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
		<h2>AI-Powered Code Simplification</h2>
		<p>The Code Simplifier analyzes your code and produces a cleaner, more maintainable version while preserving all functionality. It identifies overly complex logic, redundant patterns, and opportunities for clearer expression across 12 programming languages including TypeScript, Python, Rust, Go, Java, and C++.</p>
		<p>Built on Claude by Anthropic, the tool applies best practices for each language — simplifying nested conditionals, extracting repeated logic, improving naming, and reducing cognitive complexity. Paste your code, select the language, and get an instant refactored version.</p>
	</div>
</div>

<style>
	.simplifier-page {
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

	.attribution {
		color: #666;
		font-size: 0.85rem;
		margin: 0.75rem 0 0;
	}

	.attribution a {
		color: #27ca40;
		text-decoration: none;
	}

	.attribution a:hover {
		text-decoration: underline;
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

	.editors-container {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		gap: 1rem;
		max-width: 1200px;
		margin: 0 auto;
	}

	.editor-panel {
		background: #0d0d14;
		border: 1px solid #2a2a3a;
		border-radius: 12px;
		overflow: hidden;
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

	.clear-btn, .copy-btn {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		background: transparent;
		border: 1px solid #3a3a4a;
		color: #888;
		padding: 0.35rem 0.75rem;
		border-radius: 4px;
		font-size: 0.8rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.clear-btn:hover, .copy-btn:hover {
		border-color: #27ca40;
		color: #27ca40;
	}

	.copy-btn svg {
		width: 14px;
		height: 14px;
	}

	.editor {
		height: 400px;
	}

	.action-column {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.simplify-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: linear-gradient(135deg, #27ca40 0%, #00d4ff 100%);
		border: none;
		color: #0a0a0f;
		padding: 1rem 1.5rem;
		border-radius: 8px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s;
		white-space: nowrap;
	}

	.simplify-btn:hover:not(:disabled) {
		transform: scale(1.05);
		box-shadow: 0 0 20px rgba(39, 202, 64, 0.4);
	}

	.simplify-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.simplify-btn svg {
		width: 18px;
		height: 18px;
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
		.editors-container {
			grid-template-columns: 1fr;
		}

		.action-column {
			padding: 0.5rem 0;
		}

		.simplify-btn {
			width: 100%;
			justify-content: center;
		}

		.editor {
			height: 300px;
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
