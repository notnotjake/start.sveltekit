//@ts-check

/** @type {import("prettier").Config} */
const config = {
	useTabs: true,
	singleQuote: true,
	trailingComma: 'none',
	semi: false,
	printWidth: 100,
	plugins: [
		'prettier-plugin-svelte',
		'prettier-plugin-tailwindcss',
		'@ianvs/prettier-plugin-sort-imports'
	],
	overrides: [{ files: '*.svelte', options: { parser: 'svelte' } }],
	importOrder: [
		// Types first
		'<TYPES>',
		// Generic Stuff
		'<BUILTIN_MODULES>',
		'<THIRD_PARTY_MODULES>',
		// Svelte core imports
		'^svelte$',
		'^svelte/(.*)$',
		'^@sveltejs/(.*)$',
		'^\\$app/(.*)$',
		'^\\$utils/(.*)$',
		'^\\$env/(.*)$',
		'',
		// Local imports with aliases and relative paths
		'^\\$ui/(.*)$',
		'^\\$lib/(.*)$',
		'^[.]'
	],
	importParserPlugins: ['typescript', 'jsx', 'decorators-legacy']
}

export default config
