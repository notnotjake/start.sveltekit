<script lang="ts">
	import { superForm } from 'sveltekit-superforms'
	import { zodClient } from 'sveltekit-superforms/adapters'
	import { z } from 'zod'
	import { registration as schema } from './schema'

	let { data } = $props()

	const {
		form,
		errors,
		allErrors,
		constraints,
		message,
		enhance,
		reset,
		validate,
		validateForm,
		delayed,
		timeout
	} = superForm(data.form, {
		invalidateAll: true,
		resetForm: true,
		validators: zodClient(schema),
		validationMethod: 'auto',
		delayMs: 200,
		timeoutMs: 3000
	})
</script>

<h1>{data.requestId}</h1>

<form method="POST" use:enhance>
	<label for="email">Email</label>
	<input
		type="email"
		name="email"
		id="email"
		bind:value={$form.email}
		autocomplete="email"
		placeholder="jonny@me.com"
	/>
	{#if $errors.email}<span class="invalid">{$errors.email}</span>{/if}

	<label for="name">Name</label>
	<input
		type="text"
		name="name"
		id="name"
		bind:value={$form.name}
		autocomplete="name"
		placeholder="Jonny Ive"
	/>
	{#if $errors.name}<span class="invalid">{$errors.name}</span>{/if}

	<button>Submit</button>
</form>

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
