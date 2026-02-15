<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	let input = $state('');
	let output = $state('');
	let mode = $state<'encode' | 'decode'>('encode');
	let error = $state('');
	let urlSafe = $state(false);
	let fileInput: HTMLInputElement;
	let fileName = $state('');

	function encode(text: string): string {
		try {
			const encoded = btoa(unescape(encodeURIComponent(text)));
			if (urlSafe) {
				return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
			}
			return encoded;
		} catch {
			throw new Error('Failed to encode text');
		}
	}

	function decode(text: string): string {
		try {
			let base64 = text;
			if (urlSafe) {
				base64 = text.replace(/-/g, '+').replace(/_/g, '/');
				while (base64.length % 4) base64 += '=';
			}
			return decodeURIComponent(escape(atob(base64)));
		} catch {
			throw new Error('Invalid Base64 string');
		}
	}

	function convert() {
		error = '';
		if (!input.trim()) {
			output = '';
			return;
		}

		try {
			if (mode === 'encode') {
				output = encode(input);
			} else {
				output = decode(input);
			}
		} catch (e) {
			error = e instanceof Error ? e.message : 'Conversion failed';
			output = '';
		}
	}

	function swap() {
		const temp = input;
		input = output;
		output = temp;
		mode = mode === 'encode' ? 'decode' : 'encode';
		error = '';
	}

	function clear() {
		input = '';
		output = '';
		error = '';
		fileName = '';
	}

	function copyOutput() {
		navigator.clipboard.writeText(output);
	}

	async function handleFileUpload(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;

		fileName = file.name;
		error = '';

		try {
			const reader = new FileReader();
			reader.onload = () => {
				const result = reader.result as string;
				// Remove data URL prefix to get just the base64
				const base64 = result.split(',')[1];
				if (mode === 'encode') {
					output = urlSafe
						? base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
						: base64;
					input = `[File: ${file.name}]`;
				} else {
					input = base64;
					convert();
				}
			};
			reader.onerror = () => {
				error = 'Failed to read file';
			};
			reader.readAsDataURL(file);
		} catch {
			error = 'Failed to process file';
		}
	}

	function downloadOutput() {
		if (!output) return;
		const blob = new Blob([output], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = mode === 'encode' ? 'encoded.txt' : 'decoded.txt';
		a.click();
		URL.revokeObjectURL(url);
	}

	$effect(() => {
		if (!input.startsWith('[File:')) {
			convert();
		}
	});
</script>

<SEO
	title="Base64 Encoder/Decoder"
	description="Encode and decode Base64 strings instantly. Supports standard and URL-safe encoding, file uploads, and download of results."
/>

<div class="tool-page">
	<header class="hero">
		<a href="/tools" class="back-link">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<line x1="19" y1="12" x2="5" y2="12" />
				<polyline points="12 19 5 12 12 5" />
			</svg>
			Back to Tools
		</a>
		<h1><span class="prompt-symbol">$</span> Base64 Encoder/Decoder</h1>
		<p class="tagline">Encode and decode Base64 strings instantly</p>
	</header>

	<div class="main-content">
		<div class="controls">
			<div class="mode-toggle">
				<button
					class="mode-btn"
					class:active={mode === 'encode'}
					onclick={() => {
						mode = 'encode';
						convert();
					}}
				>
					Encode
				</button>
				<button
					class="mode-btn"
					class:active={mode === 'decode'}
					onclick={() => {
						mode = 'decode';
						convert();
					}}
				>
					Decode
				</button>
			</div>

			<label class="checkbox-label">
				<input type="checkbox" bind:checked={urlSafe} onchange={convert} />
				<span>URL-safe</span>
			</label>

			<div class="actions">
				<button class="action-btn" onclick={swap} title="Swap input/output">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<polyline points="17 1 21 5 17 9" />
						<path d="M3 11V9a4 4 0 0 1 4-4h14" />
						<polyline points="7 23 3 19 7 15" />
						<path d="M21 13v2a4 4 0 0 1-4 4H3" />
					</svg>
					Swap
				</button>
				<button class="action-btn" onclick={clear}>
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<line x1="18" y1="6" x2="6" y2="18" />
						<line x1="6" y1="6" x2="18" y2="18" />
					</svg>
					Clear
				</button>
			</div>
		</div>

		<div class="converter">
			<div class="panel">
				<div class="panel-header">
					<span class="panel-title">{mode === 'encode' ? 'Text' : 'Base64'}</span>
					<label class="file-upload">
						<input
							type="file"
							bind:this={fileInput}
							onchange={handleFileUpload}
							style="display: none"
						/>
						<button class="upload-btn" onclick={() => fileInput.click()}>
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
								<polyline points="17 8 12 3 7 8" />
								<line x1="12" y1="3" x2="12" y2="15" />
							</svg>
							Upload File
						</button>
					</label>
				</div>
				{#if fileName && mode === 'encode'}
					<div class="file-badge">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
							<polyline points="14 2 14 8 20 8" />
						</svg>
						{fileName}
					</div>
				{/if}
				<textarea
					bind:value={input}
					placeholder={mode === 'encode'
						? 'Enter text to encode...'
						: 'Enter Base64 to decode...'}
					spellcheck="false"
				></textarea>
				<div class="panel-footer">
					<span class="size">{input.length} characters</span>
				</div>
			</div>

			<div class="arrow">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<line x1="5" y1="12" x2="19" y2="12" />
					<polyline points="12 5 19 12 12 19" />
				</svg>
			</div>

			<div class="panel">
				<div class="panel-header">
					<span class="panel-title">{mode === 'encode' ? 'Base64' : 'Text'}</span>
					<div class="panel-actions">
						<button
							class="icon-btn"
							onclick={copyOutput}
							disabled={!output}
							title="Copy to clipboard"
						>
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
								<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
							</svg>
						</button>
						<button
							class="icon-btn"
							onclick={downloadOutput}
							disabled={!output}
							title="Download"
						>
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
								<polyline points="7 10 12 15 17 10" />
								<line x1="12" y1="15" x2="12" y2="3" />
							</svg>
						</button>
					</div>
				</div>
				<textarea
					value={output}
					placeholder="Output will appear here..."
					readonly
					spellcheck="false"
				></textarea>
				<div class="panel-footer">
					<span class="size">{output.length} characters</span>
					{#if output && mode === 'encode'}
						<span class="ratio">
							({((output.length / Math.max(input.length, 1)) * 100).toFixed(0)}% of original)
						</span>
					{/if}
				</div>
			</div>
		</div>

		{#if error}
			<div class="error">{error}</div>
		{/if}

		<div class="info-cards">
			<div class="info-card">
				<h3>What is Base64?</h3>
				<p>
					Base64 is an encoding scheme that converts binary data into ASCII text. It's commonly
					used for embedding images in HTML/CSS, encoding email attachments, and transmitting
					data in URLs.
				</p>
			</div>
			<div class="info-card">
				<h3>URL-Safe Encoding</h3>
				<p>
					URL-safe Base64 replaces <code>+</code> with <code>-</code> and <code>/</code> with
					<code>_</code>, making it safe to use in URLs and filenames without additional encoding.
				</p>
			</div>
		</div>
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
		margin: 0;
	}

	.main-content {
		max-width: 1000px;
		margin: 0 auto;
	}

	.controls {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		margin-bottom: 1.5rem;
		flex-wrap: wrap;
	}

	.mode-toggle {
		display: flex;
		background: #1a1a24;
		border: 1px solid #2a2a3a;
		border-radius: 8px;
		overflow: hidden;
	}

	.mode-btn {
		padding: 0.6rem 1.2rem;
		background: transparent;
		border: none;
		color: #888;
		font-size: 0.9rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.mode-btn.active {
		background: linear-gradient(135deg, #27ca40 0%, #00d4ff 100%);
		color: #0a0a0f;
		font-weight: 600;
	}

	.checkbox-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: #888;
		font-size: 0.9rem;
		cursor: pointer;
	}

	.checkbox-label input {
		accent-color: #27ca40;
	}

	.actions {
		display: flex;
		gap: 0.75rem;
		margin-left: auto;
	}

	.action-btn {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.5rem 1rem;
		background: #1a1a24;
		border: 1px solid #2a2a3a;
		border-radius: 6px;
		color: #888;
		font-size: 0.85rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.action-btn:hover {
		border-color: #27ca40;
		color: #27ca40;
	}

	.action-btn svg {
		width: 16px;
		height: 16px;
	}

	.converter {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		gap: 1rem;
		align-items: stretch;
	}

	.panel {
		background: linear-gradient(135deg, #1a1a24 0%, #15151f 100%);
		border: 1px solid #2a2a3a;
		border-radius: 12px;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	.panel-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.75rem 1rem;
		border-bottom: 1px solid #2a2a3a;
		background: rgba(0, 0, 0, 0.2);
	}

	.panel-title {
		color: #fff;
		font-size: 0.9rem;
		font-weight: 500;
	}

	.panel-actions {
		display: flex;
		gap: 0.5rem;
	}

	.icon-btn {
		padding: 0.4rem;
		background: transparent;
		border: 1px solid #2a2a3a;
		border-radius: 6px;
		color: #888;
		cursor: pointer;
		transition: all 0.2s;
	}

	.icon-btn:hover:not(:disabled) {
		border-color: #27ca40;
		color: #27ca40;
	}

	.icon-btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.icon-btn svg {
		width: 16px;
		height: 16px;
		display: block;
	}

	.upload-btn {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.4rem 0.75rem;
		background: transparent;
		border: 1px solid #2a2a3a;
		border-radius: 6px;
		color: #888;
		font-size: 0.8rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.upload-btn:hover {
		border-color: #27ca40;
		color: #27ca40;
	}

	.upload-btn svg {
		width: 14px;
		height: 14px;
	}

	.file-badge {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		background: rgba(39, 202, 64, 0.1);
		border-bottom: 1px solid #2a2a3a;
		color: #27ca40;
		font-size: 0.85rem;
	}

	.file-badge svg {
		width: 16px;
		height: 16px;
	}

	.panel textarea {
		flex: 1;
		min-height: 200px;
		padding: 1rem;
		background: transparent;
		border: none;
		color: #fff;
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
		font-size: 0.9rem;
		line-height: 1.5;
		resize: vertical;
	}

	.panel textarea:focus {
		outline: none;
	}

	.panel textarea::placeholder {
		color: #555;
	}

	.panel-footer {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.5rem 1rem;
		border-top: 1px solid #2a2a3a;
		background: rgba(0, 0, 0, 0.2);
	}

	.size {
		font-size: 0.75rem;
		color: #666;
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
	}

	.ratio {
		font-size: 0.75rem;
		color: #27ca40;
	}

	.arrow {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 0.5rem;
	}

	.arrow svg {
		width: 24px;
		height: 24px;
		color: #444;
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

	.info-cards {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
		margin-top: 2rem;
	}

	.info-card {
		background: linear-gradient(135deg, #1a1a24 0%, #15151f 100%);
		border: 1px solid #2a2a3a;
		border-radius: 12px;
		padding: 1.25rem;
	}

	.info-card h3 {
		color: #fff;
		font-size: 1rem;
		margin: 0 0 0.75rem;
	}

	.info-card p {
		color: #888;
		font-size: 0.9rem;
		line-height: 1.5;
		margin: 0;
	}

	.info-card code {
		background: #0a0a0f;
		padding: 0.15em 0.4em;
		border-radius: 4px;
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
		font-size: 0.85em;
		color: #27ca40;
	}

	@media (max-width: 768px) {
		.tool-page {
			padding: 1rem;
		}

		.hero h1 {
			font-size: 1.75rem;
		}

		.controls {
			flex-direction: column;
			align-items: stretch;
		}

		.actions {
			margin-left: 0;
			justify-content: center;
		}

		.converter {
			grid-template-columns: 1fr;
		}

		.arrow {
			transform: rotate(90deg);
			padding: 0.5rem 0;
		}

		.info-cards {
			grid-template-columns: 1fr;
		}
	}
</style>
