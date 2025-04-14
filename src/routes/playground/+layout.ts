import { layoutMetaLoad } from 'sveltekit-meta'

export const load = layoutMetaLoad({
	title: 'Playground!',
	titleTemplate: 'Playground! {page}'
})
