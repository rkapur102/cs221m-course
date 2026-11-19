import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { IntroController, shouldPlayIntro } from './intro.svelte.ts';

beforeEach(() => {
	// Motion allowed, and frames never fire on their own: only skip() can end the intro.
	vi.stubGlobal('matchMedia', (q: string) => ({ matches: false, media: q }));
	vi.stubGlobal('requestAnimationFrame', () => 1);
	vi.stubGlobal('cancelAnimationFrame', () => {});
});

afterEach(() => vi.unstubAllGlobals());

describe('IntroController', () => {
	it('starts in the drawing phase', () => {
		expect(new IntroController().phase).toBe('drawing');
	});

	it('fast-forwards to done exactly once when skipped repeatedly', async () => {
		const onDone = vi.fn();
		const intro = new IntroController({ onDone });
		const finished = intro.start();
		expect(intro.phase).toBe('drawing');
		intro.skip();
		intro.skip();
		intro.skip();
		expect(intro.phase).toBe('done');
		await expect(finished).resolves.toBeUndefined();
		expect(intro.phase).toBe('done');
		expect(intro.progress).toBe(1);
		expect(onDone).toHaveBeenCalledTimes(1);
	});
});

describe('natural completion', () => {
	it('calls onComplete when the intro runs out, but not when skipped', async () => {
		vi.unstubAllGlobals();
		vi.stubGlobal('matchMedia', (q: string) => ({ matches: false, media: q }));
		vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
		let clock = 0;
		vi.stubGlobal('performance', { now: () => clock });
		vi.stubGlobal('requestAnimationFrame', (cb: (t: number) => void) =>
			setTimeout(() => cb((clock += 16)), 16)
		);
		vi.stubGlobal('cancelAnimationFrame', (id: number) => clearTimeout(id));
		const onComplete = vi.fn();
		const natural = new IntroController({ onComplete });
		const run = natural.start();
		await vi.advanceTimersByTimeAsync(6000);
		await run;
		expect(natural.phase).toBe('done');
		expect(onComplete).toHaveBeenCalledTimes(1);

		const skipped = vi.fn();
		const intro = new IntroController({ onComplete: skipped });
		const run2 = intro.start();
		intro.skip();
		await run2;
		expect(skipped).not.toHaveBeenCalled();
		vi.useRealTimers();
	});
});

describe('shouldPlayIntro', () => {
	const base = { type: 'link', fromPath: '/week/1', toPath: '/', hash: '', reduced: false };

	it('plays on first load', () => {
		expect(shouldPlayIntro({ ...base, type: 'enter', fromPath: null })).toBe(true);
	});

	it('plays when arriving from another route', () => {
		expect(shouldPlayIntro(base)).toBe(true);
	});

	it('does not play for a hash link on the page itself', () => {
		expect(shouldPlayIntro({ ...base, fromPath: '/', hash: '#about' })).toBe(false);
	});

	it('does not play for a hash target from another route', () => {
		expect(shouldPlayIntro({ ...base, hash: '#schedule' })).toBe(false);
	});

	it('does not play on Back/Forward', () => {
		expect(shouldPlayIntro({ ...base, type: 'popstate' })).toBe(false);
	});

	it('does not play with reduced motion', () => {
		expect(shouldPlayIntro({ ...base, reduced: true })).toBe(false);
	});
});
