<script lang="ts">
	import { onMount } from 'svelte';
	import { afterNavigate } from '$app/navigation';

	/** Opening a link to one question (e.g. from the navigator's contents) opens that question. */
	function openTarget() {
		const id = decodeURIComponent(location.hash.slice(1));
		const el = id ? document.getElementById(id) : null;
		if (el instanceof HTMLDetailsElement) el.open = true;
	}
	onMount(() => {
		openTarget();
		window.addEventListener('hashchange', openTarget);
		return () => window.removeEventListener('hashchange', openTarget);
	});
	afterNavigate(openTarget);
</script>

<div class="faq">
	<details id="faq-enrolling">
		<summary>I have submitted an application but have not heard back by Mar 27th, is it still possible to enroll in the course?</summary>
		<p>
			We have received more than 200 applications, far more than what we initially
			expected. It is truly exciting to see so many students interested in
			interpretability! We have increased the course capacity to accommodate
			as many students as we can, however, we are constrained by resources,
			e.g., course staff, project mentors, compute, etc. At this point, we
			do not plan to further increase the class size. We will likely have
			another iteration of the course next year, so if you are still around,
			check it out next spring!
		</p>
	</details>
	<details id="faq-auditing">
		<summary>Can I audit this course without enrollment?</summary>
		<p>
			We generally do not allow auditing. However, you are more than welcome to attend the guest
			lectures, which will be in the second half of the course. We will also
			try to make most of the course materials public.
		</p>
	</details>
	<details id="faq-missing-lectures">
		<summary>I have enrolled in the class, but cannot attend some lectures in person.</summary>
		<p>
			We value participation. Students are expected to attend all
			lectures and engage with the course materials. If you are unable to
			attend a lecture due to travel or other unforeseen circumstances, you
			must notify us by email in advance, i.e., before the lecture. Please
			include the date of the anticipated absence and the reason for your
			absence. We will follow up with you as necessary.
		</p>
	</details>
	<details id="faq-recordings">
		<summary>Will the lecture be recorded? Will the recordings be available online?</summary>
		<p>
			As this is the first offering of the course, lectures during the first half of the course will not be recorded.
			Guest lectures may be recorded and shared publicly at the discretion of the speakers.
		</p>
	</details>
</div>

<style>
	.faq {
		line-height: 1.65;
	}

	.faq details {
		/* Room above a question when the navigator's contents jump to it. */
		scroll-margin-top: 1.5rem;
		border-top: 1px solid rgba(26, 26, 26, 0.1);
		padding: 0.9rem 0;
	}

	.faq details:last-child {
		border-bottom: 1px solid rgba(26, 26, 26, 0.1);
	}

	summary {
		cursor: pointer;
		font-weight: 500;
		list-style: none;
		position: relative;
		padding-left: 1.4rem;
	}

	summary::-webkit-details-marker {
		display: none;
	}

	/* Disclosure triangle drawn inside the column, so it respects the page gutter. */
	summary::before {
		content: '';
		position: absolute;
		left: 0.1rem;
		top: 0.55em;
		border-style: solid;
		border-width: 0.32em 0 0.32em 0.5em;
		border-color: transparent transparent transparent var(--gf-orange);
		transition: transform 160ms ease;
	}

	details[open] > summary::before {
		transform: rotate(90deg);
	}

	@media (prefers-reduced-motion: reduce) {
		summary::before {
			transition: none;
		}
	}

	summary:focus-visible {
		outline: 2px solid var(--cardinal);
		outline-offset: 3px;
	}

	details p {
		margin: 0.75rem 0 0;
	}
</style>
