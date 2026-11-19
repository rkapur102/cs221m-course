<script lang="ts">
	import { extras, scheduleFor, weeks, type ScheduleRow, type Tag } from '../course';
	import { viewState } from '../view.svelte.ts';
	import TagMark from './TagMark.svelte';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import ExternalLink from '@lucide/svelte/icons/external-link';

	const shown = $derived(scheduleFor(viewState.current));

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
		<span class="key"><span aria-hidden="true"><TagMark tag="inside" /></span> inside the model</span>
		<span class="key"><span aria-hidden="true"><TagMark tag="outside" /></span> outside the model</span>
	</p>

	<ol class="weeks" class:dated={shown.showDates}>
		{#each weeks as week (week.n)}
			<li>
				<a class="row linked" href="/week/{week.n}">
					<span class="week">Week {week.n}</span>
					<ul class="items">
						{#each week.lectures as lec (lec.num)}
							<li>
								{#if shown.showDates}<span class="date">{lec.date}</span>{/if}
								<span class="title">
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
							<li>
								{#if shown.showDates}<span class="date">{row.date}</span>{/if}
								<span class="title">
									<span class="name">{row.title}</span>
									{#if row.link}
										<a class="aside" href={row.link.url} target="_blank" rel="noopener">{row.link.label} <ExternalLink class="ext" size="0.9em" strokeWidth={1.75} aria-hidden="true" /></a>
									{/if}
								</span>
								{#if row.readings}
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
			<a class="row linked extra" href="/extra/rsa">
				<span class="week">Extra notebooks</span>
				<ul class="items">
					{#each extras as lec (lec.title)}
						<li>
							<span class="title">
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
	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem 1.5rem;
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
		outline: 2px solid var(--gf-orange);
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

	.dated .extra .items li {
		grid-template-columns: 1fr;
	}

	.date {
		font-family: var(--font-sub);
		font-size: 0.82rem;
		color: var(--muted);
		white-space: nowrap;
	}

	.title {
		display: inline;
	}

	.num {
		font-family: var(--font-sub);
		font-size: 0.82rem;
		font-weight: 600;
		color: var(--cardinal);
		margin-right: 0.4rem;
		white-space: nowrap;
	}

	.name {
		margin-right: 0.35rem;
	}

	.nowrap {
		white-space: nowrap;
	}

	.row:not(.linked) .name {
		color: var(--muted);
	}

	.aside {
		font-family: var(--font-sub);
		font-size: 0.8rem;
		white-space: nowrap;
	}

	.items .readings {
		grid-column: 2;
		display: block;
		margin: 0.25rem 0 0.2rem;
		padding: 0;
		list-style: none;
		font-family: var(--font-sub);
		font-size: 0.8rem;
		line-height: 1.45;
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

	.readings :global(.ext),
	.aside :global(.ext) {
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
			grid-column: 1 / -1;
		}

		.items {
			grid-column: 1;
		}

		.arrow {
			grid-column: 2;
			grid-row: 2;
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
</style>
