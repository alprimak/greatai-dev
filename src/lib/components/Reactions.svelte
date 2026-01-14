<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	let { slug }: { slug: string } = $props();

	let likes = $state(0);
	let existingVote = $state<string | null>(null);
	let loading = $state(true);

	onMount(async () => {
		const storageKey = `reaction:${slug}`;
		existingVote = localStorage.getItem(storageKey);

		try {
			const res = await fetch(`/api/reactions/${slug}`);
			if (res.ok) {
				const data = await res.json();
				likes = data.likes ?? 0;
			}
		} catch (e) {
			console.error('Failed to fetch reactions:', e);
		}
		loading = false;
	});

	async function handleReaction(type: 'like' | 'dislike') {
		if (!browser || existingVote) return;

		const storageKey = `reaction:${slug}`;

		try {
			const res = await fetch(`/api/reactions/${slug}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ type })
			});

			if (res.ok) {
				localStorage.setItem(storageKey, type);
				existingVote = type;

				if (type === 'like') {
					const data = await res.json();
					if (data.likes !== undefined) {
						likes = data.likes;
					}
				}
			}
		} catch (e) {
			console.error('Failed to submit reaction:', e);
		}
	}
</script>

<div class="reactions">
	<button
		class="reaction-btn like-btn"
		class:voted={existingVote === 'like'}
		disabled={!!existingVote}
		onclick={() => handleReaction('like')}
		aria-label="Like this article"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<path d="M7 10v12"></path>
			<path
				d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"
			></path>
		</svg>
		<span class="like-count">{loading ? '...' : likes}</span>
	</button>
	<button
		class="reaction-btn dislike-btn"
		class:voted={existingVote === 'dislike'}
		disabled={!!existingVote}
		onclick={() => handleReaction('dislike')}
		aria-label="Dislike this article"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<path d="M17 14V2"></path>
			<path
				d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z"
			></path>
		</svg>
	</button>
</div>

<style>
	.reactions {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin: 2rem 0;
		padding: 1rem;
		border-radius: 8px;
		background: var(--reactions-bg, #f5f5f5);
	}

	:global(.dark) .reactions {
		--reactions-bg: #1a1a2e;
	}

	.reaction-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		border: 1px solid var(--btn-border, #ddd);
		border-radius: 6px;
		background: var(--btn-bg, white);
		color: var(--btn-color, #333);
		cursor: pointer;
		transition: all 0.2s ease;
		font-size: 0.9rem;
	}

	:global(.dark) .reaction-btn {
		--btn-bg: #252542;
		--btn-border: #3a3a5c;
		--btn-color: #e0e0e0;
	}

	.reaction-btn:hover:not(:disabled) {
		border-color: var(--btn-hover-border, #999);
		transform: translateY(-1px);
	}

	.reaction-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.like-btn.voted {
		border-color: #22c55e;
		background: #dcfce7;
	}

	:global(.dark) .like-btn.voted {
		border-color: #22c55e;
		background: rgba(20, 83, 45, 0.2);
	}

	.dislike-btn.voted {
		border-color: #ef4444;
		background: #fee2e2;
	}

	:global(.dark) .dislike-btn.voted {
		border-color: #ef4444;
		background: rgba(127, 29, 29, 0.2);
	}

	.like-count {
		font-weight: 500;
		min-width: 1.5rem;
	}
</style>
