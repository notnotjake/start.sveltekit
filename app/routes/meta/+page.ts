import type { PageLoad, PageParentData } from './$types'
import { createMeta } from '$utils/Meta'

export const load: PageLoad = async ({ parent }) => {
	const Meta = await createMeta(parent)

	Meta.set({
		title: 'Meta Utility',
		description:
			'The meta utility allows us to set metadata in a sveltekit native way with data-cascade'
	})

	return {
		...Meta.getData()
	}
}
