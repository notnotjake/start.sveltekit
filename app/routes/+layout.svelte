<script>
	import '$tailwind'

	import { createFonts, LoadFonts, url } from '$utils/Fonts'
	import { LoadMeta } from '$utils/Meta'

	const Fonts = createFonts()

	let { children } = $props()
</script>

<LoadMeta debug={true} />
<LoadFonts {Fonts} debug={false} />

{@render children?.()}
