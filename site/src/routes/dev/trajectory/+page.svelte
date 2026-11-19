<script lang="ts">
	// Temporary development page for the trajectory component (removed in Task 10).
	import Trajectory from '#lib/trajectory/Trajectory.svelte';
	import { animate, easeInOutCubic } from '#lib/trajectory/animate.ts';
	import { cloudPalettes, cloudColors } from '#lib/trajectory/palette.ts';
	import { homeStoryIds, weeks } from '#lib/course.ts';

	const leadIn = weeks[0].storyId;
	const names = Object.keys(cloudPalettes);
	let palette = $state(names.find((n) => cloudPalettes[n] === cloudColors) ?? names[0]);
	let draw = $state(1);
	let yaw = $state(0);
	let glyphDraw = $state(1);
	let idle = $state(false);
	let ctrl: AbortController | null = null;

	async function replay() {
		ctrl?.abort();
		const c = (ctrl = new AbortController());
		yaw = 0;
		await animate(2600, (t) => (draw = t), { ease: (t) => 1 - Math.pow(1 - t, 2), signal: c.signal });
	}

	async function spin() {
		ctrl?.abort();
		const c = (ctrl = new AbortController());
		await animate(3200, (t) => (yaw = t * 2 * Math.PI), { ease: easeInOutCubic, signal: c.signal });
		yaw = 0;
	}

	function trace() {
		animate(450, (t) => (glyphDraw = t), { ease: (t) => t });
	}
</script>

<svelte:head><title>Trajectory dev</title></svelte:head>

<main>
	<div class="controls">
		<button type="button" onclick={replay}>Replay draw</button>
		<button type="button" onclick={spin}>Spin</button>
		<label><input type="checkbox" bind:checked={idle} /> Idle</label>
		<span>Cloud:</span>
		{#each names as n (n)}
			<label><input type="radio" name="palette" value={n} bind:group={palette} /> {n}</label>
		{/each}
	</div>

	<h2>Hero triple</h2>
	<div class="triple">
		{#each homeStoryIds as id (id)}
			<div class="cell">
				<Trajectory storyIds={[id]} {draw} {yaw} {idle} cloudColors={cloudPalettes[palette]} />
			</div>
		{/each}
	</div>

	<h2>Shared phone plot</h2>
	<div class="shared">
		<Trajectory storyIds={[...homeStoryIds]} {draw} {yaw} {idle} cloudColors={cloudPalettes[palette]} showLabels={false} />
	</div>

	<h2>Lead-in</h2>
	<div class="lead">
		<Trajectory storyIds={[leadIn]} {draw} {yaw} {idle} cloudColors={cloudPalettes[palette]} />
	</div>

	<h2>Logo and glyph</h2>
	<div class="small">
		<div class="logo"><Trajectory storyIds={[leadIn]} {yaw} showCloud={false} showLabels={false} /></div>
		<button type="button" class="glyph" onmouseenter={trace} onclick={trace} aria-label="Trace glyph">
			<Trajectory storyIds={[leadIn]} draw={glyphDraw} showCloud={false} showLabels={false} />
		</button>
	</div>
</main>

<style>
	main {
		max-width: 76rem;
		margin: 0 auto;
		padding: 1.5rem 1rem 4rem;
		font-family: var(--font-sub);
	}
	.controls {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		align-items: center;
	}
	h2 {
		font-family: var(--font-title);
		font-weight: 400;
		margin: 2rem 0 0.5rem;
	}
	.triple {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
	}
	.cell {
		aspect-ratio: 1;
	}
	.shared {
		width: min(100%, 560px);
		aspect-ratio: 1;
	}
	.lead {
		width: 100%;
		aspect-ratio: 16 / 9;
		max-height: 70vh;
	}
	.small {
		display: flex;
		gap: 2rem;
		align-items: center;
	}
	.logo {
		width: 40px;
		height: 40px;
	}
	.glyph {
		width: 20px;
		height: 20px;
		padding: 0;
		border: 0;
		background: none;
		cursor: pointer;
	}
</style>
