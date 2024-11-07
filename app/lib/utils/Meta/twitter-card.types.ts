/**
 * Used on X for presenting content in cards. Cards have types of summary, large-image, player, or app
 */
export type TwitterCard = {
	/** The X account for the website or platform where the content was published */
	site: string
	/** The X account for the individual user that created the content */
	creator?: string
	/**
	 * Title of content
	 * @maxLength 70
	 */
	title: string
	/**
	 * Description of content
	 * @maxLength 200
	 */
	description: string
} & (
	| ({ type: 'summary' } & TwitterCardImage)
	| ({ type: 'summaryLargeImage' } & TwitterCardImage)
	| { type: 'app'; app: TwitterCardApp }
	| { type: 'player'; player: TwitterCardPlayer }
)
type TwitterCardImage = {
	/**
	 * URL of image to use in the card
	 * - Supports JPG, PNG, WEBP, and GIF
	 * - Max size of 5MB
	 */
	image?: string
	/**
	 * Text description of the image
	 * @maxLength 420
	 */
	imageAlt?: string
}
type TwitterCardPlayer = {
	/** HTTPS URL of player iframe */
	url: string
	/** URL to raw video or audio stream */
	stream?: string
	/** Width of iframe in pixels */
	width?: number
	/** Height of iframe in pixels */
	heigh?: number
}
type TwitterCardApp = {
	/** The name of your app */
	name:
		| string
		| {
				iphone: string
				ipad: string
				google: string
		  }
	/** The URL scheme for your app */
	url:
		| string
		| {
				iphone: string
				ipad: string
				google: string
		  }
	/** Your app ID in the App Store  */
	id:
		| string
		| {
				iphone: string
				ipad: string
				/** Your app ID in the Google Play Store */
				google: string
		  }
	/** The two-letter App Store country code where your app is available if not available in the US */
	country?: string
}
