<script lang="ts">
	let { html }: { html: string } = $props();
</script>

<div class="prose">
	{@html html}
</div>

<style>
	.prose {
		max-width: 70ch;
		margin: 0 auto;
		font-size: 1.05rem;
		line-height: 1.8;
	}

	.prose :global(p) {
		margin: 0 0 1.4rem;
	}

	.prose :global(strong) {
		font-weight: 500;
	}

	.prose :global(em) {
		font-style: italic;
	}

	.prose :global(ul) {
		margin: 0 0 1.4rem;
		padding-left: 1.4rem;
	}

	.prose :global(li) {
		margin-bottom: 0.6rem;
	}

	.prose :global(hr) {
		border: 0;
		border-top: 1px solid rgba(26, 26, 26, 0.15);
		margin: 2.5rem 0;
	}

	.prose :global(a) {
		text-underline-offset: 0.2em;
		overflow-wrap: anywhere;
	}
</style>
