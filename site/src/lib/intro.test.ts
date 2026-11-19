import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { IntroController, introSeen, markIntroSeen } from './intro.svelte.ts';

function memoryStorage(): Storage {
	const m = new Map<string, string>();
	return {
		get length() {
			return m.size;
		},
		clear: () => m.clear(),
		getItem: (k) => m.get(k) ?? null,
		key: (i) => [...m.keys()][i] ?? null,
		removeItem: (k) => void m.delete(k),
		setItem: (k, v) => void m.set(k, String(v))
	};
}

beforeEach(() => {
	// Motion allowed, and frames never fire on their own: only skip() can end the intro.
	vi.stubGlobal('matchMedia', (q: string) => ({ matches: false, media: q }));
	vi.stubGlobal('requestAnimationFrame', () => 1);
	vi.stubGlobal('cancelAnimationFrame', () => {});
	vi.stubGlobal('sessionStorage', memoryStorage());
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

	it('marks the intro as seen when it finishes', async () => {
		const intro = new IntroController();
		const finished = intro.start();
		intro.skip();
		await finished;
		expect(introSeen()).toBe(true);
	});
});

describe('session flag', () => {
	it('reads as not seen when sessionStorage throws', () => {
		vi.stubGlobal('sessionStorage', {
			getItem: () => {
				throw new Error('blocked');
			},
			setItem: () => {
				throw new Error('blocked');
			}
		});
		expect(introSeen()).toBe(false);
		expect(() => markIntroSeen()).not.toThrow();
	});

	it('reads as seen after markIntroSeen()', () => {
		expect(introSeen()).toBe(false);
		markIntroSeen();
		expect(introSeen()).toBe(true);
	});
});

describe('natural completion', () => {
	it('calls onComplete when the intro runs out, but not when skipped', async () => {
		vi.unstubAllGlobals();
		vi.stubGlobal('matchMedia', (q: string) => ({ matches: false, media: q }));
		vi.stubGlobal('sessionStorage', memoryStorage());
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
