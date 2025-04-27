import { layoutMetaLoad } from 'sveltekit-meta'

export const load = layoutMetaLoad({
	title: 'Settings',
	titleTemplate: 'Settings - {page}'
})
