<script>
	import '$tailwind'
	import '@fontsource-variable/inter/index.css'

	import { LoadMeta } from '$utils/Meta'
	// import { createFonts, LoadFonts, url } from '$utils/Fonts'

	// const Fonts = createFonts() // Use this to import any self-hosted or licensed fonts

	let { children } = $props()
</script>

<LoadMeta debug={false} />
<!-- <LoadFonts {Fonts} debug={false} />  -->

{@render children?.()}
