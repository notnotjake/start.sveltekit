/** @type {import('tailwindcss').Config} */
export default {
	content: ['./app/**/*.{html,js,svelte,ts}'],
	theme: {
		fontFamily: {
			sans: [
				'Inter V',
				'Inter',
				'ui-sans-serif',
				'system-ui',
				'sans-serif',
				'Apple Color Emoji',
				'Segoe UI Emoji',
				'Segoe UI Symbol',
				'Noto Color Emoji'
			]
		},
		extend: {
			fontFamily: {
				rounded: ['Rounded']
			}
		}
	},
	plugins: []
}
