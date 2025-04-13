import type { Metadata, ParentMetadata } from './properties'
import type { App, Load } from '@sveltejs/kit'

const DEBUG = true

/**
 * Parse and merge metadata from parent and current tags
 * @param parentTags Metadata from parent layout (optional)
 * @param setTags Metadata to set for current route
 * @returns Object with merged metaTags
 */
export function parseMeta(parentTags: ParentMetadata | null, setTags: Metadata): { metaTags: any } {
	if (DEBUG) console.log('parse start', performance.now())

	if (DEBUG) console.log('Parent', parentTags)
	if (DEBUG) console.log('SET', setTags)

	// Handle character limit on title
	if (setTags.title && setTags.title.length > 70) {
		console.warn('Title exceeds recommended length of 70 characters')
	}

	// Handle character limit on description
	if (setTags.description && setTags.description.length > 200) {
		console.warn('Description exceeds recommended length of 200 characters')
	}

	// Handle mutual exclusivity for image/images
	if ('image' in setTags && 'images' in setTags) {
		console.warn('Both image and images properties specified - using images and ignoring image')
		const { image, ...restData } = setTags
		setTags = restData
	}

	// Handle mutual exclusivity for video/videos
	if ('video' in setTags && 'videos' in setTags) {
		console.warn('Both video and videos properties specified - using videos and ignoring video')
		const { video, ...restData } = setTags
		setTags = restData
	}

	// Handle titles and title templates
	let safeParentTags: Partial<ParentMetadata> = parentTags ? { ...parentTags } : {}
	// if we set a titleTemplate, then pass that through, if we inherit a titleTemplate, make that the parentTitleTemplate
	if (safeParentTags.titleTemplate) {
		safeParentTags.parentTitleTemplate = safeParentTags.titleTemplate
		delete safeParentTags?.titleTemplate
	}

	if (DEBUG) console.log('parse returning', performance.now())

	return {
		metaTags: { ...safeParentTags, ...setTags }
	}
}

/**
 * Create a base layout load function that resets metadata cascade
 * @param metaTags Base metadata
 * @returns SvelteKit load function
 */
export function baseMetaLoad(metaTags: Metadata): Load {
	if (DEBUG) console.log('base meta load', performance.now())
	return async ({ parent, data }) => {
		const parentData = await parent()
		const { parentMetaTags, ...parentRest } = parentData

		return {
			...data,
			...parentRest,
			...parseMeta(null, metaTags)
		}
	}
}

/**
 * Create a layout load function that merges metadata with parent
 * @param metaTags Metadata for this layout
 * @returns SvelteKit load function
 */
export function layoutMetaLoad(metaTags: Metadata): Load {
	if (DEBUG) console.log('layout meta load', performance.now())
	return async ({ parent, data }) => {
		const parentData = await parent()
		const parentTags = parentData.metaTags as ParentMetadata
		return {
			...data,
			...parentData,
			...parseMeta(parentTags, metaTags)
		}
	}
}

/**
 * Create a page load function that sets page metadata
 * @param metaTags Page metadata
 * @returns SvelteKit load function
 */
export function pageMetaLoad(metaTags: Metadata): Load {
	if (DEBUG) console.log('page meta load', performance.now())
	return async ({ parent, data }) => {
		const parentData = await parent()
		const parentTags = parentData.metaTags as ParentMetadata
		return {
			...data,
			...parentData,
			...parseMeta(parentTags, metaTags)
		}
	}
}

export { default as MetaTags } from './mount.svelte'

export default {
	parseMeta,
	layoutMetaLoad,
	baseMetaLoad,
	pageMetaLoad
}
