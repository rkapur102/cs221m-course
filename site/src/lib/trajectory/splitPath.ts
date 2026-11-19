export interface XY {
	x: number;
	y: number;
}

/**
 * Splits a polyline at fraction `t` (0..1) of its segments. `head` runs from the
 * first point to the split point and `tail` from the split point to the last, so
 * both share exactly the same split point (the last head point, the first tail point).
 */
export function splitPath<P extends XY>(pts: P[], t: number): { head: P[]; tail: P[] } {
	if (pts.length === 0) return { head: [], tail: [] };
	const last = pts.length - 1;
	const span = Math.min(1, Math.max(0, t)) * last;
	const full = Math.min(last, Math.floor(span));
	if (full >= last) return { head: pts.slice(), tail: [pts[last]] };
	const a = pts[full];
	const b = pts[full + 1];
	const k = span - full;
	const cut = { ...a, x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k } as P;
	return { head: [...pts.slice(0, full + 1), cut], tail: [cut, ...pts.slice(full + 1)] };
}
