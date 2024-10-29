<script>
	import '$tailwind'

	import { createFonts, LoadFonts, local, url } from '$utils/Fonts'

	import Head from '$lib/global/Head.svelte'

	const Fonts = createFonts()

	// Maybe we should also define the global site data here instead of a site.json?
	// in which case it would be easier i think to change that on the page and layouts
	// more like 11ty data cascade. but would require the import again i think
</script>

<svelte:head>
	<Head />
</svelte:head>

<LoadFonts {Fonts} debug={false} />

<slot />
