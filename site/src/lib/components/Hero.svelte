<script lang="ts">
	import { onMount } from 'svelte';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import Trajectory from '../trajectory/Trajectory.svelte';
	import { easeInOutCubic, prefersReducedMotion } from '../trajectory/animate';
	import { pathGradients } from '../trajectory/palette';
	import { homeStoryIds } from '../course';
	import { IntroController, introSeen } from '../intro.svelte.ts';
	import stanfordLogo from '../../../../images/stanford_logo.png';
	import goodfireLogo from '../../../../images/goodfire_logo.PNG';

	/** Below this hero width, or when a plot would be narrower than MIN_PLOT, show one shared plot. */
	const CUTOFF = 760;
	const MIN_PLOT = 240;
	/** Mirror the CSS: hero side padding and the plots row max-width (84rem), in px. */
	const PAD = 16;
	const MAX_ROW = 84 * 16;
	/** Phone draw-in: each path gets its own slice of the timeline, slightly overlapping the next. */
	const SLICE = 0.42;

	const intro = new IntroController();
	const gradients = pathGradients.slice(0, 3);

	let hero: HTMLElement;
	let started = $state(false);
	let single = $state(false);

	const done = $derived(intro.phase === 'done');
	const yaw = $derived(intro.spin * 2 * Math.PI);
	const draw = $derived(1 - Math.pow(1 - intro.progress, 2));
	const draws = $derived(
		gradients.map((_, i) => {
			const start = (i * (1 - SLICE)) / (gradients.length - 1);
			return easeInOutCubic(Math.min(1, Math.max(0, (intro.progress - start) / SLICE)));
		})
	);

	onMount(() => {
		const skipIntro =
			introSeen() || prefersReducedMotion() || location.hash !== '' || window.scrollY > 0;
		if (skipIntro) {
			intro.skip();
		} else {
			started = true;
			intro.start();
		}
		return () => intro.skip();
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
			if (e.type === 'pointerdown' || e.type === 'touchstart') swallowNextClick();
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
			<img src={stanfordLogo} alt="Stanford" width="44" height="44" />
			<span class="times" aria-hidden="true">&times;</span>
			<img src={goodfireLogo} alt="Goodfire" width="31" height="40" class="gf" />
		</div>
		<h1 id="course-title">CS 221M: Mechanistic Interpretability</h1>
		<p class="sub">Stanford University, Spring 2026</p>
	</header>

	<div class="plots" class:single aria-hidden="true">
		{#if single}
			<div class="cell">
				<Trajectory
					storyIds={[...homeStoryIds]}
					{draws}
					{yaw}
					{gradients}
					idle={done}
					showLabels={false}
					lineScale={0.78}
				/>
			</div>
		{:else}
			{#each homeStoryIds as id, i (id)}
				<div class="cell">
					<Trajectory storyIds={[id]} {draw} {yaw} gradients={[gradients[i]]} idle={done} />
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
				<ChevronDown size="1.4em" strokeWidth={1.75} aria-hidden="true" />
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
		max-width: 46rem;
	}

	.mark {
		display: inline-flex;
		align-items: center;
		gap: 0.7rem;
		margin-bottom: clamp(0.9rem, 2.5vh, 1.5rem);
	}

	.mark img {
		display: block;
		height: 2.6rem;
		width: auto;
	}

	.mark .gf {
		height: 2.2rem;
	}

	.times {
		font-family: var(--font-sub);
		font-weight: 300;
		font-size: 1.1rem;
		color: var(--muted);
	}

	h1 {
		font-size: clamp(2.1rem, 5.2vw, 3.9rem);
		letter-spacing: 0.005em;
		text-wrap: balance;
	}

	.sub {
		margin: 0.7rem 0 0;
		font-family: var(--font-sub);
		font-weight: 600;
		font-size: 0.8rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--cardinal);
	}

	.plots {
		flex: 1 1 auto;
		min-height: 0;
		width: 100%;
		max-width: 84rem;
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		column-gap: clamp(0.5rem, 2vw, 2rem);
		margin-top: clamp(0.5rem, 3vh, 2rem);
	}

	.plots.single {
		grid-template-columns: minmax(0, 1fr);
		max-width: 36rem;
		/* Keep the shared plot about square and let the title and plot sit together, centered. */
		flex: 0 1 auto;
		height: min(100vw, 40rem);
	}

	.hero.single .head {
		margin-top: auto;
	}

	.hero.single .foot {
		margin-top: auto;
	}

	.cell {
		position: relative;
		min-width: 0;
		min-height: 0;
	}

	.foot {
		flex: 0 0 auto;
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
		gap: 0.35rem;
		padding: 0.4rem 0.8rem;
	}

	.cue:hover,
	.cue:focus-visible {
		color: var(--cardinal);
	}

	.cue :global(svg) {
		color: var(--gf-orange);
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
		.mark img {
			height: 2.2rem;
		}

		.mark .gf {
			height: 1.9rem;
		}

		.sub {
			font-size: 0.72rem;
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

		.mark img {
			height: 1.8rem;
		}

		.mark .gf {
			height: 1.55rem;
		}

		h1 {
			font-size: clamp(1.6rem, 4vw, 2.4rem);
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
