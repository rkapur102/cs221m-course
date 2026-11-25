import { storyIds } from './trajectory/data';

/** Prototype only: which trajectory each navigator arrow is drawn from, chosen in the arrow lab. */
export interface ArrowSpec {
	storyId: string;
	/** Use the story's most forward-running stretch instead of the whole path. */
	stretch: boolean;
	/** 0 keeps the wiggle, 1 flattens it. */
	tame: number;
}

export type Side = 'back' | 'next';

const KEY = 'cs221m-arrow-v3';

export const arrowChoice = $state<Record<Side, ArrowSpec>>({
	back: { storyId: '1469084', stretch: true, tame: 0.15 },
	next: { storyId: '1469084', stretch: true, tame: 0.15 }
});

export function loadArrowChoice(): void {
	try {
		const saved = JSON.parse(localStorage.getItem(KEY) ?? 'null');
		for (const side of ['back', 'next'] as const) {
			if (saved?.[side] && storyIds.includes(saved[side].storyId)) Object.assign(arrowChoice[side], saved[side]);
		}
	} catch {
		// Keep the defaults.
	}
}

export function saveArrowChoice(): void {
	try {
		localStorage.setItem(KEY, JSON.stringify(arrowChoice));
	} catch {
		// Storage can be blocked; the choice then lasts for this page view.
	}
}
