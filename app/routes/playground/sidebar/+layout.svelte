<script lang="ts">
	import SidebarProvider from '$ui/containers/sidebar-provider.svelte'
	import SidebarButton from '$ui/containers/sidebar-button.svelte'

	let { children } = $props()
</script>

<SidebarProvider defaultWidth={300} class="bg-neutral-900">
	{#snippet sidebarContent()}
		<SidebarButton>
			{#snippet whenOpen()}
				Close
			{/snippet}
			{#snippet whenClosed()}
				Open
			{/snippet}
		</SidebarButton>
		<p class="text-neutral-100">This is in the sidebar</p>
	{/snippet}

	<div class="h-full w-full bg-neutral-800 p-3">{@render children()}</div>
</SidebarProvider>
