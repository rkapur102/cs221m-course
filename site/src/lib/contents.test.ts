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
	it('continues the weeks with the guest and project sessions in the Student view only', () => {
		expect(contentsFor('self').map((g) => g.heading)).toEqual(['Home', 'Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Wrap-up']);
		const groups = contentsFor('enrolled');
		expect(groups.map((g) => g.heading)).toEqual([
			'Home', 'Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8', 'Week 9', 'Week 10', 'Wrap-up'
		]);
		const week7 = groups.find((g) => g.heading === 'Week 7')!;
		expect(week7.href).toBe('/#schedule-week-7');
		expect(week7.items).toEqual([
			{ href: '/#schedule-week-7', label: 'David Bau', tag: 'Guest' },
			{ href: '/#schedule-week-7', label: 'Midpoint check-in', tag: 'Project' }
		]);
		const week9 = groups.find((g) => g.heading === 'Week 9')!;
		expect(week9.items.map((i) => i.label)).toEqual(['Jack Lindsey']);
		expect(groups.find((g) => g.heading === 'Week 10')!.items.at(-1)).toEqual({
			href: '/#schedule-week-10', label: 'Presentations', tag: 'Project'
		});
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
