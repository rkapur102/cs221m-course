<script lang="ts">
	import '../app.css';
	import type { LayoutProps } from './$types';
	import { page } from '$app/state';
	import { href, sitePath } from '../lib/paths';
	import { neighbors } from '../lib/sequence';
	import PageNav from '../lib/components/PageNav.svelte';
	import { loadView } from '../lib/view.svelte.ts';
	import { onMount, tick } from 'svelte';

	let { children }: LayoutProps = $props();

	onMount(() => {
		loadView();
		// Reveal once the enrolled content has been rendered (see the script in app.html).
		tick().then(() => {
			// Enrolled-only sections are not in the prerendered HTML, so the browser's own
			// fragment scroll misses them; scroll once they exist.
			if (location.hash) document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView();
			document.documentElement.dataset.ready = '';
		});
	});

	const nav = $derived(neighbors(sitePath(page.url.pathname)));
	const hasNav = $derived(Boolean(nav.back || nav.next));
</script>

<svelte:head>
	{#if import.meta.env.VITE_NOINDEX === '1'}
		<!-- Temporary preview: keep search engines out. -->
		<meta name="robots" content="noindex, nofollow" />
	{/if}
	<link rel="preload" href={href('/fonts/Forum-Regular.woff2')} as="font" type="font/woff2" crossorigin="anonymous" />
</svelte:head>

<div class="page" class:with-nav={hasNav}>
	{@render children()}
</div>

{#if hasNav}
	<PageNav />
{/if}

<style>
	/* Sticky footer: the page fills the viewport and the footer takes the leftover space above it. */
	.page {
		display: flex;
		flex-direction: column;
		min-height: 100dvh;
		box-sizing: border-box;
	}

	.page > :global(main) {
		margin-bottom: 5rem;
	}

	.page > :global(.site-footer) {
		margin-top: auto;
	}

	/* The navigator floats 1.25rem from the bottom, about 2.5rem tall. This band, plus the footer's own bottom padding, keeps them clear of footer text. */
	.with-nav {
		padding-bottom: calc(3.5rem + env(safe-area-inset-bottom));
	}
</style>
