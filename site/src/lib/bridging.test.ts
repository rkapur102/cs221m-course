import { describe, it, expect } from 'vitest';
import { bridgingHtml } from './bridging';

describe('bridgingHtml', () => {
	it('renders bold terms', () => {
		expect(bridgingHtml('01_week_1_to_week_2.md')).toContain('<strong>autoregressive</strong>');
	});
	it('renders the rule and external links', () => {
		const html = bridgingHtml('05_out_of_week_5.md');
		expect(html).toContain('<hr>');
		expect(html).toMatch(/<a [^>]*target="_blank"/);
		expect(html).toContain('rel="noopener"');
	});
	it('throws on an unknown file', () => {
		expect(() => bridgingHtml('nope.md')).toThrow();
	});
});
