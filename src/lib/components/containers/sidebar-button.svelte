<script lang="ts">
	import { getContext } from 'svelte'

	let { children, whenOpen, whenClosed } = $props()

	let sidebar = getContext('sidebar')

	function toggle() {
		sidebar.isShown = !sidebar.isShown
	}
</script>

<button onclick={toggle} class="text-lg font-semibold text-neutral-300">
	{#if whenOpen}
		{#if sidebar.isShown}
			{@render whenOpen()}
		{/if}
	{/if}

	{#if whenClosed}
		{#if !sidebar.isShown}
			{@render whenClosed()}
		{/if}
	{/if}

	{#if children}
		{@render children()}
	{/if}
</button>
