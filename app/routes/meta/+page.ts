import type { PageLoad } from './$types'
import { createMeta } from '$utils/Meta'

export const load: PageLoad = async ({ parent }) => {
	const Meta = await createMeta(parent)

	// Full Options
	Meta.set({
		icon: {
			url: 'favicon.png',
			size: 180,
			type: 'png'
		},
		maskIcon: {
			url: 'mask-icon.svg',
			color: '#000000'
		},
		theme: '#020202',
		colorScheme: 'light dark',
		sitename: 'SvelteKit Meta',
		title: 'Meta Testing',
		titleTemplate: 'Test {page}',
		description:
			'The meta utility allows us to set metadata in a sveltekit native way with data-cascade',
		author: ['Jake Go', 'Another'],
		twitterSite: '@sveltejs',
		twitterCreator: '@notnotjake',
		date: '2024-11-13',
		modified: '2024-11-13',
		type: 'player',
		image: {
			url: 'imageurl.png',
			alt: 'A photo of a happy puppy'
		}
	})

	return {
		...Meta.getData()
	}
}
