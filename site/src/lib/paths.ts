import { resolve } from '$app/paths';

/**
 * The site's base path: '' at a domain root, '/cs221m-course' for the temporary
 * GitHub Pages preview (set with BASE_PATH at build time).
 */
export const base = resolve('/').replace(/\/$/, '');

/** Prefix a site path like '/week/1' with the base path. */
export function href(path: string): string {
	return base + path;
}

/** The site path for a URL pathname, with the base path removed. */
export function sitePath(pathname: string): string {
	if (!base || !pathname.startsWith(base)) return pathname;
	return pathname.slice(base.length) || '/';
}
