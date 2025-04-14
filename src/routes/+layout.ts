import { baseMetaLoad } from 'sveltekit-meta'
import { assetUrl } from '$utils/asset-url'

export const load = baseMetaLoad({
	sitename: 'SvelteKit Starter',
	icon: './favicon.png',
	title: 'Root Layout',
	titleTemplate: 'Luxo - {page}',
	description: 'A great example SvelteKit site to start new projects from',
	image: assetUrl('/images/og-image.jpg')
})
