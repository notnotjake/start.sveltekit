<script lang="ts">
	import { superForm } from 'sveltekit-superforms'
	import { zodClient } from 'sveltekit-superforms/adapters'
	import { emailSchema, passwordSchema } from './schema'

	let { data } = $props()

	let authState = $state('email')

	const {
		form: emailForm,
		errors: emailErrors,
		allErrors: emailAllErrors,
		constraints: emailConstraints,
		message: emailMessage,
		enhance: emailEnhance,
		validate: emailValidate,
		validateForm: emailValidateForm
	} = superForm(data.emailForm, {
		resetForm: false,
		validators: zodClient(emailSchema),
		validationMethod: 'auto',
		onResult({ result }) {
			if (result.type === 'success' && result.data.form.message) {
				const { nextStep, text } = result.data.form.message
				authState = nextStep
				emailMessage.set(text)
			}
		}
	})

	const {
		form: passwordForm,
		errors: passwordErrors,
		allErrors: passwordAllErrors,
		constraints: passwordConstraints,
		message: passwordMessage,
		enhance: passwordEnhance,
		validate: passwordValidate,
		validateForm: passwordValidateForm
	} = superForm(data.passwordForm, {
		resetForm: false,
		validators: zodClient(passwordSchema),
		validationMethod: 'auto'
	})

	const inputStyle = 'bg-slate-100 px-2 py-1 rounded-md'
</script>

<div class="flex flex-col">
	<!-- Email Form -->
	<form method="POST" action="?/checkEmail" use:emailEnhance>
		<label for="email">Email</label>
		<input
			type="email"
			name="email"
			placeholder="steve@apple.com"
			aria-invalid={$emailErrors.email ? 'true' : undefined}
			bind:value={$emailForm.email}
			{...$emailConstraints.email}
			class={inputStyle}
		/>
		{#if $emailErrors.email}<span class="invalid">{$emailErrors.email}</span>{/if}

		<div>
			<button
				class="mt-4 mb-3 w-full rounded-[1.1rem] bg-blue-600 px-2 py-3 text-blue-100 disabled:cursor-not-allowed disabled:bg-blue-200 disabled:text-blue-400"
				disabled={$emailAllErrors.length > 0 || $emailForm.email.length < 1}>Submit</button
			>
		</div>
	</form>

	{#if $emailMessage?.text}<h3>{$emailMessage.text}</h3>{/if}

	{#if authState === 'newUser'}
		<p>New User</p>
	{:else if authState === 'returningUser'}
		<p>Login User</p>
		<!-- Password Form -->
		{#if $passwordMessage}<h3>{$passwordMessage}</h3>{/if}
		<form method="POST" action="?/checkPassword" use:passwordEnhance>
			<label for="password">Password</label>
			<input
				type="password"
				name="password"
				placeholder="password"
				aria-invalid={$passwordForm.password ? 'true' : undefined}
				bind:value={$passwordForm.password}
				{...$passwordConstraints.password}
				class={inputStyle}
			/>
			{#if $passwordErrors.password}<span class="invalid">{$passwordErrors.password}</span>{/if}

			<div>
				<button
					class="mt-4 mb-3 w-full rounded-[1.1rem] bg-blue-600 px-2 py-3 text-blue-100 disabled:cursor-not-allowed disabled:bg-blue-200 disabled:text-blue-400"
					disabled={$passwordForm.password.length < 1}>Submit</button
				>
			</div>
		</form>
	{:else}{/if}
</div>

<style>
	.invalid {
		color: red;
	}
</style>
