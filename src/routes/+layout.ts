import { metaLoad } from 'sveltekit-meta'
import { assetUrl } from '$utils/asset-url'

export const load = metaLoad.layout({
	sitename: 'SvelteKit Starter',
	icon: './favicon.png',
	title: 'Root Layout',
	titleTemplate: { route: '/', template: 'Luxo - {page}' },
	description: 'A great example SvelteKit site to start new projects from',
	image: assetUrl('/images/og-image.jpg')
})
