<script lang="ts">
	import { inject } from '@vercel/analytics';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import posthog from 'posthog-js';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import '../app.css';

	inject();

	if (browser) {
		posthog.init('phc_nRxzcAz73mv2goLrrjnsad2r6zmmJh94pTER2I1cXvw', {
			api_host: 'https://us.i.posthog.com',
			person_profiles: 'identified_only',
			capture_pageview: false,
			capture_pageleave: true
		});

		// Track page views on SPA navigation
		page.subscribe(($page) => {
			if ($page.url) {
				posthog.capture('$pageview', {
					$current_url: $page.url.href
				});
			}
		});
	}

	let { children } = $props();
</script>

<Header />
{@render children()}
<Footer />
