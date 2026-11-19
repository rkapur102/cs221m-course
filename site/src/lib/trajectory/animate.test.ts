import { afterEach, describe, expect, it, vi } from 'vitest';
import { animate, easeInOutCubic } from './animate';

function mockMatchMedia(reduce: boolean) {
	vi.stubGlobal('matchMedia', (q: string) => ({ matches: reduce && q.includes('reduce'), media: q }));
}

afterEach(() => vi.unstubAllGlobals());

describe('animate', () => {
	it('jumps to the final frame under reduced motion', async () => {
		mockMatchMedia(true);
		const raf = vi.fn();
		vi.stubGlobal('requestAnimationFrame', raf);
		const frames: number[] = [];
		await animate(1000, (t) => frames.push(t));
		expect(frames).toEqual([1]);
		expect(raf).not.toHaveBeenCalled();
	});

	it('resolves with the final frame when aborted', async () => {
		mockMatchMedia(false);
		const ctrl = new AbortController();
		const frames: number[] = [];
		vi.stubGlobal('requestAnimationFrame', () => 1);
		vi.stubGlobal('cancelAnimationFrame', () => {});
		const done = animate(1000, (t) => frames.push(t), { signal: ctrl.signal });
		ctrl.abort();
		await done;
		expect(frames.at(-1)).toBe(1);
	});

	it('resolves at once when the signal is already aborted', async () => {
		mockMatchMedia(false);
		const ctrl = new AbortController();
		ctrl.abort();
		const frames: number[] = [];
		await animate(1000, (t) => frames.push(t), { signal: ctrl.signal });
		expect(frames).toEqual([1]);
	});

	it('runs frames up to 1 over the duration', async () => {
		mockMatchMedia(false);
		let now = 0;
		vi.stubGlobal('performance', { now: () => now });
		vi.stubGlobal('cancelAnimationFrame', () => {});
		vi.stubGlobal('requestAnimationFrame', (cb: (t: number) => void) => {
			now += 100;
			queueMicrotask(() => cb(now));
			return 1;
		});
		const frames: number[] = [];
		await animate(500, (t) => frames.push(t), { ease: (t) => t });
		expect(frames.at(-1)).toBe(1);
		expect(frames.length).toBeGreaterThan(3);
		for (let i = 1; i < frames.length; i++) expect(frames[i]).toBeGreaterThanOrEqual(frames[i - 1]);
	});
});

describe('easeInOutCubic', () => {
	it('maps the endpoints and midpoint', () => {
		expect(easeInOutCubic(0)).toBe(0);
		expect(easeInOutCubic(1)).toBe(1);
		expect(easeInOutCubic(0.5)).toBeCloseTo(0.5);
	});
});
