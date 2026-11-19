<script lang="ts">
	import '../app.css';
	import type { LayoutProps } from './$types';
	import { page } from '$app/state';
	import { neighbors } from '../lib/sequence';
	import PageNav from '../lib/components/PageNav.svelte';
	import ViewToggle from '../lib/components/ViewToggle.svelte';
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

	const nav = $derived(neighbors(page.url.pathname));
	const hasNav = $derived(Boolean(nav.back || nav.next));
</script>

<svelte:head>
	<link rel="preload" href="/fonts/Forum-Regular.woff2" as="font" type="font/woff2" crossorigin="anonymous" />
</svelte:head>

<div class="page" class:with-nav={hasNav}>
	{@render children()}
</div>

{#if page.url.pathname === '/'}
	<div class="home-toggle"><ViewToggle /></div>
{/if}

{#if hasNav}
	<PageNav />
{/if}

<style>
	/* The homepage has no top bar; the toggle sits where the bar's last item would. */
	.home-toggle {
		position: absolute;
		top: 0.9rem;
		right: 1.5rem;
		z-index: 15;
	}

	@media (max-width: 40rem) {
		.home-toggle {
			right: 1rem;
		}
	}

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

	/* Back/Next float 1.25rem from the bottom, about 2.5rem tall. This band, plus the footer's own bottom padding, keeps them clear of footer text. */
	.with-nav {
		padding-bottom: calc(3.5rem + env(safe-area-inset-bottom));
	}
</style>
