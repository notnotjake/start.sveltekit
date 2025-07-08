<script lang="ts">
	import SidebarButton from '$ui/container/sidebar-button.svelte'
	import LogoutButton from '$bits/auth/logout.svelte'
	import { IconClock, IconMessage, IconPackage, IconArrowsDiagonal } from '@tabler/icons-svelte'

	let { data } = $props()

	let cardOpen = $state<false | 'time' | 'message' | 'products'>(false)

	function toggleCard(name) {
		if (name === cardOpen) {
			cardOpen = false
		} else {
			cardOpen = name
		}
	}
</script>

<div class="flex min-h-full w-full items-center justify-center">
	<div>
		<div class="flex min-h-full w-full flex-col items-center justify-center">
			<div class="mb-9 flex flex-col items-center">
				<h2 class="text-2xl font-semibold">
					Welcome back <span class="text-neutral-500">{data.userName}</span>
				</h2>
				<p class="text-lg font-medium text-neutral-500">{data.userEmail}</p>
			</div>

			<div class="flex min-w-32 flex-col justify-center gap-2">
				<a
					class="text-neutal-500 rounded-full bg-neutral-200 px-4 py-2 text-center font-medium"
					href="/settings">Settings</a
				>
				<LogoutButton class="rounded-full bg-neutral-800 px-4 py-2 font-medium text-neutral-100" />
			</div>
		</div>
	</div>
</div>
