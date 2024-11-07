export { default as LoadMeta } from './mount.svelte'
import type { Metadata } from './properties'
import type { App } from '@sveltejs/kit'

type HeadTagMeta = {
	name?: string
	property?: string
	content: string
}

type HeadTagMetaSimple = [name: string, content: string]

type HeadTagArbitrary = {
	[key: string]: string | boolean
}

type HeadTag =
	| ({ tagType: 'meta' } & HeadTagMeta)
	| ({ tagType: 'link' | 'script' } & HeadTagArbitrary)

class MetaClass {
	// An array of the head tags (meta, link, script) to add to the <head>
	private outputTags: Array<HeadTag>

	private outputData: Metadata

	private parentData?: App.parentData

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

		// Merge data with parent data
		this.outputData = {
			...parentDataMeta,
			...data
		}
	}

	// Generates output when using the instance variable
	getData() {
		return {
			meta: {
				...this.outputData,
				additionalTags: this.outputTags
			}
		}
	}
}

export async function createMeta(
	parentDataLoad?: () => Promise<App.parentData>
): Promise<MetaClass> {
	// Loads the parent data from the reference passed in, if it exists, else undefined
	const parentData = parentDataLoad ? await parentDataLoad() : undefined
	// Passing in empty variables so that we control the data flow
	// This fixes an issue where on server side, sveltekit will re-use the same instance across requests
	const outputTagsArray: Array<HeadTag> = []
	const outputDataObj: Metadata = {}
	// Creates the instance of the class and returns it
	return new MetaClass(outputTagsArray, outputDataObj, parentData)
}
