<script>
	import '$tailwind'
	import '@fontsource-variable/inter/index.css'

	import { MetaTags } from 'sveltekit-meta'

	// import { createFonts, LoadFonts, url } from '$utils/Fonts'

	// const Fonts = createFonts() // Use this to import any self-hosted or licensed fonts

	let { children } = $props()
</script>

<MetaTags />

<!-- <LoadMeta /> -->
<!-- <LoadFonts {Fonts} />  -->

{@render children?.()}
