import type { LayoutServerLoad } from './$types'

const site = {
	title: 'Svelte Starter',
	description: 'Super Awesome SvelteKit Site!',
	author: '',
	twitter: '',
	image: 'https://assets.foo.com/images/og-image.jpg'
}

export const load: LayoutServerLoad = () => {
	return {
		test: 'Test Success',
		...site
	}
}
