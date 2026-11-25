<script lang="ts">
	import { onDestroy, onMount, tick } from 'svelte';
	import { afterNavigate, goto } from '$app/navigation';
	import { page } from '$app/state';
	import List from '@lucide/svelte/icons/list';
	import { neighbors, readingOrder, type PageRef } from '../sequence';
	import { contentsFor, pageOf } from '../contents';
	import { href, sitePath } from '../paths';
	import { viewState } from '../view.svelte.ts';
	import { animate } from '../trajectory/animate';
	import ArrowGlyph from './ArrowGlyph.svelte';
	import DownGlyph from './DownGlyph.svelte';
	import { cubicOut } from 'svelte/easing';
	import { prefersReducedMotion } from '../trajectory/animate';

	/**
	 * Desktop: the menu rises out of the bar, revealed upward from the bar's own outline.
	 * Phones: a bottom sheet that slides up (and back down from wherever it was dragged to).
	 */
	function reveal(node: HTMLElement) {
		if (prefersReducedMotion()) return { duration: 0 };
		if (node.classList.contains('sheet')) {
			const from = dragY;
			return {
				duration: 260,
				easing: cubicOut,
				css: (_t: number, u: number) => `transform: translateY(calc(${from * (1 - u)}px + ${u * 100}%));`
			};
		}
		// Grow the menu's height up from the bar's. (A clip would also clip the menu's shadow until the
		// animation ended; a box's own shadow is never clipped by its height, so it shows throughout.)
		const full = node.offsetHeight;
		const from = Math.min(full, node.parentElement!.querySelector<HTMLElement>('.pill')!.offsetHeight);
		return {
			duration: 220,
			easing: cubicOut,
			css: (t: number) => `height: ${from + (full - from) * t}px;`
		};
	}

	const TRACE_MS = 450;
	const path = $derived.by(() => {
		const p = sitePath(page.url.pathname);
		return p.length > 1 ? p.replace(/\/+$/, '') : p;
	});
	const nav = $derived(neighbors(path));
	const current = $derived(readingOrder().find((p) => p.href === path));
	const groups = $derived(contentsFor(viewState.current));

	let open = $state(false);
	let dock: HTMLDivElement | undefined = $state();
	let card: HTMLDivElement | undefined = $state();

	/** Phones get the bottom sheet; matches the site's 640px phone breakpoint. */
	let phone = $state(false);
	onMount(() => {
		const mq = window.matchMedia('(max-width: 640px)');
		const sync = () => (phone = mq.matches);
		sync();
		mq.addEventListener('change', sync);
		return () => mq.removeEventListener('change', sync);
	});

	async function toggle() {
		open = !open;
		if (open) {
			dragY = 0;
			await tick();
			card?.querySelector<HTMLElement>('[aria-current="page"]')?.scrollIntoView({ block: 'center' });
		}
	}

	/** Drag the sheet's handle down to dismiss it (a tap on the handle closes it too). */
	let dragY = $state(0);
	let dragFrom: { y: number; id: number } | null = null;
	/** A drag that did not go far enough snaps back; the click that follows it should not close the sheet. */
	let dragged = false;
	function dragStart(e: PointerEvent) {
		dragFrom = { y: e.clientY, id: e.pointerId };
		dragged = false;
		(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
	}
	function dragMove(e: PointerEvent) {
		if (!dragFrom || e.pointerId !== dragFrom.id) return;
		dragY = Math.max(0, e.clientY - dragFrom.y);
		if (dragY > 6) dragged = true;
	}
	function dragEnd(e: PointerEvent) {
		if (!dragFrom || e.pointerId !== dragFrom.id) return;
		dragFrom = null;
		if (dragY > 70) open = false;
		else dragY = 0;
	}

	afterNavigate(() => (open = false));

	function onpointerdown(e: PointerEvent) {
		const t = e.target as Element;
		if (!open || !dock || dock.contains(t) || t.closest?.('[data-keeps-menu]')) return;
		open = false;
	}

	/** Hovering an arrow redraws its trajectory. */
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
		// Also leave arrow keys alone on buttons and disclosures, which may use them.
		return el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'SUMMARY'].includes(el.tagName);
	}

	function onkeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && open) {
			open = false;
			dock?.querySelector<HTMLElement>('.current')?.focus();
			return;
		}
		if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey || e.defaultPrevented) return;
		if (typing(document.activeElement)) return;
		const target: PageRef | null =
			e.key === 'ArrowLeft' ? nav.back : e.key === 'ArrowRight' ? nav.next : null;
		if (!target) return;
		e.preventDefault();
		goto(href(target.href));
	}
</script>

<svelte:window {onkeydown} {onpointerdown} />

