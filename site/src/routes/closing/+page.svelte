<script lang="ts">
	import LeadIn from '#lib/components/LeadIn.svelte';
	import { bridgingHtml } from '../../lib/bridging';
	import { closing, courseStoryId, progressFor } from '../../lib/course';

	const html = bridgingHtml(closing.bridging);
</script>

<svelte:head>
	<title>Closing | CS 221M</title>
</svelte:head>

<LeadIn
	storyId={courseStoryId}
	{html}
	progress={progressFor('closing')}
	markerLabel="The end!"
	markerColor="#eab651"
	markerRing="#8c1515"
>
	{#snippet header()}
		<h1>Closing</h1>
		<p class="done">You've reached the end of the course!</p>
	{/snippet}
</LeadIn>

<style>
	h1 {
		font-size: clamp(2.6rem, 7vw, 4rem);
	}

	.done {
		margin: 0.75rem 0 0;
		font-family: var(--font-sub);
		font-size: 1.1rem;
		line-height: 1.5;
		color: var(--muted);
	}
</style>
