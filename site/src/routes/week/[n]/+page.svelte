<script lang="ts">
	import LeadIn from '#lib/components/LeadIn.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const week = $derived(data.week);
	const subtitle = $derived(week.lectures.map((l) => l.title).join(' · '));
</script>

<svelte:head>
	<title>Week {week.n} | CS 221M</title>
</svelte:head>

<LeadIn storyId={week.storyId} html={data.html}>
	{#snippet header()}
		<h1>Week {week.n}</h1>
		<p class="lectures">{subtitle}</p>
		<p class="materials"><a href="/week/{week.n}/materials">Go to materials <span aria-hidden="true">&rarr;</span></a></p>
	{/snippet}
</LeadIn>

<style>
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

	.materials {
		margin: 0.9rem 0 0;
		font-family: var(--font-sub);
		font-size: 0.95rem;
		font-weight: 600;
	}

	.materials a {
		text-decoration: none;
	}

	.materials a:hover {
		text-decoration: underline;
		text-underline-offset: 0.2em;
	}
</style>
