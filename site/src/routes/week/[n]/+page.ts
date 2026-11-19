import { error } from '@sveltejs/kit';
import { weeks } from '../../../lib/course';
import { bridgingHtml } from '../../../lib/bridging';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => weeks.map((w) => ({ n: String(w.n) }));

export const load: PageLoad = ({ params }) => {
	const week = weeks.find((w) => String(w.n) === params.n);
	if (!week) error(404, 'Not found');
	return { week, html: bridgingHtml(week.bridging) };
};
