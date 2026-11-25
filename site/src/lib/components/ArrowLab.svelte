<script lang="ts">
	import { onMount } from 'svelte';
	import { storyIds } from '../trajectory/data';
	import { arrowChoice, loadArrowChoice, saveArrowChoice, type Side } from '../arrowChoice.svelte.ts';
	import ArrowGlyph from './ArrowGlyph.svelte';

	/** Prototype only: try different trajectories for the Back and Next arrows. Remove once they are chosen. */
	let open = $state(false);
	let side = $state<Side>('next');
	const spec = $derived(arrowChoice[side]);
	onMount(loadArrowChoice);

	function copyToOther() {
		const other: Side = side === 'back' ? 'next' : 'back';
		Object.assign(arrowChoice[other], spec);
		saveArrowChoice();
	}
</script>

<div class="lab">
	<button class="toggle" aria-expanded={open} onclick={() => (open = !open)}>Arrow lab</button>
	{#if open}
		<div class="panel">
			<div class="sides" role="group" aria-label="Which arrow">
				{#each ['back', 'next'] as const as s (s)}
					<button class="side" class:on={side === s} aria-pressed={side === s} onclick={() => (side = s)}>
						<ArrowGlyph side={s} />
						{s === 'back' ? 'Back' : 'Next'}
					</button>
				{/each}
			</div>
			<p class="hint">Pick the trajectory for the {side === 'back' ? 'Back' : 'Next'} arrow.</p>
			<div class="grid">
				{#each storyIds as id (id)}
					<button
						class="opt"
						class:on={spec.storyId === id}
						aria-pressed={spec.storyId === id}
						title={`Story ${id}`}
						onclick={() => {
							spec.storyId = id;
							saveArrowChoice();
						}}
					>
						<ArrowGlyph {side} storyId={id} />
					</button>
				{/each}
			</div>
			<label class="row">
				<input type="checkbox" bind:checked={spec.stretch} onchange={saveArrowChoice} />
				Straightest stretch only (off: whole story)
			</label>
			<label class="row">
				Wiggle
				<input
					type="range"
					min="0"
					max="0.9"
					step="0.05"
					value={0.9 - spec.tame}
					oninput={(e) => {
						spec.tame = 0.9 - Number(e.currentTarget.value);
						saveArrowChoice();
					}}
				/>
			</label>
			<button class="link" onclick={copyToOther}>Use this for {side === 'back' ? 'Next' : 'Back'} too</button>
			<p class="hint now">
				Back: story {arrowChoice.back.storyId}, {arrowChoice.back.stretch ? 'stretch' : 'whole'}, wiggle {(0.9 - arrowChoice.back.tame).toFixed(2)}<br />
				Next: story {arrowChoice.next.storyId}, {arrowChoice.next.stretch ? 'stretch' : 'whole'}, wiggle {(0.9 - arrowChoice.next.tame).toFixed(2)}
			</p>
		</div>
	{/if}
</div>

<style>
	.lab {
		position: fixed;
		left: var(--gutter);
		top: 5.75rem;
		z-index: 30;
		font-family: var(--font-sub);
		font-size: 0.75rem;
	}
	.toggle {
		padding: 0.35rem 0.6rem;
		border: 1px dashed var(--gf-orange);
		border-radius: 0.4rem;
		background: #fffaf5;
		color: var(--gf-orange);
		font: inherit;
		font-weight: 700;
		cursor: pointer;
	}
	.panel {
		margin-top: 0.4rem;
		width: min(16.5rem, calc(100vw - 2 * var(--gutter)));
		padding: 0.75rem;
		background: var(--bg);
		border: 1px solid rgba(26, 26, 26, 0.15);
		border-radius: 0.6rem;
		box-shadow: 0 6px 20px rgba(26, 26, 26, 0.1);
	}
	.sides {
		display: grid;
		grid-template-columns: 1fr 1fr;
		margin-bottom: 0.6rem;
		border: 1px solid rgba(26, 26, 26, 0.15);
		border-radius: 0.45rem;
		overflow: hidden;
	}
	.side {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		padding: 0.4rem;
		border: 0;
		background: none;
		font: inherit;
		font-weight: 700;
		cursor: pointer;
	}
	.side + .side {
		border-left: 1px solid rgba(26, 26, 26, 0.15);
	}
	.side.on {
		background: #fdf4ee;
		color: var(--cardinal);
	}
	.side :global(.arrow-glyph) {
		width: 1.5rem;
	}
	.hint {
		margin: 0 0 0.5rem;
		line-height: 1.35;
	}
	.now {
		margin: 0.5rem 0 0;
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 0.3rem;
		margin-bottom: 0.6rem;
	}
	.opt {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.45rem 0.2rem;
		border: 1px solid rgba(26, 26, 26, 0.12);
		border-radius: 0.4rem;
		background: none;
		cursor: pointer;
	}
	.opt.on {
		border-color: var(--cardinal);
		background: #fdf4ee;
	}
	.opt :global(.arrow-glyph) {
		width: 1.8rem;
	}
	.row {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		margin-bottom: 0.5rem;
	}
	.row input[type='range'] {
		flex: 1;
	}
	.link {
		padding: 0;
		border: 0;
		background: none;
		color: var(--cardinal);
		font: inherit;
		text-decoration: underline;
		cursor: pointer;
	}
</style>
