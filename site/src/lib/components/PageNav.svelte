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
	/* Styled like the schedule's "Slides" / "Suggested readings" tags: thin red outline,
	   small all-caps label, white backing so they read over the page. */
	.ctl {
		position: fixed;
		bottom: max(1.25rem, env(safe-area-inset-bottom));
		z-index: 20;
		display: grid;
		grid-template-columns: auto auto;
		grid-template-areas: 'a b' 'd d';
		align-items: center;
		column-gap: 0.45rem;
		padding: 0.4rem 0.65rem;
		background: #fff;
		border: 1px solid rgba(140, 21, 21, 0.3);
		border-radius: 0.4rem;
		color: var(--cardinal);
		text-decoration: none;
		font-family: var(--font-sub);
		max-width: calc(50vw - 1.25rem);
		transition: background-color 150ms ease;
	}
	.back {
		left: max(var(--gutter), env(safe-area-inset-left));
	}
	.next {
		right: max(var(--gutter), env(safe-area-inset-right));
	}
	.ctl:hover,
	.ctl:focus-visible {
		background: #fdf4ee;
	}
	.ctl:focus-visible {
		outline: 2px solid var(--gf-orange);
		outline-offset: 2px;
	}
	.word {
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		line-height: 1.3;
	}
	.glyph {
		display: block;
		width: 22px;
		height: 22px;
		flex: none;
	}
	.flip {
		transform: scaleX(-1);
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
		margin-top: 0.1rem;
		font-size: 0.66rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		line-height: 1.3;
		color: var(--muted);
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
	@media (prefers-reduced-motion: reduce) {
		.ctl {
			transition: none;
		}
	}
</style>
