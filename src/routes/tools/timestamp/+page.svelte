<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	let timestamp = $state(Math.floor(Date.now() / 1000));
	let milliseconds = $state(false);
	let dateInput = $state('');
	let timeInput = $state('');
	let timezone = $state(Intl.DateTimeFormat().resolvedOptions().timeZone);
	let currentTime = $state(Math.floor(Date.now() / 1000));

	const commonTimezones = [
		'UTC',
		'America/New_York',
		'America/Chicago',
		'America/Denver',
		'America/Los_Angeles',
		'Europe/London',
		'Europe/Paris',
		'Europe/Berlin',
		'Asia/Tokyo',
		'Asia/Shanghai',
		'Asia/Singapore',
		'Australia/Sydney'
	];

	function getDateFromTimestamp(ts: number): Date {
		return new Date(milliseconds ? ts : ts * 1000);
	}

	function formatDate(date: Date, tz: string): string {
		return date.toLocaleDateString('en-CA', { timeZone: tz });
	}

	function formatTime(date: Date, tz: string): string {
		return date.toLocaleTimeString('en-GB', { timeZone: tz, hour12: false });
	}

	function formatFull(date: Date, tz: string): string {
		return date.toLocaleString('en-US', {
			timeZone: tz,
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			hour12: true
		});
	}

	function formatISO(date: Date): string {
		return date.toISOString();
	}

	function formatRelative(date: Date): string {
		const now = Date.now();
		const diff = date.getTime() - now;
		const absDiff = Math.abs(diff);

		const seconds = Math.floor(absDiff / 1000);
		const minutes = Math.floor(seconds / 60);
		const hours = Math.floor(minutes / 60);
		const days = Math.floor(hours / 24);
		const months = Math.floor(days / 30);
		const years = Math.floor(days / 365);

		let value: number;
		let unit: string;

		if (years > 0) {
			value = years;
			unit = years === 1 ? 'year' : 'years';
		} else if (months > 0) {
			value = months;
			unit = months === 1 ? 'month' : 'months';
		} else if (days > 0) {
			value = days;
			unit = days === 1 ? 'day' : 'days';
		} else if (hours > 0) {
			value = hours;
			unit = hours === 1 ? 'hour' : 'hours';
		} else if (minutes > 0) {
			value = minutes;
			unit = minutes === 1 ? 'minute' : 'minutes';
		} else {
			value = seconds;
			unit = seconds === 1 ? 'second' : 'seconds';
		}

		if (diff < 0) {
			return `${value} ${unit} ago`;
		} else if (diff > 0) {
			return `in ${value} ${unit}`;
		}
		return 'now';
	}

	function updateFromDateTime() {
		if (!dateInput || !timeInput) return;
		const dateTimeStr = `${dateInput}T${timeInput}`;
		const date = new Date(dateTimeStr);
		if (!isNaN(date.getTime())) {
			timestamp = milliseconds
				? date.getTime()
				: Math.floor(date.getTime() / 1000);
		}
	}

	function setNow() {
		const now = Date.now();
		timestamp = milliseconds ? now : Math.floor(now / 1000);
	}

	function copyTimestamp() {
		navigator.clipboard.writeText(timestamp.toString());
	}

	function copyISO() {
		navigator.clipboard.writeText(formatISO(getDateFromTimestamp(timestamp)));
	}

	$effect(() => {
		const date = getDateFromTimestamp(timestamp);
		dateInput = formatDate(date, timezone);
		timeInput = formatTime(date, timezone);
	});

	$effect(() => {
		const interval = setInterval(() => {
			currentTime = Math.floor(Date.now() / 1000);
		}, 1000);
		return () => clearInterval(interval);
	});
</script>

