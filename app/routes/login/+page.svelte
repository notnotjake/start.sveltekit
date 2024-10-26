<script lang="ts">
	import Footer from '$ui/Footer.svelte'
	import type { PageData } from './$types'

	export let data: PageData
</script>

{#await data.token}
	<p>Loading Token...</p>
{:then token}
	<p>{token}</p>
{:catch error}
	<p>Error Loading Token</p>
{/await}

{#await data.session}
	<p>Loading Session...</p>
{:then session}
	<p>{session.userId} - {session.id} {session.expiresAt}</p>
{:catch error}
	<p>Error Loading Session</p>
{/await}

<a href="/">Svelte Starter</a>

<Footer />
