<script lang="ts">
	import SidebarButton from '$ui/containers/sidebar-button.svelte'
</script>

<SidebarButton>
	{#snippet whenClosed()}
		Open
	{/snippet}
</SidebarButton>

<div class="text-neutral-100"><p>Main Content!</p></div>
