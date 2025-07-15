import { metaLoad } from 'sveltekit-meta'

export const load = metaLoad.layout({
	title: 'Settings',
	titleTemplate: { route: '/(protected)/settings', template: 'Settings - {page}' }
})
