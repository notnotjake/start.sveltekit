<script lang="ts">
	import { createClass } from '$utils/create-class'
	import ToastSwap from '$ui/feedback/toast-swap-adapting.svelte'
	import { wipeHorizontal } from '$ui/motion/transitions'

	let showingNotification = $state(false)
	let triggerNotification = $state(null)

	function openMenu() {
		triggerNotification(9000, 'button')
	}

	function sendNotification() {
		triggerNotification()
	}
</script>

<div
	class={createClass(
		'flex items-center justify-center gap-2 rounded-[3rem] px-4 py-2 transition-all duration-200',
		showingNotification
			? 'bg-neutral-900 shadow-md'
			: 'cursor-pointer bg-neutral-100 hover:bg-neutral-200'
	)}
>
	<ToastSwap bind:trigger={triggerNotification} bind:isSwapActive={showingNotification}>
		{#snippet swapContent(data)}
			<div transition:wipeHorizontal={{ duraiton: 300 }}>
				{#if data === 'button'}
					<div class="flex flex-col items-center justify-start gap-2">
						<h3 class="text-[0.95rem] font-medium text-white">Settings</h3>
						<h3 class="text-[0.95rem] font-medium text-white">Billing</h3>
						<p class="text-[0.93rem] text-neutral-300">Log Out</p>
					</div>
				{:else}
					<div class="flex items-center justify-center gap-2">
						<h3 class="text-[0.95rem] font-medium text-white">Logged In</h3>
						<p class="text-[0.93rem] text-neutral-300">jake@notnotjake.com</p>
					</div>
				{/if}
			</div>
		{/snippet}

		<p>Account</p>
	</ToastSwap>
</div>

<button onclick={sendNotification}>Send Notification</button>
<button onclick={openMenu}>Open Menu</button>
