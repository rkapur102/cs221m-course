import type { Emotion } from './data';

export type CloudPalette = Record<Emotion, string>;

/** Candidate cloud palettes, compared on /dev/trajectory. */
export const cloudPalettes: Record<string, CloudPalette> = {
	// Brand colors as they are, at low alpha.
	brand: {
		anger: 'rgba(140, 21, 21, 0.30)',
		disgust: 'rgba(178, 41, 53, 0.30)',
		fear: 'rgba(196, 101, 45, 0.34)',
		happiness: 'rgba(234, 182, 81, 0.55)',
		sadness: 'rgba(110, 112, 130, 0.32)',
		surprise: 'rgba(196, 160, 120, 0.45)'
	},
	// Light tints of the brand colors with soft neutrals.
	tints: {
		anger: 'rgba(214, 128, 128, 0.55)',
		disgust: 'rgba(222, 150, 156, 0.55)',
		fear: 'rgba(232, 166, 124, 0.58)',
		happiness: 'rgba(240, 200, 118, 0.65)',
		sadness: 'rgba(164, 170, 190, 0.55)',
		surprise: 'rgba(218, 194, 166, 0.62)'
	},
	// A single warm haze: brand hues pulled toward sand.
	haze: {
		anger: 'rgba(200, 132, 124, 0.50)',
		disgust: 'rgba(204, 148, 140, 0.50)',
		fear: 'rgba(214, 162, 128, 0.52)',
		happiness: 'rgba(226, 190, 132, 0.58)',
		sadness: 'rgba(172, 166, 162, 0.50)',
		surprise: 'rgba(210, 186, 158, 0.55)'
	},
	// The original demo palette (ColorBrewer Set2), at the demo's opacity.
	demo: {
		anger: 'rgba(252, 141, 98, 0.45)',
		disgust: 'rgba(102, 194, 165, 0.45)',
		fear: 'rgba(231, 138, 195, 0.45)',
		happiness: 'rgba(255, 217, 47, 0.45)',
		sadness: 'rgba(141, 160, 203, 0.45)',
		surprise: 'rgba(229, 196, 148, 0.45)'
	}
};

export const cloudColors: CloudPalette = cloudPalettes.tints;

/** Path gradient stops from Start to End. Index 0 is the default. */
export const pathGradients: string[][] = [
	['#1a1a1a', '#8c1515', '#c4652d', '#eab651'],
	['#3d0a0e', '#8c1515', '#b22935', '#e39aa0'],
	['#8a3e14', '#c4652d', '#dd9a3c', '#eab651']
];

function parseColor(c: string): [number, number, number] {
	if (c.startsWith('#')) {
		const h = c.length === 4 ? [...c.slice(1)].map((d) => d + d).join('') : c.slice(1);
		return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as [number, number, number];
	}
	const m = c.match(/[\d.]+/g);
	if (!m || m.length < 3) throw new Error(`Unsupported color: ${c}`);
	return [Number(m[0]), Number(m[1]), Number(m[2])];
}

/** Color at position t (0..1) along evenly spaced gradient stops, as rgb(). */
export function gradientAt(stops: string[], t: number): string {
	if (stops.length === 0) return 'rgb(0, 0, 0)';
	const u = Math.min(1, Math.max(0, t)) * (stops.length - 1);
	const i = Math.min(stops.length - 2, Math.floor(u));
	if (stops.length === 1) {
		const [r, g, b] = parseColor(stops[0]);
		return `rgb(${r}, ${g}, ${b})`;
	}
	const a = parseColor(stops[i]);
	const b = parseColor(stops[i + 1]);
	const k = u - i;
	const mix = (j: number) => Math.round(a[j] + (b[j] - a[j]) * k);
	return `rgb(${mix(0)}, ${mix(1)}, ${mix(2)})`;
}
