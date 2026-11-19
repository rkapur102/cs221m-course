<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import Trajectory from '#lib/trajectory/Trajectory.svelte';
	import { animate } from '../trajectory/animate';
	import { pathGradients } from '../trajectory/palette';
	import { courseStoryId } from '../course';
	import TopBar from './TopBar.svelte';
	import Prose from './Prose.svelte';
	import SiteFooter from './SiteFooter.svelte';

	let {
		storyId,
		html,
		header,
		footer,
		progress,
		markerLabel,
		markerColor,
		markerRing
	}: {
		/** Story for the top-bar logo. */
		storyId: string;
		html: string;
		header: Snippet;
		/** Rendered after the essay, e.g. a call to action. */
		footer?: Snippet;
		/** How much of the course path to draw, 0..1. */
		progress: number;
		markerLabel: string;
		markerColor?: string;
		markerRing?: string;
	} = $props();

	const DRAW_MS = 2000;
	let draw = $state(0);
	let done = $state(false);
	let controller: AbortController | undefined;
	let instant = $state(false);

	function skip() {
		controller?.abort();
	}

	/** Restart the draw-in; browser Back/Forward shows the essay at once. */
	function play(returning: boolean) {
		controller?.abort();
		const c = new AbortController();
		controller = c;
		draw = 0;
		done = false;
		instant = returning;
		if (returning) c.abort();
		animate(DRAW_MS, (t) => (draw = t), { signal: c.signal }).then(() => {
			if (controller === c) done = true;
		});
	}

	// Reset synchronously when the story changes, so a reused instance never renders the new
	// story with the old finished state.
	$effect.pre(() => {
		void storyId;
		void progress;
		controller?.abort();
		draw = 0;
		done = false;
	});

	// Runs on first load and after every navigation, including week to week where the
	// component instance is reused.
	afterNavigate(({ type }) => play(type === 'popstate'));

	onMount(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.metaKey || e.ctrlKey || e.altKey) return;
			skip();
		};
		const onAny = () => skip();
		window.addEventListener('keydown', onKey);
		window.addEventListener('wheel', onAny, { passive: true });
		window.addEventListener('touchstart', onAny, { passive: true });
		window.addEventListener('pointerdown', onAny, { passive: true });
		return () => {
			controller?.abort();
			window.removeEventListener('keydown', onKey);
			window.removeEventListener('wheel', onAny);
			window.removeEventListener('touchstart', onAny);
			window.removeEventListener('pointerdown', onAny);
		};
	});
</script>

<TopBar {storyId} />

<main>
	<header>
		{@render header()}
	</header>

	<div class="stage">
		<Trajectory
			storyIds={[courseStoryId]}
			draw={draw * progress}
			gradients={[pathGradients[0]]}
			idle={done}
			ghost
			marker={{ label: markerLabel, color: markerColor, ring: markerRing }}
		/>
	</div>

	<div class="essay" class:shown={done} class:instant>
		<Prose {html} />
		{@render footer?.()}
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

	.stage {
		width: min(var(--content), 100% - 2rem);
		aspect-ratio: 16 / 9;
		max-height: min(70vh, 34rem);
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

	.essay.instant {
		transition: none;
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
