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
			aria-label={opt.value === 'self' ? 'Self-paced view' : 'Enrolled view'}
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

	/* Phones: stay fixed top-right under the top bar (never near Back and Next at the bottom),
	   compact: the active option shows its label, the other only its icon. */
	@media (max-width: 40rem) {
		.toggle {
			top: max(4.6rem, calc(env(safe-area-inset-top) + 4.6rem));
			right: max(0.75rem, env(safe-area-inset-right));
			background: rgba(255, 255, 255, 0.72);
			backdrop-filter: blur(10px);
			-webkit-backdrop-filter: blur(10px);
		}

		.toggle.home {
			top: max(0.75rem, env(safe-area-inset-top));
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
