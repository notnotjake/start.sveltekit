/** @type {import('tailwindcss').Config} */
import appearance from './app/lib/theme/appearance'
import effects from './app/lib/theme/effects'
import layout from './app/lib/theme/layout'
import typography from './app/lib/theme/typography'

export default {
	content: ['./app/**/*.{html,js,svelte,ts}'],
	theme: {
		...typography,
		...appearance,
		...effects,
		...layout,
		extend: {
			...typography.extend,
			...appearance.extend,
			...effects.extend,
			...layout.extend
		}
	},
	plugins: []
}
