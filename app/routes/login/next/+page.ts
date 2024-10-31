import type { PageLoad } from './$types'

const site = {
	description: 'page after layout?'
}

export const load: PageLoad = () => {
	return {
		test: 'Test Success',
		...site
	}
}
