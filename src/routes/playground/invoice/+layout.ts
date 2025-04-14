import { layoutMetaLoad } from 'sveltekit-meta'

export const load = layoutMetaLoad({
	titleTemplate: 'Playground! {page}'
})
