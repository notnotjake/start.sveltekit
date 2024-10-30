import type { LayoutLoad } from './$types'

export const site = {
	title: 'Svelte Starter',
	description: 'Super Awesome SvelteKit Site!',
	author: '',
	twitter: '',
	image: 'https://assets.foo.com/images/og-image.jpg'
}

export const load: LayoutLoad = () => {
	return {
		meta: {
			...site
		}
	}
}
