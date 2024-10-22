<script lang="ts">
	let { Fonts, debug = false } = $props()
</script>

<svelte:head>
	<link rel="preconnect" href="https://rsms.me/" />
	<link rel="stylesheet" href="https://rsms.me/inter/inter.css" />

	{@html Fonts.gen()}
</svelte:head>

{#if debug}
	<div
		class="font-mono m-2 overflow-auto rounded-lg border border-orange-300 bg-orange-100 p-4 text-gray-800 shadow-inner"
	>
		<p class="mb-2 text-lg font-semibold text-orange-700">Debugger: Font Output</p>
		<pre class="font-mono max-w-lg text-sm text-gray-700">{Fonts.gen()}</pre>
	</div>
{/if}
