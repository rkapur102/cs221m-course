import type { View } from './view.svelte.ts';

export type Tag = 'inside' | 'outside' | null;

export interface Reading {
	authors: string;
	year: string;
	title: string;
	url: string;
}

export interface Notebook {
	label?: string;
	file: string;
}

export interface Lecture {
	num: number;
	title: string;
	date: string;
	tag: Tag;
	notebooks: Notebook[];
	slides: boolean;
	readings: Reading[];
}

export interface Week {
	n: 1 | 2 | 3 | 4 | 5;
	/** filename in bridging/ */
	bridging: string;
	storyId: string;
	lectures: Lecture[];
}

export interface ScheduleRow {
	week: number;
	date: string;
	title: string;
	link?: { label: string; url: string };
	readings?: Reading[];
}

const REPO = 'rkapur102/cs221m-course';

export function colabUrl(file: string): string {
	return `https://colab.research.google.com/github/${REPO}/blob/main/${file}`;
}

export function slidesUrl(n: number): string {
	return `https://github.com/${REPO}/blob/main/materials/${String(n).padStart(2, '0')}_slides.pdf`;
}

export const weeks: Week[] = [
	{
		n: 1,
		bridging: '00_into_week_1.md',
		storyId: '2023196',
		lectures: [
		{
			num: 1,
			title: 'Introduction',
			date: 'Mon. March 30',
			tag: null,
			notebooks: [],
			slides: true,
			readings: [
			]
		},
		{
			num: 2,
			title: 'Review of language models',
			date: 'Wed. April 1',
			tag: 'inside',
			notebooks: [{ file: '02_review_of_lms.ipynb' }],
			slides: true,
			readings: [
				{ authors: 'Rush et al.', year: '2018', title: 'The Annotated Transformer', url: 'https://nlp.seas.harvard.edu/annotated-transformer/' },
				{ authors: 'Elhage et al.', year: '2021', title: 'A Mathematical Framework for Transformer Circuits', url: 'https://transformer-circuits.pub/2021/framework/index.html' },
			]
		}
		]
	},
	{
		n: 2,
		bridging: '01_week_1_to_week_2.md',
		storyId: '942571',
		lectures: [
		{
			num: 3,
			title: 'Behavioral analysis and input attribution',
			date: 'Mon. April 6',
			tag: 'outside',
			notebooks: [{ file: '03_behavioral_analysis.ipynb' }],
			slides: true,
			readings: [
				{ authors: 'McCoy et al.', year: '2019', title: 'Right for the Wrong Reasons: Diagnosing Syntactic Heuristics in Natural Language Inference', url: 'https://aclanthology.org/P19-1334/' },
				{ authors: 'Jia & Liang', year: '2017', title: 'Adversarial Examples for Evaluating Reading Comprehension Systems', url: 'https://aclanthology.org/D17-1215/' },
				{ authors: 'Zheng et al.', year: '2024', title: 'Large Language Models Are Not Robust Multiple Choice Selectors', url: 'https://arxiv.org/abs/2309.03882' },
				{ authors: 'Mirzadeh et al.', year: '2024', title: 'GSM-Symbolic: Understanding the Limitations of Mathematical Reasoning in Large Language Models', url: 'https://arxiv.org/abs/2410.05229' },
				{ authors: 'Sundararajan et al.', year: '2017', title: 'Axiomatic Attribution for Deep Networks', url: 'https://arxiv.org/abs/1703.01365' },
			]
		},
		{
			num: 4,
			title: 'Probes for decoding activations',
			date: 'Wed. April 8',
			tag: 'inside',
			notebooks: [{ file: '04_probes.ipynb' }],
			slides: true,
			readings: [
				{ authors: 'Wendler et al.', year: '2024', title: 'Do Llamas Work in English? On the Latent Language of Multilingual Transformers', url: 'https://aclanthology.org/2024.acl-long.820/' },
				{ authors: 'Tenney et al.', year: '2019', title: 'BERT Rediscovers the Classical NLP Pipeline', url: 'https://aclanthology.org/P19-1452/' },
				{ authors: 'Marks & Tegmark', year: '2023', title: 'The Geometry of Truth: Emergent Linear Structure in Large Language Model Representations of True/False Datasets', url: 'https://arxiv.org/abs/2310.06824' },
			]
		}
		]
	},
	{
		n: 3,
		bridging: '02_week_2_to_week_3.md',
		storyId: '1670970',
		lectures: [
		{
			num: 5,
			title: 'Causal methods for interpretability',
			date: 'Mon. April 13',
			tag: 'inside',
			notebooks: [],
			slides: true,
			readings: [
				{ authors: 'Vig et al.', year: '2020', title: 'Causal Mediation Analysis for Interpreting Neural NLP: The Case of Gender Bias', url: 'https://arxiv.org/abs/2004.12265' },
				{ authors: 'Geiger et al.', year: '2021', title: 'Causal Abstractions of Neural Networks', url: 'https://arxiv.org/abs/2106.02997' },
			]
		},
		{
			num: 6,
			title: 'Interventions for steering activations',
			date: 'Wed. April 15',
			tag: 'inside',
			notebooks: [{ file: '06_interventions.ipynb' }],
			slides: true,
			readings: [
				{ authors: 'Ravfogel et al.', year: '2020', title: 'Null It Out: Guarding Protected Attributes by Iterative Nullspace Projection', url: 'https://arxiv.org/abs/2004.07667' },
				{ authors: 'Geva et al.', year: '2023', title: 'Dissecting Recall of Factual Associations in Auto-Regressive Language Models', url: 'https://arxiv.org/abs/2304.14767' },
				{ authors: 'Meng et al.', year: '2022', title: 'Locating and Editing Factual Associations in GPT', url: 'https://arxiv.org/abs/2202.05262' },
				{ authors: 'Wu et al.', year: '2024', title: 'ReFT: Representation Finetuning for Language Models', url: 'https://arxiv.org/abs/2404.03592' },
			]
		}
		]
	},
	{
		n: 4,
		bridging: '03_week_3_to_week_4.md',
		storyId: '1692290',
		lectures: [
		{
			num: 7,
			title: 'Causal mediation analysis',
			date: 'Mon. April 20',
			tag: 'inside',
			notebooks: [{ file: '07_causal_mediation_analysis.ipynb' }],
			slides: true,
			readings: [
				{ authors: 'Vig et al.', year: '2020', title: 'Causal Mediation Analysis for Interpreting Neural NLP: The Case of Gender Bias', url: 'https://arxiv.org/abs/2004.12265' },
				{ authors: 'Wang et al.', year: '2023', title: 'Interpretability in the Wild: a Circuit for Indirect Object Identification in GPT-2 small', url: 'https://arxiv.org/abs/2211.00593' },
				{ authors: 'Mueller et al.', year: '2025', title: 'The Quest for the Right Mediator: Surveying Mechanistic Interpretability Through the Lens of Causal Mediation Analysis', url: 'https://arxiv.org/abs/2408.01416' },
				{ authors: 'Finlayson et al.', year: '2021', title: 'Causal Analysis of Syntactic Agreement Mechanisms in Neural Language Models', url: 'https://arxiv.org/abs/2106.06087' },
				{ authors: 'Yamakoshi et al.', year: '2023', title: 'Causal interventions expose implicit situation models for commonsense language understanding', url: 'https://arxiv.org/abs/2306.03882' },
				{ authors: 'Li et al.', year: '2025', title: '(How) Do Language Models Track State?', url: 'https://arxiv.org/abs/2503.02854' },
				{ authors: 'Boguraev et al.', year: '2025', title: 'Causal Interventions Reveal Shared Structure Across English Filler-Gap Constructions', url: 'https://arxiv.org/abs/2505.16002' },
			]
		},
		{
			num: 8,
			title: 'Theory of causal abstraction',
			date: 'Wed. April 22',
			tag: 'inside',
			notebooks: [{ file: '08_causal_abstraction_i.ipynb' }],
			slides: false,
			readings: [
				{ authors: 'Rubenstein et al.', year: '2017', title: 'Causal Consistency of Structural Equation Models', url: 'https://arxiv.org/abs/1707.00819' },
				{ authors: 'Beckers et al.', year: '2019', title: 'Approximate Causal Abstraction', url: 'https://arxiv.org/abs/1906.11583' },
				{ authors: 'Geiger et al.', year: '2021', title: 'Causal Abstractions of Neural Networks', url: 'https://arxiv.org/abs/2106.02997' },
				{ authors: 'Geiger et al.', year: '2025', title: 'Causal Abstraction: A Theoretical Foundation for Mechanistic Interpretability', url: 'https://arxiv.org/abs/2301.04709' },
				{ authors: 'Geiger et al.', year: '2020', title: 'Relational Reasoning and Generalization Using Non-Symbolic Neural Networks', url: 'https://arxiv.org/abs/2006.07968' },
				{ authors: 'Geiger et al.', year: '2026', title: 'How Causal Abstraction Underpins Computational Explanation', url: 'https://arxiv.org/abs/2508.11214' },
			]
		}
		]
	},
	{
		n: 5,
		bridging: '04_week_4_to_week_5.md',
		storyId: '1808033',
		lectures: [
		{
			num: 9,
			title: 'Designing counterfactuals',
			date: 'Mon. April 27',
			tag: 'inside',
			notebooks: [{ file: '09_counterfactual_design.ipynb' }],
			slides: true,
			readings: [
				{ authors: 'Mueller et al.', year: '2025', title: 'MIB: A Mechanistic Interpretability Benchmark', url: 'https://arxiv.org/abs/2504.13151' },
				{ authors: 'Prakash et al.', year: '2025', title: 'Language Models use Lookbacks to Track Beliefs', url: 'https://arxiv.org/abs/2505.14685' },
				{ authors: 'Gur-Arieh et al.', year: '2025', title: 'Mixing Mechanisms: How Language Models Retrieve Bound Entities In-Context', url: 'https://arxiv.org/abs/2510.06182' },
			]
		},
		{
			num: 10,
			title: 'Automated causal interpretability',
			date: 'Wed. April 29',
			tag: 'inside',
			notebooks: [{ label: 'i', file: '10_causal_abstraction_ii.ipynb' },{ label: 'ii', file: '10_automated_causal_interpretability.ipynb' }],
			slides: false,
			readings: [
				{ authors: 'Davies et al.', year: '2023', title: 'Discovering Variable Binding Circuitry with Desiderata', url: 'https://arxiv.org/abs/2307.03637' },
				{ authors: 'De Cao et al.', year: '2020', title: 'How do Decisions Emerge across Layers in Neural Models? Interpretation with Differentiable Masking', url: 'https://arxiv.org/abs/2004.14992' },
				{ authors: 'De Cao et al.', year: '2022', title: 'Sparse Interventions in Language Models with Differentiable Masking', url: 'https://aclanthology.org/2022.blackboxnlp-1.2/' },
				{ authors: 'Geiger et al.', year: '2023', title: 'Finding Alignments Between Interpretable Causal Variables and Distributed Neural Representations', url: 'https://arxiv.org/abs/2303.02536' },
				{ authors: 'Wu et al.', year: '2023', title: 'Interpretability at Scale: Identifying Causal Mechanisms in Alpaca', url: 'https://arxiv.org/abs/2305.08809' },
				{ authors: 'Huang et al.', year: '2024', title: 'RAVEL: Evaluating Interpretability Methods on Disentangling Language Model Representations', url: 'https://arxiv.org/abs/2402.17700' },
			]
		}
		]
	}
];

