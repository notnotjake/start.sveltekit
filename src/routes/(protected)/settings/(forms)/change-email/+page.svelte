<script lang="ts">
	import { superForm } from 'sveltekit-superforms'
	import { zodClient } from 'sveltekit-superforms/adapters'
	import { changeEmailSchema, confirmEmailCodeSchema } from './schema.ts'
	import { goto } from '$app/navigation'
	import { onDestroy, onMount } from 'svelte'

	import PasskeyIcon from '$ui/icons/passkey.svelte'
	import CheckmarkIcon from '$ui/icons/checkmark.svelte'
	import TextInput from '$ui/input/text-input.svelte'
	import { ToastInline } from '$ui/feedback'
	import { wipeVertical } from '$ui/motion/transitions'
	import CodeInput from '$ui/auth/code-input.svelte'

	let submitSuccess: boolean | null = $state(null)
	let showCodeForm = $state(false)

	let { data } = $props()

	// First form for entering new email
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
	} = superForm(data.changeEmailForm, {
		id: 'changeEmailForm',
		resetForm: false,
		validators: zodClient(changeEmailSchema),
		validationMethod: 'auto',
		delayMs: 300,
		timeoutMs: 1000,
		multipleSubmits: 'prevent',
		onResult({ result }) {
			console.log(result)
			if (result.type === 'success' && result.data.form.message.success) {
				showCodeForm = true
			}
		}
	})

	// Second form for confirming with code
	const {
		form: codeForm,
		errors: codeErrors,
		allErrors: codeAllErrors,
		constraints: codeConstraints,
		message: codeMessage,
		enhance: codeEnhance,
		validate: codeValidate,
		validateForm: codeValidateForm,
		delayed: codeDelayed,
		timeout: codeTimeout
	} = superForm(data.confirmCodeForm, {
		id: 'confirmCodeForm',
		resetForm: false,
		validators: zodClient(confirmEmailCodeSchema),
		validationMethod: 'auto',
		delayMs: 300,
		timeoutMs: 1000,
		multipleSubmits: 'prevent',
		onResult({ result }) {
			if (result.type === 'success') {
				submitSuccess = true
				triggerToast()
				redirectTimeout = setTimeout(() => {
					goto('/settings')
				}, 2500)
			} else {
				submitSuccess = false
			}
		}
	})

	// Set user's timezone on component mount
	onMount(() => {
		$form.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
	})

	let redirectTimeout
	let triggerToast

	// Handle code input changes
	function handleCodeInput(event: CustomEvent<string>) {
		const code = event.detail
		$codeForm.code = code

		if (code.length === 6) {
			codeValidateForm()
		}
	}

	// Submit code form when code is complete
	function submitCodeForm() {
		if ($codeForm.code.length === 6) {
			const formElement = document.getElementById('code-form')
			if (formElement) {
				formElement.requestSubmit()
			}
		}
	}

	onDestroy(() => {
		if (redirectTimeout) {
			clearTimeout(redirectTimeout)
		}
	})
</script>

<div class="mx-auto mt-30 flex max-w-90 flex-col items-center justify-center">
	<div class="w-full flex-col items-center justify-center px-7 py-5 text-center">
		<h2 class="tracking-tight-md animate-fade-in-scale text-[1.33rem] leading-loose font-[550]">
			Change Account Email
		</h2>

		{#if submitSuccess === true}
			<div transition:wipeVertical class="flex items-center justify-center gap-1">
				<CheckmarkIcon class="text-green-500" size="19px" />
				<p class="text-[1.05rem] leading-5 font-[430] tracking-[-0.015em] text-neutral-500">
					Your email has been updated
				</p>
			</div>
		{:else if submitSuccess === false}
			<div transition:wipeVertical class="flex items-center justify-center gap-1">
				<p class="text-[1.05rem] leading-5 font-[430] tracking-[-0.015em] text-rose-500">
					Something went wrong, please try again
				</p>
			</div>
		{:else if showCodeForm}
			<div transition:wipeVertical class="flex items-center justify-center gap-1">
				<p class="text-[1.05rem] leading-5 font-[430] tracking-[-0.015em] text-neutral-500">
					Enter the verification code sent to {$form.newEmail}
				</p>
			</div>
		{/if}
	</div>

	{#if !showCodeForm}
		<!-- First form: Enter new email address -->
		<form
			method="POST"
			class="w-full"
			action="?/changeEmail"
			use:enhance
			autocomplete="update-email"
		>
			<TextInput
				bind:value={$form.newEmail}
				{...$constraints.newEmail}
				autocomplete="username"
				name="newEmail"
				id="newEmail"
				placeholder="Enter new email address"
				submits
				buttonDisabled={$allErrors.length > 0 || $form.newEmail.length < 4}
				error={$errors.newEmail}
				delayed={$delayed}
				timeout={$timeout}
			/>

			<!-- Hidden input to capture user's timezone -->
			<input type="hidden" aria-hidden name="timezone" bind:value={$form.timezone} />

			<!-- Hidden input for password managers -->
			<input
				type="hidden"
				id="current-email"
				name="current-email"
				autocomplete="username"
				class="hidden"
				value={data.currentEmail}
			/>
		</form>
	{:else}
		<!-- Second form: Enter verification code -->
		<form
			method="POST"
			class="w-full"
			action="?/confirmNewEmail"
			use:codeEnhance
			autocomplete="one-time-code"
		>
			<div class="shadow-card w-full rounded-xl bg-neutral-50 px-4 py-5 ring-1 ring-neutral-200">
				<div class="flex flex-col items-center justify-center">
					<TextInput
						bind:value={$codeForm.code}
						{...$codeConstraints.code}
						autocomplete="one-time-code"
						name="code"
						id="code"
						placeholder="Enter one time code"
						submits
						buttonDisabled={$codeAllErrors.length > 0 || $codeForm.code.length < 6}
						error={$codeErrors.code}
						delayed={$codeDelayed}
						timeout={$codeTimeout}
					/>

					<!-- Option to go back and change email -->
					<button
						type="button"
						class="mt-2 text-sm text-neutral-500 hover:text-blue-500"
						on:click={() => (showCodeForm = false)}
					>
						Change email address
					</button>
				</div>
			</div>
		</form>
	{/if}

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
