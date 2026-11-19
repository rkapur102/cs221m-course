<script lang="ts">
	import TagMark from './TagMark.svelte';
	import ExternalLink from '@lucide/svelte/icons/external-link';
	import { colabUrl, slidesUrl, type Lecture } from '../course';

	let { lecture }: { lecture: Lecture } = $props();
	const hasNotebook = $derived(lecture.notebooks.length > 0);
	const slidesFirst = $derived(!hasNotebook && lecture.slides);
	const slidesLabel = $derived(lecture.num > 0 ? `Lecture ${lecture.num} slides` : 'Slides');
	const showSlidesInline = $derived(lecture.slides && !slidesFirst);
	const hasSupplemental = $derived(showSlidesInline || lecture.readings.length > 0);
</script>

<section class="lecture">
	<h2>
		{#if lecture.num > 0}<span class="num">Lecture {lecture.num}</span>{/if}
		<span class="title">{lecture.title}</span>
		<TagMark tag={lecture.tag} />
	</h2>

	{#if hasNotebook}
		<div class="notebooks">
			{#each lecture.notebooks as nb}
				<a class="primary" href={colabUrl(nb.file)} target="_blank" rel="noopener">
					Open notebook{nb.label ? ` (${nb.label})` : ''} in Colab <ExternalLink size="1em" strokeWidth={1.75} aria-hidden="true" />
				</a>
			{/each}
		</div>
	{:else}
		{#if slidesFirst}
			<div class="notebooks">
				<a class="primary" href={slidesUrl(lecture.num)} target="_blank" rel="noopener">
					Open {slidesLabel} (PDF) <ExternalLink size="1em" strokeWidth={1.75} aria-hidden="true" />
				</a>
			</div>
			<p class="none beneath">No notebook for this lecture.</p>
		{:else}
			<p class="none">No notebook for this lecture.</p>
		{/if}
	{/if}

	{#if hasSupplemental}
		<div class="supplemental">
			<h3>{hasNotebook ? 'Supplemental' : 'Materials'}</h3>
			{#if showSlidesInline}
				<p class="slides"><a href={slidesUrl(lecture.num)} target="_blank" rel="noopener">{slidesLabel} (PDF)</a></p>
			{/if}
			{#if lecture.readings.length > 0}
				<ul class="readings">
					{#each lecture.readings as r}
						<li>
							<a href={r.url} target="_blank" rel="noopener"><strong>{r.authors}</strong> ({r.year}), <em>{r.title}</em>.</a>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	{/if}
</section>

<style>
	.lecture {
		padding: 2.25rem 0;
		border-top: 1px solid rgba(26, 26, 26, 0.1);
	}

	h2 {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.2rem 0.8rem;
		margin: 0 0 1.1rem;
		font-size: 1.7rem;
	}

	.num {
		font-family: var(--font-sub);
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--muted);
	}

	.notebooks {
		display: flex;
		flex-wrap: wrap;
		gap: 0.7rem;
	}

	.primary {
		display: inline-flex;
		align-items: center;
		gap: 0.5em;
		padding: 0.8rem 1.4rem;
		background: var(--cardinal);
		color: #fff;
		border-radius: 0.4rem;
		font-family: var(--font-sub);
		font-size: 1.05rem;
		font-weight: 700;
		text-decoration: none;
	}

	.primary:hover {
		background: var(--gf-red);
	}

	.primary:focus-visible {
		outline: 3px solid var(--gf-gold);
		outline-offset: 2px;
	}

	.none {
		margin: 0;
		font-family: var(--font-sub);
		color: var(--muted);
	}

	.beneath {
		margin-top: 0.7rem;
	}

	.supplemental {
		margin-top: 1.5rem;
		font-size: 0.95rem;
	}

	h3 {
		margin: 0 0 0.5rem;
		font-family: var(--font-sub);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--muted);
	}

	.slides {
		margin: 0 0 0.6rem;
	}

	.readings {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.readings li {
		margin: 0 0 0.45rem;
	}

	.supplemental a {
		color: var(--cardinal);
		text-decoration-color: rgba(140, 21, 21, 0.35);
		text-underline-offset: 0.15em;
	}

	.supplemental a:hover {
		text-decoration-color: currentColor;
	}
</style>
