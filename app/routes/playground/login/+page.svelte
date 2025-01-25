<script lang="ts">
	import { superForm } from 'sveltekit-superforms'
	import { zodClient } from 'sveltekit-superforms/adapters'
	import { z } from 'zod'
	import Spinner from '$ui/feedback/suspense-spinner.svelte'
	import TextShimmer from '$ui/feedback/suspense-text-shimmer.svelte'

	const email = z.object({
		email: z.string().email('Email not accepted')
	})

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
	} = superForm(data.form, {
		validators: zodClient(email),
		validationMethod: 'auto',
		delayMs: 200,
		timeoutMs: 3000
	})

	const inputStyle = 'bg-slate-100 px-2 py-1 rounded-md'
</script>

<div class="flex flex-col">
	{#if $message}<h3>{$message}</h3>{/if}

	<form method="POST" use:enhance class="flex flex-col">
		<label for="email">E-mail</label>
		<input
			type="email"
			name="email"
			placeholder="jonny@apple.com"
			aria-invalid={$errors.email ? 'true' : undefined}
			bind:value={$form.email}
			{...$constraints.email}
			class={inputStyle}
		/>
		{#if $errors.email}<span class="invalid">{$errors.email}</span>{/if}

		{#if $allErrors.length}
			<ul>
				{#each $allErrors as error}
					<li>
						<b>{error.path}:</b>
						{error.messages.join('. ')}
					</li>
				{/each}
			</ul>
		{/if}

		<div>
			<button
				class="mb-3 mt-4 w-full rounded-[1.1rem] bg-blue-600 px-2 py-3 text-blue-100 disabled:cursor-not-allowed disabled:bg-blue-200 disabled:text-blue-400"
				disabled={$allErrors.length > 0 || $form.email.length < 1}>Submit</button
			>
		</div>

		{#if $timeout}
			<TextShimmer>Still Working</TextShimmer>
		{:else if $delayed}
			<Spinner />
		{/if}
	</form>
</div>

<style>
	.invalid {
		color: red;
	}
</style>
