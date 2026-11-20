<script lang="ts">
	import { onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { neighbors, type PageRef } from '../sequence';
	import { homeStoryIds } from '../course';
	import Trajectory from '../trajectory/Trajectory.svelte';
	import { animate } from '../trajectory/animate';
	import { pathGradients } from '../trajectory/palette';

	const TRACE_MS = 500;
	const nav = $derived(neighbors(page.url.pathname));

	let backDraw = $state(1);
	let nextDraw = $state(1);
	const ctrls: Record<'back' | 'next', AbortController | null> = { back: null, next: null };

	function trace(which: 'back' | 'next') {
		ctrls[which]?.abort();
		const ctrl = new AbortController();
		ctrls[which] = ctrl;
		const set = (v: number) => (which === 'back' ? (backDraw = v) : (nextDraw = v));
		set(0);
		animate(TRACE_MS, set, { signal: ctrl.signal });
	}

	onDestroy(() => {
		ctrls.back?.abort();
		ctrls.next?.abort();
	});

	function typing(el: Element | null): boolean {
		if (!(el instanceof HTMLElement)) return false;
		return el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName);
	}

	function onkeydown(e: KeyboardEvent) {
		if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey || e.defaultPrevented) return;
		if (typing(document.activeElement)) return;
		const target: PageRef | null =
			e.key === 'ArrowLeft' ? nav.back : e.key === 'ArrowRight' ? nav.next : null;
		if (!target) return;
		e.preventDefault();
		goto(target.href);
	}
</script>

<svelte:window {onkeydown} />

{#snippet glyph(draw: number, flip: boolean)}
	<span class="glyph" class:flip aria-hidden="true">
		<Trajectory
			storyIds={[homeStoryIds[0]]}
			{draw}
			simplify={3}
			showCloud={false}
			showLabels={false}
			gradients={[pathGradients[0]]}
			lineScale={1.3}
		/>
	</span>
{/snippet}

{#if nav.back}
	<a
		class="ctl back"
		href={nav.back.href}
		aria-label={`Back: ${nav.back.label}`}
		onmouseenter={() => trace('back')}
		onfocus={() => trace('back')}
		onpointerdown={() => trace('back')}
	>
		{@render glyph(backDraw, true)}
		<span class="word">Back</span>
		<span class="dest">{nav.back.label}</span>
	</a>
{/if}

{#if nav.next}
	<a
		class="ctl next"
		href={nav.next.href}
		aria-label={`Next: ${nav.next.label}`}
		onmouseenter={() => trace('next')}
		onfocus={() => trace('next')}
		onpointerdown={() => trace('next')}
	>
		<span class="word">Next</span>
		{@render glyph(nextDraw, false)}
		<span class="dest">{nav.next.label}</span>
	</a>
{/if}

<style>
	.ctl {
		position: fixed;
		bottom: max(1.25rem, env(safe-area-inset-bottom));
		z-index: 20;
		display: flex;
		align-items: center;
		gap: 0.6rem;
		padding: 0.5rem 0.25rem;
		color: var(--ink);
		text-decoration: none;
		font-family: var(--font-sub);
		font-size: 1.1rem;
		font-weight: 600;
		letter-spacing: 0.02em;
	}
	.back {
		left: max(1rem, env(safe-area-inset-left));
	}
	.next {
		right: max(1rem, env(safe-area-inset-right));
	}
	.ctl:hover,
	.ctl:focus-visible {
		color: var(--cardinal);
	}
	.ctl:focus-visible {
		outline: 2px solid var(--cardinal);
		outline-offset: 2px;
	}
	.glyph {
		display: block;
		width: 28px;
		height: 28px;
		flex: none;
	}
	.flip {
		transform: scaleX(-1);
	}
	.dest {
		display: none;
		font-weight: 400;
		color: var(--muted);
	}
	/* Boxed like the view toggle, destination as a small second line: phones, and any width where
	   the plain controls would run into the 60rem text column (they need ~15rem each side). */
	@media (hover: none), (max-width: 89.99rem) {
		.ctl {
			padding: 0.35rem 0.55rem;
			background: #fff;
			border: 1px solid rgba(26, 26, 26, 0.18);
			border-radius: 0.5rem;
			display: grid;
			grid-template-columns: auto auto;
			grid-template-areas: 'a b' 'd d';
			align-items: center;
			column-gap: 0.4rem;
			row-gap: 0;
			max-width: calc(50vw - 1.25rem);
		}
		.back .glyph {
			grid-area: a;
		}
		.back .word {
			grid-area: b;
		}
		.next .word {
			grid-area: a;
		}
		.next .glyph {
			grid-area: b;
		}
		.dest {
			grid-area: d;
			display: block;
			font-family: var(--font-sub);
			font-size: 0.7rem;
			line-height: 1.25;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		.back .dest {
			text-align: left;
		}
		.next .dest {
			text-align: right;
		}
	}
	@media (hover: hover) and (min-width: 90rem) {
		/* Back reads "Week 2: Materials, glyph, Back": the destination opens on the outer side. */
		.back .dest {
			order: -1;
		}
		.dest {
			display: block;
			font-size: 0.95rem;
			max-width: 0;
			overflow: hidden;
			white-space: nowrap;
			opacity: 0;
			transition:
				max-width 0.3s ease,
				opacity 0.3s ease;
		}
		/* Cancel the flex gap while the label is collapsed, so the glyph does not shift on hover. */
		.back .dest {
			margin-right: -0.6rem;
		}
		.next .dest {
			margin-left: -0.6rem;
		}
		.ctl:hover .dest,
		.ctl:focus-visible .dest {
			max-width: 22rem;
			opacity: 1;
			margin-left: 0;
			margin-right: 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.dest {
			transition: none;
		}
	}
</style>
