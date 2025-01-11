<script lang="ts">
	import { DebugLogger } from '$utils/debug'

	let { Fonts, debug = false } = $props()
</script>

<svelte:head>
	{@html Fonts.gen()}
</svelte:head>

{#if debug}
	<DebugLogger label="Fonts" data={{ generated: Fonts.gen() }} />
{/if}
