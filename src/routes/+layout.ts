import type { LayoutLoad } from './$types'
import { createMeta } from '$utils/Meta'
import { assetUrl } from '$utils/asset-url'

export const load: LayoutLoad = async () => {
	const Meta = await createMeta()
	Meta.set({
		sitename: 'SvelteKit Starter',
		icon: './favicon.png',
		title: 'SvelteKit Starter',
		titleTemplate: 'SvelteKit Starter - {page}',
		description: 'A great example SvelteKit site to start new projects from',
		image: 'https://assets.foo.com/images/og-image.jpg'
	})

	return {
		...Meta.getData()
	}
}
