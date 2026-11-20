<script lang="ts">
	import BookOpen from '@lucide/svelte/icons/book-open';
	import GraduationCap from '@lucide/svelte/icons/graduation-cap';
	import { setView, viewState } from '../view.svelte.ts';
</script>

<div class="toggle" role="group" aria-label="Course view">
	<button
		type="button"
		title="Self-paced view"
		aria-label="Self-paced view"
		aria-pressed={viewState.current === 'self'}
		class:active={viewState.current === 'self'}
		onclick={() => setView('self')}
	>
		<BookOpen size={17} strokeWidth={1.75} aria-hidden="true" />
	</button>
	<span class="divider" aria-hidden="true"></span>
	<button
		type="button"
		title="Enrolled view"
		aria-label="Enrolled view"
		aria-pressed={viewState.current === 'enrolled'}
		class:active={viewState.current === 'enrolled'}
		onclick={() => setView('enrolled')}
	>
		<GraduationCap size={18} strokeWidth={1.75} aria-hidden="true" />
	</button>
</div>

<style>
	/* Same rounded rectangle as .btn-quiet, split in two by a thin divider. */
	.toggle {
		display: inline-flex;
		align-items: stretch;
		overflow: hidden;
		border: 1px solid rgba(26, 26, 26, 0.25);
		border-radius: 0.5rem;
		background: rgba(255, 255, 255, 0.85);
	}

	.divider {
		width: 1px;
		background: rgba(26, 26, 26, 0.25);
	}

	button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2.5rem;
		height: 2.25rem;
		padding: 0;
		border: 0;
		border-radius: 0;
		background: transparent;
		color: var(--muted);
		cursor: pointer;
		transition:
			color 150ms ease,
			background-color 150ms ease;
	}

	button :global(svg) {
		color: currentColor;
	}

	button:hover {
		color: var(--cardinal);
	}

	button.active {
		color: var(--cardinal);
		background: rgba(196, 101, 45, 0.12);
		box-shadow: inset 0 0 0 1px rgba(196, 101, 45, 0.45);
	}

	button:focus-visible {
		outline: 2px solid var(--cardinal);
		outline-offset: -3px;
	}

	@media (max-width: 40rem) {
		button {
			width: 2.25rem;
			height: 2.125rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		button {
			transition: none;
		}
	}
</style>
