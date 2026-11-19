<script lang="ts">
	import TopBar from '#lib/components/TopBar.svelte';
	import LectureBlock from '#lib/components/LectureBlock.svelte';
	import SiteFooter from '#lib/components/SiteFooter.svelte';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const week = $derived(data.week);
	const subtitle = $derived(week.lectures.map((l) => l.title).join(' · '));
</script>

<svelte:head>
	<title>Week {week.n} materials | CS 221M</title>
</svelte:head>

<TopBar storyId={week.storyId} />

<main>
	<header>
		<h1>Week {week.n}</h1>
		<p class="lectures">{subtitle}</p>
		<p class="back"><a href="/week/{week.n}"><ArrowLeft size="1em" strokeWidth={1.75} aria-hidden="true" /> Week {week.n} lead-in</a></p>
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
		padding: 5.5rem 0 0;
	}

	header {
		width: min(var(--content), 100% - 2rem);
		margin: 0 auto;
		text-align: center;
	}

	h1 {
		font-size: clamp(2.6rem, 7vw, 4rem);
	}

	.lectures {
		margin: 0.75rem 0 0;
		font-family: var(--font-sub);
		font-size: 1.1rem;
		line-height: 1.5;
		color: var(--muted);
	}

	.back {
		margin: 0.9rem 0 0;
		font-family: var(--font-sub);
		font-size: 0.95rem;
		font-weight: 600;
	}

	.back a {
		text-decoration: none;
		display: inline-flex;
		align-items: center;
		gap: 0.35em;
	}

	.back a:hover {
		text-decoration: underline;
		text-underline-offset: 0.2em;
	}

	.blocks {
		width: min(var(--content), 100% - 2rem);
		margin: 2.5rem auto 0;
	}
</style>
