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

<div class="fixed top-0 right-0 h-[100dvh]">
	<div class="flex h-full w-fit items-center justify-center">
		{#if cardOpen !== false}
			<div class="min-h-80 min-w-60 rounded-3xl bg-neutral-800 px-3 py-2">
				<div class="flex items-center justify-between pl-1">
					<p class="text-[1.13rem] font-semibold text-neutral-50">Card Content</p>
					<IconArrowsDiagonal class="cursor-pointer text-neutral-50" />
				</div>
			</div>
		{/if}
		<div
			class="group flex min-h-40 min-w-18 items-center justify-end pr-0.5 pl-2 transition-all hover:pr-2"
		>
			<div
				class="flex flex-col items-center justify-center gap-3 rounded-full bg-neutral-100/0 p-1.5 ring-[0.5px] ring-neutral-200/0 transition-all group-hover:bg-neutral-100 group-hover:ring-neutral-200/80"
			>
				<div
					onclick={() => toggleCard('time')}
					class="cursor-pointer rounded-full bg-neutral-300/0 transition-all group-hover:p-1.5 hover:bg-neutral-300 hover:inset-shadow-sm"
				>
					<IconClock class="text-neutral-600 hover:text-neutral-800" size={21} />
				</div>
				<div
					onclick={() => toggleCard('message')}
					class="cursor-pointer rounded-full bg-neutral-300/0 transition-all group-hover:p-1.5 hover:bg-neutral-300 hover:inset-shadow-sm"
				>
					<IconMessage class="text-neutral-600 hover:text-neutral-800" size={21} />
				</div>
				<div
					onclick={() => toggleCard('products')}
					class="cursor-pointer rounded-full bg-neutral-300/0 transition-all group-hover:p-1.5 hover:bg-neutral-300 hover:inset-shadow-sm"
				>
					<IconPackage class="text-neutral-600 hover:text-neutral-800" size={21} />
				</div>
			</div>
		</div>
	</div>
</div>
