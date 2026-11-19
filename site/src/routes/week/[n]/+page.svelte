<script lang="ts">
	import { onMount } from 'svelte';
	import Trajectory from '#lib/trajectory/Trajectory.svelte';
	import { animate } from '../../../lib/trajectory/animate';
	import { pathGradients } from '../../../lib/trajectory/palette';
	import Prose from '#lib/components/Prose.svelte';
	import SiteFooter from '#lib/components/SiteFooter.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const week = $derived(data.week);

	const DRAW_MS = 2000;
	let draw = $state(0);
	let done = $state(false);
	let controller: AbortController | undefined;

	function skip() {
		controller?.abort();
	}

	// Restart the draw-in whenever the week changes.
	$effect(() => {
		void week.n;
		draw = 0;
		done = false;
		const c = new AbortController();
		controller = c;
		animate(DRAW_MS, (t) => (draw = t), { signal: c.signal }).then(() => {
			if (controller === c) done = true;
		});
		return () => c.abort();
	});

	onMount(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.metaKey || e.ctrlKey || e.altKey) return;
			skip();
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	});

	const subtitle = $derived(week.lectures.map((l) => l.title).join(' · '));
</script>

<svelte:head>
	<title>Week {week.n} | CS 221M</title>
</svelte:head>

<main>
	<header>
		<h1>Week {week.n}</h1>
		<p class="lectures">{subtitle}</p>
		<p class="materials"><a href="/week/{week.n}/materials">Go to materials <span aria-hidden="true">&rarr;</span></a></p>
	</header>

	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="stage" onpointerdown={skip}>
		<Trajectory
			storyIds={[week.storyId]}
			{draw}
			gradients={[pathGradients[(week.n - 1) % pathGradients.length]]}
			idle={done}
		/>
	</div>

	<div class="essay" class:shown={done}>
		<Prose html={data.html} />
	</div>
</main>

<SiteFooter />

<style>
	main {
		padding: 5.5rem 1rem 0;
	}

	header {
		max-width: 44rem;
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

	.stage {
		width: min(100%, 44rem);
		aspect-ratio: 4 / 3;
		margin: 1.5rem auto 2rem;
	}

	@media (max-width: 640px) {
		.stage {
			aspect-ratio: 1;
		}
	}

	.essay {
		opacity: 0;
		transform: translateY(10px);
		transition:
			opacity 800ms ease,
			transform 800ms ease;
	}

	.essay.shown {
		opacity: 1;
		transform: none;
	}

	@media (prefers-reduced-motion: reduce) {
		.essay {
			transition: none;
		}
	}
</style>