export const guestRows: ScheduleRow[] = [
	{ week: 6, date: 'Mon. May 4', title: 'Guest lecture: Chris Potts', link: { label: 'Slides', url: 'https://docs.google.com/presentation/d/1BOVhpBoGD-At0hrsHruK78ZYSFU0dEKW1ztY03IwDrk/edit?usp=sharing' } },
	{ week: 6, date: 'Wed. May 6', title: 'Guest lecture: Jack Merullo' },
	{ week: 7, date: 'Mon. May 11', title: 'Guest lecture: David Bau' },
	{ week: 7, date: 'Wed. May 13', title: 'Mid-project check-in', link: { label: 'Final project description', url: 'https://github.com/rkapur102/cs221m-course/blob/main/materials/final-project.pdf' } },
	{ week: 8, date: 'Mon. May 18', title: 'Guest lecture: Neel Nanda' },
	{
		week: 8,
		date: 'Wed. May 20',
		title: 'Guest lecture: Jing Huang',
		readings: [
			{ authors: 'Huang et al.', year: '2024', title: 'Demystifying Verbatim Memorization in Large Language Models', url: 'https://aclanthology.org/2024.emnlp-main.598/' },
			{ authors: 'Zhang et al.', year: '2021', title: 'Counterfactual Memorization in Neural Language Models', url: 'https://arxiv.org/abs/2112.12938' },
			{ authors: 'Carlini et al.', year: '2021', title: 'Extracting Training Data from Large Language Models', url: 'https://arxiv.org/abs/2012.07805' },
			{ authors: 'Carlini et al.', year: '2023', title: 'Quantifying Memorization Across Neural Language Models', url: 'https://arxiv.org/abs/2202.07646' },
			{ authors: 'Kuditipudi et al.', year: '2025', title: 'Blackbox Model Provenance via Palimpsestic Membership Inference', url: 'https://arxiv.org/abs/2510.19796' },
		]
	},
	{ week: 9, date: 'Mon. May 25', title: 'No lecture (Memorial Day)' },
	{ week: 9, date: 'Wed. May 27', title: 'Guest lecture: Jack Lindsey' },
	{ week: 10, date: 'Mon. June 1', title: 'Guest lecture: Naomi Saphra' },
	{ week: 10, date: 'Wed. June 3', title: 'Project presentations', link: { label: 'Final project description', url: 'https://github.com/rkapur102/cs221m-course/blob/main/materials/final-project.pdf' } },
];

