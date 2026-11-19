<script lang="ts">
	import type { Tag } from '../course';
	import CircleDot from '@lucide/svelte/icons/circle-dot';
	import CircleArrowOutUpRight from '@lucide/svelte/icons/circle-arrow-out-up-right';

	let { tag }: { tag: Tag } = $props();
</script>

{#if tag}
	<span class="tag-mark" title={tag === 'inside' ? 'Inside the model' : 'Outside the model'}>
		{#if tag === 'inside'}
			<CircleDot size="1.15em" strokeWidth={1.75} aria-hidden="true" />
		{:else}
			<CircleArrowOutUpRight size="1.15em" strokeWidth={1.75} aria-hidden="true" />
		{/if}
		<span class="visually-hidden">{tag === 'inside' ? 'Inside the model' : 'Outside the model'}</span>
	</span>
{/if}

<style>
	.tag-mark {
		display: inline-flex;
		align-items: center;
		vertical-align: -0.12em;
		line-height: 1;
	}

	.tag-mark :global(svg) {
		color: var(--gf-orange);
		opacity: 0.9;
	}

	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		margin: -1px;
		padding: 0;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
		border: 0;
	}
</style>
