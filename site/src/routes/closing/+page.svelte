<script lang="ts">
	import LeadIn from '#lib/components/LeadIn.svelte';
	import { bridgingHtml } from '../../lib/bridging';
	import { closing } from '../../lib/course';

	const html = bridgingHtml(closing.bridging);
	const email = 'cs221m-spr2526-staff@lists.stanford.edu';
</script>

<svelte:head>
	<title>Closing | CS 221M</title>
</svelte:head>

<LeadIn storyId={closing.storyId} {html}>
	{#snippet header()}
		<h1>Closing</h1>
	{/snippet}
	{#snippet after()}
		<section class="links" aria-label="Links">
			<ul>
				<li><a href="https://github.com/rkapur102/cs221m-course">Course materials on GitHub</a></li>
				<li><a href="https://www.goodfire.com/research/stories-in-space">Goodfire's post, <em>Meandering on Manifolds</em></a></li>
				<li><a href="mailto:{email}">Email the course staff</a></li>
			</ul>
			<p class="credit">
				Trajectory visuals adapted from Goodfire's
				<a href="https://www.goodfire.com/research/stories-in-space"><em>Meandering on Manifolds</em></a>
				(<a href="https://arxiv.org/abs/2605.12412">Bigelow et al., 2026</a>).
			</p>
		</section>
	{/snippet}
</LeadIn>

<style>
	h1 {
		font-size: clamp(2.6rem, 7vw, 4rem);
	}

	.links {
		width: min(var(--content), 100% - 2rem);
		margin: 3rem auto 0;
		padding-top: 1.5rem;
		border-top: 1px solid rgba(26, 26, 26, 0.1);
		font-family: var(--font-sub);
	}

	ul {
		margin: 0 0 1.2rem;
		padding: 0;
		list-style: none;
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 1.5rem;
	}

	a {
		color: var(--cardinal);
		text-decoration-color: rgba(140, 21, 21, 0.35);
		text-underline-offset: 0.15em;
		overflow-wrap: anywhere;
	}

	a:hover {
		text-decoration-color: currentColor;
	}

	.credit {
		margin: 0;
		font-size: 0.85rem;
		color: var(--muted);
	}
</style>
