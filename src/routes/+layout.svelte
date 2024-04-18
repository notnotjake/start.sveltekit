<script>
	import '$lib/_global/_reset.css'
	import '$lib/_global/_styles.scss'
	import Fonts from '$lib/_global/Fonts.svelte'
	import Head from '$lib/_global/Head.svelte'
</script>

<svelte:head>
	<Head />
	<Fonts />
</svelte:head>

<slot />