import { guestParts, scheduleFor, scheduleWeekAnchor, weeks } from './course';
import type { View } from './view.svelte.ts';

export interface ContentsItem {
	href: string;
	label: string;
	/** Small-caps tag before the label, in the site's own terms (e.g. "Lecture 3", "Guest"). */
	tag?: string;
	/** Parts of this section, each linking to its own spot (e.g. Logistics > Syllabus). */
	children?: ContentsItem[];
}

export interface ContentsGroup {
	heading: string;
	/** When set, the heading itself links here (each week's heading opens its lead-in). */
	href?: string;
	items: ContentsItem[];
}

/** The page an href points at, without its #section. */
export function pageOf(href: string): string {
	return href.split('#')[0] || '/';
}

/**
 * The floating navigator's table of contents. Weeks list their real lectures (linking into the
 * materials page); the homepage sections and guest lectures follow the view.
 */
export function contentsFor(view: View): ContentsGroup[] {
	const enrolled = view === 'enrolled';
	const groups: ContentsGroup[] = [
		{
			heading: 'Home',
			href: '/',
			items: [
				{ href: '/#about', label: 'Course description' },
				{ href: '/#staff', label: 'Staff' },
				...(enrolled
					? [
							{
								href: '/#logistics',
								label: 'Logistics',
								children: [
									{ href: '/#logistics-office-hours', label: 'Office hours' },
									{ href: '/#logistics-coursework', label: 'Coursework' },
									{ href: '/#logistics-syllabus', label: 'Syllabus' }
								]
							}
						]
					: []),
				{ href: '/#schedule', label: 'Schedule' },
				...(enrolled
					? [
							{
								href: '/#faq',
								label: 'Frequently asked questions',
								children: [
									{ href: '/#faq-enrolling', label: 'Enrolling after applying' },
									{ href: '/#faq-auditing', label: 'Auditing' },
									{ href: '/#faq-missing-lectures', label: 'Missing lectures' },
									{ href: '/#faq-recordings', label: 'Recordings' }
								]
							}
						]
					: [])
			]
		}
	];
	for (const w of weeks) {
		groups.push({
			heading: `Week ${w.n}`,
			href: `/week/${w.n}`,
			items: w.lectures.map((l) => ({
				href: `/week/${w.n}/materials#lecture-${l.num}`,
				label: l.title,
				tag: `Lecture ${l.num}`
			}))
		});
	}
	// Student view: the guest weeks continue the course's own week numbering, as on the schedule. Each week
	// heading and each session under it jump to the top of that week's row.
	const byWeek = new Map<number, ContentsItem[]>();
	for (const row of scheduleFor(view).guestRows) {
		const parts = guestParts(row.title);
		if (!parts.label) continue; // e.g. "No lecture (Memorial Day)"
		const items = byWeek.get(row.week) ?? [];
		items.push({
			href: `/#${scheduleWeekAnchor(row.week)}`,
			label: parts.name,
			tag: parts.label === 'Guest lecture' ? 'Guest' : parts.label
		});
		byWeek.set(row.week, items);
	}
	for (const [n, items] of byWeek) groups.push({ heading: `Week ${n}`, href: `/#${scheduleWeekAnchor(n)}`, items });
	groups.push({
		heading: 'Wrap-up',
		items: [
			{ href: '/closing', label: 'Closing' },
			{ href: '/extras', label: 'Extras' }
		]
	});
	return groups;
}
