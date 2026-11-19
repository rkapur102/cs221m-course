import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { IntroController } from './intro.svelte.ts';

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
