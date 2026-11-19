export interface PageRef {
	href: string;
	label: string;
}

const HOME: PageRef = { href: '/', label: 'Home' };

export function readingOrder(): PageRef[] {
	const pages: PageRef[] = [];
	for (let n = 1; n <= 5; n++) {
		pages.push({ href: `/week/${n}`, label: `Week ${n}` });
		pages.push({ href: `/week/${n}/materials`, label: `Week ${n}: Materials` });
	}
	pages.push({ href: '/closing', label: 'Closing' });
	pages.push({ href: '/extras', label: 'Extra notebooks' });
	return pages;
}

export function neighbors(href: string): { back: PageRef | null; next: PageRef | null } {
	const path = href.length > 1 ? href.replace(/\/+$/, '') : href;
	const order = readingOrder();
	const i = order.findIndex((p) => p.href === path);
	if (i < 0) return { back: null, next: null };
	return { back: i === 0 ? HOME : order[i - 1], next: order[i + 1] ?? null };
}
