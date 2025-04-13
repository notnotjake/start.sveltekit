import { layoutMetaLoad } from '$utils/meta-tags'

export const load = layoutMetaLoad({
	maskIcon: {
		url: 'mask-icon.svg',
		color: '#000000'
	},
	theme: '#020202',
	colorScheme: 'light dark',
	sitename: 'SvelteKit Starter',
	title: 'Meta Layout',
	twitterSite: '@sveltejs',
	twitterCreator: '@notnotjake'
})
