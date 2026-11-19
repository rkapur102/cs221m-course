export type View = 'self' | 'enrolled';

const KEY = 'cs221m-view';

/** Which version of the site is showing. Prerendered HTML is always the self-paced view. */
export const viewState = $state<{ current: View }>({ current: 'self' });

export function setView(v: View): void {
	viewState.current = v;
	try {
		localStorage.setItem(KEY, v);
	} catch {
		// Storage can be blocked; the choice then lasts for this visit only.
	}
}

/** Restore the saved choice. Called once on mount in the layout. */
export function loadView(): void {
	try {
		if (localStorage.getItem(KEY) === 'enrolled') viewState.current = 'enrolled';
	} catch {
		// Keep the default.
	}
}
