<script lang="ts">
	let { debug = false } = $props()
	import { page } from '$app/stores'
	import { assets } from '$app/paths'

	function formatValue(value: any): string {
		if (Array.isArray(value)) {
			return `[${value.length} items]`
		}
		if (typeof value === 'object') {
			return JSON.stringify(value, null, 2)
		}
		return String(value)
	}
</script>

<svelte:head>
	<!-- Basic Tags -->
	{#if $page.data.meta.canonical}
		<meta name="description" content={$page.data.meta.description} />
		<meta property="og:url" content={$page.data.meta.canonical} />
	{/if}

	{#if $page.data.meta.description}
		<meta name="description" content={$page.data.meta.description} />
		<meta property="og:description" content={$page.data.meta.description} />
		<meta name="twitter:description" content={$page.data.meta.description} />
	{/if}

	<!-- Arbitrary meta, link, script tags -->
	{#each $page.data.meta.additionalTags as tag}
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
	<div
		class="font-mono fixed right-4 top-4 z-50 max-h-[calc(100vh-2rem)] w-96 overflow-y-auto rounded-lg border-2 border-orange-300 bg-orange-50 text-sm shadow-xl"
	>
		<div
			class="sticky top-0 flex items-center justify-between border-b-2 border-orange-200 bg-orange-100 p-3"
		>
			<h2 class="font-bold text-orange-800">Meta Debug</h2>
			<button
				onclick={() => (debug = false)}
				class="rounded-md p-1 transition-colors hover:bg-orange-200"
				aria-label="Close debug panel"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
					<path
						fill="none"
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2.5"
						d="m7 7l10 10M7 17L17 7"
					/>
				</svg>
			</button>
		</div>

		<div class="divide-y divide-orange-200">
			{#each Object.entries($page.data.meta) as [key, value]}
				<div class="p-3 hover:bg-orange-100/50">
					<div class="mb-1 font-bold text-orange-900">{key}</div>
					<div class="whitespace-pre-wrap break-all text-orange-700">
						{formatValue(value)}
					</div>
				</div>
			{/each}
		</div>
	</div>
{/if}
