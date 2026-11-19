<script lang="ts">
	import TopBar from '#lib/components/TopBar.svelte';
	import SiteFooter from '#lib/components/SiteFooter.svelte';
	import { homeStoryIds } from '../../lib/course';

	const email = 'cs221m-spr2526-staff@lists.stanford.edu';
</script>

<svelte:head>
	<title>Logistics | CS 221M</title>
</svelte:head>

<TopBar storyId={homeStoryIds[0]} />

<main>
	<h1>Logistics</h1>
	<p class="term">Spring 2026</p>

	<p>Please reach the staff at <a href="mailto:{email}">{email}</a>.</p>

	<ul class="facts">
		<li><b>Time:</b> Monday, Wednesday 2:30pm-3:50pm</li>
		<li><b>Location:</b> McMurtry Art Building, Oshman</li>
		<li><b>Office hours:</b> By appointment. Email course staff to schedule (<a href="mailto:{email}">{email}</a>).</li>
	</ul>

	<h2>Coursework</h2>
	<p>
		The course will have five weeks of notebook-guided lectures, four weeks of guest lectures, and one week of final presentations.
		Students will be graded for participation in lectures and for their final project.
	</p>
	<ul>
		<li><b>Participation:</b> Students are expected to attend all lectures and engage with the course materials; please notify staff if you are unable to attend lectures in advance.</li>
		<li><b>Final project:</b> Students will implement and present the key results from a recent paper in mechanistic interpretability.</li>
	</ul>

	<h2>Syllabus</h2>
	<p>Please download the syllabus <a href="https://github.com/rkapur102/cs221m-course/blob/main/materials/syllabus.pdf"><b>here</b></a>.</p>

	<h2>Frequently asked questions</h2>
	<div class="faq">
		<details>
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
		<details>
			<summary>Can I audit this course without enrollment?</summary>
			<p>
				We generally do not allow auditing. However, you are more than welcome to attend the guest
				lectures, which will be in the second half of the course. We will also
				try to make most of the course materials public.
			</p>
		</details>
		<details>
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
		<details>
			<summary>Will the lecture be recorded? Will the recordings be available online?</summary>
			<p>
				As this is the first offering of the course, lectures during the first half of the course will not be recorded.
				Guest lectures may be recorded and shared publicly at the discretion of the speakers.
			</p>
		</details>
	</div>
</main>

<SiteFooter />

<style>
	main {
		max-width: 44rem;
		margin: 0 auto;
		padding: 5.5rem 1rem 0;
		line-height: 1.65;
	}

	h1 {
		font-size: clamp(2.6rem, 7vw, 4rem);
		text-align: center;
		margin-bottom: 0.25rem;
	}

	.term {
		margin: 0 0 2rem;
		text-align: center;
		font-family: var(--font-sub);
		color: var(--muted);
	}

	h2 {
		margin: 2.5rem 0 0.75rem;
		font-size: 1.7rem;
	}

	ul {
		padding-left: 1.25rem;
	}

	.facts {
		list-style: none;
		padding: 0;
	}

	a {
		color: var(--cardinal);
		text-decoration-color: rgba(140, 21, 21, 0.35);
		text-underline-offset: 0.15em;
		overflow-wrap: anywhere;
	}

	a:hover {
		text-decoration-color: currentColor;
	}

	.faq details {
		border-top: 1px solid rgba(26, 26, 26, 0.1);
		padding: 0.9rem 0;
	}

	.faq details:last-child {
		border-bottom: 1px solid rgba(26, 26, 26, 0.1);
	}

	summary {
		cursor: pointer;
		font-weight: 500;
		list-style-position: outside;
		padding-left: 0.25rem;
	}

	summary:focus-visible {
		outline: 3px solid var(--gf-gold);
		outline-offset: 3px;
	}

	details p {
		margin: 0.75rem 0 0;
	}
</style>
