<script lang="ts">
	import { onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import Trajectory from '../trajectory/Trajectory.svelte';
	import { animate, prefersReducedMotion } from '../trajectory/animate';
	import { pathGradients } from '../trajectory/palette';
	import { href, sitePath } from '../paths';

	let { storyId }: { storyId: string } = $props();

	const SPIN_MS = 450;
	let yaw = $state(0);
	let spinning = false;
	const ctrl = new AbortController();

	onDestroy(() => ctrl.abort());

	/** Go home; on the homepage itself, reload it so the intro plays again. */
	function home() {
		spinning = false;
		if (sitePath(location.pathname) === '/') {
			// Drop any #section so the reload starts at the top with the intro.
			if (location.hash) history.replaceState(history.state, '', href('/'));
			location.reload();
		} else {
			goto(href('/'));
		}
	}

	async function onclick(e: MouseEvent) {
		if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
		e.preventDefault();
		if (spinning) return;
		if (prefersReducedMotion()) {
			home();
			return;
		}
		spinning = true;
		await animate(SPIN_MS, (t) => (yaw = t * Math.PI * 2), { signal: ctrl.signal });
		if (ctrl.signal.aborted) return;
		home();
	}
</script>

<a class="logo" href={href('/')} aria-label="CS 221M home" {onclick}>
	<Trajectory
		storyIds={[storyId]}
		{yaw}
		simplify={3}
		showCloud={false}
		showLabels={false}
		gradients={[pathGradients[0]]}
		lineScale={1.1}
	/>
</a>

<style>
	.logo {
		display: block;
		width: 4rem;
		height: 4rem;
		flex: none;
	}

	.logo:focus-visible {
		outline: 2px solid var(--cardinal);
		outline-offset: 4px;
		border-radius: 0.4rem;
	}
</style>
