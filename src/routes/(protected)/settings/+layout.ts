import { metaLoad } from '@opensky/seo'

export const load = metaLoad.layout({
	title: 'Settings',
	titleTemplate: { route: '/(protected)/settings', template: 'Settings - {page}' }
})
