<script lang="ts" module>
	import { arrowGlyph, bestSpan } from '../trajectory/arrow';
	import { arrowStoryIds } from '../course';

	/** Computed once: the straightest stretch of its story, wiggle kept, drawn pointing right and turned down below. */
	const GLYPH = arrowGlyph(arrowStoryIds.down, { tame: 0, span: bestSpan(arrowStoryIds.down) });
</script>

<script lang="ts">
	/** The phone sheet's close handle: a trajectory arrow pointing down. */
	const uid = $props.id();
</script>

<!-- Turned inside the SVG (not with CSS), so the box is the arrow's real, tall size and padding above it holds. -->
<svg class="down-glyph" viewBox={`0 0 ${GLYPH.height} ${GLYPH.width}`} aria-hidden="true" focusable="false">
	<defs>
		<linearGradient id={`d-${uid}`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={GLYPH.width} y2="0">
			<stop offset="0" stop-color="#1a1a1a" />
			<stop offset="0.55" stop-color="#8c1515" />
			<stop offset="1" stop-color="#c4652d" />
		</linearGradient>
	</defs>
	<g transform={`translate(${GLYPH.height} 0) rotate(90)`}>
		<path d={GLYPH.body} stroke={`url(#d-${uid})`} />
		<circle class="tail" cx={GLYPH.tail[0]} cy={GLYPH.tail[1]} r="1.7" />
		<path class="head" d={GLYPH.head} />
	</g>
</svg>

<style>
	.down-glyph {
		display: block;
		height: 1.75rem;
		width: auto;
		overflow: visible;
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
	}
</style>
