import { marked } from 'marked';

const files = import.meta.glob('../../../bridging/*.md', {
	query: '?raw',
	import: 'default',
	eager: true
}) as Record<string, string>;

const byName = new Map(Object.entries(files).map(([path, src]) => [path.split('/').pop()!, src]));

/** Render a bridging essay (from the repo's bridging/ folder) to HTML. */
export function bridgingHtml(filename: string): string {
	const src = byName.get(filename);
	if (src === undefined) throw new Error(`Unknown bridging text: ${filename}`);
	const html = marked.parse(src, { async: false });
	return html.replace(/<a href="(https?:\/\/[^"]*)"/g, '<a href="$1" target="_blank" rel="noopener"');
}
