import { describe, it, expect } from 'vitest';
import { arrowGlyph, bestSpan, forwardness } from './arrow';
import { storyIds } from './data';
import { arrowStoryIds } from '../course';

describe('arrow glyphs', () => {
	it('uses stories that exist', () => {
		expect(storyIds).toContain(arrowStoryIds.back);
		expect(storyIds).toContain(arrowStoryIds.next);
	});
	it('picks a stretch that runs forward more than the whole story does', () => {
		for (const id of Object.values(arrowStoryIds)) {
			const span = bestSpan(id);
			expect(span[1] - span[0]).toBeGreaterThanOrEqual(6);
			expect(forwardness(id, span)).toBeGreaterThan(forwardness(id));
		}
	});
	it('fits the glyph box with the tail on the left and the head on the right', () => {
		const g = arrowGlyph(arrowStoryIds.next, { tame: 0, span: bestSpan(arrowStoryIds.next) });
		const nums = (g.body + ' ' + g.head).match(/-?[\d.]+/g)!.map(Number);
		const xs = nums.filter((_, i) => i % 2 === 0);
		const ys = nums.filter((_, i) => i % 2 === 1);
		expect(Math.min(...xs)).toBeGreaterThanOrEqual(0);
		expect(Math.max(...xs)).toBeLessThanOrEqual(g.width);
		expect(Math.min(...ys)).toBeGreaterThanOrEqual(0);
		expect(Math.max(...ys)).toBeLessThanOrEqual(g.height);
		expect(g.tail[0]).toBeLessThan(g.width / 3);
		expect(g.head).toMatch(/^M/);
	});
});
