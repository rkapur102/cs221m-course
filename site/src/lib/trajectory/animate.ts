export function easeInOutCubic(t: number): number {
	return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function prefersReducedMotion(): boolean {
	return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Calls `onFrame` with eased progress from 0 to 1 over `durationMs`.
 * Under reduced motion, or when aborted, it calls `onFrame(1)` once and resolves.
 */
export function animate(
	durationMs: number,
	onFrame: (t: number) => void,
	opts: { ease?: (t: number) => number; signal?: AbortSignal } = {}
): Promise<void> {
	const { ease = easeInOutCubic, signal } = opts;
	if (prefersReducedMotion() || signal?.aborted || durationMs <= 0) {
		onFrame(1);
		return Promise.resolve();
	}
	return new Promise((resolve) => {
		let raf = 0;
		let done = false;
		const start = performance.now();
		const finish = () => {
			if (done) return;
			done = true;
			cancelAnimationFrame(raf);
			signal?.removeEventListener('abort', finish);
			onFrame(1);
			resolve();
		};
		const tick = (now: number) => {
			if (done) return;
			const t = Math.min(1, (now - start) / durationMs);
			if (t >= 1) return finish();
			onFrame(ease(t));
			raf = requestAnimationFrame(tick);
		};
		signal?.addEventListener('abort', finish);
		raf = requestAnimationFrame(tick);
	});
}
