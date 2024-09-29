<script>
	import { page } from '$app/stores'

	import Site from '$lib/global/site.json'
</script>

<link rel="icon" type="image/png" sizes="128x128" href={Site.favicon} />

<!-- Site Info -->
{#if Site.author}<meta name="author" content={Site.author} />{/if}

<title>{$page?.data?.title ? `${Site.name} - ${$page.data.title}` : Site.name} </title>

<meta
	name="description"
	content={$page?.data?.description ? $page.data.description : Site.description}
/>
<!-- Site Info [END] -->

<!-- OpenGraph -->
<meta property="og:type" content="website" />
<meta property="og:site_name" content={Site.name} />
<meta property="og:url" content={Site.baseURL} />
<meta
	property="og:title"
	content={$page?.data?.title ? `${Site.name} - ${$page.data.title}` : Site.name}
/>
<meta
	property="og:description"
	content={$page?.data?.description ? $page.data.description : Site.description}
/>
<meta property="og:image" content={$page?.data?.image ? $page.data.image : Site.image} />
<!-- OpenGraph [END] -->

<!-- Twitter Cards -->
<meta property="twitter:card" content="summary" />
<meta property="twitter:site" content={Site.twitter} />
<meta property="twitter:creator" content={Site.twitter} />
<meta
	property="twitter:title"
	content={$page?.data?.title ? `${Site.name} - ${$page.data.title}` : Site.name}
/>
<meta
	property="twitter:description"
	content={$page?.data?.description ? $page.data.description : Site.description}
/>
<meta property="twitter:image" content={$page?.data?.image ? $page.data.image : Site.image} />
<!-- Twitter Cards [END] -->

<!-- Fathom Analytics -->
{#if Site?.analytics?.id}
	<script src="https://cdn.usefathom.com/script.js" data-site={Site.analytics.id} defer></script>
{/if}
<!-- Fathom Analytics [END] -->
