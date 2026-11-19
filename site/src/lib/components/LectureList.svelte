<script lang="ts">
	import { viewState } from '../view.svelte.ts';
	import type { Lecture } from '../course';

	let { lectures }: { lectures: Lecture[] } = $props();
</script>

<ul class="lectures">
	{#each lectures as lec (lec.num)}
		<li>
			<span class="num">Lecture {lec.num}</span>
			<span class="title">{lec.title}</span>
			{#if viewState.current === 'enrolled'}<span class="date">{lec.date}</span>{/if}
		</li>
	{/each}
</ul>

<style>
	.lectures {
		margin: 0.75rem 0 0;
		padding: 0;
		list-style: none;
		font-family: var(--font-sub);
		font-size: 1.1rem;
		line-height: 1.5;
	}

	li {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: baseline;
		gap: 0 0.7em;
	}

	.num {
		font-variant-caps: all-small-caps;
		letter-spacing: 0.06em;
		font-weight: 700;
		color: var(--muted);
	}

	.title {
		color: var(--ink);
	}

	.date {
		font-size: 0.85rem;
		color: var(--muted);
	}
</style>
