<script lang="ts">
	import TrajectoryLogo from './TrajectoryLogo.svelte';

	let { storyId }: { storyId: string } = $props();
</script>

<nav class="topbar" aria-label="Site">
	<TrajectoryLogo {storyId} />
	<div class="links">
		<a href="/#schedule">Schedule</a>
		<a href="/logistics">Logistics</a>
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
		gap: 1.4rem;
		font-family: var(--font-sub);
		font-size: 0.95rem;
		font-weight: 600;
	}

	.links a {
		color: var(--ink);
		text-decoration: none;
		padding: 0.4rem 0;
	}

	.links a:hover {
		text-decoration: underline;
		text-underline-offset: 0.2em;
	}
</style>
