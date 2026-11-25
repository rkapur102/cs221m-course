import { storyIds } from './trajectory/data';

/** Prototype only: which trajectory the navigator's arrows are drawn from, chosen in the arrow picker. */
export interface ArrowChoice {
	storyId: string;
	/** Use the story's most forward-running stretch instead of the whole path. */
	stretch: boolean;
	/** 0 keeps the wiggle, 1 flattens it. */
	tame: number;
}

const KEY = 'cs221m-arrow-v2';
const DEFAULT: ArrowChoice = { storyId: '1469084', stretch: true, tame: 0.15 };

export const arrowChoice = $state<ArrowChoice>({ ...DEFAULT });

export function loadArrowChoice(): void {
	try {
		const saved = JSON.parse(localStorage.getItem(KEY) ?? 'null');
		if (saved && storyIds.includes(saved.storyId)) Object.assign(arrowChoice, saved);
	} catch {
		// Keep the default.
	}
}

export function saveArrowChoice(): void {
	try {
		localStorage.setItem(KEY, JSON.stringify(arrowChoice));
	} catch {
		// Storage can be blocked; the choice then lasts for this page view.
	}
}
