<script lang="ts">
	import { SITE_TITLE, SITE_DESCRIPTION } from '$lib/config';

	let { data } = $props();

	function formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>Blog | {SITE_TITLE}</title>
	<meta name="description" content={SITE_DESCRIPTION} />
</svelte:head>

<main>
	<section>
		<ul>
			{#each data.posts as post}
				<li>
					<a href="/blog/{post.slug}">
						<h3 class="title">{post.metadata.title}</h3>
						<p class="description">{post.metadata.description}</p>
						<div class="meta">
							<p class="date">{formatDate(post.metadata.pubDate)}</p>
							{#if post.metadata.tags && post.metadata.tags.length > 0}
								<div class="tags">
									{#each post.metadata.tags as tag}
										<span class="tag">{tag}</span>
									{/each}
								</div>
							{/if}
						</div>
					</a>
				</li>
			{/each}
		</ul>
	</section>
</main>

<style>
	main {
		width: 960px;
		max-width: calc(100% - 2em);
		margin: auto;
		padding: 3em 1em;
	}
	ul {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		list-style-type: none;
		margin: 0;
		padding: 0;
	}
	ul li {
		width: 100%;
	}
	ul li a {
		display: block;
		padding: 1.5rem;
		background: var(--bg-secondary);
		border-radius: 12px;
		text-decoration: none;
		transition: all 0.2s ease;
		border: 1px solid rgba(var(--gray), 0.2);
	}
	ul li a:hover {
		border-color: rgb(var(--accent));
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(var(--gray), 0.15);
	}
	.title {
		margin: 0 0 0.5rem 0;
		color: rgb(var(--black));
		font-size: 1.5rem;
		font-weight: 600;
		line-height: 1.3;
	}
	.description {
		margin: 0 0 0.75rem 0;
		color: rgb(var(--gray));
		font-size: 1rem;
		line-height: 1.5;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	.meta {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
	}
	.date {
		margin: 0;
		color: rgb(var(--gray));
		font-size: 0.875rem;
	}
	.tags {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}
	.tag {
		font-size: 0.75rem;
		padding: 0.25rem 0.5rem;
		background: rgba(var(--accent), 0.1);
		color: rgb(var(--accent));
		border-radius: 4px;
	}
	ul li a:hover .title {
		color: rgb(var(--accent));
	}
	@media (max-width: 720px) {
		ul {
			gap: 1rem;
		}
		ul li a {
			padding: 1rem;
		}
		.title {
			font-size: 1.25rem;
		}
	}
</style>
