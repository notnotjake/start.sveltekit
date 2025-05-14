<script lang="ts">
	import { onMount, onDestroy, tick } from 'svelte'
	import { createClass } from '$utils/create-class'
	import { wipeHorizontal } from '$ui/transition'
	import { fade } from 'svelte/transition'
	import ToastSwap from '$ui/feedback/toast-swap-adapting.svelte'
	import { DropdownMenu } from 'bits-ui'
	import { IconSettings, IconDots, IconLogout } from '@tabler/icons-svelte'
	import Button from '$ui/input/button.svelte'
	import { handleLogout } from '$bits/auth/logout'

	let { user } = $props()

	let timer = null

	onMount(() => {
		if (user) {
			tick()

			timer = setTimeout(() => {
				triggerAlert()
			}, 100)
		}
	})

	function triggerAlert() {
		triggerNotification(2500, 'initial')

		clearTimeout(timer)
		timer = null

		timer = setTimeout(() => {
			triggerNotification(3000, 'welcome')
		}, 2500)
	}

	onDestroy(() => {
		clearTimeout(timer)
		timer = null
	})

	let showingNotification = $state<boolean>(false)
	let showingMenu = $state<boolean>(false)
	let triggerNotification = $state(null)

	let menuOpen = $state(false)
	let isToastOpen = $state(false)

	let openToast = $state(null)
	let closeToast = $state(null)
	$effect(() => {
		if (menuOpen) {
			openToast('menu')
			clearTimeout(timer)
		}
	})
	$effect(() => {
		if (!menuOpen) {
			closeToast()
		}
	})
</script>

<DropdownMenu.Root bind:open={menuOpen}>
	<DropdownMenu.Trigger class="outline-none">
		<div
			class={createClass(
				'flex items-center justify-center gap-2 rounded-[3rem] transition-all duration-200',
				isToastOpen
					? 'bg-neutral-900 shadow-md'
					: 'cursor-pointer bg-neutral-100 hover:bg-neutral-200',
				menuOpen ? 'bg-neutral-700' : ''
			)}
		>
			<ToastSwap
				bind:isOpen={isToastOpen}
				bind:trigger={triggerNotification}
				bind:open={openToast}
				bind:close={closeToast}
				adapting={true}
			>
				{#snippet swapContent(data)}
					<div transition:wipeHorizontal={{ duraiton: 300 }}>
						{#if data === 'initial'}
							<div class="flex items-center justify-center gap-1 px-4 py-2" in:fade>
								<h3 class="text-[0.95rem] font-medium text-white">Logged In</h3>
								<p class="text-[0.93rem] text-neutral-300">{user.email}</p>
							</div>
						{:else if data === 'welcome'}
							<div class="flex items-center justify-center gap-1 px-4 py-2" in:fade>
								<h3 class="text-[0.95rem] font-medium text-white">Welcome back</h3>
								<p class="text-[0.93rem] text-neutral-300">{user.name}</p>
							</div>
						{:else if data === 'menu'}
							<div class="flex items-center justify-center gap-2 px-4 py-2" in:fade>
								<h3 class="text-[0.95rem] font-medium text-white">{user.name}</h3>
								<p class="text-[0.93rem] text-neutral-300">{user.email}</p>
							</div>
						{/if}
					</div>
				{/snippet}

				<div class="px-2"><IconDots color="var(--color-neutral-500)" /></div>
			</ToastSwap>
		</div></DropdownMenu.Trigger
	>

	<DropdownMenu.Content
		class="	w-50 rounded-xl bg-neutral-900 p-1.5 shadow-lg outline-none"
		sideOffset={8}
		collisionPadding={8}
	>
		<DropdownMenu.Item class="outline-none">
			<Button resetStyles href="/settings" class="w-full">
				<div
					class="flex cursor-pointer gap-2 rounded-md px-2 py-1.5 pr-3 text-white hover:bg-neutral-600/80"
				>
					<IconSettings color="var(--color-neutral-200)" />
					<p class="px-1.5 font-medium text-neutral-200">Settings</p>
				</div>
			</Button>
		</DropdownMenu.Item>
		<DropdownMenu.Separator class="bg-neutral-600" />
		<DropdownMenu.Item onSelect={handleLogout} class="outline-none">
			<div
				class="flex cursor-pointer gap-2 rounded-md px-2 py-1.5 pr-3 text-white hover:bg-neutral-600/80"
			>
				<IconLogout color="var(--color-neutral-200)" />
				<p class="px-1.5 font-medium text-neutral-200">Logout</p>
			</div>
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
