<script lang="ts">
	import { superForm } from 'sveltekit-superforms'
	import { zodClient } from 'sveltekit-superforms/adapters'
	import { passwordSchema } from './schema.ts'
	import { goto } from '$app/navigation'
	import { onDestroy, onMount } from 'svelte'

	import { inputSelectAll } from '$lib/attachments/input-select-all'

	import PasskeyIcon from '$ui/icon/passkey.svelte'
	import CheckmarkIcon from '$ui/icon/checkmark.svelte'
	import TextInput from '$ui/input/text-input.svelte'
	import { ToastInline } from '$ui/feedback'
	import { wipeVertical } from '$ui/transition'
	import RegisterPasskey from '$bits/auth/passkey-register.svelte'
	import Button from '$ui/input/button.svelte'
	import { getBrowserNameForPasskey } from '$lib/utils/browser-detection'

	let { data } = $props()

	let passkeyName = $state<string>('')

	let submitSuccess = $state<null | 'success' | 'error' | 'suspense'>(null)

	let redirectTimeout
	let triggerToast

	onMount(() => {
		// Set default passkey name to detected browser
		passkeyName = getBrowserNameForPasskey()
	})

	$effect(() => {
		if (submitSuccess === 'success') {
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

<div class="mx-auto mt-30 flex max-w-90 flex-col items-center justify-center">
	<div class=" w-full flex-col items-center justify-center px-7 py-5 text-center">
		<h2 class="tracking-tight-md animate-fade-in-scale text-[1.33rem] leading-loose font-[550]">
			Add a Passkey
		</h2>

		{#if submitSuccess === 'success'}
			<div transition:wipeVertical class="flex items-center justify-center gap-1">
				<CheckmarkIcon class="text-green-500" size="19px" />
				<p class=" text-[1.05rem] leading-5 font-[430] tracking-[-0.015em] text-neutral-500">
					Passkey added successfully
				</p>
			</div>
		{:else if submitSuccess === 'error'}
			<div trantision:wipeVertical class="flex items-center justify-center gap-1">
				<p class=" text-[1.05rem] leading-5 font-[430] tracking-[-0.015em] text-rose-500">
					Something went wrong, please try again
				</p>
			</div>
		{/if}
	</div>

	<div class="flex w-full flex-col gap-4">
		<TextInput
			bind:value={passkeyName}
			name="passkey-name"
			id="passkey-name"
			placeholder="Passkey Name"
			withButton={false}
			disabled={submitSuccess !== null}
			{@attach inputSelectAll}
		/>

		<Button style="primary" size="md" class="text-md h-12 bg-neutral-800" rounded="lg">
			<RegisterPasskey name={passkeyName} bind:submitSuccess />
		</Button>
	</div>

	<div class="py-5">
		<ToastInline
			bind:trigger={triggerToast}
			class="flex items-center gap-[0.2rem] rounded-full bg-green-100 p-[2px]"
		>
			<CheckmarkIcon size="20px" class="text-green-400" />
			<p class="pr-2 text-[0.9rem]/1 font-medium text-green-500">Passkey Saved</p>
		</ToastInline>
	</div>
</div>
