export function load() {
	type Head = {
		title: String
		description: String
		image: String
	}

	const pageData: Head = {
		title: 'Svelte Project',
		description: 'This is my starter project',
		image: 'https://large-assets.notnotjake.com/images/site/og-image-sitewide.jpeg'
	}

	return {
		pageData
	}
}
