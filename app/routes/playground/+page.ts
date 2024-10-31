import type { PageLoad } from './$types'

const site = {
	title: 'Page Override'
}

export const load: PageLoad = () => {
	return {
		test: 'Test Success',
		...site
	}
}
