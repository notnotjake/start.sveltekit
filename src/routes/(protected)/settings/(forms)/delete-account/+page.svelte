<script lang="ts">
	import { goto } from '$app/navigation'
	import { onDestroy } from 'svelte'

	import PasskeyIcon from '$ui/icons/passkey.svelte'
	import CheckmarkIcon from '$ui/icons/checkmark.svelte'
	import TextInput from '$ui/input/text-input.svelte'
	import { ToastInline } from '$ui/feedback'
	import { wipeVertical } from '$ui/motion/transitions'
	import Button from '$ui/input/button.svelte'
	import Checkbox from '$ui/input/checkbox.svelte'

	let submitSuccess: boolean | null = $state(null)

	let { data } = $props()

	let redirectTimeout
	let triggerToast

	$effect(() => {
		if (submitSuccess) {
			// password has been added successfully
			triggerToast()
			redirectTimeout = setTimeout(() => {
				goto('/settings')
			}, 2500)
		}
	})
	onDestroy(() => {
		if (redirectTimeout) {
			clearTimeout(redirectTimeout)
		}
	})
</script>

<div class="mx-auto mt-30 flex max-w-130 flex-col items-center justify-center">
	<div class=" w-full flex-col items-center justify-center px-7 py-5 text-center">
		<h2 class="tracking-tight-md animate-fade-in-scale text-[1.33rem] leading-loose font-[550]">
			Delete Account
		</h2>

		<div class="flex w-full flex-col gap-6 px-4 pt-12 pb-6">
			<div class="flex w-full gap-3">
				<div class="shrink-0 pt-1"><Checkbox /></div>
				<div class="text-left">
					<h3 class="font-medium text-neutral-900">Your Data Will Be Deleted</h3>
					<p class="text-neutral-700">
						To download your data, please contact us <span class="font-semibold italic">before</span
						> deleting your account. After deletion, we will not be able to recover any of your data.
					</p>
				</div>
			</div>

			<div class="flex w-full gap-3">
				<div class="shrink-0 pt-1"><Checkbox /></div>
				<div class="text-left">
					<h3 class="font-medium text-neutral-900">Your Subscription Will Be Cancelled</h3>
					<p class="text-neutral-700">
						Your subscription wont renew. You will lose access to your current subscription and
						won't receive a refund.
					</p>
				</div>
			</div>
		</div>

		<div class="my-6 w-full rounded-2xl bg-rose-100/50 px-5 py-3 text-left">
			<h3 class="font-medium text-red-600">Important</h3>
			<p class="text-red-600">Deleting your account is permanent and you will lose all your data</p>
		</div>

		<Button style="primary" class="min-h-11 w-full" rounded="md" role="destructive">Continue</Button
		>

		{#if submitSuccess === true}
			<div transition:wipeVertical class="flex items-center justify-center gap-1">
				<CheckmarkIcon class="text-green-500" size="19px" />
				<p class=" text-[1.05rem] leading-5 font-[430] tracking-[-0.015em] text-neutral-500">
					New password successfully added
				</p>
			</div>
		{:else if submitSuccess === false}
			<div trantision:wipeVertical class="flex items-center justify-center gap-1">
				<p class=" text-[1.05rem] leading-5 font-[430] tracking-[-0.015em] text-rose-500">
					Something went wrong, please try again
				</p>
			</div>
		{/if}
	</div>

	<div class="py-5">
		<ToastInline
			bind:trigger={triggerToast}
			class="flex items-center gap-[0.2rem] rounded-full bg-green-100 p-[2px]"
		>
			<CheckmarkIcon size="20px" class="text-green-400" />
			<p class="pr-2 text-[0.9rem]/1 font-medium text-green-500">Email Updated</p>
		</ToastInline>
	</div>
</div>
