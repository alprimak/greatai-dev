<script lang="ts">
	import { inject } from '@vercel/analytics';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import '../app.css';

	inject();

	let { children } = $props();
</script>

<Header />
{@render children()}
<Footer />
