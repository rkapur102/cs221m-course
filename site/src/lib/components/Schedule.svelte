<script lang="ts">
	import { extras, guestAnchor, guestParts, lectureLabel, scheduleFor, weeks, type ScheduleRow, type Tag } from '../course';
	import { viewState } from '../view.svelte.ts';
	import { href } from '../paths';
	import TagMark from './TagMark.svelte';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import ExternalLink from '@lucide/svelte/icons/external-link';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';

	const shown = $derived(scheduleFor(viewState.current));
	/** Which guest rows have their suggested readings expanded, keyed by date. */
	let openReadings = $state<Record<string, boolean>>({});

	const guestWeeks = $derived.by(() => {
		const byWeek = new Map<number, ScheduleRow[]>();
		for (const row of shown.guestRows) byWeek.set(row.week, [...(byWeek.get(row.week) ?? []), row]);
		return [...byWeek.entries()].map(([n, rows]) => ({ n, rows }));
	});

	/** Split off the last word so the mark never wraps onto a line by itself. */
	function split(title: string): [string, string] {
		const i = title.lastIndexOf(' ');
		return i < 0 ? ['', title] : [title.slice(0, i + 1), title.slice(i + 1)];
	}
</script>

{#snippet titled(title: string, tag: Tag)}
	{@const [head, last] = split(title)}
	<span class="name">{head}<span class="nowrap">{last}{#if tag}&nbsp;<TagMark {tag} />{/if}</span></span>
{/snippet}

<div class="schedule">
	<p class="legend">
		<span class="key"><span aria-hidden="true"><TagMark tag="inside" /></span> Inside the model</span>
		<span class="key"><span aria-hidden="true"><TagMark tag="outside" /></span> Outside the model</span>
	</p>

	<ol class="weeks" class:dated={shown.showDates}>
		{#each weeks as week (week.n)}
			<li>
				<a class="row linked" href={href(`/week/${week.n}`)}>
					<span class="week">Week {week.n}</span>
					<ul class="items">
						{#each week.lectures as lec (lec.num)}
							<li>
								{#if shown.showDates}<span class="date">{lec.date}</span>{/if}
								<span class="title numbered">
									<span class="num">Lecture {lec.num}</span>
									{@render titled(lec.title, lec.tag)}
								</span>
							</li>
						{/each}
					</ul>
					<span class="arrow" aria-hidden="true"><ArrowRight size="1.1em" strokeWidth={1.75} /></span>
				</a>
			</li>
		{/each}

		{#each guestWeeks as week (week.n)}
			<li>
				<div class="row">
					<span class="week">Week {week.n}</span>
					<ul class="items">
						{#each week.rows as row (row.date)}
							{@const parts = guestParts(row.title)}
							<!-- Anchor so the navigator's contents can jump straight to this row. -->
							<li id={guestAnchor(row)} class="guest">
								{#if shown.showDates}<span class="date">{row.date}</span>{/if}
								<span class="title numbered">
									<span class="num">{parts.label}</span>
									<span class="name"
										>{parts.name}{#if row.link}<a class="tag" href={row.link.url} target="_blank" rel="noopener"
												><span class="label">{row.link.label}</span><ExternalLink class="ext" size="1.15em" strokeWidth={2} aria-hidden="true" /></a
											>{/if}{#if row.readings}<button
												type="button"
												class="tag"
												aria-expanded={openReadings[row.date] ?? false}
												onclick={() => (openReadings[row.date] = !openReadings[row.date])}
												><span class="label">Suggested readings</span><ChevronDown class="chev" size="1.15em" strokeWidth={2} aria-hidden="true" /></button
											>{/if}</span
									>
								</span>
								{#if row.readings && openReadings[row.date]}
									<ul class="readings">
										{#each row.readings as r (r.url)}
											<li><a href={r.url} target="_blank" rel="noopener"><strong>{r.authors}</strong> ({r.year}), <em>{r.title}</em>. <ExternalLink class="ext" size="0.95em" strokeWidth={1.75} aria-hidden="true" /></a></li>
										{/each}
									</ul>
								{/if}
							</li>
						{/each}
					</ul>
				</div>
			</li>
		{/each}

		<li>
			<a class="row linked extra" href={href('/extras')}>
				<span class="week">Extras</span>
				<ul class="items">
					{#each extras as lec (lec.title)}
						<li>
							{#if shown.showDates}<span class="date" aria-hidden="true"></span>{/if}
							<span class="title numbered">
								<span class="num">{lectureLabel(lec)}</span>
								{@render titled(lec.title, lec.tag)}
							</span>
						</li>
					{/each}
				</ul>
				<span class="arrow" aria-hidden="true"><ArrowRight size="1.1em" strokeWidth={1.75} /></span>
			</a>
		</li>
	</ol>
</div>

<style>
	/* Room above a guest row when the navigator jumps to it. */
	.guest {
		scroll-margin-top: 2rem;
	}

	.legend {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		gap: 0.4rem 1.25rem;
		margin: 0 0 1.25rem;
		font-family: var(--font-sub);
		font-size: 0.85rem;
		color: var(--muted);
	}

	.key {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
	}

	.weeks,
	.items {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.weeks {
		border-top: 1px solid rgba(26, 26, 26, 0.12);
	}

	.weeks > li {
		border-bottom: 1px solid rgba(26, 26, 26, 0.12);
	}

	.row {
		display: grid;
		grid-template-columns: 9.75rem 1fr 1.5rem;
		gap: 0.5rem 1.25rem;
		padding: 1.1rem 0.75rem;
		color: inherit;
		text-decoration: none;
	}

	.linked {
		transition: background-color 160ms ease;
	}

	.linked:hover,
	.linked:focus-visible {
		background: rgba(196, 101, 45, 0.06);
	}

	.linked:focus-visible {
		outline: 2px solid var(--cardinal);
		outline-offset: -2px;
	}

	.week {
		font-family: var(--font-title);
		font-size: 1.35rem;
		line-height: 1.3;
	}

	.items {
		display: grid;
		gap: 0.55rem;
	}

	.items li {
		display: grid;
		grid-template-columns: 1fr;
		gap: 0 1rem;
		align-items: baseline;
	}

	.dated .items li {
		grid-template-columns: 7.5rem 1fr;
	}

	.date {
		font-family: var(--font-sub);
		font-size: 0.82rem;
		color: var(--muted);
		white-space: nowrap;
	}

	/* Label in its own column, so a wrapped title stays indented past "Lecture 10" / "Notebook". */
	.title.numbered {
		display: grid;
		grid-template-columns: 6.25rem 1fr;
		column-gap: 0.4rem;
		align-items: baseline;
	}

	.num {
		font-family: var(--font-sub);
		font-size: 0.82rem;
		font-weight: 600;
		color: var(--cardinal);
		white-space: nowrap;
	}

	.name {
		margin-right: 0.35rem;
	}

	.nowrap {
		white-space: nowrap;
	}

	.items .readings {
		grid-column: 2;
		display: block;
		list-style: none;
		/* Indented past the label column, under the speaker's name. */
		margin: 0.45rem 0 0.2rem;
		padding: 0 0 0 6.65rem;
		/* Same as the readings on the materials pages. */
		font-family: var(--font-body);
		font-size: 0.95rem;
		line-height: 1.6;
	}

	.items .readings li {
		display: block;
		margin: 0 0 0.2rem;
	}

	.readings a {
		color: var(--cardinal);
		text-decoration-color: rgba(140, 21, 21, 0.35);
		text-underline-offset: 0.15em;
	}

	.readings a:hover {
		text-decoration-color: currentColor;
	}

	.readings :global(.ext) {
		vertical-align: -0.1em;
		opacity: 0.7;
	}

	.arrow {
		display: inline-flex;
		align-self: center;
		justify-self: end;
		color: var(--gf-orange);
		opacity: 0.45;
		transition:
			transform 160ms ease,
			opacity 160ms ease;
	}

	.linked:hover .arrow,
	.linked:focus-visible .arrow {
		opacity: 1;
		transform: translateX(3px);
	}

	@media (max-width: 640px) {
		.row {
			grid-template-columns: 1fr 1.25rem;
			padding: 1rem 0.25rem;
		}

		.week {
			grid-column: 1;
			grid-row: 1;
		}

		.items {
			grid-column: 1;
			grid-row: 2;
		}

		/* Span the week heading and its items, so the arrow sits centered on the whole row. */
		.arrow {
			grid-column: 2;
			grid-row: 1 / span 2;
		}

		.dated .items li {
			grid-template-columns: 1fr;
		}

		.items .readings {
			grid-column: 1;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.linked,
		.arrow {
			transition: none;
		}
	}

	/* Small clickable chips beside a guest row ("Slides", "Suggested readings"). */
	.tag {
		display: inline-flex;
		align-items: center;
		gap: 0.35em;
		margin-left: 0.6rem;
		padding: 0.3rem 0.5rem;
		/* Centered on the name's x-height, then lifted (top below) to its optical middle. */
		vertical-align: middle;
		position: relative;
		/* x-height middle is a hair low for a mixed-case name; lift to its optical middle. */
		top: -0.1em;
		border: 1px solid rgba(140, 21, 21, 0.3);
		border-radius: 0.35rem;
		background: transparent;
		color: var(--cardinal);
		font-family: var(--font-sub);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		line-height: 1;
		text-transform: uppercase;
		text-decoration: none;
		white-space: nowrap;
		cursor: pointer;
		transition: background-color 150ms ease;
	}

	/* Caps sit high in a line-height:1 box; this centers them on the icons. */
	.tag .label {
		display: block;
		padding-top: var(--caps-nudge);
	}

	.tag :global(svg) {
		flex: none;
	}

	.tag:hover,
	.tag:focus-visible {
		background: rgba(196, 101, 45, 0.1);
	}

	.tag:focus-visible {
		outline: 2px solid var(--cardinal);
		outline-offset: 2px;
	}

	.tag :global(.chev) {
		transition: transform 150ms ease;
	}

	.tag[aria-expanded='true'] :global(.chev) {
		transform: rotate(180deg);
	}

	@media (prefers-reduced-motion: reduce) {
		.tag,
		.tag :global(.chev) {
			transition: none;
		}
	}

	/* Phones: the tag gets its own line under the name, so Slides and Suggested readings
	   sit the same way instead of one inline and one wrapped. (After the base .tag rule.) */
	@media (max-width: 640px) {
		.tag {
			display: flex;
			width: fit-content;
			max-width: 100%;
			margin: 0.4rem 0 0;
			top: 0;
			white-space: normal;
			text-align: left;
		}
	}
</style>
