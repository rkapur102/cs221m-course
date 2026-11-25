import { describe, it, expect } from 'vitest';
import { contentsFor } from './contents';

describe('contentsFor', () => {
	it('lists homepage sections by view', () => {
		expect(contentsFor('self')[0].items.map((i) => i.label)).toEqual(['Course description', 'Staff', 'Schedule']);
		expect(contentsFor('enrolled')[0].items.map((i) => i.href)).toEqual([
			'/#about', '/#staff', '/#logistics', '/#schedule', '/#faq'
		]);
	});
	it('numbers each week and ends with the wrap-up pages', () => {
		const groups = contentsFor('self');
		expect(groups.map((g) => g.heading)).toEqual(['Home', 'Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Wrap-up']);
		expect(groups[3].items).toEqual([
			{ href: '/week/3', label: 'Lead-In', num: '3.1' },
			{ href: '/week/3/materials', label: 'Materials', num: '3.2' }
		]);
		expect(groups[6].items.map((i) => i.href)).toEqual(['/closing', '/extras']);
	});
	it('every reading-order page appears exactly once', () => {
		const hrefs = contentsFor('enrolled').flatMap((g) => g.items.map((i) => i.href)).filter((h) => !h.startsWith('/#'));
		expect(new Set(hrefs).size).toBe(hrefs.length);
		expect(hrefs).toHaveLength(12);
	});
});
