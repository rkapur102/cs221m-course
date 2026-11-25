import { readingOrder } from './sequence';
import type { View } from './view.svelte.ts';

export interface ContentsItem {
	href: string;
	label: string;
	/** Shown before the label, e.g. "1.1". */
	num?: string;
}

export interface ContentsGroup {
	heading: string;
	items: ContentsItem[];
}

/** The floating navigator's table of contents. The homepage sections follow the view: Logistics and FAQ exist only for enrolled students. */
export function contentsFor(view: View): ContentsGroup[] {
	const home: ContentsItem[] = [
		{ href: '/#about', label: 'Course description' },
		{ href: '/#staff', label: 'Staff' },
		...(view === 'enrolled' ? [{ href: '/#logistics', label: 'Logistics' }] : []),
		{ href: '/#schedule', label: 'Schedule' },
		...(view === 'enrolled' ? [{ href: '/#faq', label: 'Frequently asked questions' }] : [])
	];
	const groups: ContentsGroup[] = [{ heading: 'Home', items: home }];
	const order = readingOrder();
	for (let n = 1; n <= 5; n++) {
		groups.push({
			heading: `Week ${n}`,
			items: [
				{ href: `/week/${n}`, label: 'Lead-In', num: `${n}.1` },
				{ href: `/week/${n}/materials`, label: 'Materials', num: `${n}.2` }
			]
		});
	}
	groups.push({
		heading: 'Wrap-up',
		items: order.filter((p) => !p.href.startsWith('/week/')).map((p) => ({ href: p.href, label: p.label }))
	});
	return groups;
}
