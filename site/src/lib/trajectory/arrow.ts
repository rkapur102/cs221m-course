import { cloud, getStory, type Vec3 } from './data';
import { project } from './projection';

/** A story trajectory flattened into a small right-pointing arrow glyph (SVG units). */
export interface ArrowGlyph {
	/** The path body, smoothed. */
	body: string;
	/** An open chevron at the tip, aimed along the path's final direction. */
	head: string;
	/** The story's start point, for a dot at the tail. */
	tail: [number, number];
	width: number;
	height: number;
}

export interface ArrowOptions {
	/** 0 keeps the story's own wiggle, 1 flattens it to a straight line. */
	tame?: number;
	width?: number;
	height?: number;
	/** Arrowhead arm length. */
	headSize?: number;
	/** Use only points [from, to] of the story. */
	span?: [number, number];
}

// Same camera and axis stretch as Trajectory.svelte, so the glyph is the curve people see on the page.
const BASE_YAW = -0.75 * Math.PI;
const PITCH = Math.atan2(1.05, Math.hypot(1.45, 1.45));
const axisScale = [0, 1, 2].map(
	(k) => 1 / Math.max(1e-6, ...cloud.points.map((p) => Math.abs(p[k])))
) as Vec3;

type P = [number, number];

function projected(id: string): P[] {
	return getStory(id).points.map((p) => {
		const q = project(
			[p[0] * axisScale[0], p[1] * axisScale[1], p[2] * axisScale[2]],
			BASE_YAW,
			{ w: 2, h: 2 },
			{ pitch: PITCH, persp: 0, scale: 1 }
		);
		return [q.x, q.y] as P;
	});
}

/** Turn a 2D path so it runs from left (start) to right (end), starting at the origin. */
function level(pts: P[]): P[] {
	const [x0, y0] = pts[0];
	const [x1, y1] = pts[pts.length - 1];
	const a = -Math.atan2(y1 - y0, x1 - x0);
	const c = Math.cos(a);
	const s = Math.sin(a);
	return pts.map(([x, y]) => [(x - x0) * c - (y - y0) * s, (x - x0) * s + (y - y0) * c]);
}

/** The story as the homepage camera sees it, optionally only points [from, to], levelled left to right. */
export function flatten(id: string, span?: [number, number]): P[] {
	const pts = projected(id);
	return level(span ? pts.slice(span[0], span[1] + 1) : pts);
}

function forwardOf(pts: P[]): number {
	let fwd = 0;
	let total = 0;
	for (let i = 1; i < pts.length; i++) {
		const dx = pts[i][0] - pts[i - 1][0];
		total += Math.hypot(dx, pts[i][1] - pts[i - 1][1]);
		if (dx > 0) fwd += dx;
	}
	return total > 0 ? fwd / total : 0;
}

/** The stretch of at least `minPoints` points that moves forward most steadily. */
export function bestSpan(id: string, minPoints = 7): [number, number] {
	const pts = projected(id);
	let best: [number, number] = [0, pts.length - 1];
	let score = -1;
	for (let i = 0; i < pts.length; i++) {
		for (let j = i + minPoints - 1; j < pts.length; j++) {
			// Favor longer stretches slightly, so the glyph keeps some of the story's wiggle.
			const s = forwardOf(level(pts.slice(i, j + 1))) + 0.004 * (j - i);
			if (s > score) {
				score = s;
				best = [i, j];
			}
		}
	}
	return best;
}

/** How arrow-like a story reads: 1 when it only ever moves forward, lower when it doubles back. */
export function forwardness(id: string, span?: [number, number]): number {
	return forwardOf(flatten(id, span));
}

function smooth(pts: P[]): P[] {
	if (pts.length < 3) return pts;
	return pts.map((p, i) => {
		if (i === 0 || i === pts.length - 1) return p;
		const a = pts[i - 1];
		const b = pts[i + 1];
		return [(a[0] + 2 * p[0] + b[0]) / 4, (a[1] + 2 * p[1] + b[1]) / 4];
	});
}

const f = (n: number) => Math.round(n * 100) / 100;

/** Catmull-Rom through the points, written as cubic Beziers. */
function curve(pts: P[]): string {
	let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
	for (let i = 0; i < pts.length - 1; i++) {
		const p0 = pts[Math.max(0, i - 1)];
		const p1 = pts[i];
		const p2 = pts[i + 1];
		const p3 = pts[Math.min(pts.length - 1, i + 2)];
		const c1: P = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
		const c2: P = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
		d += ` C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
	}
	return d;
}

export function arrowGlyph(id: string, opts: ArrowOptions = {}): ArrowGlyph {
	const { tame = 0.15, width = 30, height = 18, headSize = 4.5, span } = opts;
	const pad = 2;
	let pts = smooth(smooth(flatten(id, span))).map(([x, y]) => [x, y * (1 - tame)] as P);

	const xs = pts.map((p) => p[0]);
	const ys = pts.map((p) => p[1]);
	const minX = Math.min(...xs);
	const maxX = Math.max(...xs);
	const minY = Math.min(...ys);
	const maxY = Math.max(...ys);
	// Leave room for the head on the right; keep the aspect so the curve is not distorted.
	const k = Math.min((width - 2 * pad - headSize * 0.4) / Math.max(1e-6, maxX - minX), (height - 2 * pad) / Math.max(1e-6, maxY - minY));
	const ox = pad - minX * k;
	const oy = height / 2 - ((minY + maxY) / 2) * k;
	pts = pts.map(([x, y]) => [ox + x * k, oy + y * k]);

	// Aim the head along the last stretch of the path, measured over a short distance so a final kink does not swing it.
	const tip = pts[pts.length - 1];
	let j = pts.length - 2;
	while (j > 0 && Math.hypot(tip[0] - pts[j][0], tip[1] - pts[j][1]) < headSize * 1.2) j--;
	const dir = Math.atan2(tip[1] - pts[j][1], tip[0] - pts[j][0]);
	const spread = (38 * Math.PI) / 180;
	const arm = (t: number): P => [tip[0] - headSize * Math.cos(dir + t), tip[1] - headSize * Math.sin(dir + t)];
	const l = arm(spread);
	const r = arm(-spread);

	return {
		body: curve(pts),
		tail: [f(pts[0][0]), f(pts[0][1])],
		head: `M${f(l[0])} ${f(l[1])} L${f(tip[0])} ${f(tip[1])} L${f(r[0])} ${f(r[1])}`,
		width,
		height
	};
}
