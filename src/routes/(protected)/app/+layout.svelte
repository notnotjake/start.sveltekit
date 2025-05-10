<script lang="ts">
	import SidebarProvider from '$ui/containers/sidebar-provider.svelte'
	import SidebarButton from '$ui/containers/sidebar-button.svelte'

	import AccountButton from '$ui/auth/account.svelte'

	let { children, data } = $props()
</script>

<SidebarProvider defaultWidth={300} class="relative bg-neutral-100">
	{#snippet sidebarContent()}
		<div class="w-full pt-10"><p class="text-neutral-800">This is in the sidebar</p></div>
	{/snippet}

	<div class="h-full w-full bg-white p-3 pt-10">{@render children()}</div>

	<div
		class="fixed inset-0 z-50 flex flex h-10 w-full items-center items-center justify-center px-5 pt-7 pb-5"
	>
		<div class="shrink grow-0">
			<SidebarButton useButton={true} />
		</div>

		<div class="flex grow items-center justify-center">
			<AccountButton user={data?.user} />
		</div>
	</div>
</SidebarProvider>
