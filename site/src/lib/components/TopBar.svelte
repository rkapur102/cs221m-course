<script lang="ts">
	import { page } from '$app/state';
	import TrajectoryLogo from './TrajectoryLogo.svelte';

	let { storyId }: { storyId: string } = $props();
</script>

<nav class="topbar" aria-label="Site">
	<TrajectoryLogo {storyId} />
	<div class="links">
		<a href="/#schedule">Schedule</a>
		<a href="/logistics" aria-current={page.url.pathname === '/logistics' ? 'page' : undefined}>Logistics</a>
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
		padding: 0.9rem 1rem;
	}

	.links {
		display: flex;
		gap: 1.75rem;
		font-family: var(--font-title);
		font-size: 1.3rem;
		line-height: 1.2;
	}

	.links a {
		position: relative;
		color: var(--ink);
		text-decoration: none;
		padding: 0.4rem 0;
	}

	.links a::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0.1rem;
		height: 1px;
		background: var(--gf-orange);
		transform: scaleX(0);
		transform-origin: left;
		transition: transform 220ms ease;
	}

	.links a:hover::after,
	.links a:focus-visible::after,
	.links a[aria-current='page']::after {
		transform: scaleX(1);
	}

	.links a:focus-visible {
		outline: 2px solid var(--gf-orange);
		outline-offset: 3px;
	}

	@media (prefers-reduced-motion: reduce) {
		.links a::after {
			transition: none;
		}
	}
</style>
