import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { loadView, setView, viewState } from './view.svelte.ts';

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
	viewState.current = 'self';
});

afterEach(() => {
	vi.unstubAllGlobals();
});

describe('view', () => {
	it('defaults to the self-paced view', () => {
		vi.stubGlobal('localStorage', memoryStorage());
		loadView();
		expect(viewState.current).toBe('self');
	});

	it('persists the enrolled view and restores it', () => {
		vi.stubGlobal('localStorage', memoryStorage());
		setView('enrolled');
		viewState.current = 'self';
		loadView();
		expect(viewState.current).toBe('enrolled');
	});

	it('stays on the default when storage throws', () => {
		const broken = {
			getItem: () => {
				throw new Error('blocked');
			},
			setItem: () => {
				throw new Error('blocked');
			}
		};
		vi.stubGlobal('localStorage', broken);
		expect(() => loadView()).not.toThrow();
		expect(viewState.current).toBe('self');
		expect(() => setView('enrolled')).not.toThrow();
		expect(viewState.current).toBe('enrolled');
	});
});
