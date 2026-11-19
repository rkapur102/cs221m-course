<script lang="ts">
	import type { Tag } from '../course';

	let { tag }: { tag: Tag } = $props();
</script>

{#if tag}
	<span class="tag-mark" title={tag === 'inside' ? 'Inside the model' : 'Outside the model'}>
		<svg viewBox="0 0 18 14" width="18" height="14" aria-hidden="true" focusable="false">
			<circle class="ring" cx="7" cy="7" r="5" />
			{#if tag === 'inside'}
				<circle class="dot" cx="7" cy="7" r="2" />
			{:else}
				<circle class="dot" cx="15.2" cy="3" r="2" />
			{/if}
		</svg>
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

	.ring {
		fill: none;
		stroke: var(--muted);
		stroke-width: 1.1;
	}

	.dot {
		fill: var(--gf-orange);
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