<div class="dock" bind:this={dock}>
	<nav class="pill" aria-label="Course pages" inert={open}>
		{#if nav.back}
			<a
				class="arrow"
				href={href(nav.back.href)}
				aria-label={`Back: ${nav.back.label}`}
				title={`Back: ${nav.back.label}`}
				onmouseenter={() => trace('back')}
				onfocus={() => trace('back')}
			>
				<ArrowGlyph side="back" draw={backDraw} />
			</a>
		{:else}
			<span class="arrow off" aria-hidden="true"><ArrowGlyph side="back" /></span>
		{/if}

		<button class="current" aria-expanded={open} aria-controls="contents" onclick={toggle}>
			<List size="1.1em" strokeWidth={1.75} aria-hidden="true" />
			<span class="label">{current?.label ?? 'Contents'}</span>
		</button>

		{#if nav.next}
			<a
				class="arrow"
				href={href(nav.next.href)}
				aria-label={`Next: ${nav.next.label}`}
				title={`Next: ${nav.next.label}`}
				onmouseenter={() => trace('next')}
				onfocus={() => trace('next')}
			>
				<ArrowGlyph side="next" draw={nextDraw} />
			</a>
		{:else}
			<span class="arrow off" aria-hidden="true"><ArrowGlyph side="next" /></span>
		{/if}
	</nav>

	{#if open}
		<!-- Desktop: grows out of the bar (same width, same bottom edge). Phones: a sheet across the bottom of the screen. -->
		<div
			class="panel"
			class:sheet={phone}
			class:dragging={dragY > 0}
			style:transform={phone && dragY ? `translateY(${dragY}px)` : undefined}
			transition:reveal
		>
			{#if phone}
				<button
					class="handle"
					aria-label="Close contents"
					onclick={() => {
						if (!dragged) open = false;
						dragged = false;
					}}
					onpointerdown={dragStart}
					onpointermove={dragMove}
					onpointerup={dragEnd}
					onpointercancel={dragEnd}
				>
					<DownGlyph />
				</button>
			{/if}
			<div class="scroller" id="contents" role="navigation" aria-label="Contents" bind:this={card}>
				{#each groups as g (g.heading)}
					{#if g.href}
						<a
							class="heading"
							href={href(g.href)}
							aria-current={g.href === path ? 'page' : undefined}
							onclick={() => (open = false)}>{g.heading}</a
						>
					{:else}
						<p class="heading">{g.heading}</p>
					{/if}
					<ul>
						{#each g.items as item (item.href + item.label)}
							<li>
								<a
									class="item"
									href={href(item.href)}
									aria-current={path !== '/' && pageOf(item.href) === path ? 'page' : undefined}
									onclick={() => (open = false)}
								>
									<span class="tag">{item.tag ?? ''}</span>
									<span class="text">{item.label}</span>
								</a>
								{#if item.children}
									<ul class="sub">
										{#each item.children as sub (sub.href)}
											<li>
												<a class="item" href={href(sub.href)} onclick={() => (open = false)}>
													<span class="tag"></span>
													<span class="text">{sub.label}</span>
												</a>
											</li>
										{/each}
									</ul>
								{/if}
							</li>
						{/each}
					</ul>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	.dock {
		--nav-w: min(18.5rem, calc(100vw - 2 * var(--gutter)));
		--nav-h: 2.75rem;
		/* One outline and one soft shadow for the bar, the desktop menu and the phone sheet, on every screen size. */
		--nav-outline: 0 0 0 1px rgba(26, 26, 26, 0.06);
		--nav-shadow: var(--nav-outline), 0 6px 22px rgba(26, 26, 26, 0.09);
		position: fixed;
		left: 0;
		right: 0;
		/* 1.25rem from the bottom, mirroring the top bar's 1.25rem from the top (TopBar padding). */
		bottom: max(1.25rem, env(safe-area-inset-bottom));
		margin-inline: auto;
		z-index: 20;
		width: var(--nav-w);
		font-family: var(--font-sub);
	}

	.pill {
		display: flex;
		align-items: stretch;
		height: var(--nav-h);
		background: var(--bg);
		border-radius: 999px;
		box-shadow: var(--nav-shadow);
	}

	.arrow {
		display: flex;
		align-items: center;
		justify-content: center;
		flex: none;
		width: 3rem;
		border-radius: 999px;
	}
	.arrow :global(.arrow-glyph) {
		width: 1.75rem;
	}
	.arrow:hover {
		background: #fdf4ee;
	}
	.arrow.off {
		opacity: 0.2;
	}

	.current {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.55rem;
		min-width: 0;
		padding: 0 0.25rem;
		border: 0;
		background: none;
		color: var(--ink);
		font-family: var(--font-sub);
		font-weight: 700;
		font-size: 0.72rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		line-height: 1;
		cursor: pointer;
	}
	.current :global(svg) {
		flex: none;
	}
	.current .label {
		padding-top: var(--caps-nudge);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.current:hover {
		color: var(--cardinal);
	}

	.arrow:focus-visible,
	.current:focus-visible,
	.handle:focus-visible,
	.panel a:focus-visible {
		outline: 2px solid var(--cardinal);
		outline-offset: 2px;
	}

	/* Desktop menu: sits over the bar at the bar's width, bottom edges aligned. */
	.panel {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		background: var(--bg);
		border-radius: 1.25rem;
		box-shadow: var(--nav-shadow);
		overflow: hidden;
		/* Keep the list anchored to the bottom so the menu reveals it in place as it grows upward. */
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
	}
	.scroller {
		/* Keeps its full size while the menu grows, so it is revealed rather than squashed. */
		flex: none;
		max-height: min(26rem, calc(100dvh - 6rem));
		overflow-y: auto;
		overscroll-behavior: contain;
		/* The site's standard gutter on every side. */
		padding: var(--gutter);
		/* Fade the list out at its top and bottom edges as it scrolls. */
		mask-image: linear-gradient(to bottom, transparent, #000 1rem, #000 calc(100% - 1.25rem), transparent);
	}

	/* Two columns: the small-caps tag ("Lecture 3", "Guest") and the name; headings sit over the names. */
	.item {
		display: grid;
		grid-template-columns: 4.1rem 1fr;
		column-gap: 0.4rem;
	}
	.heading {
		display: block;
		margin: 1rem 0 0.3rem;
		padding-left: 4.5rem;
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		line-height: 1.3;
		color: var(--cardinal);
		text-decoration: none;
	}
	.heading:first-child {
		margin-top: 0;
	}
	a.heading:hover {
		text-decoration: underline;
		text-underline-offset: 0.2em;
	}
	a.heading[aria-current='page'] {
		font-weight: 900;
	}
	ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.item {
		align-items: baseline;
		padding: 0.2rem 0;
		color: var(--ink);
		text-decoration: none;
		font-size: 0.86rem;
		font-weight: 500;
		line-height: 1.3;
	}
	/* A section's parts (Logistics > Syllabus): indented under its name, a size smaller. */
	.sub .text {
		padding-left: 0.9rem;
		font-size: 0.8rem;
	}
	.sub .item {
		padding: 0.1rem 0;
	}
	.tag {
		font-size: 0.6rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		white-space: nowrap;
	}
	.item:hover .text {
		text-decoration: underline;
		text-underline-offset: 0.2em;
	}
	.item[aria-current='page'] {
		color: var(--cardinal);
	}
	.item[aria-current='page'] .text {
		font-weight: 800;
	}

	/* Small phones: tighter arrow cells so the longest page name ("Week 5: Materials") still fits. */
	@media (max-width: 400px) {
		.arrow {
			width: 2.75rem;
		}
		.arrow :global(.arrow-glyph) {
			width: 1.5rem;
		}
		.current {
			gap: 0.4rem;
			letter-spacing: 0.08em;
		}
	}

	/* Phone menu: a sheet across the whole bottom of the screen, like Notion's, with a
	   downward trajectory arrow as its handle (drag it down or tap it to close). */
	.panel.sheet {
		position: fixed;
		bottom: 0;
		border-radius: 1.25rem 1.25rem 0 0;
		/* Same outline and shadow as the bar, cast upward since the sheet sits on the bottom edge. */
		box-shadow: var(--nav-outline), 0 -6px 22px rgba(26, 26, 26, 0.09);
		transition: transform 200ms ease;
	}
	.panel.sheet.dragging {
		transition: none;
	}
	.handle {
		display: flex;
		justify-content: center;
		width: 100%;
		/* Same space above the handle as the sheet's side gutter. */
		padding: var(--gutter) 0 0.75rem;
		border: 0;
		background: none;
		cursor: grab;
		touch-action: none;
	}
	.handle :global(.down-glyph) {
		height: 1.9rem;
	}
	.sheet .scroller {
		max-height: min(72dvh, 34rem);
		/* Extra room at the bottom so the last rows can scroll up out of the fade, clear of Safari's toolbar. */
		padding: 0.5rem var(--gutter) calc(env(safe-area-inset-bottom) + 5rem);
		/* A fade at the bottom (like Notion's), so rows dissolve under the browser toolbar. */
		mask-image: linear-gradient(
			to bottom,
			transparent,
			#000 1rem,
			#000 calc(100% - 6rem),
			rgba(0, 0, 0, 0.45) calc(100% - 3rem),
			transparent calc(100% - 0.75rem)
		);
	}
	.sheet .item {
		font-size: 0.95rem;
		padding: 0.3rem 0;
	}
</style>
