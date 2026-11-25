<script lang="ts">
	import { arrowGlyph, bestSpan } from '../trajectory/arrow';
	import { arrowChoice, type Side } from '../arrowChoice.svelte.ts';

	let {
		side = 'next',
		flip = side === 'back',
		draw = 1,
		storyId,
		stretch,
		tame
	}: {
		/** Which arrow's chosen trajectory to draw. */
		side?: Side;
		/** Point left instead of right (default: when side is back). */
		flip?: boolean;
		/** How much of the path is drawn, 0..1 (the head appears at the end). */
		draw?: number;
		/** Overrides for the picker's previews; otherwise the current choice is used. */
		storyId?: string;
		stretch?: boolean;
		tame?: number;
	} = $props();

	const uid = $props.id();
	const spec = $derived(arrowChoice[side]);
	const glyph = $derived.by(() => {
		const id = storyId ?? spec.storyId;
		const useStretch = stretch ?? spec.stretch;
		return arrowGlyph(id, { tame: tame ?? spec.tame, span: useStretch ? bestSpan(id) : undefined });
	});
</script>

<svg
	class="arrow-glyph"
	class:flip
	viewBox={`0 0 ${glyph.width} ${glyph.height}`}
	aria-hidden="true"
	focusable="false"
>
	<defs>
		<linearGradient id={`g-${uid}`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={glyph.width} y2="0">
			<stop offset="0" stop-color="#1a1a1a" />
			<stop offset="0.55" stop-color="#8c1515" />
			<stop offset="1" stop-color="#c4652d" />
		</linearGradient>
	</defs>
	<path
		d={glyph.body}
		pathLength="1"
		stroke={`url(#g-${uid})`}
		stroke-dasharray="1 1"
		stroke-dashoffset={1 - draw}
	/>
	<circle class="tail" cx={glyph.tail[0]} cy={glyph.tail[1]} r="1.7" />
	<path class="head" d={glyph.head} style:opacity={draw > 0.92 ? 1 : 0} />
</svg>

<style>
	.arrow-glyph {
		display: block;
		width: 1.9rem;
		height: auto;
		overflow: visible;
	}
	.flip {
		transform: scaleX(-1);
	}
	path {
		fill: none;
		stroke-width: 1.6;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.tail {
		fill: #1a1a1a;
	}
	.head {
		stroke: #c4652d;
		transition: opacity 120ms ease;
	}
</style>
