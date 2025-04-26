<script lang="ts">
	import { superForm } from 'sveltekit-superforms'
	import { zodClient } from 'sveltekit-superforms/adapters'
	import { passwordSchema } from './schema.ts'
	import { goto } from '$app/navigation'
	import { onDestroy } from 'svelte'

	import PasskeyIcon from '$ui/icons/passkey.svelte'
	import CheckmarkIcon from '$ui/icons/checkmark.svelte'
	import TextInput from '$ui/input/text-input.svelte'
	import { ToastInline } from '$ui/feedback'
	import { wipeVertical } from '$ui/motion/transitions'

	let submitSuccess: boolean | null = $state(null)

	let { data } = $props()

	const {
		form,
		errors,
		allErrors,
		constraints,
		message,
		enhance,
		validate,
		validateForm,
		delayed,
		timeout
	} = superForm(data.addPasswordForm, {
		resetForm: false,
		validators: zodClient(passwordSchema),
		validatorMethod: 'auto',
		delayMs: 300,
		timeoutMs: 1000,
		multipleSubmits: 'prevent'
	})

	let redirectTimeout
	let triggerToast

	$effect(() => {
		if ($message?.success) {
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
			Add a Password
		</h2>

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

	<form method="POST" class="w-full" action="?/addPassword" use:enhance autocomplete="new-password">
		<TextInput
			bind:value={$form.password}
			{...$constraints.password}
			autocomplete="new-password"
			name="password"
			id="password"
			placeholder="Enter new password"
			submits
			buttonDisabled={$allErrors.length > 0 || $form.password.length < 4}
			error={$errors.password}
			delayed={$delayed}
			timeout={$timeout}
		/>

		<input
			type="hidden"
			id="username"
			name="username"
			autocomplete="username"
			value={data.email}
			class="hidden"
		/>
	</form>

	<div class="py-5">
		<ToastInline
			bind:trigger={triggerToast}
			class="flex items-center gap-[0.2rem] rounded-full bg-green-100 p-[2px]"
		>
			<CheckmarkIcon size="20px" class="text-green-400" />
			<p class="pr-2 text-[0.9rem]/1 font-medium text-green-500">Password Saved</p>
		</ToastInline>
	</div>
</div>
