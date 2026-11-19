<script lang="ts">
	import TopBar from '#lib/components/TopBar.svelte';
	import LectureBlock from '#lib/components/LectureBlock.svelte';
	import SiteFooter from '#lib/components/SiteFooter.svelte';
	import { closing, extras } from '../../../lib/course';

	const rsa = extras[0];
</script>

<svelte:head>
	<title>Extra: Pragmatic inference and Rational Speech Acts | CS 221M</title>
</svelte:head>

<TopBar storyId={closing.storyId} />

<main>
	<header>
		<h1>Extra notebooks</h1>
	</header>

	<div class="blocks">
		<LectureBlock lecture={rsa} />
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
