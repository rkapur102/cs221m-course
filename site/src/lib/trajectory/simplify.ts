/**
 * Thin a path for small renderings: keeps the first and last point and every
 * `stride`-th point in between. A stride below 2 returns the path unchanged.
 */
export function simplifyPath<T>(points: T[], stride: number): T[] {
	if (!(stride >= 2) || points.length <= 2) return points;
	const step = Math.floor(stride);
	const last = points.length - 1;
	const out: T[] = [];
	for (let i = 0; i < last; i += step) out.push(points[i]);
	// Drop a kept point that would crowd the End point.
	if (out.length > 1 && last - (out.length - 1) * step < step / 2) out.pop();
	out.push(points[last]);
	return out;
}
