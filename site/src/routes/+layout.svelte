<script lang="ts">
	import '../app.css';
	import type { LayoutProps } from './$types';
	import { page } from '$app/state';
	import { neighbors } from '../lib/sequence';
	import PageNav from '../lib/components/PageNav.svelte';

	let { children }: LayoutProps = $props();

	const nav = $derived(neighbors(page.url.pathname));
	const hasNav = $derived(Boolean(nav.back || nav.next));
</script>

<svelte:head>
	<link rel="preload" href="/fonts/Forum-Regular.woff2" as="font" type="font/woff2" crossorigin="anonymous" />
</svelte:head>

<div class:with-nav={hasNav}>
	{@render children()}
</div>

{#if hasNav}
	<PageNav />
{/if}

<style>
	.with-nav {
		padding-bottom: calc(4.5rem + env(safe-area-inset-bottom));
	}
</style>
