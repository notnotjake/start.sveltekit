export const typography = {
	fontFamily: {
		sans: [
			'"Inter V"',
			'"Inter Var"',
			'"Inter"',
			'ui-sans-serif',
			'system-ui',
			'sans-serif',
			'Apple Color Emoji',
			'Segoe UI Emoji',
			'Segoe UI Symbol',
			'Noto Color Emoji'
		],
		mono: [
			'ui-monospace',
			'SFMono-Regular',
			'Menlo',
			'Monaco',
			'Consolas',
			'"Liberation Mono"',
			'"Courier New"',
			'monospace'
		]
	}
}

export const extend = {
	fontFamily: {
		headline: ['Unbounded Var']
	},
	letterSpacing: {
		'tight-sm': '-0.011em',
		'tight-md': '-0.013em',
		'tight-lg': '-0.015em'
	}
}

export default {
	...typography,
	extend
}
