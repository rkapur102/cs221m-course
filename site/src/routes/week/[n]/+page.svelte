<script lang="ts">
	import LeadIn from '#lib/components/LeadIn.svelte';
	import LectureList from '#lib/components/LectureList.svelte';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import { progressFor, weeks } from '../../../lib/course';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const week = $derived(data.week);
</script>

<svelte:head>
	<title>Week {week.n} | CS 221M</title>
</svelte:head>

<LeadIn
	storyId={week.storyId}
	html={data.html}
	progress={progressFor(week.n)}
	markerLabel="Week {week.n} of {weeks.length}"
>
	{#snippet header()}
		<h1>Week {week.n}</h1>
		<LectureList lectures={week.lectures} />
	{/snippet}
	{#snippet footer()}
		<p class="cta">
			<a class="btn-quiet" href="/week/{week.n}/materials">
				Go to Week {week.n}: Materials <ArrowRight size="1em" strokeWidth={1.75} aria-hidden="true" />
			</a>
		</p>
	{/snippet}
</LeadIn>

<style>
	h1 {
		font-size: clamp(2.6rem, 7vw, 4rem);
	}

	.cta {
		width: min(var(--content), 100% - 2 * var(--gutter));
		margin: 2.5rem auto 0;
		text-align: center;
	}
</style>
