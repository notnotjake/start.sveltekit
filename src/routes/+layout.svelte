<script>
	import '$tailwind'
	import '@fontsource-variable/inter/index.css'

	import { onNavigate } from '$app/navigation'

	import { MetaTags } from '@opensky/seo'

	// import { createFonts, LoadFonts, url } from '$utils/Fonts'

	// const Fonts = createFonts() // Use this to import any self-hosted or licensed fonts

	let { children } = $props()

	onNavigate((navigation) => {
		if (!document.startViewTransition) return

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve()
				await navigation.complete
			})
		})
	})
</script>

<MetaTags />

<!-- <LoadMeta /> -->
<!-- <LoadFonts {Fonts} />  -->

{@render children?.()}
