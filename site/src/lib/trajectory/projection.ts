import type { Vec3 } from './data';

export interface ProjectOptions {
	/** Camera elevation in radians (tilts the view down onto the floor). */
	pitch?: number;
	/** Perspective strength; 0 is orthographic. */
	persp?: number;
	/** Fraction of half the shorter side that one data unit spans. */
	scale?: number;
}

export interface Projected {
	x: number;
	y: number;
	/** Larger is nearer the camera. */
	depth: number;
}

/**
 * Projects a point in data space (z up) onto a canvas of the given CSS size.
 * The scene rotates by `yaw` about the vertical axis; the camera sits on the
 * -y side, raised by `pitch`, looking at the origin.
 */
export function project(
	p: Vec3,
	yaw: number,
	size: { w: number; h: number },
	opts: ProjectOptions = {}
): Projected {
	const { pitch = 0.45, persp = 0.12, scale = 0.6 } = opts;
	const c = Math.cos(yaw);
	const s = Math.sin(yaw);
	const x = p[0] * c - p[1] * s;
	const y = p[0] * s + p[1] * c;
	const z = p[2];

	const cp = Math.cos(pitch);
	const sp = Math.sin(pitch);
	const up = y * sp + z * cp;
	const depth = z * sp - y * cp;

	const f = 1 / Math.max(0.2, 1 - persp * depth);
	const unit = (Math.min(size.w, size.h) / 2) * scale * f;
	return { x: size.w / 2 + x * unit, y: size.h / 2 - up * unit, depth };
}
