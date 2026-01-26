<script lang="ts">
	import { SITE_URL, SITE_TITLE, AUTHOR } from '$lib/config';
	import { page } from '$app/stores';

	interface Props {
		title?: string;
		description?: string;
		image?: string;
		type?: 'website' | 'article';
		publishedTime?: string;
		modifiedTime?: string;
		tags?: string[];
	}

	let {
		title = SITE_TITLE,
		description = '',
		image = '/og-image.png',
		type = 'website',
		publishedTime,
		modifiedTime,
		tags = []
	}: Props = $props();

	const canonicalUrl = $derived(`${SITE_URL}${$page.url.pathname}`);
	const imageUrl = $derived(image.startsWith('http') ? image : `${SITE_URL}${image}`);
	const fullTitle = $derived(title === SITE_TITLE ? title : `${title} | ${SITE_TITLE}`);
</script>

<svelte:head>
	<!-- Primary Meta Tags -->
	<title>{fullTitle}</title>
	<meta name="title" content={fullTitle} />
	<meta name="description" content={description} />
	<meta name="author" content={AUTHOR} />
	<link rel="canonical" href={canonicalUrl} />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content={type} />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={imageUrl} />
	<meta property="og:site_name" content={SITE_TITLE} />
	<meta property="og:locale" content="en_US" />

	{#if type === 'article' && publishedTime}
		<meta property="article:published_time" content={publishedTime} />
		{#if modifiedTime}
			<meta property="article:modified_time" content={modifiedTime} />
		{/if}
		<meta property="article:author" content={AUTHOR} />
		{#each tags as tag}
			<meta property="article:tag" content={tag} />
		{/each}
	{/if}

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content={canonicalUrl} />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={imageUrl} />
	<meta name="twitter:creator" content="@alprimak" />
</svelte:head>
