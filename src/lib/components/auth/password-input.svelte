<script lang="ts">
	import { SuspenseSpinner } from '$ui/feedback/'
	import Arrow from '$lib/theme/icons/arrow-circle-fill.svelte'
	import { createClass } from '$utils/create-class'
	import { superForm } from 'sveltekit-superforms'
	import { zodClient } from 'sveltekit-superforms/adapters'
	import { z } from 'zod'

	const schema = z.object({
		password: z.string().min(3, 'Too Short').max(64, 'Too Long')
	})

	let { formData: passwordLoginForm, email } = $props()

	const {
		form,
		errors,
		allErrors,
		message,
		constraints,
		validate,
		validateForm,
		enhance,
		delayed,
		timeout
	} = superForm(passwordLoginForm, {
		id: 'passwordLoginForm',
		resetForm: false,
		onSubmit({ formData }) {
			// Ensure email is set in form data
			formData.set('email', email)
		},
		validators: zodClient(schema),
		delayMs: 800,
		timeoutMs: 9000
	})

	let isInput = $state(false)
	function toggleInput() {
		isInput = true
	}
	let buttonWidth = $state(0)
</script>

<div class="relative flex w-full w-full shrink-1 grow basis-1 cursor-pointer flex-col items-center">
	<form
		method="POST"
		action="?/passwordLogin"
		use:enhance
		class="relative flex w-full w-full shrink-1 grow basis-1 cursor-pointer flex-col items-center"
	>
		<div
			class={createClass(
				'group focus-within:shadow-input-pop relative flex h-11 h-[2.8rem] w-full items-center overflow-hidden rounded-[0.9rem]',
				isInput ? 'bg-neutral-50 ring-1 ring-neutral-200' : 'bg-neutral-150 cursor-pointer'
			)}
		>
			<input
				type="password"
				{...$constraints.password}
				name="password"
				autocomplete="current-password"
				id="current-password"
				placeholder="Password"
				aria-label="Enter account password"
				bind:value={$form.password}
				class={createClass(
					'h-full w-full flex-grow-1 pl-4 font-[450] text-zinc-900 transition-all outline-none selection:bg-sky-200 selection:text-blue-600 placeholder:font-normal placeholder:text-neutral-500',
					$errors.password && 'text-rose-500'
				)}
				onclick={toggleInput}
				onfocus={toggleInput}
			/>
			<button
				type="submit"
				disabled={$allErrors.length > 0 || $form.password.length < 3}
				class="group flex h-full shrink-0 flex-nowrap items-center justify-end px-1 transition-all duration-200"
				bind:offsetWidth={buttonWidth}
				style:margin-right={$message ? `-${buttonWidth}px` : '0px'}
				class:cursor-[w-resize]={$allErrors.length > 0}
				class:cursor-pointer={!$allErrors.length > 0}
			>
				{#if $errors.password}
					<p
						class="animate-fade-in-scale-right cursor-[w-resize] rounded-full bg-rose-100 px-3 py-1 text-[0.83rem] font-medium text-rose-600"
					>
						{$errors.password}
					</p>
				{:else if $delayed && !$timeout}
					<div class="flex h-full items-center px-3">
						<SuspenseSpinner size={18} thickness={7} />
					</div>
				{:else}
					<Arrow
						class="bi bi-arrow-right-circle-fill mr-1 h-6 w-6 cursor-pointer p-[0.1rem] text-[#0E8CFF] transition-colors duration-300 ease-in-out group-disabled:text-neutral-500/80"
					/>
				{/if}
			</button>
		</div>
	</form>

	{#if !isInput}
		<button
			type="button"
			onclick={(isInput = true)}
			class={createClass(
				'bg-neutral-150 pointer-events-none absolute top-0 left-0 m-auto flex h-11 w-full max-w-full cursor-pointer items-center justify-center rounded-[0.9rem] border-none px-4 text-zinc-900 outline-none',
				isInput ? 'hidden' : 'absolute cursor-pointer'
			)}>Continue with Password</button
		>
	{/if}
</div>

<p>{$errors.password}</p>
<p>{$errors.email}</p>
<p>{$allErrors}</p>
<p>{$message}</p>
