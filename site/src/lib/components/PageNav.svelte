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
	{#if open}
		<div class="card" id="contents" role="navigation" aria-label="Contents" bind:this={card}>
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
								<span>{item.label}</span>
							</a>
						</li>
					{/each}
				</ul>
			{/each}
		</div>
	{/if}

	<nav class="pill" aria-label="Course pages">
		{#if nav.back}
			<a
				class="arrow"
				href={href(nav.back.href)}
				aria-label={`Back: ${nav.back.label}`}
				title={`Back: ${nav.back.label}`}
				onmouseenter={() => trace('back')}
				onfocus={() => trace('back')}
			>
				<ArrowGlyph flip draw={backDraw} />
			</a>
		{:else}
			<span class="arrow off" aria-hidden="true"><ArrowGlyph flip /></span>
		{/if}

		<button class="current" aria-expanded={open} aria-controls="contents" onclick={toggle}>
			<List size="1em" strokeWidth={2} aria-hidden="true" />
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
				<ArrowGlyph draw={nextDraw} />
			</a>
		{:else}
			<span class="arrow off" aria-hidden="true"><ArrowGlyph /></span>
		{/if}
	</nav>
</div>

<style>
	.dock {
		position: fixed;
		left: 50%;
		bottom: max(1.25rem, env(safe-area-inset-bottom));
		transform: translateX(-50%);
		z-index: 20;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		width: max-content;
		max-width: calc(100vw - 2 * var(--gutter));
		font-family: var(--font-sub);
	}

	.pill {
		display: flex;
		align-items: stretch;
		max-width: 100%;
		background: var(--bg);
		border: 1px solid rgba(26, 26, 26, 0.12);
		border-radius: 0.75rem;
		box-shadow: 0 6px 20px rgba(26, 26, 26, 0.08);
	}

	.arrow {
		display: flex;
		align-items: center;
		justify-content: center;
		flex: none;
		padding: 0 0.7rem;
		border-radius: 0.75rem;
		color: var(--ink);
	}
	.arrow:hover {
		background: #fdf4ee;
	}
	.arrow.off {
		opacity: 0.25;
	}

	.current {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		min-width: 0;
		padding: 0.6rem 0.75rem;
		border: 0;
		border-left: 1px solid rgba(26, 26, 26, 0.08);
		border-right: 1px solid rgba(26, 26, 26, 0.08);
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
	.current:hover,
	.current[aria-expanded='true'] {
		color: var(--cardinal);
	}

	.arrow:focus-visible,
	.current:focus-visible,
	.card a:focus-visible {
		outline: 2px solid var(--cardinal);
		outline-offset: 2px;
	}

	.card {
		width: min(19rem, calc(100vw - 2 * var(--gutter)));
		max-height: min(26rem, calc(100dvh - 7rem));
		overflow-y: auto;
		padding: 0.9rem 1.1rem 1rem;
		background: var(--bg);
		border: 1px solid rgba(26, 26, 26, 0.12);
		border-radius: 0.9rem;
		box-shadow: 0 10px 30px rgba(26, 26, 26, 0.12);
	}
	.heading {
		margin: 0.85rem 0 0.25rem 2.1rem;
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
	.card a {
		display: flex;
		gap: 0.5rem;
		padding: 0.2rem 0;
		color: var(--ink);
		text-decoration: none;
		font-size: 0.88rem;
		font-weight: 500;
		line-height: 1.35;
		border-radius: 0.25rem;
	}
	.card a:hover {
		color: var(--cardinal);
	}
	.num {
		flex: none;
		width: 1.6rem;
		font-variant-numeric: tabular-nums;
	}
	.card a[aria-current='page'] {
		color: var(--cardinal);
		font-weight: 800;
	}
</style>
