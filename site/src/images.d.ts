// images/goodfire_logo.PNG has an uppercase extension, which vite/client does not declare.
declare module '*.PNG' {
	const src: string;
	export default src;
}
