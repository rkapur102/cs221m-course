import { describe, it, expect } from 'vitest';
import { splitPath } from './splitPath';

const path = [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 10 }];

describe('splitPath', () => {
	it('t=0 puts the split at the first point', () => {
		const { head, tail } = splitPath(path, 0);
		expect(head[head.length - 1]).toEqual({ x: 0, y: 0 });
		expect(tail[0]).toEqual({ x: 0, y: 0 });
		expect(tail).toHaveLength(3);
	});
	it('t=1 puts the split at the last point and leaves no remainder', () => {
		const { head, tail } = splitPath(path, 1);
		expect(head).toEqual(path);
		expect(tail).toEqual([{ x: 10, y: 10 }]);
	});
	it('t=0.5 splits at the joint of a two-segment path', () => {
		const { head, tail } = splitPath(path, 0.5);
		expect(head[head.length - 1]).toEqual({ x: 10, y: 0 });
		expect(tail[0]).toEqual({ x: 10, y: 0 });
	});
	it('t=0.25 splits halfway along the first segment, head and tail agreeing', () => {
		const { head, tail } = splitPath(path, 0.25);
		expect(head).toEqual([{ x: 0, y: 0 }, { x: 5, y: 0 }]);
		expect(tail).toEqual([{ x: 5, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 10 }]);
	});
});
