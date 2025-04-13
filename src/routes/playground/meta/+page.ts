import { pageMetaLoad } from '$utils/meta-tags'

export const load = pageMetaLoad({
	theme: '#020202',
	colorScheme: 'light dark',
	sitename: 'SvelteKit Meta Page',
	title: 'Meta Testing',
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
