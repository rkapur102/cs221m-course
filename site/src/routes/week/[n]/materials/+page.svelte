<script lang="ts">
	import TopBar from '#lib/components/TopBar.svelte';
	import LectureBlock from '#lib/components/LectureBlock.svelte';
	import SiteFooter from '#lib/components/SiteFooter.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const week = $derived(data.week);
</script>

<svelte:head>
	<title>Week {week.n}: Materials | CS 221M</title>
</svelte:head>

<TopBar storyId={week.storyId} />

<main>
	<header>
		<h1>Week {week.n}</h1>
	</header>

	<div class="blocks">
		{#each week.lectures as lecture (lecture.num)}
			<LectureBlock {lecture} />
		{/each}
	</div>
</main>

<SiteFooter />

<style>
	main {
		padding: var(--page-top) 0 0;
	}

	header {
		width: min(var(--content), 100% - 2rem);
		margin: 0 auto;
		text-align: center;
	}

	h1 {
		font-size: clamp(2.6rem, 7vw, 4rem);
	}

	.blocks {
		width: min(var(--content), 100% - 2rem);
		margin: 2.5rem auto 0;
	}
</style>
