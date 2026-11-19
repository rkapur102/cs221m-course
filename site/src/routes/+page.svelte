<script lang="ts">
	import Hero from '#lib/components/Hero.svelte';
	import StaffGrid from '#lib/components/StaffGrid.svelte';
	import Schedule from '#lib/components/Schedule.svelte';
	import Logistics from '#lib/components/Logistics.svelte';
	import Faq from '#lib/components/Faq.svelte';
	import SiteFooter from '#lib/components/SiteFooter.svelte';
	import { viewState } from '../lib/view.svelte.ts';

	/** Fade a section up the first time it scrolls into view (skipped under reduced motion). */
	function reveal(node: HTMLElement) {
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		if (node.getBoundingClientRect().top < innerHeight) return;
		node.classList.add('pending');
		const io = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) return;
				node.classList.remove('pending');
				io.disconnect();
			},
			{ rootMargin: '0px 0px -8% 0px' }
		);
		io.observe(node);
		return { destroy: () => io.disconnect() };
	}
</script>

<svelte:head>
	<title>CS 221M: Mechanistic Interpretability</title>
	<meta
		name="description"
		content="CS 221M at Stanford: a broad and deep introduction to mechanistic interpretability, with an emphasis on causal methods and large language models."
	/>
</svelte:head>

<Hero />

<main>
	<section id="about" class="section" use:reveal>
		<h2>Course description</h2>
		<p class="lede">
			What is the internal structure of modern neural networks and how can we study it? This course
			provides a broad and deep introduction to interpretability, the subfield of machine learning
			concerned with understanding precisely how models process information and why they produce
			the outputs they do. We will cover topics such as probing, steering, causal abstraction, and
			sparse autoencoders, with a particular emphasis on causal methods and large language models.
			{#if viewState.current === 'enrolled'}
				The course will include guest lectures from leading interpretability labs across academia
				and industry.
			{/if}
		</p>
	</section>

	<section id="staff" class="section" use:reveal>
		<h2>Staff</h2>
		<StaffGrid />
	</section>

	{#if viewState.current === 'enrolled'}
		<section id="logistics" class="section" use:reveal>
			<h2>Logistics</h2>
			<Logistics />
		</section>
	{/if}

	<section id="schedule" class="section" use:reveal>
		<h2>Schedule</h2>
		<Schedule />
	</section>

	{#if viewState.current === 'enrolled'}
		<section id="faq" class="section" use:reveal>
			<h2>Frequently asked questions</h2>
			<Faq />
		</section>
	{/if}
</main>

<SiteFooter />

<style>
	.section {
		width: min(var(--content), 100% - 2rem);
		margin: 0 auto;
		padding-top: clamp(3.5rem, 9vh, 6rem);
		scroll-margin-top: 1rem;
		transition:
			opacity 700ms ease,
			transform 700ms ease;
	}

	.section:global(.pending) {
		opacity: 0;
		transform: translateY(14px);
	}

	h2 {
		font-size: clamp(1.9rem, 4vw, 2.4rem);
		margin-bottom: 1.5rem;
	}

	.lede {
		margin: 0;
		font-size: 1.08rem;
		line-height: 1.75;
	}
</style>
