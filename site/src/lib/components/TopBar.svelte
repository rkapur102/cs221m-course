<script lang="ts">
	import TrajectoryLogo from './TrajectoryLogo.svelte';
	import ViewToggle from './ViewToggle.svelte';

	let { storyId }: { storyId: string } = $props();
</script>

<nav class="topbar" aria-label="Site">
	<TrajectoryLogo {storyId} />
	<ViewToggle />
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
		padding: 1.25rem var(--gutter);
	}
</style>
