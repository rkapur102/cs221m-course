import { describe, expect, it } from 'vitest';
import { cloud, getStory, storyIds } from './data';

describe('trajectory data', () => {
	it('has 1500 cloud points with matching emotions', () => {
		expect(cloud.points.length).toBe(1500);
		expect(cloud.emotion.length).toBe(cloud.points.length);
	});
	it('keeps every coordinate within [-1, 1]', () => {
		for (const p of cloud.points) for (const v of p) expect(Math.abs(v)).toBeLessThanOrEqual(1);
		for (const id of storyIds)
			for (const p of getStory(id).points) for (const v of p) expect(Math.abs(v)).toBeLessThanOrEqual(1);
	});
	it('has stories with enough sentences', () => {
		expect(getStory(storyIds[0]).points.length).toBeGreaterThanOrEqual(8);
	});
	it('throws on unknown ids', () => {
		expect(() => getStory('nope')).toThrow();
	});
});
