import { describe, it, expect } from 'vitest';
import { readingOrder, neighbors } from './sequence';

describe('sequence', () => {
	it('orders the pages', () => {
		expect(readingOrder().map((p) => p.href)).toEqual([
			'/week/1', '/week/1/materials', '/week/2', '/week/2/materials', '/week/3', '/week/3/materials',
			'/week/4', '/week/4/materials', '/week/5', '/week/5/materials', '/closing', '/extras'
		]);
	});
	it('finds neighbors', () => {
		expect(neighbors('/week/1')).toEqual({
			back: { href: '/', label: 'Home' },
			next: expect.objectContaining({ href: '/week/1/materials' })
		});
		expect(neighbors('/extras').next).toBeNull();
		expect(neighbors('/week/3/materials')).toMatchObject({ back: { href: '/week/3' }, next: { href: '/week/4' } });
		expect(neighbors('/week/3/materials/')).toMatchObject({ back: { href: '/week/3' } });
	});
});
