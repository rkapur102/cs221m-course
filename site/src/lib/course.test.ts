import { describe, it, expect } from 'vitest';
import { weeks, colabUrl, slidesUrl, guestRows, extras } from './course';

describe('course', () => {
	it('groups lectures by week', () => {
		expect(weeks.map((w) => w.lectures.map((l) => l.num))).toEqual([[1, 2], [3, 4], [5, 6], [7, 8], [9, 10]]);
	});
	it('tags', () => {
		expect(weeks.flatMap((w) => w.lectures).filter((l) => l.tag === 'outside').map((l) => l.num)).toEqual([3]);
		expect(extras[0].tag).toBe('inside');
	});
	it('slides flags', () => {
		expect(weeks.flatMap((w) => w.lectures).filter((l) => !l.slides).map((l) => l.num)).toEqual([8, 10]);
	});
	it('urls', () => {
		expect(colabUrl('04_probes.ipynb')).toBe('https://colab.research.google.com/github/rkapur102/cs221m-course/blob/main/04_probes.ipynb');
		expect(slidesUrl(3)).toBe('https://github.com/rkapur102/cs221m-course/blob/main/materials/03_slides.pdf');
	});
	it('bridging files', () => {
		expect(weeks.map((w) => w.bridging)).toEqual(['00_into_week_1.md', '01_week_1_to_week_2.md', '02_week_2_to_week_3.md', '03_week_3_to_week_4.md', '04_week_4_to_week_5.md']);
	});
	it('guest rows', () => {
		expect(guestRows).toHaveLength(10);
		expect(guestRows.map((r) => r.week)).toEqual([6, 6, 7, 7, 8, 8, 9, 9, 10, 10]);
	});
});
