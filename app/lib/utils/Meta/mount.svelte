<script lang="ts">
	let { Meta, debug = false } = $props()
</script>

<svelte:head>
	{@html Meta.gen()}
</svelte:head>

{#if debug}
	<div
		class="font-mono m-2 overflow-auto rounded-lg border border-orange-300 bg-orange-100 p-4 text-gray-800 shadow-inner"
	>
		<p class="mb-2 text-lg font-semibold text-orange-700">Debugger: Meta Output</p>
		<pre class="font-mono max-w-lg text-sm text-gray-700">{Meta.gen()}</pre>
	</div>
{/if}
