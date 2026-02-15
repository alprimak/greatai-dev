<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let inputJson = $state('');
	let outputJson = $state('');
	let indentSize = $state(2);
	let error = $state('');
	let stats = $state({ keys: 0, depth: 0, size: '' });

	let inputEditor: any = null;
	let outputEditor: any = null;
	let monaco: any = null;

	onMount(async () => {
		if (!browser) return;

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

		const inputContainer = document.getElementById('input-editor');
		if (inputContainer) {
			inputEditor = monaco.editor.create(inputContainer, {
				value: '',
				language: 'json',
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
				inputJson = inputEditor.getValue();
				validateJson();
			});
		}

		const outputContainer = document.getElementById('output-editor');
		if (outputContainer) {
			outputEditor = monaco.editor.create(outputContainer, {
				value: '// Formatted JSON will appear here',
				language: 'json',
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

	function validateJson() {
		if (!inputJson.trim()) {
			error = '';
			outputJson = '';
			stats = { keys: 0, depth: 0, size: '' };
			if (outputEditor) outputEditor.setValue('// Formatted JSON will appear here');
			return;
		}

		try {
			const parsed = JSON.parse(inputJson);
			error = '';
			calculateStats(parsed);
		} catch (e: any) {
			error = `Invalid JSON: ${e.message}`;
			outputJson = '';
			if (outputEditor) outputEditor.setValue('// Invalid JSON');
		}
	}

	function calculateStats(obj: any, currentDepth = 0): number {
		let keyCount = 0;
		let maxDepth = currentDepth;

		if (Array.isArray(obj)) {
			for (const item of obj) {
				if (typeof item === 'object' && item !== null) {
					const result = calculateStats(item, currentDepth + 1);
					maxDepth = Math.max(maxDepth, currentDepth + 1);
					keyCount += result;
				}
			}
		} else if (typeof obj === 'object' && obj !== null) {
			const keys = Object.keys(obj);
			keyCount += keys.length;
			for (const key of keys) {
				if (typeof obj[key] === 'object' && obj[key] !== null) {
					const result = calculateStats(obj[key], currentDepth + 1);
					maxDepth = Math.max(maxDepth, currentDepth + 1);
					keyCount += result;
				}
			}
		}

		if (currentDepth === 0) {
			const size = new Blob([inputJson]).size;
			stats = {
				keys: keyCount,
				depth: maxDepth,
				size: formatBytes(size)
			};
		}

		return keyCount;
	}

	function formatBytes(bytes: number): string {
		if (bytes === 0) return '0 B';
		const k = 1024;
		const sizes = ['B', 'KB', 'MB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
	}

	function formatJson() {
		if (!inputJson.trim() || error) return;

		try {
			const parsed = JSON.parse(inputJson);
			outputJson = JSON.stringify(parsed, null, indentSize);
			if (outputEditor) outputEditor.setValue(outputJson);
		} catch (e) {
			// Already handled in validateJson
		}
	}

	function minifyJson() {
		if (!inputJson.trim() || error) return;

		try {
			const parsed = JSON.parse(inputJson);
			outputJson = JSON.stringify(parsed);
			if (outputEditor) outputEditor.setValue(outputJson);
		} catch (e) {
			// Already handled in validateJson
		}
	}

	function sortKeys() {
		if (!inputJson.trim() || error) return;

		try {
			const parsed = JSON.parse(inputJson);
			const sorted = sortObjectKeys(parsed);
			outputJson = JSON.stringify(sorted, null, indentSize);
			if (outputEditor) outputEditor.setValue(outputJson);
		} catch (e) {
			// Already handled in validateJson
		}
	}

	function sortObjectKeys(obj: any): any {
		if (Array.isArray(obj)) {
			return obj.map(sortObjectKeys);
		} else if (typeof obj === 'object' && obj !== null) {
			const sorted: any = {};
			Object.keys(obj).sort().forEach(key => {
				sorted[key] = sortObjectKeys(obj[key]);
			});
			return sorted;
		}
		return obj;
	}

	function copyOutput() {
		if (outputJson) {
			navigator.clipboard.writeText(outputJson);
		}
	}

	function clearAll() {
		inputJson = '';
		outputJson = '';
		error = '';
		stats = { keys: 0, depth: 0, size: '' };
		if (inputEditor) inputEditor.setValue('');
		if (outputEditor) outputEditor.setValue('// Formatted JSON will appear here');
	}

	function loadSample() {
		const sample = {
			"name": "greatAI.dev",
			"version": "1.0.0",
			"tools": [
				{ "name": "Code Simplifier", "type": "ai" },
				{ "name": "Token Calculator", "type": "client" },
				{ "name": "JSON Formatter", "type": "client" }
			],
			"config": {
				"theme": "dark",
				"features": {
					"monaco": true,
					"syntax_highlighting": true
				}
			}
		};
		const sampleStr = JSON.stringify(sample);
		inputJson = sampleStr;
		if (inputEditor) inputEditor.setValue(sampleStr);
	}
</script>

<SEO
	title="JSON Formatter"
	description="Format, validate, minify, and sort JSON online. Free JSON formatter with Monaco editor, syntax highlighting, and real-time validation."
/>

<div class="formatter-page">
	<header class="header">
		<a href="/tools" class="back-link">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<line x1="19" y1="12" x2="5" y2="12"/>
				<polyline points="12 19 5 12 12 5"/>
			</svg>
			Back to Tools
		</a>
		<h1><span class="icon">{'{ }'}</span> JSON Formatter</h1>
		<p class="subtitle">Format, validate, minify, and sort JSON with syntax highlighting</p>
	</header>

	<div class="controls">
		<div class="left-controls">
			<label>
				<span>Indent:</span>
				<select bind:value={indentSize}>
					<option value={2}>2 spaces</option>
					<option value={4}>4 spaces</option>
					<option value={1}>1 space</option>
				</select>
			</label>
			<button class="sample-btn" onclick={loadSample}>Load Sample</button>
		</div>
		<div class="right-controls">
			{#if stats.size}
				<div class="stats">
					<span class="stat"><strong>{stats.keys}</strong> keys</span>
					<span class="stat"><strong>{stats.depth}</strong> depth</span>
					<span class="stat"><strong>{stats.size}</strong></span>
				</div>
			{/if}
		</div>
	</div>

	<div class="editors-container">
		<div class="editor-panel">
			<div class="panel-header">
				<span class="panel-title">Input</span>
				<button class="clear-btn" onclick={clearAll}>Clear</button>
			</div>
			<div id="input-editor" class="editor"></div>
		</div>

		<div class="action-column">
			<button class="action-btn primary" onclick={formatJson} disabled={!inputJson.trim() || !!error}>
				Format
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<line x1="5" y1="12" x2="19" y2="12"/>
					<polyline points="12 5 19 12 12 19"/>
				</svg>
			</button>
			<button class="action-btn" onclick={minifyJson} disabled={!inputJson.trim() || !!error}>
				Minify
			</button>
			<button class="action-btn" onclick={sortKeys} disabled={!inputJson.trim() || !!error}>
				Sort Keys
			</button>
		</div>

		<div class="editor-panel">
			<div class="panel-header">
				<span class="panel-title">Output</span>
				<button class="copy-btn" onclick={copyOutput} disabled={!outputJson}>
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
	{:else if inputJson.trim() && !outputJson}
		<div class="success-message">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
				<polyline points="22 4 12 14.01 9 11.01"/>
			</svg>
			Valid JSON
		</div>
	{/if}

	<div class="seo-content">
		<h2>Format and Validate JSON Online</h2>
		<p>The JSON Formatter provides a full-featured editing environment powered by Monaco (the same editor behind VS Code). Paste any JSON to instantly validate it, then format with configurable indentation, minify for production use, or sort keys alphabetically for consistent structure.</p>
		<p>Real-time statistics show key count, nesting depth, and file size as you type. Ideal for debugging API responses, cleaning up configuration files, or preparing JSON payloads for testing.</p>
	</div>
</div>

<style>
	.formatter-page {
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

	.sample-btn {
		background: transparent;
		border: 1px solid #3a3a4a;
		color: #888;
		padding: 0.5rem 1rem;
		border-radius: 6px;
		font-size: 0.9rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.sample-btn:hover {
		border-color: #27ca40;
		color: #27ca40;
	}

	.stats {
		display: flex;
		gap: 1rem;
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
		font-size: 0.85rem;
	}

	.stat {
		color: #888;
	}

	.stat strong {
		color: #27ca40;
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
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
	}

	.action-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: #1a1a24;
		border: 1px solid #2a2a3a;
		color: #ccc;
		padding: 0.75rem 1.25rem;
		border-radius: 8px;
		font-size: 0.9rem;
		cursor: pointer;
		transition: all 0.2s;
		min-width: 120px;
		justify-content: center;
	}

	.action-btn:hover:not(:disabled) {
		border-color: #27ca40;
		color: #27ca40;
	}

	.action-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.action-btn.primary {
		background: linear-gradient(135deg, #27ca40 0%, #00d4ff 100%);
		border: none;
		color: #0a0a0f;
		font-weight: 600;
	}

	.action-btn.primary:hover:not(:disabled) {
		transform: scale(1.05);
		box-shadow: 0 0 20px rgba(39, 202, 64, 0.4);
	}

	.action-btn svg {
		width: 18px;
		height: 18px;
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

	.success-message {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		max-width: 1200px;
		margin: 1rem auto 0;
		padding: 1rem;
		background: rgba(39, 202, 64, 0.1);
		border: 1px solid rgba(39, 202, 64, 0.3);
		border-radius: 8px;
		color: #27ca40;
		font-size: 0.9rem;
	}

	.error-message svg, .success-message svg {
		width: 20px;
		height: 20px;
		flex-shrink: 0;
	}

	@media (max-width: 900px) {
		.editors-container {
			grid-template-columns: 1fr;
		}

		.action-column {
			flex-direction: row;
			padding: 0.5rem 0;
		}

		.action-btn {
			min-width: auto;
			flex: 1;
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
