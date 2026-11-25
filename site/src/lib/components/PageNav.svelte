<script lang="ts">
	import { onDestroy, tick } from 'svelte';
	import { afterNavigate, goto } from '$app/navigation';
	import { page } from '$app/state';
	import List from '@lucide/svelte/icons/list';
	import { neighbors, readingOrder, type PageRef } from '../sequence';
	import { contentsFor } from '../contents';
	import { href, sitePath } from '../paths';
	import { viewState } from '../view.svelte.ts';
	import { animate } from '../trajectory/animate';
	import ArrowGlyph from './ArrowGlyph.svelte';
	import { cubicOut } from 'svelte/easing';
	import { prefersReducedMotion } from '../trajectory/animate';

	/** The menu rises out of the bar: revealed upward from the bar's own outline, fading in. */
	function grow(node: HTMLElement) {
		if (prefersReducedMotion()) return { duration: 0 };
		const hidden = Math.max(0, node.offsetHeight - node.parentElement!.querySelector<HTMLElement>('.pill')!.offsetHeight);
		return {
			duration: 220,
			easing: cubicOut,
			css: (t: number) =>
				`opacity: ${Math.min(1, 0.3 + t)}; clip-path: inset(${(1 - t) * hidden}px 0 0 0 round 1.25rem);`
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

	async function toggle() {
		open = !open;
		if (open) {
			await tick();
			card?.querySelector<HTMLElement>('[aria-current="page"]')?.scrollIntoView({ block: 'center' });
		}
	}

	afterNavigate(() => (open = false));

	function onpointerdown(e: PointerEvent) {
		if (open && dock && !dock.contains(e.target as Node)) open = false;
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
		<!-- Grows out of the bar: same width, same bottom edge, so the bar becomes the foot of the menu. -->
		<div class="panel" transition:grow>
			<div class="scroller" id="contents" role="navigation" aria-label="Contents" bind:this={card}>
				{#each groups as g (g.heading)}
					<p class="heading">{g.heading}</p>
					<ul>
						{#each g.items as item (item.href)}
							<li>
								<a
									href={href(item.href)}
									aria-current={item.href === path ? 'page' : undefined}
									onclick={() => (open = false)}
								>
									<span class="num">{item.num ?? ''}</span>
									<span class="text">{item.label}</span>
								</a>
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
		--nav-w: min(17.5rem, calc(100vw - 2 * var(--gutter)));
		--nav-h: 2.75rem;
		--nav-shadow: 0 14px 28px -6px rgba(26, 26, 26, 0.22), 0 0 0 1px rgba(26, 26, 26, 0.06);
		position: fixed;
		left: 50%;
		bottom: max(1.25rem, env(safe-area-inset-bottom));
		transform: translateX(-50%);
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

	.arrow:focus-visible,
	.current:focus-visible,
	.panel a:focus-visible {
		outline: 2px solid var(--cardinal);
		outline-offset: 2px;
	}

	.panel {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		background: var(--bg);
		border-radius: 1.25rem;
		box-shadow: var(--nav-shadow);
		overflow: hidden;
	}
	.scroller {
		max-height: min(24rem, calc(100dvh - 6rem));
		overflow-y: auto;
		overscroll-behavior: contain;
		/* The site's standard gutter on every side. */
		padding: var(--gutter);
		/* Fade the list out at its top and bottom edges as it scrolls. */
		mask-image: linear-gradient(to bottom, transparent, #000 1rem, #000 calc(100% - 1.25rem), transparent);
	}
	.heading {
		margin: 1rem 0 0.25rem 2rem;
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--cardinal);
	}
	.heading:first-child {
		margin-top: 0;
	}
	ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.panel a {
		display: flex;
		padding: 0.18rem 0;
		color: var(--ink);
		text-decoration: none;
		font-size: 0.9rem;
		font-weight: 500;
		line-height: 1.35;
		border-radius: 0.25rem;
	}
	.num {
		flex: none;
		width: 2rem;
		font-variant-numeric: tabular-nums;
	}
	.panel a:hover .text,
	.panel a:hover .num {
		text-decoration: underline;
		text-underline-offset: 0.2em;
	}
	.panel a[aria-current='page'] {
		color: var(--cardinal);
		font-weight: 800;
	}
</style>
