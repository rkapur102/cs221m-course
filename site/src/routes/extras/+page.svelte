<script lang="ts">
	import TopBar from '#lib/components/TopBar.svelte';
	import LectureBlock from '#lib/components/LectureBlock.svelte';
	import LectureList from '#lib/components/LectureList.svelte';
	import SiteFooter from '#lib/components/SiteFooter.svelte';
	import { courseStoryId, extras } from '../../lib/course';
</script>

<svelte:head>
	<title>Extra notebooks | CS 221M</title>
</svelte:head>

<TopBar storyId={courseStoryId} />

<main>
	<header>
		<h1>Extra notebooks</h1>
		<LectureList lectures={extras} />
	</header>

	<div class="blocks">
		{#each extras as lecture (lecture.title)}
			<LectureBlock {lecture} />
		{/each}
	</div>
</main>

<SiteFooter />

<style>
	main {
		padding: 5.5rem 0 0;
	}

	header {
		width: min(var(--content), 100% - 2rem);
		margin: 0 auto;
		text-align: center;
	}

	h1 {
		font-size: clamp(2.6rem, 7vw, 4rem);
	}

	.blocks {
		width: min(var(--content), 100% - 2rem);
		margin: 2.5rem auto 0;
	}
</style>
