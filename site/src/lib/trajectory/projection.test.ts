import { describe, expect, it } from 'vitest';
import { project } from './projection';

const size = { w: 200, h: 100 };

describe('project', () => {
	it('puts the origin at the center of the canvas', () => {
		const p = project([0, 0, 0], 0, size);
		expect(p.x).toBeCloseTo(100);
		expect(p.y).toBeCloseTo(50);
	});

	it('mirrors x around the center when rotated by pi', () => {
		const a = project([1, 0, 0], 0, size);
		const b = project([1, 0, 0], Math.PI, size);
		expect(a.x - 100).toBeGreaterThan(0);
		expect(b.x - 100).toBeCloseTo(-(a.x - 100));
		expect(b.y).toBeCloseTo(a.y);
	});

	it('gives larger depth to points nearer the camera', () => {
		const near = project([0, -1, 0], 0, size);
		const far = project([0, 1, 0], 0, size);
		expect(near.depth).toBeGreaterThan(far.depth);
	});

	it('draws higher z higher on screen', () => {
		expect(project([0, 0, 1], 0, size).y).toBeLessThan(50);
	});
});
