<script lang="ts">
	import TrajectoryLogo from './TrajectoryLogo.svelte';
	import ViewToggle from './ViewToggle.svelte';
	import { viewState } from '../view.svelte.ts';

	let { storyId }: { storyId: string } = $props();
</script>

<nav class="topbar" aria-label="Site">
	<TrajectoryLogo {storyId} />
	<div class="links">
		<a href="/#schedule">Schedule</a>
		{#if viewState.current === 'enrolled'}
			<a href="/#logistics">Logistics</a>
		{/if}
		<ViewToggle />
	</div>
</nav>

<style>
	.topbar {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		z-index: 5;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.9rem 1.5rem;
	}

	.links {
		display: flex;
		align-items: center;
		gap: 1.75rem;
		font-family: var(--font-title);
		font-size: 1.3rem;
		line-height: 1.2;
	}

	.links a {
		color: var(--ink);
		text-decoration: none;
		padding: 0.4rem 0;
	}

	.links a:hover,
	.links a:focus-visible {
		color: var(--cardinal);
	}

	.links a {
		transition: color 160ms ease;
	}

	.links a:focus-visible {
		outline: 2px solid var(--gf-orange);
		outline-offset: 3px;
	}

	@media (max-width: 40rem) {
		.topbar {
			padding: 0.9rem 1rem;
		}

		.links {
			gap: 0.9rem;
			font-size: 1.1rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.links a {
			transition: none;
		}
	}
</style>