<SEO
	title="Unix Timestamp Converter"
	description="Convert Unix timestamps to human-readable dates and vice versa. Supports seconds and milliseconds, multiple timezones, ISO 8601 output, and relative time display."
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
		<h1><span class="prompt-symbol">$</span> Unix Timestamp Converter</h1>
		<p class="tagline">Convert between Unix timestamps and human-readable dates</p>
	</header>

	<div class="main-content">
		<div class="current-time-card">
			<span class="label">Current Unix Time:</span>
			<span class="time">{currentTime}</span>
			<span class="label-small">(updates live)</span>
		</div>

		<div class="converter-grid">
			<div class="panel timestamp-panel">
				<h2>Unix Timestamp</h2>
				<div class="timestamp-input-group">
					<input
						type="number"
						bind:value={timestamp}
						class="timestamp-input"
					/>
					<div class="timestamp-actions">
						<button class="icon-btn" onclick={copyTimestamp} title="Copy timestamp">
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
								<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
							</svg>
						</button>
						<button class="now-btn" onclick={setNow}>Now</button>
					</div>
				</div>
				<label class="checkbox-label">
					<input
						type="checkbox"
						bind:checked={milliseconds}
						onchange={() => {
							if (milliseconds) {
								timestamp = timestamp * 1000;
							} else {
								timestamp = Math.floor(timestamp / 1000);
							}
						}}
					/>
					<span>Milliseconds</span>
				</label>
			</div>

			<div class="panel datetime-panel">
				<h2>Date & Time</h2>
				<div class="datetime-inputs">
					<div class="input-group">
						<label for="date-input">Date</label>
						<input id="date-input" type="date" bind:value={dateInput} onchange={updateFromDateTime} />
					</div>
					<div class="input-group">
						<label for="time-input">Time</label>
						<input id="time-input" type="time" bind:value={timeInput} step="1" onchange={updateFromDateTime} />
					</div>
					<div class="input-group">
						<label for="timezone-select">Timezone</label>
						<select id="timezone-select" bind:value={timezone}>
							{#each commonTimezones as tz}
								<option value={tz}>{tz.replace(/_/g, ' ')}</option>
							{/each}
						</select>
					</div>
				</div>
			</div>
		</div>

		<div class="results-panel">
			<h2>Formatted Output</h2>
			<div class="results-grid">
				<div class="result-item">
					<span class="result-label">Local Time ({timezone})</span>
					<span class="result-value">{formatFull(getDateFromTimestamp(timestamp), timezone)}</span>
				</div>
				<div class="result-item">
					<span class="result-label">UTC</span>
					<span class="result-value">{formatFull(getDateFromTimestamp(timestamp), 'UTC')}</span>
				</div>
				<div class="result-item">
					<span class="result-label">ISO 8601</span>
					<div class="result-value-group">
						<span class="result-value mono">{formatISO(getDateFromTimestamp(timestamp))}</span>
						<button class="icon-btn small" onclick={copyISO} title="Copy ISO">
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
								<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
							</svg>
						</button>
					</div>
				</div>
				<div class="result-item">
					<span class="result-label">Relative</span>
					<span class="result-value accent">{formatRelative(getDateFromTimestamp(timestamp))}</span>
				</div>
			</div>
		</div>

		<div class="info-section">
			<h3>Common Timestamps</h3>
			<div class="timestamps-list">
				<button class="timestamp-btn" onclick={() => (timestamp = 0)}>
					<span class="ts">0</span>
					<span class="desc">Unix Epoch (Jan 1, 1970)</span>
				</button>
				<button class="timestamp-btn" onclick={() => (timestamp = 1000000000)}>
					<span class="ts">1000000000</span>
					<span class="desc">Sep 9, 2001 (billennium)</span>
				</button>
				<button class="timestamp-btn" onclick={() => (timestamp = 2147483647)}>
					<span class="ts">2147483647</span>
					<span class="desc">Jan 19, 2038 (Y2K38)</span>
				</button>
				<button class="timestamp-btn" onclick={() => (timestamp = Math.floor(Date.now() / 1000) + 86400)}>
					<span class="ts">{Math.floor(Date.now() / 1000) + 86400}</span>
					<span class="desc">Tomorrow</span>
				</button>
			</div>
		</div>

		<div class="seo-content">
			<h2>Unix Timestamp Conversion</h2>
			<p>The Unix Timestamp Converter translates between Unix epoch timestamps and human-readable dates in real time. It supports both second and millisecond precision, 12 common timezones, and outputs in multiple formats including ISO 8601, local time, UTC, and relative time (e.g., "3 days ago").</p>
			<p>Use the built-in reference timestamps to quickly jump to notable dates like the Unix epoch (January 1, 1970), the billennium (September 9, 2001), the Y2K38 problem date, or tomorrow's timestamp. The live counter shows the current Unix time updating every second.</p>
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
		max-width: 900px;
		margin: 0 auto;
	}

	.current-time-card {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		background: linear-gradient(135deg, #1a1a24 0%, #15151f 100%);
		border: 1px solid #2a2a3a;
		border-radius: 12px;
		padding: 1rem 1.5rem;
		margin-bottom: 1.5rem;
	}

	.current-time-card .label {
		color: #888;
		font-size: 0.9rem;
	}

	.current-time-card .time {
		color: #27ca40;
		font-size: 1.5rem;
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
		font-weight: 600;
	}

	.current-time-card .label-small {
		color: #555;
		font-size: 0.8rem;
	}

	.converter-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1.5rem;
		margin-bottom: 1.5rem;
	}

	.panel {
		background: linear-gradient(135deg, #1a1a24 0%, #15151f 100%);
		border: 1px solid #2a2a3a;
		border-radius: 12px;
		padding: 1.5rem;
	}

	.panel h2 {
		color: #fff;
		font-size: 1rem;
		margin: 0 0 1rem;
		font-weight: 500;
	}

	.timestamp-input-group {
		display: flex;
		gap: 0.75rem;
		margin-bottom: 1rem;
	}

	.timestamp-input {
		flex: 1;
		background: #0a0a0f;
		border: 1px solid #2a2a3a;
		border-radius: 8px;
		padding: 0.75rem 1rem;
		color: #fff;
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
		font-size: 1.1rem;
		transition: border-color 0.2s;
	}

	.timestamp-input:focus {
		outline: none;
		border-color: #27ca40;
	}

	.timestamp-actions {
		display: flex;
		gap: 0.5rem;
	}

	.icon-btn {
		padding: 0.5rem;
		background: #0a0a0f;
		border: 1px solid #2a2a3a;
		border-radius: 6px;
		color: #888;
		cursor: pointer;
		transition: all 0.2s;
	}

	.icon-btn:hover {
		border-color: #27ca40;
		color: #27ca40;
	}

	.icon-btn svg {
		width: 18px;
		height: 18px;
		display: block;
	}

	.icon-btn.small {
		padding: 0.3rem;
	}

	.icon-btn.small svg {
		width: 14px;
		height: 14px;
	}

	.now-btn {
		padding: 0.5rem 1rem;
		background: linear-gradient(135deg, #27ca40 0%, #00d4ff 100%);
		border: none;
		border-radius: 6px;
		color: #0a0a0f;
		font-weight: 600;
		font-size: 0.9rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.now-btn:hover {
		transform: translateY(-1px);
		box-shadow: 0 4px 16px rgba(39, 202, 64, 0.3);
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

	.datetime-inputs {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.input-group {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.input-group label {
		color: #888;
		font-size: 0.8rem;
	}

	.input-group input,
	.input-group select {
		background: #0a0a0f;
		border: 1px solid #2a2a3a;
		border-radius: 6px;
		padding: 0.6rem 0.75rem;
		color: #fff;
		font-size: 0.9rem;
		transition: border-color 0.2s;
	}

	.input-group input:focus,
	.input-group select:focus {
		outline: none;
		border-color: #27ca40;
	}

	.results-panel {
		background: linear-gradient(135deg, #1a1a24 0%, #15151f 100%);
		border: 1px solid #2a2a3a;
		border-radius: 12px;
		padding: 1.5rem;
		margin-bottom: 1.5rem;
	}

	.results-panel h2 {
		color: #fff;
		font-size: 1rem;
		margin: 0 0 1rem;
		font-weight: 500;
	}

	.results-grid {
		display: grid;
		gap: 1rem;
	}

	.result-item {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid #2a2a3a;
	}

	.result-item:last-child {
		padding-bottom: 0;
		border-bottom: none;
	}

	.result-label {
		color: #888;
		font-size: 0.8rem;
	}

	.result-value {
		color: #fff;
		font-size: 0.95rem;
	}

	.result-value.mono {
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
		font-size: 0.85rem;
	}

	.result-value.accent {
		color: #27ca40;
		font-weight: 500;
	}

	.result-value-group {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.info-section {
		background: linear-gradient(135deg, #1a1a24 0%, #15151f 100%);
		border: 1px solid #2a2a3a;
		border-radius: 12px;
		padding: 1.5rem;
	}

	.info-section h3 {
		color: #fff;
		font-size: 1rem;
		margin: 0 0 1rem;
		font-weight: 500;
	}

	.timestamps-list {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.75rem;
	}

	.timestamp-btn {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		padding: 0.75rem 1rem;
		background: #0a0a0f;
		border: 1px solid #2a2a3a;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s;
		text-align: left;
	}

	.timestamp-btn:hover {
		border-color: #27ca40;
	}

	.timestamp-btn .ts {
		color: #27ca40;
		font-family: 'JetBrains Mono', 'Fira Code', monospace;
		font-size: 0.9rem;
	}

	.timestamp-btn .desc {
		color: #888;
		font-size: 0.8rem;
	}

	@media (max-width: 768px) {
		.tool-page {
			padding: 1rem;
		}

		.hero h1 {
			font-size: 1.75rem;
		}

		.current-time-card {
			flex-direction: column;
			gap: 0.5rem;
		}

		.converter-grid {
			grid-template-columns: 1fr;
		}

		.timestamp-input-group {
			flex-direction: column;
		}

		.timestamp-actions {
			justify-content: flex-end;
		}

		.timestamps-list {
			grid-template-columns: 1fr;
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
