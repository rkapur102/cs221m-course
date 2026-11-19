<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import Trajectory from '#lib/trajectory/Trajectory.svelte';
	import { animate } from '../trajectory/animate';
	import { pathGradients } from '../trajectory/palette';
	import TopBar from './TopBar.svelte';
	import Prose from './Prose.svelte';
	import SiteFooter from './SiteFooter.svelte';

	let {
		storyId,
		html,
		header,
		after
	}: { storyId: string; html: string; header: Snippet; after?: Snippet } = $props();

	const DRAW_MS = 2000;
	let draw = $state(0);
	let done = $state(false);
	let controller: AbortController | undefined;

	function skip() {
		controller?.abort();
	}

	// Restart the draw-in whenever the story changes.
	$effect(() => {
		void storyId;
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
</script>

<TopBar {storyId} />

<main>
	<header>
		{@render header()}
	</header>

	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="stage" onpointerdown={skip}>
		<Trajectory storyIds={[storyId]} {draw} gradients={[pathGradients[0]]} idle={done} />
	</div>

	<div class="essay" class:shown={done}>
		<Prose {html} />
		{@render after?.()}
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
