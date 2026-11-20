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
		<BookOpen size={16} strokeWidth={1.75} aria-hidden="true" />
		<span>Self-paced</span>
	</button>
	<span class="divider" aria-hidden="true"></span>
	<button
		type="button"
		title="Student view"
		aria-label="Student view"
		aria-pressed={viewState.current === 'enrolled'}
		class:active={viewState.current === 'enrolled'}
		onclick={() => setView('enrolled')}
	>
		<GraduationCap size={17} strokeWidth={1.75} aria-hidden="true" />
		<span>Student</span>
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
		gap: 0.45rem;
		height: 2.25rem;
		padding: 0 0.85rem;
		font-family: var(--font-sub);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		white-space: nowrap;
		line-height: 1;
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
		flex: none;
	}

	/* Caps sit high in the line box; nudge them so they center on the icon. */
	button span {
		display: block;
		padding-top: 0.07em;
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
			height: 2.125rem;
			padding: 0 0.65rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		button {
			transition: none;
		}
	}
</style>
