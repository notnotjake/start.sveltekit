<script lang="ts">
	import { createClass } from '$utils/create-class'
	import ToastSwap from '$ui/feedback/toast-swap-adapting.svelte'
	import { wipeHorizontal } from '$ui/motion/transitions'
	import { fade } from 'svelte/transition'

	let showingNotification = $state<boolean>(false)
	let showingMenu = $state<boolean>(false)
	let triggerNotification = $state(null)

	function openMenu() {
		showingMenu = true
		triggerNotification(9000, 'button')
	}

	$effect(() => {
		if (!showingNotification) {
			showingMenu = false
		}
	})

	function sendNotification() {
		triggerNotification(2500, 'initial')

		setTimeout(() => {
			triggerNotification(3000, 'welcome')
		}, 2500)
	}
</script>

<div
	class={createClass(
		'flex items-center justify-center gap-2 rounded-[3rem] transition-all duration-200',
		showingNotification
			? 'bg-neutral-900 shadow-md'
			: 'cursor-pointer bg-neutral-100 hover:bg-neutral-200',
		showingMenu ? 'rounded-[1.3rem]' : 'rounded-[3rem]'
	)}
>
	<ToastSwap bind:trigger={triggerNotification} bind:isSwapActive={showingNotification}>
		{#snippet swapContent(data)}
			<div transition:wipeHorizontal={{ duraiton: 300 }}>
				{#if data === 'button'}
					<div class="flex flex-col items-center justify-start gap-1 px-4 py-2" in:fade>
						<h3 class="text-[0.95rem] font-medium text-white">Settings</h3>
						<h3 class="text-[0.95rem] font-medium text-white">Billing</h3>
						<p class="text-[0.93rem] text-neutral-300">Log Out</p>
					</div>
				{:else if data === 'initial'}
					<div class="flex items-center justify-center gap-1 px-4 py-2" in:fade>
						<h3 class="text-[0.95rem] font-medium text-white">Logged In</h3>
						<p class="text-[0.93rem] text-neutral-300">jake@notnotjake.com</p>
					</div>
				{:else if data === 'welcome'}
					<div class="flex items-center justify-center gap-2 px-4 py-2" in:fade>
						<h3 class="text-[0.95rem] font-medium text-white">Welcome back</h3>
						<p class="text-[0.93rem] text-neutral-300">Curious Panda</p>
					</div>
				{/if}
			</div>
		{/snippet}

		<p class="px-4 py-2">Account</p>
	</ToastSwap>
</div>

<button onclick={sendNotification}>Send Notification</button>
<button onclick={openMenu}>Open Menu</button>
