<script lang="ts">
	const email = 'cs221m-spr2526-staff@lists.stanford.edu';
</script>

<div class="logistics">
	<ul class="facts">
		<li><b>Time:</b> Monday, Wednesday 2:30pm-3:50pm</li>
		<li><b>Location:</b> McMurtry Art Building, Oshman</li>
		<li><b>Office hours:</b> By appointment. Email course staff to schedule (<a href="mailto:{email}">{email}</a>).</li>
	</ul>

	<h3>Coursework</h3>
	<p>
		The course will have five weeks of notebook-guided lectures, four weeks of guest lectures, and one week of final presentations.
		Students will be graded for participation in lectures and for their final project.
	</p>
	<ul>
		<li><b>Participation:</b> Students are expected to attend all lectures and engage with the course materials; please notify staff if you are unable to attend lectures in advance.</li>
		<li><b>Final project:</b> Students will implement and present the key results from a recent paper in mechanistic interpretability.</li>
	</ul>

	<h3>Syllabus</h3>
	<p>Please download the syllabus <a href="https://github.com/rkapur102/cs221m-course/blob/main/materials/syllabus.pdf"><b>here</b></a>.</p>
</div>

<style>
	.logistics {
		line-height: 1.65;
	}

	/* Subsections use the same rhythm as the homepage sections around them. */
	h3 {
		margin: var(--section-gap) 0 1.25rem;
		/* Same size as the section heading ("Logistics") above it. */
		font-size: clamp(1.9rem, 4vw, 2.4rem);
	}

	ul {
		padding-left: 1.25rem;
	}

	.facts {
		margin: 0;
	}

	p,
	ul {
		margin: 0 0 1rem;
	}

	p:last-child,
	ul:last-child {
		margin-bottom: 0;
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
</style>
