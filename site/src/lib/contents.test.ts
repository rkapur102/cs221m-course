import { describe, it, expect } from 'vitest';
import { contentsFor, pageOf } from './contents';

describe('contentsFor', () => {
	it('lists homepage sections by view', () => {
		expect(contentsFor('self')[0].items.map((i) => i.label)).toEqual(['Course description', 'Staff', 'Schedule']);
		expect(contentsFor('enrolled')[0].items.map((i) => i.href)).toEqual([
			'/#about', '/#staff', '/#logistics', '/#schedule', '/#faq'
		]);
	});
	it('week headings open the lead-in and list the real lectures', () => {
		const week2 = contentsFor('self').find((g) => g.heading === 'Week 2')!;
		expect(week2.href).toBe('/week/2');
		expect(week2.items).toEqual([
			{ href: '/week/2/materials#lecture-3', label: 'Behavioral analysis and input attribution', tag: 'Lecture 3' },
			{ href: '/week/2/materials#lecture-4', label: 'Probes for decoding activations', tag: 'Lecture 4' }
		]);
	});
	it('never uses made-up section numbers or repeated generic labels', () => {
		const labels = contentsFor('enrolled').flatMap((g) => g.items.map((i) => i.label));
		expect(labels).not.toContain('Lead-In');
		expect(labels).not.toContain('Materials');
		expect(new Set(labels).size).toBe(labels.length);
	});
	it('shows guest lectures and project sessions only in the Student view', () => {
		expect(contentsFor('self').map((g) => g.heading)).toEqual(['Home', 'Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Wrap-up']);
		const guests = contentsFor('enrolled').find((g) => g.heading === 'Guest lectures')!;
		expect(guests.items[0]).toEqual({ href: '/#guest-chris-potts', label: 'Chris Potts', tag: 'Guest' });
		expect(guests.items.find((i) => i.label === 'Midpoint check-in')?.href).toBe('/#guest-midpoint-check-in');
		expect(new Set(guests.items.map((i) => i.href)).size).toBe(guests.items.length);
		expect(guests.items.map((i) => i.label)).toContain('Neel Nanda');
		expect(guests.items.find((i) => i.label === 'Presentations')?.tag).toBe('Project');
		expect(guests.items.some((i) => /Memorial/.test(i.label))).toBe(false);
	});
	it('ends with the wrap-up pages', () => {
		expect(contentsFor('self').at(-1)!.items.map((i) => i.href)).toEqual(['/closing', '/extras']);
	});
	it('gives Logistics and the FAQ their parts in the Student view', () => {
		const home = contentsFor('enrolled')[0].items;
		expect(home.find((i) => i.label === 'Logistics')!.children!.map((c) => c.href)).toEqual([
			'/#logistics-office-hours', '/#logistics-coursework', '/#logistics-syllabus'
		]);
		expect(home.find((i) => i.href === '/#faq')!.children!.map((c) => c.href)).toEqual([
			'/#faq-enrolling', '/#faq-auditing', '/#faq-missing-lectures', '/#faq-recordings'
		]);
		expect(contentsFor('self')[0].items.some((i) => i.children)).toBe(false);
	});
	it('pageOf drops the section', () => {
		expect(pageOf('/week/2/materials#lecture-3')).toBe('/week/2/materials');
		expect(pageOf('/#faq')).toBe('/');
	});
});
