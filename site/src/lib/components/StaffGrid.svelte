<script lang="ts">
	import stanfordBadge from '../../../../images/stanford_s_transparent.png';
	import goodfireBadge from '../../../../images/goodfire_logo.PNG';
	import icard from '../../../../images/thomas_icard.png';
	import geiger from '../../../../images/atticus_geiger.jpg';
	import zur from '../../../../images/amir_zur.jpg';
	import huang from '../../../../images/jing_huang.jpg';
	import tao from '../../../../images/junyi_tao.jpg';
	import yamakoshi from '../../../../images/taka_yamakoshi.jpg';
	import vatsavaya from '../../../../images/siri_vatsavaya.jpg';
	import kapur from '../../../../images/rhea_kapur.jpg';

	type Org = 'Stanford' | 'Goodfire';
	interface Member {
		name: string;
		role: string;
		org: Org;
		photo: string;
		position?: string;
	}

	const staff: Member[] = [
		{ name: 'Thomas Icard', role: 'Instructor', org: 'Stanford', photo: icard },
		{ name: 'Atticus Geiger', role: 'Instructor', org: 'Goodfire', photo: geiger },
		{ name: 'Amir Zur', role: 'Instructor', org: 'Stanford', photo: zur },
		{ name: 'Jing Huang', role: 'Instructor', org: 'Stanford', photo: huang },
		{ name: 'Junyi Tao', role: 'Teaching Assistant', org: 'Stanford', photo: tao },
		{ name: 'Taka Yamakoshi', role: 'Teaching Assistant', org: 'Stanford', photo: yamakoshi },
		{
			name: 'Rhea Kapur',
			// The newline puts "Assistant" on its own line at every width.
			role: 'Designer & Teaching\nAssistant',
			org: 'Stanford',
			photo: kapur,
			position: 'center 25%'
		},
		{
			name: 'Siri Vatsavaya',
			role: 'Course Manager',
			org: 'Goodfire',
			photo: vatsavaya,
			position: 'center 30%'
		}
	];

	const badges: Record<Org, string> = { Stanford: stanfordBadge, Goodfire: goodfireBadge };
</script>

<ul class="staff">
	{#each staff as m (m.name)}
		<li>
			<img
				class="headshot"
				src={m.photo}
				alt={m.name}
				width="112"
				height="112"
				loading="lazy"
				decoding="async"
				style:object-position={m.position}
			/>
			<span class="name">{m.name}</span>
			<span class="role">
				<img class="badge" src={badges[m.org]} alt={m.org} width="14" height="14" />{#each m.role.split('\n') as line, i}{#if i > 0}<br />{/if}<span class="line">{line}</span>{/each}
			</span>
		</li>
	{/each}
</ul>

<style>
	.staff {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(9.5rem, 1fr));
		gap: 2rem 1.25rem;
	}

	li {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}

	.headshot {
		width: 7rem;
		height: 7rem;
		border-radius: 50%;
		object-fit: cover;
		background: #f3efec;
		box-shadow: 0 0 0 1px rgba(26, 26, 26, 0.06);
	}

	.name {
		margin-top: 0.85rem;
		font-family: var(--font-sub);
		font-weight: 600;
		font-size: 0.98rem;
		line-height: 1.3;
	}

	/* Inline so a long role wraps with its badge still at the start of the text. */
	.role {
		margin-top: 0.2rem;
		display: inline;
		font-family: var(--font-sub);
		font-size: 0.82rem;
		color: var(--muted);
	}

	/* Each written line of a role stays whole; only the newline in the data breaks it. */
	.line {
		white-space: nowrap;
	}

	.badge {
		display: inline;
		width: auto;
		height: 1em;
		margin-right: 0.3rem;
		vertical-align: -0.12em;
		object-fit: contain;
	}

	@media (max-width: 420px) {
		.staff {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 1.75rem 0.75rem;
		}

		.headshot {
			width: 6rem;
			height: 6rem;
		}

		/* Small enough that "Designer & Teaching" plus its badge fits a 320px phone column. */
		.role {
			font-size: 0.74rem;
		}
	}
</style>
