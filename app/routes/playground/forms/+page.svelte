<script lang="ts">
	import { superForm } from 'sveltekit-superforms'
	import { zodClient } from 'sveltekit-superforms/adapters'
	import { newUser as schema } from '$lib/schemas/new-user'

	let { data } = $props()
	let currentStep = 0

	const { form, errors, allErrors, constraints, message, enhance, validate, validateForm } =
		superForm(data.form, {
			validators: zodClient(schema),
			validationMethod: 'auto'
		})

	const inputStyle = 'bg-slate-100 px-2 py-1 rounded-md'
	
	async function handleNextStep() {
		// For step 1, only validate name and email
		if (currentStep === 0) {
			const valid = await validate(['name', 'email'])
			if (valid) {
				currentStep++
			}
		}
	}

	function handlePrevStep() {
		if (currentStep > 0) {
			currentStep--
		}
	}
</script>

<div class="flex flex-col">
	{#if $message}<h3>{$message}</h3>{/if}

	<form method="POST" use:enhance class="flex flex-col">
		<div class="steps mb-4">
			<div class="flex gap-2">
				<div class="step" class:active={currentStep === 0}>Step 1: Basic Info</div>
				<div class="step" class:active={currentStep === 1}>Step 2: Job Details</div>
			</div>
		</div>

		{#if currentStep === 0}
			<div class="step-content">
				<label for="name">Name</label>
				<input
					type="text"
					name="name"
					placeholder="Jonny Appleseed"
					aria-invalid={$errors.name ? 'true' : undefined}
					bind:value={$form.name}
					{...$constraints.name}
					class={inputStyle}
				/>
				{#if $errors.name}<span class="invalid">{$errors.name}</span>{/if}

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
			</div>
		{:else if currentStep === 1}
			<div class="step-content">
				<label for="jobTitle">Job Title</label>
				<input
					type="text"
					name="jobTitle"
					placeholder="Software Engineer"
					aria-invalid={$errors.jobTitle ? 'true' : undefined}
					bind:value={$form.jobTitle}
					{...$constraints.jobTitle}
					class={inputStyle}
				/>
				{#if $errors.jobTitle}<span class="invalid">{$errors.jobTitle}</span>{/if}
			</div>
		{/if}

		{#if $allErrors.length}
			<ul class="errors">
				{#each $allErrors as error}
					<li>
						<b>{error.path}:</b>
						{error.messages.join('. ')}
					</li>
				{/each}
			</ul>
		{/if}

		<div class="flex gap-2 mt-4">
			{#if currentStep > 0}
				<button
					type="button"
					on:click={handlePrevStep}
					class="flex-1 rounded-[1.1rem] bg-gray-600 px-2 py-3 text-gray-100">
					Previous
				</button>
			{/if}
			
			{#if currentStep === 0}
				<button
					type="button"
					on:click={handleNextStep}
					class="flex-1 rounded-[1.1rem] bg-blue-600 px-2 py-3 text-blue-100 disabled:cursor-not-allowed disabled:bg-blue-200 disabled:text-blue-400"
					disabled={!$form.name || !$form.email || $errors.name || $errors.email}>
					Next
				</button>
			{:else}
				<button
					type="submit"
					class="flex-1 rounded-[1.1rem] bg-blue-600 px-2 py-3 text-blue-100 disabled:cursor-not-allowed disabled:bg-blue-200 disabled:text-blue-400"
					disabled={$allErrors.length > 0}>
					Submit
				</button>
			{/if}
		</div>
	</form>
</div>

<style>
	.invalid {
		color: red;
	}

	.errors {
		margin: 1rem 0;
		padding: 1rem;
		background-color: rgb(254 226 226);
		border-radius: 0.5rem;
	}

	.steps {
		border-bottom: 2px solid #e5e7eb;
		padding-bottom: 1rem;
	}

	.step {
		padding: 0.5rem 1rem;
		border-radius: 0.5rem;
		background-color: #e5e7eb;
		color: #4b5563;
	}

	.step.active {
		background-color: #3b82f6;
		color: white;
	}

	.step-content {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	label {
		margin-top: 1rem;
	}
</style>