export const extras: Lecture[] = [
		{
			num: 0,
			title: 'Pragmatic inference and Rational Speech Acts',
			date: 'Extra',
			tag: 'inside',
			notebooks: [{ file: 'extra_rsa_pragmatics.ipynb' }],
			slides: false,
			readings: [
				{ authors: 'Frank & Goodman', year: '2012', title: 'Predicting Pragmatic Reasoning in Language Games', url: 'https://doi.org/10.1126/science.1218633' },
				{ authors: 'Goodman & Frank', year: '2016', title: 'Pragmatic Language Interpretation as Probabilistic Inference', url: 'https://doi.org/10.1016/j.tics.2016.08.005' },
				{ authors: 'Scontras et al.', year: '2021', title: 'A Practical Introduction to the Rational Speech Act Modeling Framework', url: 'https://arxiv.org/abs/2105.09867' },
				{ authors: 'Geiger et al.', year: '2021', title: 'Causal Abstractions of Neural Networks', url: 'https://arxiv.org/abs/2106.02997' },
			]
		}
];

export const closing = { bridging: '05_out_of_week_5.md', storyId: '748017' };

export const homeStoryIds: [string, string, string] = ['2109652', '539105', '1596061'];

/** What the homepage schedule shows in each view. Final project links never appear. */
export function scheduleFor(view: View): { showDates: boolean; guestRows: ScheduleRow[] } {
	if (view === 'self') return { showDates: false, guestRows: [] };
	const guestRowsShown = guestRows.map((row) =>
		row.link?.label === 'Final project description' ? { ...row, link: undefined } : row
	);
	return { showDates: true, guestRows: guestRowsShown };
}

/** A lecture title for headers, with its date only in the enrolled view. */
export function lectureLabel(lec: Lecture, view: View): string {
	return view === 'enrolled' ? `${lec.title} (${lec.date})` : lec.title;
}
