<script lang="ts">
	import { page } from '$app/state'
	import { onMount } from 'svelte'
	import { DebugLogger } from '$utils/debug'

	let { debug = false } = $props()

	let meta = page.data.meta
</script>

<svelte:head>
	<!-- SEO: Cannonical URL -->
	{#if meta.canonical}
		<meta property="og:url" content={meta.canonical} />
	{/if}

	<!-- APPEARENCE: Icon -->
	{#if meta.icon}
		{#if typeof meta.icon === 'string'}
			<link rel="icon" href={meta.icon} />
			<link rel="apple-touch-icon" href={meta.icon} />
		{:else}
			{#if meta.icon.svg}
				<link rel="icon" type="image/svg+xml" href={meta.icon.svg} />
			{/if}
			{#if meta.icon.small}
				<link rel="icon" type={meta.icon.small.type || 'image/png'} href={meta.icon.small.url} />
			{/if}
			{#if meta.icon.large}
				<link rel="icon" type={meta.icon.small.type || 'image/png'} href={meta.icon.small.url} />
				<link
					rel="apple-touch-icon"
					type={meta.icon.small.type || 'image/png'}
					href={meta.icon.small.url}
				/>
			{/if}
		{/if}
	{/if}

	<!-- APPEARENCE: Safari Pinned Tab Icon -->
	{#if meta.maskIcon}
		<link rel="mask-icon" href={meta.maskIcon.url} color={meta.maskIcon.color} />
	{/if}

	<!-- APPEARENCE: Theme Color -->
	{#if meta.theme}
		{#if typeof meta.theme === 'object'}
			<meta name="theme-color" content={meta.theme.light} media="(prefers-color-scheme: light)" />
			<meta name="theme-color" content={meta.theme.dark} media="(prefers-color-scheme: dark)" />
		{:else}
			<meta name="theme-color" content={meta.theme} />
		{/if}
	{/if}

	<!-- APPEARENCE: Color Scheme -->
	{#if meta.colorScheme}
		<meta name="color-scheme" content={meta.colorScheme} />
	{/if}

	<!-- SHARING: Site Name -->
	{#if meta.sitename}
		<meta property="og:site_name" content={meta.sitename} />
	{/if}

	<!-- SHARING: Title -->
	{#if meta.title}
		<title>{meta.title}</title>
		<meta property="og:title" content={meta.title} />
		<meta name="twitter:title" content={meta.title} />
	{/if}

	<!-- SHARING: Description -->
	{#if meta.description}
		<meta name="description" content={meta.description} />
		<meta property="og:description" content={meta.description} />
		<meta name="twitter:description" content={meta.description} />
	{/if}

	<!-- SHARING: Content Type -->
	{#if meta.type}
		{#if typeof meta.type === 'object'}
			<meta property="og:type" content={meta.type.og} />
			<meta name="twitter:card" content={meta.type.twitter} />
		{:else if meta.type === 'article'}
			<meta property="og:type" content="article" />
			<meta name="twitter:card" content="summary" />
		{:else if meta.type === 'largeImage'}
			<meta property="og:type" content="website" />
			<meta name="twitter:card" content="summary_large_image" />
		{:else if meta.type === 'player'}
			<meta property="og:type" content="website" />
			<meta name="twitter:card" content="player" />
		{:else}
			<meta property="og:type" content="website" />
			<meta name="twitter:card" content="summary" />
		{/if}
	{/if}

	<!-- SHARING: Author -->
	{#if meta.author}
		{#if Array.isArray(meta.author)}
			<meta name="author" content={meta.author.join(', ')} />
			{#each meta.author as author}
				<meta property="article:author" content={author} />
			{/each}
		{:else}
			<meta name="author" content={meta.author} />
			<meta property="article:author" content={meta.author} />
		{/if}
	{/if}

	<!-- SHARING: Images -->
	{#if meta.image}
		{#if typeof meta.image === 'string'}
			<meta property="og:image" content={meta.image} />
			<meta name="twitter:image" content={meta.image} />
		{:else}
			<meta property="og:image" content={meta.image.url} />
			{#if meta.image.secureUrl}<meta
					property="og:image:secure_url"
					content={meta.image.secureUrl}
				/>{/if}
			<meta name="twitter:image" content={meta.image.url} />
			{#if meta.image.width}<meta property="og:image:width" content={meta.image.width} />{/if}
			{#if meta.image.height}<meta property="og:image:height" content={meta.image.height} />{/if}
			{#if meta.image.type}<meta property="og:image:type" content={meta.image.type} />{/if}
			{#if meta.image.alt}
				<meta property="og:image:alt" content={meta.image.alt} />
				<meta name="twitter:image:alt" content={meta.image.alt} />
			{/if}
		{/if}
	{/if}
	{#if meta.images}
		{#each meta.images as image, i}
			<!-- Set twitter:image only for the first image -->
			{#if i === 0}
				<meta name="twitter:image" content={image.url} />
				{#if image.alt}
					<meta name="twitter:image:alt" content={image.alt} />
				{/if}
			{/if}
			<meta property="og:image" content={image.url} />
			{#if meta.image.secureUrl}<meta
					property="og:image:secure_url"
					content={meta.image.secureUrl}
				/>{/if}
			{#if image.width}<meta property="og:image:width" content={image.width} />{/if}
			{#if image.height}<meta property="og:image:height" content={image.height} />{/if}
			{#if image.type}<meta property="og:image:type" content={image.type} />{/if}
			{#if image.alt}
				<meta property="og:image:alt" content={image.alt} />
			{/if}
		{/each}
	{/if}

	<!-- SHARING: Video -->
	{#if meta.video}
		{#if typeof meta.video === 'string'}
			<meta property="og:video" content={meta.video} />
			<meta name="twitter:player" content={meta.video} />
		{:else}
			<meta property="og:video" content={meta.video.url} />
			<meta name="twitter:player" content={meta.video.url} />
			{#if meta.video.width}
				<meta property="og:video:width" content={meta.video.width} />
				<meta name="twitter:player:width" content={meta.video.width} />
			{/if}
			{#if meta.video.height}
				<meta property="og:video:height" content={meta.video.height} />
				<meta name="twitter:player:height" content={meta.video.height} />
			{/if}
			{#if meta.video.type}<meta property="og:video:type" content={meta.video.type} />{/if}
		{/if}
	{/if}
	<!-- [END] SHARING: Media (images or video) -->

	<!-- SEO: Date Published -->
	{#if meta.date}
		<meta property="article:published_time" content={meta.date} />
		<meta name="date" content={meta.date} />
	{/if}

	<!-- SEO: Date Modified -->
	{#if meta.modified}
		<meta property="article:modified_time" content={meta.modified} />
		<meta name="last-modified" content={meta.modified} />
	{/if}

	<!-- TWITTER: Site/Publisher Account -->
	{#if meta.twitterSite}
		<meta name="twitter:site" content={meta.twitterSite} />
	{/if}

	<!-- TWITTER: Creator Account -->
	{#if meta.twitterCreator}
		<meta name="twitter:creator" content={meta.twitterCreator} />
	{/if}

	<!-- Arbitrary meta, link, script tags -->
	{#each meta.additionalTags as tag}
		{@const { tagType, ...attributes } = tag}
		{#if tagType === 'meta'}
			<meta {...attributes} />
		{:else if tagType === 'link'}
			<link {...attributes} />
		{:else if tagType === 'script'}
			<script {...attributes}></script>
		{/if}
	{/each}
</svelte:head>

{#if debug}
	<DebugLogger label="Meta" data={meta} />
{/if}
