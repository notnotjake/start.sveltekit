<script>
	import '$lib/global/_reset.css'
	import '$lib/global/_styles.scss'
	import Fonts from '$lib/global/Fonts.svelte'
	import Head from '$lib/global/Head.svelte'
</script>

<svelte:head>
	<Head />
	<Fonts />
</svelte:head>

<slot />