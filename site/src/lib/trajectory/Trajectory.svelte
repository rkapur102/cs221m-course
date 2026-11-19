<script lang="ts">
	import { cloud, getStory, type Emotion, type Vec3 } from './data';
	import { project } from './projection';
	import { cloudColors as defaultCloudColors, gradientAt, pathGradients } from './palette';
	import { prefersReducedMotion } from './animate';
	import { simplifyPath } from './simplify';
	import { splitPath } from './splitPath';

	interface Props {
		storyIds: string[];
		/** How much of each path is drawn, 0..1. The cloud fades in slightly ahead. */
		draw?: number;
		/** Per-story draw progress, overriding `draw` for the stories it covers. */
		draws?: number[];
		/** Multiplier on the path line width. */
		lineScale?: number;
		/** Extra rotation about the vertical axis, in radians. */
		yaw?: number;
		/** Tilt offset added to the base camera pitch, in radians (clamped to +/-0.6 in total). */
		pitch?: number;
		/** Show the undrawn remainder of each path as a faint thin line. */
		ghost?: boolean;
		/** Marks the tip of the drawn path with a halo dot and a label, instead of the End marker. */
		marker?: { label: string; color?: string; ring?: string };
		showCloud?: boolean;
		showLabels?: boolean;
		gradients?: string[][];
		/** Rotate very slowly while visible. */
		idle?: boolean;
		/** Keep only Start, End and every Nth point of each path (for small renderings). */
		simplify?: number;
		cloudColors?: Record<Emotion, string>;
		/** Multiplier on how much of the cell the cloud fills (1 leaves a margin for rotation). */
		zoom?: number;
		class?: string;
	}

	let {
		storyIds,
		draw = 1,
		draws,
		lineScale = 1,
		yaw = 0,
		pitch = 0,
		ghost = false,
		marker,
		showCloud = true,
		showLabels = true,
		gradients = pathGradients,
		idle = false,
		simplify = 0,
		cloudColors = defaultCloudColors,
		zoom = 1,
		class: className = ''
	}: Props = $props();

	/** Base view, matching the demo camera at (1.45, 1.45, 1.05). */
	const BASE_YAW = -0.75 * Math.PI;
	const PITCH = Math.atan2(1.05, Math.hypot(1.45, 1.45));
	const MAX_PITCH_OFFSET = 0.6;
	const IDLE_SPEED = (2 * Math.PI) / 150; // radians per second
	const EMOTIONS: Emotion[] = ['anger', 'disgust', 'fear', 'happiness', 'sadness', 'surprise'];

	// Stretch each axis to the cloud's full range, like Plotly's default cube aspect.
	const axisScale = [0, 1, 2].map(
		(k) => 1 / Math.max(1e-6, ...cloud.points.map((p) => Math.abs(p[k])))
	) as Vec3;
	const stretch = (p: Vec3): Vec3 => [p[0] * axisScale[0], p[1] * axisScale[1], p[2] * axisScale[2]];
	const cloudPoints = cloud.points.map(stretch);
	const cloudRadius = Math.max(...cloudPoints.map((p) => Math.hypot(p[0], p[1], p[2])));
	const floorZ = Math.min(...cloudPoints.map((p) => p[2]));

	let wrap: HTMLDivElement;
	let canvas: HTMLCanvasElement;
	let size = $state({ w: 0, h: 0 });
	let idleYaw = $state(0);

	const stories = $derived(storyIds.map((id) => simplifyPath(getStory(id).points, simplify).map(stretch)));

	/** Center and radius of what is drawn, so the view stays framed while it turns. */
	const frame = $derived.by(() => {
		if (showCloud) return { center: [0, 0, 0] as Vec3, radius: cloudRadius };
		const pts = stories.flat();
		const lo = [0, 1, 2].map((k) => Math.min(...pts.map((p) => p[k])));
		const hi = [0, 1, 2].map((k) => Math.max(...pts.map((p) => p[k])));
		const center = [0, 1, 2].map((k) => (lo[k] + hi[k]) / 2) as Vec3;
		const radius = Math.max(
			1e-3,
			...pts.map((p) => Math.hypot(p[0] - center[0], p[1] - center[1], p[2] - center[2]))
		);
		return { center, radius };
	});

	/** Per-story segment colors, computed once per story and gradient. */
	const colors = $derived(
		stories.map((pts, i) => {
			const stops = gradients[i % gradients.length];
			return pts.map((_, j) => gradientAt(stops, pts.length > 1 ? j / (pts.length - 1) : 0));
		})
	);

	function render() {
		if (!canvas || size.w === 0 || size.h === 0) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		const { w, h } = size;
		const dpr = window.devicePixelRatio || 1;
		const pw = Math.round(w * dpr);
		const ph = Math.round(h * dpr);
		if (canvas.width !== pw || canvas.height !== ph) {
			canvas.width = pw;
			canvas.height = ph;
		}
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		ctx.clearRect(0, 0, w, h);

		const angle = BASE_YAW + yaw + idleYaw;
		const { center, radius } = frame;
		const opts = { pitch: PITCH + Math.min(MAX_PITCH_OFFSET, Math.max(-MAX_PITCH_OFFSET, pitch)), persp: 0.12, scale: ((showCloud ? 0.86 : 0.9) * zoom) / radius };
		const proj = (p: Vec3) =>
			project([p[0] - center[0], p[1] - center[1], p[2] - center[2]], angle, size, opts);

		const m = Math.min(w, h);
		const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
		const ts = stories.map((_, i) => clamp01(draws?.[i] ?? draw));
		const t = Math.max(clamp01(draw), ...ts);
		const cloudAlpha = Math.min(1, (draws ? Math.max(0, ...ts) : t) * 3);

		// 1. Faint floor grid.
		if (showCloud && cloudAlpha > 0) {
			ctx.globalAlpha = cloudAlpha;
			// Short pieces whose alpha falls off with distance from the center,
			// so the grid fades out and its corners never read as a hard box.
			ctx.lineWidth = 1;
			const N = 16;
			for (let k = -1; k <= 1.0001; k += 0.4) {
				for (let i = 0; i < N; i++) {
					const u0 = -1 + (2 * i) / N;
					const u1 = -1 + (2 * (i + 1)) / N;
					const um = (u0 + u1) / 2;
					const fall = Math.max(0, 1 - (k * k + um * um) / 1.6);
					if (fall <= 0) continue;
					ctx.strokeStyle = `rgba(26, 26, 26, ${(0.1 * fall).toFixed(3)})`;
					ctx.beginPath();
					for (const [p0, p1] of [
						[[k, u0, floorZ], [k, u1, floorZ]],
						[[u0, k, floorZ], [u1, k, floorZ]]
					] as [Vec3, Vec3][]) {
						const a = proj(p0);
						const b = proj(p1);
						ctx.moveTo(a.x, a.y);
						ctx.lineTo(b.x, b.y);
					}
					ctx.stroke();
				}
			}

			// 2. Cloud dots, batched by emotion.
			const r0 = 1.7;
			for (const emo of EMOTIONS) {
				ctx.fillStyle = cloudColors[emo];
				ctx.beginPath();
				for (let i = 0; i < cloudPoints.length; i++) {
					if (cloud.emotion[i] !== emo) continue;
					const q = proj(cloudPoints[i]);
					const r = r0 * (1 + 0.12 * q.depth);
					ctx.moveTo(q.x + r, q.y);
					ctx.arc(q.x, q.y, r, 0, Math.PI * 2);
				}
				ctx.fill();
			}
			ctx.globalAlpha = 1;
		}

		if (t <= 0) return;

		const line = Math.min(3.4, Math.max(1.3, m * 0.0085)) * lineScale;
		const halo = line * 2.6;
		const markerR = m >= 160 ? line * 0.8 : 0;
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';

		const projected = stories.map((pts) => pts.map(proj));
		const split = projected.map((q, s) => splitPath(q, ts[s]));
		const visible = split.map((sp, s) => (ts[s] <= 0 ? [] : sp.head));

		// Faint remainder of each path, starting exactly where the drawn part ends.
		if (ghost) {
			ctx.strokeStyle = 'rgba(26, 26, 26, 0.12)';
			ctx.lineWidth = Math.max(1, line * 0.5);
			split.forEach((sp, s) => {
				const q = ts[s] <= 0 ? projected[s] : sp.tail;
				if (q.length < 2) return;
				ctx.beginPath();
				ctx.moveTo(q[0].x, q[0].y);
				for (const p of q.slice(1)) ctx.lineTo(p.x, p.y);
				ctx.stroke();
			});
		}

		// 3. Light halo under every path.
		if (showCloud) {
			ctx.strokeStyle = 'rgba(255, 255, 255, 0.92)';
			ctx.lineWidth = halo;
			for (const q of visible) {
				if (q.length < 2) continue;
				ctx.beginPath();
				ctx.moveTo(q[0].x, q[0].y);
				for (const p of q.slice(1)) ctx.lineTo(p.x, p.y);
				ctx.stroke();
			}
		}

		// 4. Gradient segments with small sentence markers.
		visible.forEach((q, s) => {
			ctx.lineWidth = line;
			for (let j = 1; j < q.length; j++) {
				ctx.strokeStyle = colors[s][j - 1];
				ctx.beginPath();
				ctx.moveTo(q[j - 1].x, q[j - 1].y);
				ctx.lineTo(q[j].x, q[j].y);
				ctx.stroke();
			}
			if (markerR > 0) {
				const n = stories[s].length;
				for (let j = 1; j < Math.min(q.length, n - 1); j++) {
					if (j === q.length - 1 && q.length - 1 > (n - 1) * ts[s]) continue;
					ctx.fillStyle = colors[s][j];
					ctx.beginPath();
					ctx.arc(q[j].x, q[j].y, markerR, 0, Math.PI * 2);
					ctx.fill();
					ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
					ctx.lineWidth = 0.8;
					ctx.stroke();
				}
			}
		});

		// 5. Start and End markers with labels.
		if (m < 60) return;
		const endR = Math.max(2.5, line * 1.35);
		const font = Math.round(Math.min(12, Math.max(9.5, m * 0.026)));
		ctx.font = `600 ${font}px "Nunito Sans", system-ui, sans-serif`;
		ctx.textBaseline = 'middle';
		const mark = (p: { x: number; y: number }, fill: string, label: string) => {
			ctx.beginPath();
			ctx.arc(p.x, p.y, endR, 0, Math.PI * 2);
			ctx.fillStyle = fill;
			ctx.fill();
			ctx.strokeStyle = '#ffffff';
			ctx.lineWidth = 1.5;
			ctx.stroke();
			if (showLabels) {
				const tx = p.x + endR + 4;
				ctx.lineWidth = 3;
				ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
				ctx.strokeText(label, tx, p.y);
				ctx.fillStyle = fill;
				ctx.fillText(label, tx, p.y);
			}
		};
		// Progress marker: soft halo, solid dot, and a label that flips or slides to stay inside the canvas.
		const tip = (p: { x: number; y: number }, mk: { label: string; color?: string; ring?: string }) => {
			const fill = mk.color ?? '#8c1515';
			const r = Math.max(3.5, line * 1.5);
			ctx.beginPath();
			ctx.arc(p.x, p.y, r * 2.6, 0, Math.PI * 2);
			ctx.fillStyle = fill;
			ctx.globalAlpha = mk.ring ? 0.3 : 0.2;
			ctx.fill();
			ctx.globalAlpha = 1;
			ctx.beginPath();
			ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
			ctx.fill();
			ctx.strokeStyle = mk.ring ?? '#ffffff';
			ctx.lineWidth = mk.ring ? 2 : 1.5;
			ctx.stroke();
			if (!showLabels) return;
			const labelFont = Math.max(11, font);
			ctx.font = `600 ${labelFont}px "Nunito Sans", system-ui, sans-serif`;
			const tw = ctx.measureText(mk.label).width;
			const gap = r * 2.6 + 4;
			const edge = 4;
			let tx = p.x + gap;
			if (tx + tw > w - edge) tx = p.x - gap - tw;
			tx = Math.min(w - edge - tw, Math.max(edge, tx));
			ctx.lineWidth = 3.5;
			ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
			ctx.strokeText(mk.label, tx, p.y);
			ctx.fillStyle = '#1a1a1a';
			ctx.fillText(mk.label, tx, p.y);
		};
		visible.forEach((q, s) => {
			if (q.length === 0) return;
			mark(q[0], '#1a1a1a', 'Start');
			if (marker) tip(q[q.length - 1], marker);
			else if (ts[s] >= 1) mark(q[q.length - 1], '#8c1515', 'End');
		});
	}

	// Redraw whenever an input changes.
	$effect(() => {
		void [draw, draws, lineScale, yaw, pitch, idleYaw, showCloud, showLabels, ghost, marker, cloudColors, colors, frame, size.w, size.h];
		render();
	});

	// Labels use Nunito Sans; redraw once the font has loaded.
	$effect(() => {
		let live = true;
		document.fonts?.ready.then(() => live && render());
		return () => (live = false);
	});

	// Size tracking.
	$effect(() => {
		const ro = new ResizeObserver(([entry]) => {
			const r = entry.contentRect;
			size = { w: r.width, h: r.height };
		});
		ro.observe(wrap);
		return () => ro.disconnect();
	});

	// Idle rotation, paused when hidden, off-screen or under reduced motion.
	$effect(() => {
		if (!idle) return;
		let raf = 0;
		let last = 0;
		let onScreen = true;
		const tick = (now: number) => {
			if (last) idleYaw = (idleYaw + ((now - last) / 1000) * IDLE_SPEED) % (2 * Math.PI);
			last = now;
			raf = requestAnimationFrame(tick);
		};
		const sync = () => {
			const run = onScreen && !document.hidden && !prefersReducedMotion();
			if (run && !raf) {
				last = 0;
				raf = requestAnimationFrame(tick);
			} else if (!run && raf) {
				cancelAnimationFrame(raf);
				raf = 0;
			}
		};
		const io = new IntersectionObserver(([entry]) => {
			onScreen = entry.isIntersecting;
			sync();
		});
		io.observe(wrap);
		document.addEventListener('visibilitychange', sync);
		sync();
		return () => {
			cancelAnimationFrame(raf);
			raf = 0;
			io.disconnect();
			document.removeEventListener('visibilitychange', sync);
		};
	});
</script>

<div class="trajectory {className}" bind:this={wrap}>
	<canvas bind:this={canvas} aria-hidden="true"></canvas>
</div>

<style>
	.trajectory {
		position: relative;
		width: 100%;
		height: 100%;
	}

	canvas {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		display: block;
	}
</style>
