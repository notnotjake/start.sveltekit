import type { LayoutLoad } from './$types'
import { createMeta } from '$utils/Meta'

export const load: LayoutLoad = async ({ parent }) => {
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
		sitename: 'SvelteKit Starter',
		title: 'Meta Utility',
		twitterSite: '@sveltejs',
		twitterCreator: '@notnotjake'
	})

	return {
		...Meta.getData()
	}
}
