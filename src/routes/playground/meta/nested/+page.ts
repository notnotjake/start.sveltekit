import { pageMetaLoad } from '$utils/meta-tags'

export const load = pageMetaLoad({
	icon: '/favicon.png',
	sitename: 'SvelteKit Starter',
	title: 'Meta Nested Page',
	description: 'This is a test page for metadata',
	image: 'https://large-assets.notnotjake.com/images/onething.png'
})
