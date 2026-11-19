<script lang="ts">
	import { page } from '$app/state';
	import BookOpen from '@lucide/svelte/icons/book-open';
	import GraduationCap from '@lucide/svelte/icons/graduation-cap';
	import { setView, viewState, type View } from '../view.svelte.ts';

	const options: { value: View; label: string }[] = [
		{ value: 'self', label: 'Self-paced' },
		{ value: 'enrolled', label: 'Enrolled' }
	];

	/** The homepage has no top bar, so the control can sit higher there. */
	const home = $derived(page.url.pathname === '/');
</script>

<div class="toggle" class:home role="radiogroup" aria-label="Course version">
	{#each options as opt (opt.value)}
		<button
			type="button"
			role="radio"
			aria-checked={viewState.current === opt.value}
			class:active={viewState.current === opt.value}
			onclick={() => setView(opt.value)}
		>
			{#if opt.value === 'self'}
				<BookOpen size={15} strokeWidth={1.75} aria-hidden="true" />
			{:else}
				<GraduationCap size={16} strokeWidth={1.75} aria-hidden="true" />
			{/if}
			{opt.label}
		</button>
	{/each}
</div>

<style>
	.toggle {
		position: fixed;
		top: 4.1rem;
		right: 1rem;
		z-index: 15;
		display: flex;
		padding: 0.15rem;
		border: 1px solid rgba(26, 26, 26, 0.16);
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.8);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
	}

	.toggle.home {
		top: 0.75rem;
		right: 0.75rem;
	}

	button {
		display: inline-flex;
		align-items: center;
		gap: 0.4em;
		height: 2.25rem;
		padding: 0 0.85rem;
		border: 0;
		border-radius: 999px;
		background: transparent;
		color: var(--muted);
		font-family: var(--font-sub);
		font-size: 0.875rem;
		font-weight: 600;
		line-height: 1;
		white-space: nowrap;
		cursor: pointer;
		transition:
			color 160ms ease,
			background-color 160ms ease;
	}

	button :global(svg) {
		flex: none;
	}

	button:hover {
		color: var(--cardinal);
	}

	button.active {
		color: var(--ink);
		background: rgba(26, 26, 26, 0.06);
	}

	button.active :global(svg) {
		color: var(--gf-red);
	}

	button:focus-visible {
		outline: 2px solid var(--gf-orange);
		outline-offset: 1px;
	}

	/* Phones: stay top-right under the top bar like desktop, but scroll away with the page so
	   the control never covers reading content or crowds Back and Next at the bottom. */
	@media (max-width: 40rem) {
		.toggle {
			position: absolute;
			top: 3.4rem;
		}

		.toggle.home {
			top: 0.75rem;
		}

		button {
			height: 2rem;
			padding: 0 0.6rem;
			font-size: 0.8rem;
		}

		button:not(.active) {
			padding: 0 0.5rem;
			font-size: 0;
			gap: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		button {
			transition: none;
		}
	}
</style>
