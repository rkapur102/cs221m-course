<script lang="ts">
	import { onMount } from 'svelte';
	import { storyIds } from '../trajectory/data';
	import { arrowChoice, loadArrowChoice, saveArrowChoice } from '../arrowChoice.svelte.ts';
	import ArrowGlyph from './ArrowGlyph.svelte';

	/** Prototype only: try different trajectories for the navigator's arrows. Remove once one is chosen. */
	let open = $state(false);
	onMount(loadArrowChoice);

	function pick(id: string) {
		arrowChoice.storyId = id;
		saveArrowChoice();
	}
</script>

<div class="lab">
	<button class="toggle" aria-expanded={open} onclick={() => (open = !open)}>Arrow lab</button>
	{#if open}
		<div class="panel">
			<p class="hint">Pick the trajectory the Back and Next arrows are drawn from.</p>
			<div class="grid">
				{#each storyIds as id (id)}
					<button class="opt" class:on={arrowChoice.storyId === id} aria-pressed={arrowChoice.storyId === id} title={`Story ${id}`} onclick={() => pick(id)}>
						<ArrowGlyph storyId={id} />
					</button>
				{/each}
			</div>
			<label class="row">
				<input type="checkbox" bind:checked={arrowChoice.stretch} onchange={saveArrowChoice} />
				Straightest stretch only (off: whole story)
			</label>
			<label class="row">
				Wiggle
				<input type="range" min="0" max="0.9" step="0.05" value={0.9 - arrowChoice.tame} oninput={(e) => { arrowChoice.tame = 0.9 - Number(e.currentTarget.value); saveArrowChoice(); }} />
			</label>
			<p class="hint">Now: story {arrowChoice.storyId}, {arrowChoice.stretch ? 'stretch' : 'whole'}, wiggle {(0.9 - arrowChoice.tame).toFixed(2)}</p>
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
		width: 16rem;
		padding: 0.75rem;
		background: var(--bg);
		border: 1px solid rgba(26, 26, 26, 0.15);
		border-radius: 0.6rem;
		box-shadow: 0 6px 20px rgba(26, 26, 26, 0.1);
	}
	.hint {
		margin: 0 0 0.5rem;
		line-height: 1.35;
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
</style>
