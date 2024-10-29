export const effects = {}

export const extend = {
	boxShadow: {
		'inner-xs': 'inset 0 0 0 1px hsl(0, 0%, 88%)',
		'input-pop':
			'inset 0 0 0 2px hsla(207, 100%, 50%, 0.8),inset 0 -2px 0 0 hsla(0, 0%, 0%, 0.2), 0 1.5px 3px 1px hsla(274, 100%, 64%, 0.1), 0 0 0 3px hsla(211, 100%, 60%, 0.2)'
	},
	keyframes: {
		shimmer: {
			'100%': {
				transform: 'translateX(100%)'
			}
		}
	}
}

export default {
	...effects,
	extend
}
