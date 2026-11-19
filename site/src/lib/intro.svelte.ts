import { animate, easeInOutCubic } from './trajectory/animate';

export type IntroPhase = 'drawing' | 'spinning' | 'done';

const KEY = 'cs221m:intro-seen';

/** Whether the homepage intro already played in this tab session. Storage failures read as "not seen". */
export function introSeen(): boolean {
	try {
		return sessionStorage.getItem(KEY) === '1';
	} catch {
		return false;
	}
}

export function markIntroSeen(): void {
	try {
		sessionStorage.setItem(KEY, '1');
	} catch {
		// Storage blocked: the intro simply plays again next time.
	}
}

interface IntroOptions {
	drawMs?: number;
	spinMs?: number;
	onDone?: () => void;
}

/**
 * Drives the homepage intro: a draw-in, then one synchronized spin, then done.
 * `skip()` jumps straight to the finished state; repeated calls are harmless.
 */
export class IntroController {
	phase = $state<IntroPhase>('drawing');
	/** Linear draw-in progress, 0..1. Callers apply their own easing. */
	progress = $state(0);
	/** Eased spin progress, 0..1 (one full turn). Back to 0 once done. */
	spin = $state(0);

	#ctrl = new AbortController();
	#drawMs: number;
	#spinMs: number;
	#onDone?: () => void;

	constructor({ drawMs = 2200, spinMs = 1600, onDone }: IntroOptions = {}) {
		this.#drawMs = drawMs;
		this.#spinMs = spinMs;
		this.#onDone = onDone;
	}

	async start(): Promise<void> {
		const { signal } = this.#ctrl;
		if (this.phase === 'done' || signal.aborted) return;
		await animate(this.#drawMs, (t) => (this.progress = t), { ease: (t) => t, signal });
		if (!signal.aborted) {
			this.phase = 'spinning';
			await animate(this.#spinMs, (t) => (this.spin = t), { ease: easeInOutCubic, signal });
		}
		this.#finish();
	}

	skip(): void {
		this.#ctrl.abort();
		this.#finish();
	}

	#finish() {
		if (this.phase === 'done') return;
		this.progress = 1;
		this.spin = 0;
		this.phase = 'done';
		markIntroSeen();
		this.#onDone?.();
	}
}
