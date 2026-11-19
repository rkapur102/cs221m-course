import { describe, expect, it } from 'vitest';
import { simplifyPath } from './simplify';

const path = (n: number) => Array.from({ length: n }, (_, i) => i);

describe('simplifyPath', () => {
	it('keeps Start and End', () => {
		for (const n of [3, 8, 14, 21, 30]) {
			const out = simplifyPath(path(n), 3);
			expect(out[0]).toBe(0);
			expect(out[out.length - 1]).toBe(n - 1);
		}
	});
	it('respects the stride between interior points', () => {
		expect(simplifyPath(path(11), 3)).toEqual([0, 3, 6, 10]);
		expect(simplifyPath(path(10), 3)).toEqual([0, 3, 6, 9]);
	});
	it('drops a point that would crowd End', () => {
		expect(simplifyPath(path(8), 3)).toEqual([0, 3, 7]);
	});
	it('returns the path unchanged for stride below 2 or tiny paths', () => {
		expect(simplifyPath(path(9), 1)).toEqual(path(9));
		expect(simplifyPath(path(2), 3)).toEqual([0, 1]);
	});
});
