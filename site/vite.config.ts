import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			adapter: adapter({
				fallback: undefined,
				// The preview build goes to its own folder so it never replaces the local build.
				pages: process.env.BUILD_DIR ?? 'build',
				assets: process.env.BUILD_DIR ?? 'build'
			}),
			// Temporary GitHub Pages preview builds set BASE_PATH=/cs221m-course; the real site builds at the root.
			paths: { base: (process.env.BASE_PATH ?? '') as '' | `/${string}` }
		})
	],
	server: {
		fs: {
			// Allow reading files from the repo root (course notebooks, slides, bridging texts).
			allow: ['..']
		}
	}
});
