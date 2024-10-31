<script>
	import '$tailwind'

	import { page } from '$app/stores'
	import { createFonts, LoadFonts, local, url } from '$utils/Fonts'

	// import { LoadMeta } from '$utils/Meta'

	const Fonts = createFonts()
</script>

<!-- <LoadMeta debug={false} /> -->
<LoadFonts {Fonts} debug={false} />

<h1>{$page.data.test}</h1>
<h1>{$page.data.title}</h1>
<h1>{$page.data.description}</h1>

<slot />
