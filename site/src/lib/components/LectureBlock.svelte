<script lang="ts">
	import TagMark from './TagMark.svelte';
	import ExternalLink from '@lucide/svelte/icons/external-link';
	import NotebookPen from '@lucide/svelte/icons/notebook-pen';
	import Presentation from '@lucide/svelte/icons/presentation';
	import { colabUrl, lectureLabel, slidesUrl, type Lecture } from '../course';

	let { lecture }: { lecture: Lecture } = $props();
	const hasNotebook = $derived(lecture.notebooks.length > 0);
</script>

<section class="lecture">
	<h2>
		{lectureLabel(lecture)}: {lecture.title}
		<TagMark tag={lecture.tag} />
	</h2>

	<div class="buttons">
		{#each lecture.notebooks as nb}
			<a class="btn-quiet" href={colabUrl(nb.file)} target="_blank" rel="noopener">
				<NotebookPen size="1.1em" strokeWidth={1.75} aria-hidden="true" />
				Open notebook{nb.label ? ` (${nb.label})` : ''} in Colab
				<ExternalLink size="1em" strokeWidth={1.75} aria-hidden="true" />
			</a>
		{/each}
		{#if lecture.slides}
			<a class="btn-quiet" href={slidesUrl(lecture.num)} target="_blank" rel="noopener">
				<Presentation size="1.1em" strokeWidth={1.75} aria-hidden="true" />
				Slides (PDF)
				<ExternalLink size="1em" strokeWidth={1.75} aria-hidden="true" />
			</a>
		{/if}
	</div>
	{#if !hasNotebook}
		<p class="none">No notebook for this lecture.</p>
	{/if}

	{#if lecture.readings.length > 0}
		<div class="supplemental">
			<h3>Supplemental readings</h3>
			<ul class="readings">
				{#each lecture.readings as r}
					<li>
						<a href={r.url} target="_blank" rel="noopener"><strong>{r.authors}</strong> ({r.year}), <em>{r.title}</em>.</a>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</section>

<style>
	.lecture {
		padding: 2.25rem 0;
		border-top: 1px solid rgba(26, 26, 26, 0.1);
	}

	h2 {
		margin: 0 0 1.1rem;
		font-size: 1.7rem;
	}

	.buttons {
		display: flex;
		flex-wrap: wrap;
		gap: 0.7rem;
	}

	.none {
		margin: 0.7rem 0 0;
		font-family: var(--font-sub);
		color: var(--muted);
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
