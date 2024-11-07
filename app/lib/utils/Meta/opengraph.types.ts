export type OpenGraph = {
	/** The title of your object as it should appear within the graph */
	title: string
	/** A one to two sentence description of your object */
	description: string
	/** The canonical URL of your object that will be used as its permanent ID in the graph */
	url?: string
	/** If your object is part of a larger web site, the name which should be displayed for the overall site */
	siteName?: string

	/** An image URL which should represent your object within the graph */
	image?: string | OpenGraphMediaOptional | Array<string> | Array<OpenGraphMediaOptional>
	/** A URL to a video file that complements this object */
	video?: string | OpenGraphMediaOptional | Array<string> | Array<OpenGraphMediaOptional>
	/** A URL to an audio file to accompany this object */
	audio?: string | OpenGraphAudioOptional | Array<string> | Array<OpenGraphAudioOptional>
	/**
	 * The word that appears before the title in a sentence. If auto is chosen, the consumer of your data should choose between 'a' and 'an'.
	 * @default "" */
	determiner?: 'a' | 'an' | 'the' | '' | 'auto'
	/**
	 * The locale these tags are marked up in. Of the format language_TERRITORY
	 * @default "en_US"
	 */
	locale?: string
	/** An array of other locales this page is available in */
	localeAlt?: Array<string>
} & (({ type: 'article' } & OpenGraphArticle) | { type: 'website' })

type OpenGraphMediaOptional = {
	/** An image URL which should represent your object within the graph */
	url: string
	/** An alternate url to use if the webpage requires HTTPS */
	secureUrl?: string
	/** A MIME type for this image */
	type?: string
	/** The width in pixels */
	width?: number
	/** The height in pixels */
	height?: number
	/** A description of what is in the image (not a caption) */
	alt?: string
}

type OpenGraphAudioOptional = {
	/** An image URL which should represent your object within the graph */
	url: string
	/** An alternate url to use if the webpage requires HTTPS */
	secureUrl?: string
	/** A MIME type for this image */
	type?: string
	/** The width in pixels */
}

type OpenGraphArticle = {
	publishedTime?: string
	modifiedTime?: string
	expirationTime?: string
	author?: string | Array<string>
	section?: string
	tags?: string | Array<string>
}
