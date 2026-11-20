<script lang="ts">
	import goodfire from '../../../../images/goodfire_name.svg';

	import { setView, viewState } from '../view.svelte.ts';

	const email = 'cs221m-spr2526-staff@lists.stanford.edu';
</script>

<footer class="site-footer">
	<div class="inner">
		<div class="sponsor">
			<span class="label">Sponsor</span>
			<a href="https://www.goodfire.com/" class="sponsor-logo">
				<img src={goodfire} alt="Goodfire" width="163" height="35" />
			</a>
		</div>
		<div class="text">
			{#if viewState.current === 'enrolled'}
				<p>Please reach the staff at <a href="mailto:{email}">{email}</a>.</p>
			{:else}
				<p>Questions? You can reach the Spring 2026 course staff at <a href="mailto:{email}">{email}</a>.</p>
			{/if}
			<p class="credit">
				Trajectory visual theme adapted from Goodfire's
				<a href="https://www.goodfire.com/research/stories-in-space"><em>Meandering on Manifolds</em></a>
				(<a href="https://arxiv.org/abs/2605.12412">Bigelow et al., 2026</a>).
			</p>
			{#if viewState.current === 'enrolled'}
				<p>You can access the <a href="https://github.com/rkapur102/cs221m-course">course materials on GitHub</a>.</p>
			{:else}
				<p>
					Based on the
					<button type="button" class="linklike" onclick={() => setView('enrolled')}>Spring 2026 course offering</button>.
					You can access the <a href="https://github.com/rkapur102/cs221m-course">course materials on GitHub</a>.
				</p>
			{/if}
		</div>
	</div>
</footer>

<style>
	.site-footer {
		border-top: 1px solid rgba(26, 26, 26, 0.1);
		padding: 2.5rem var(--gutter) 3rem;
		font-size: 0.9rem;
		color: var(--muted);
	}

	.inner {
		max-width: var(--content);
		margin: 0 auto;
		display: flex;
		flex-wrap: wrap;
		gap: 1.5rem 3rem;
		align-items: flex-start;
		justify-content: space-between;
	}

	.sponsor {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.label {
		font-family: var(--font-sub);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	.sponsor-logo img {
		display: block;
		height: 1.6rem;
		width: auto;
	}

	.text {
		flex: 1 1 22rem;
		max-width: 36rem;
	}

	.text p {
		margin: 0 0 0.45rem;
	}

	a {
		color: var(--cardinal);
		text-decoration-color: rgba(140, 21, 21, 0.35);
		text-underline-offset: 0.15em;
		overflow-wrap: anywhere;
	}

	.linklike {
		padding: 0;
		border: 0;
		background: none;
		font: inherit;
		color: var(--cardinal);
		text-decoration: underline;
		text-decoration-color: rgba(140, 21, 21, 0.35);
		text-underline-offset: 0.15em;
		cursor: pointer;
	}

	.linklike:hover {
		text-decoration-color: currentColor;
	}

	.linklike:focus-visible {
		outline: 2px solid var(--gf-orange);
		outline-offset: 2px;
	}

	a:hover {
		text-decoration-color: currentColor;
	}
</style>
