<script lang="ts">
	import { onMount } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import ArrowDown from '@lucide/svelte/icons/arrow-down';
	import Trajectory from '../trajectory/Trajectory.svelte';
	import { animate, easeInOutCubic, prefersReducedMotion } from '../trajectory/animate';
	import { pathGradients } from '../trajectory/palette';
	import { homeStoryIds } from '../course';
	import { viewState } from '../view.svelte.ts';
	import { IntroController, shouldPlayIntro } from '../intro.svelte.ts';
	import stanfordLogo from '../../../../images/stanford_logo.png';
	import goodfireLogo from '../../../../images/goodfire_logo.PNG';

	/** Below this hero width, or when a plot would be narrower than MIN_PLOT, show one shared plot. */
	const CUTOFF = 760;
	const MIN_PLOT = 240;
	/** Mirror the CSS: hero side padding and the plots row max-width (84rem), in px. */
	const PAD = 16;
	const MAX_ROW = 84 * 16;

	/** Drag sensitivity, radians per pixel, and the pitch limit shared with Trajectory. */
	const DRAG_YAW = 0.008;
	const DRAG_PITCH = 0.006;
	const MAX_PITCH = 0.6;
	const SCROLL_DELAY_MS = 1800;
	const SCROLL_MS = 2200;

	const intro = new IntroController({ onComplete: () => scheduleAutoScroll() });
	const gradients = pathGradients.slice(0, 3);
	/** The hero cells are sized to the cloud, so it can fill more of them than in small previews. */
	const zoom = 1.2;

	let hero: HTMLElement;
	let started = $state(false);
	let single = $state(false);

	const done = $derived(intro.phase === 'done');
	let dragYaw = $state(0);
	let dragPitch = $state(0);
	let dragging = $state(false);
	const yaw = $derived(intro.spin * 2 * Math.PI + dragYaw);
	const pitch = $derived(dragPitch);
	const draw = $derived(1 - Math.pow(1 - intro.progress, 2));

	let cancelAutoScroll: (() => void) | undefined;

	/** After the intro runs out on its own, glide down to the course details unless the visitor acts first. */
	function scheduleAutoScroll() {
		const target = document.getElementById('about');
		if (!target || prefersReducedMotion() || window.scrollY > 0) return;
		const ctrl = new AbortController();
		const { signal } = ctrl;
		const events = ['wheel', 'touchstart', 'keydown', 'pointerdown', 'pagehide'] as const;
		const cancel = () => {
			ctrl.abort();
			clearTimeout(timer);
			for (const e of events) window.removeEventListener(e, cancel);
			window.removeEventListener('scroll', onScroll);
			cancelAutoScroll = undefined;
		};
		let expected = window.scrollY;
		const onScroll = () => {
			// Scrolls we did not make ourselves (scrollbar drag, anchor jump) take over.
			if (Math.abs(window.scrollY - expected) > 3) cancel();
		};
		const timer = setTimeout(async () => {
			const from = window.scrollY;
			const to = Math.max(0, target.getBoundingClientRect().top + from - 16);
			await animate(
				SCROLL_MS,
				(t) => {
					if (signal.aborted) return;
					expected = from + (to - from) * t;
					window.scrollTo({ top: expected, behavior: 'instant' });
				},
				{ ease: easeInOutCubic, signal }
			);
			cancel();
		}, SCROLL_DELAY_MS);
		for (const e of events) window.addEventListener(e, cancel, { passive: true });
		window.addEventListener('scroll', onScroll, { passive: true });
		cancelAutoScroll = cancel;
	}

	let dragStart: { x: number; y: number; yaw: number; pitch: number; id: number } | null = null;

	function onDragDown(e: PointerEvent) {
		if (e.pointerType === 'mouse' && e.button !== 0) return;
		dragStart = { x: e.clientX, y: e.clientY, yaw: dragYaw, pitch: dragPitch, id: e.pointerId };
		dragging = true;
		(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
	}

	function onDragMove(e: PointerEvent) {
		if (!dragStart || e.pointerId !== dragStart.id) return;
		dragYaw = dragStart.yaw + (e.clientX - dragStart.x) * DRAG_YAW;
		// Touch keeps vertical swipes for scrolling, so only mouse and pen tilt the view.
		if (e.pointerType !== 'touch') {
			const next = dragStart.pitch + (e.clientY - dragStart.y) * DRAG_PITCH;
			dragPitch = Math.min(MAX_PITCH, Math.max(-MAX_PITCH, next));
		}
	}

	function onDragEnd(e: PointerEvent) {
		if (!dragStart || e.pointerId !== dragStart.id) return;
		dragStart = null;
		dragging = false;
	}

	// Play on every arrival (load, reload, coming from another route). Hero is remounted per arrival,
	// so the controller is fresh; in-page hash navigation leaves it alone.
	let arrived = false;
	afterNavigate(({ type, from, to }) => {
		if (arrived) return;
		arrived = true;
		const play = shouldPlayIntro({
			type,
			fromPath: from ? from.url.pathname : null,
			toPath: to ? to.url.pathname : location.pathname,
			hash: location.hash,
			reduced: prefersReducedMotion()
		});
		if (play) {
			started = true;
			intro.start();
		} else {
			intro.skip();
		}
	});

	onMount(() => () => {
		intro.skip();
		cancelAutoScroll?.();
	});

	// Pick the layout from the space the plots actually get.
	$effect(() => {
		// Measured from the hero, since the plots row itself narrows in the single layout.
		const ro = new ResizeObserver(() => {
			const w = hero.clientWidth;
			const inner = Math.min(w - 2 * PAD, MAX_ROW);
			const gap = Math.min(32, Math.max(8, 0.02 * window.innerWidth));
			single = w < CUTOFF || (inner - 2 * gap) / 3 < MIN_PLOT;
		});
		ro.observe(hero);
		return () => ro.disconnect();
	});

	/** Cancel the next click anywhere (once), or give up after a short while if none comes. */
	function swallowNextClick() {
		const onClick = (e: MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();
			stop();
		};
		const timer = setTimeout(() => stop(), 800);
		const stop = () => {
			clearTimeout(timer);
			window.removeEventListener('click', onClick, true);
		};
		window.addEventListener('click', onClick, true);
	}

	// While the intro plays, hold the page still; any input fast-forwards it.
	$effect(() => {
		if (!started || done) return;
		const root = document.documentElement;
		const prev = root.style.overflow;
		root.style.overflow = 'hidden';
		const skip = (e: Event) => {
			// A tap's click fires after the Skip button has been swapped for the "Course details"
			// link in the same spot, so swallow that one click to keep the page at the hero.
			if (
				(e.type === 'pointerdown' || e.type === 'touchstart') &&
				e.target instanceof Element &&
				e.target.closest('.foot')
			)
				swallowNextClick();
			intro.skip();
		};
		const events = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const;
		for (const e of events) window.addEventListener(e, skip, { passive: true });
		return () => {
			root.style.overflow = prev;
			for (const e of events) window.removeEventListener(e, skip);
		};
	});
</script>

<section class="hero" class:single bind:this={hero} aria-labelledby="course-title">
	<header class="head">
		<div class="mark">
			<img src={stanfordLogo} alt="Stanford" width="44" height="44" class="su" />
			<span class="times" aria-hidden="true">&times;</span>
			<img src={goodfireLogo} alt="Goodfire" width="31" height="40" class="gf" />
		</div>
		<h1 id="course-title">
			<span class="line">CS 221M:</span>
			<span class="line">Mechanistic</span>
			<span class="line">Interpretability</span>
		</h1>
		<p class="sub">Stanford University{viewState.current === 'enrolled' ? ', Spring 2026' : ''}</p>
	</header>

	<div
		class="plots"
		class:single
		class:dragging
		aria-hidden="true"
		onpointerdown={onDragDown}
		onpointermove={onDragMove}
		onpointerup={onDragEnd}
		onpointercancel={onDragEnd}
		onlostpointercapture={onDragEnd}
	>
		{#if single}
			<div class="cell">
				<Trajectory
					storyIds={[homeStoryIds[0]]}
					{draw}
					{yaw}
					{pitch}
					gradients={[gradients[0]]}
					idle={done && !dragging}
					{zoom}
				/>
			</div>
		{:else}
			{#each homeStoryIds as id, i (id)}
				<div class="cell">
					<Trajectory storyIds={[id]} {draw} {yaw} {pitch} gradients={[gradients[i]]} idle={done && !dragging}
					{zoom} />
				</div>
			{/each}
		{/if}
	</div>

	<div class="foot">
		{#if started && !done}
			<button type="button" class="skip" onclick={() => intro.skip()}>Skip intro</button>
		{:else}
			<a class="cue" class:fade={started} href="#about">
				Course details
				<ArrowDown size="1em" strokeWidth={1.25} aria-hidden="true" />
			</a>
		{/if}
	</div>
</section>

<style>
	.hero {
		height: 100vh;
		height: 100dvh;
		min-height: 20rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: clamp(1.75rem, 6vh, 4rem) 1rem 0;
		overflow: hidden;
	}

	.head {
		text-align: center;
		max-width: 100%;
	}

	.mark {
		--seal: 2.6rem;
		--gf: 2.2rem;
		display: inline-flex;
		align-items: center;
		gap: 0.7rem;
		margin-bottom: clamp(0.9rem, 2.5vh, 1.5rem);
	}

	.mark img {
		display: block;
		height: var(--seal);
		width: auto;
	}

	/* The seal PNG carries ~7.3% transparent padding on each side; the Goodfire PNG has almost none.
	   Pull the seal's right edge in so the ink-to-times gap matches the other side. */
	.mark .su {
		margin-right: calc(var(--seal) * -0.073);
	}

	.mark .gf {
		height: var(--gf);
	}

	.times {
		font-family: var(--font-sub);
		font-weight: 300;
		font-size: 1.1rem;
		color: var(--muted);
	}

	h1 {
		/* One line on wide screens: sized so the full title fits from the desktop cutoff upward. */
		font-size: clamp(1.9rem, 4.6vw, 3.9rem);
		letter-spacing: 0.005em;
		white-space: nowrap;
	}

	/* The stacked phone layout shows each word group on its own line. */
	.hero.single h1 {
		white-space: normal;
		font-size: clamp(2.1rem, 9vw, 3.4rem);
	}

	.hero.single h1 .line {
		display: block;
	}

	.sub {
		margin: 0.7rem 0 0;
		font-family: var(--font-sub);
		font-weight: 600;
		font-size: 1.05rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--cardinal);
	}

	.plots {
		--gap: clamp(0.5rem, 2vw, 2rem);
		flex: 1 1 0;
		min-height: 0;
		width: 100%;
		max-width: 84rem;
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		column-gap: var(--gap);
		margin-top: clamp(0.5rem, 3vh, 2rem);
		/* Rows never grow taller than one cell is wide, so each cloud fills its cell
		   and the plots sit close under the subtitle. Shorter windows shrink them. */
		max-height: calc((min(100vw - 2rem, 84rem) - 2 * var(--gap)) / 3 * 1.1);
	}

	.plots {
		cursor: grab;
		touch-action: pan-y;
		user-select: none;
		-webkit-user-select: none;
	}

	.plots.dragging {
		cursor: grabbing;
	}

	.plots.single {
		grid-template-columns: minmax(0, 1fr);
		max-width: 36rem;
		max-height: calc(min(100vw - 2rem, 36rem) * 1.1);
	}

	.cell {
		position: relative;
		min-width: 0;
		min-height: 0;
	}

	.foot {
		flex: 0 0 auto;
		margin-top: auto;
		height: clamp(3.25rem, 9vh, 5rem);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.skip,
	.cue {
		font-family: var(--font-sub);
		font-size: 0.78rem;
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--muted);
		text-decoration: none;
	}

	.cue {
		font-size: 0.95rem;
		font-weight: 400;
		letter-spacing: normal;
		text-transform: none;
	}

	.skip {
		background: none;
		border: 1px solid rgba(26, 26, 26, 0.18);
		border-radius: 999px;
		padding: 0.45rem 1rem;
		cursor: pointer;
	}

	.skip:hover,
	.skip:focus-visible {
		color: var(--ink);
		border-color: var(--gf-orange);
	}

	.cue {
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
		padding: 0.4rem 0.8rem;
	}

	.cue:hover,
	.cue:focus-visible {
		color: var(--cardinal);
	}

	.cue :global(svg) {
		opacity: 0.75;
	}

	.cue.fade {
		animation: fade-in 700ms ease both;
	}

	@keyframes fade-in {
		from {
			opacity: 0;
			transform: translateY(-4px);
		}
	}

	@media (max-width: 480px) {
		.mark {
			--seal: 2.2rem;
			--gf: 1.9rem;
		}

		.hero {
			padding-top: 3.6rem;
		}

		.sub {
			font-size: 0.9rem;
			letter-spacing: 0.08em;
			text-wrap: balance;
		}
	}

	/* Landscape phones: keep the title compact so the plots and the skip button stay on screen. */
	@media (max-height: 520px) {
		.hero {
			padding-top: 1rem;
		}

		.mark {
			margin-bottom: 0.5rem;
		}

		.mark {
			--seal: 1.8rem;
			--gf: 1.55rem;
		}

		h1,
		.hero.single h1 {
			font-size: clamp(1.6rem, 4vw, 2.4rem);
		}

		.hero.single h1 .line {
			display: inline;
		}

		.sub {
			margin-top: 0.35rem;
		}

		.plots {
			margin-top: 0.5rem;
		}

		.foot {
			height: 2.75rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.cue.fade {
			animation: none;
		}
	}
</style>
