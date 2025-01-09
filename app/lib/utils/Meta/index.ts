/**
 * Metadata management system for SvelteKit applications.
 * Handles HTML head tags and structured metadata with parent data inheritance.
 */

export { default as LoadMeta } from './mount.svelte'
import type { Metadata } from './properties'
import type { App } from '@sveltejs/kit'

/**
 * Represents a meta tag configuration with name/property and content.
 */
type HeadTagMeta = {
	name?: string
	property?: string
	content: string
}

/**
 * Simplified meta tag configuration as a tuple of [name, content].
 */
type HeadTagMetaSimple = [name: string, content: string]

/**
 * Arbitrary key-value pairs for link and script tags.
 */
type HeadTagArbitrary = {
	[key: string]: string | boolean
}

/**
 * Union type representing different kinds of head tags (meta, link, script).
 */
type HeadTag =
	| ({ tagType: 'meta' } & HeadTagMeta)
	| ({ tagType: 'link' | 'script' } & HeadTagArbitrary)

/**
 * Core class for managing metadata and head tags.
 * Provides methods for adding tags and setting structured metadata.
 */
class MetaClass {
	/**
	 * Collection of head tags (meta, link, script) to be added to the <head>.
	 */
	private outputTags: Array<HeadTag>

	/**
	 * Structured metadata storage for the application.
	 */
	private outputData: Metadata

	/**
	 * Optional parent-level metadata inherited from SvelteKit.
	 */
	private parentData?: App.parentData

	/**
	 * Creates a new MetaClass instance.
	 * @param outputTags Initial array of head tags
	 * @param outputData Initial structured metadata
	 * @param parentData Optional parent-level metadata from SvelteKit
	 */
	constructor(outputTags: Array<HeadTag>, outputData: Metadata, parentData?: App.parentData) {
		this.outputTags = outputTags
		this.outputData = outputData
		this.parentData = parentData

		// Define Object.add as a function with additional methods
		this.add = Object.assign(
			(config: HeadTagMeta | HeadTagMetaSimple): void => {
				this.add.meta(config) // passes on to add.meta method
			},
			{
				meta: (config: HeadTagMeta | HeadTagMetaSimple): void => {
					if (Array.isArray(config)) {
						const [name, content] = config
						this.outputTags.push({ tagType: 'meta', name, content })
					} else {
						this.outputTags.push({ tagType: 'meta', ...config })
					}
				},
				link: (config: HeadTagArbitrary): void => {
					this.outputTags.push({ tagType: 'link', ...config })
				},
				script: (config: HeadTagArbitrary): void => {
					this.outputTags.push({ tagType: 'script', ...config })
				}
			}
		)
	}

	// Add is both a method and contains methods
	add: ((config: HeadTagMeta | [string, string]) => void) & {
		meta: (config: HeadTagMeta | [string, string]) => void
		link: (config: HeadTagArbitrary) => void
		script: (config: HeadTagArbitrary) => void
	}

	// Use to add structured data
	/**
	 * Sets structured metadata with validation and parent data inheritance.
	 * Handles title templates, character limits, and mutual exclusivity rules.
	 * @param data Metadata to set
	 */
	set(data: Metadata): void {
		// Extract data from parent data if it exists
		const parentDataMeta = this.parentData?.meta as Metadata | undefined

		console.log('data.set was called')

		// Validate Data

		// Handle character limit on title
		if (data.title && data.title.length > 70) {
			console.warn('Title exceeds recommended length of 70 characters')
		}
		// Handle character limit on description
		if (data.description && data.description.length > 200) {
			console.warn('Description exceeds recommended length of 200 characters')
		}
		// Handle mutual exclusivity for image/images
		if ('image' in data && 'images' in data) {
			console.warn('Both image and images properties specified - using images and ignoring image')
			const { image, ...restData } = data
			data = restData
		}
		// Handle mutual exclusivity for video/videos
		if ('video' in data && 'videos' in data) {
			console.warn('Both video and videos properties specified - using videos and ignoring video')
			const { video, ...restData } = data
			data = restData
		}

		// Handle Title and Title Templates
		if (parentDataMeta?.titleTemplate && data?.title) {
			data.title = parentDataMeta.titleTemplate.replace(/\{page\}/g, data.title)
		}

		// Merge data with parent data
		this.outputData = {
			...parentDataMeta,
			...data
		}
	}

	// Generates output when using the instance variable
	/**
	 * Retrieves the final metadata structure including both
	 * structured data and additional head tags.
	 * @returns Object containing merged metadata and additional tags
	 */
	getData() {
		return {
			meta: {
				...this.outputData,
				additionalTags: this.outputTags
			}
		}
	}
}

/**
 * Factory function to create a new MetaClass instance with clean state.
 * @param parentDataLoad Optional function to load parent data
 * @returns Promise resolving to new MetaClass instance
 */
export async function createMeta(
	parentDataLoad?: () => Promise<App.parentData>
): Promise<MetaClass> {
	// Loads the parent data from the reference passed in, if it exists, else undefined
	const parentData = parentDataLoad ? await parentDataLoad() : undefined
	// Passing in empty variables so that we control the data flow
	// This fixes an issue where on server side, sveltekit will re-use the same instance across requests
	const outputTagsArray: Array<HeadTag> = []
	const outputDataObj: Metadata = {}

	console.log(parentData)

	// Creates the instance of the class and returns it
	return new MetaClass(outputTagsArray, outputDataObj, parentData)
}
