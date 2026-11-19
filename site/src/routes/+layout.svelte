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
		tick().then(() => (document.documentElement.dataset.ready = ''));
	});

	const nav = $derived(neighbors(page.url.pathname));
	const hasNav = $derived(Boolean(nav.back || nav.next));
</script>

<svelte:head>
	<link rel="preload" href="/fonts/Forum-Regular.woff2" as="font" type="font/woff2" crossorigin="anonymous" />
</svelte:head>

<div class:with-nav={hasNav}>
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


	/* Pills occupy 1.25rem to 4.5rem from the bottom; the footer's own bottom padding supplies the clear space above them. */
	.with-nav {
		padding-bottom: calc(3.5rem + env(safe-area-inset-bottom));
	}
</style>
