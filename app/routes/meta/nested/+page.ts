import type { PageLoad, PageParentData } from './$types'
import { createMeta } from '$utils/Meta'

export const load: PageLoad = async ({ parent }) => {
	const Meta = await createMeta(parent)

	Meta.set({
		icon: '/favicon.png',
		sitename: 'SvelteKit Starter',
		title: 'Nested Page Meta Test',
		description: 'This is a test page for metadata',
		image: 'https://large-assets.notnotjake.com/images/onething.png'
	})

	console.log('Nested Page', Meta.getData())
	console.log('Nested Page', Meta.getData().meta.additionalTags)

	return {
		...Meta.getData()
	}
}
