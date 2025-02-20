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

<h1>Session ID: {data.sessionId}</h1>
<h1>Identifier: {data.identifier}</h1>

<form method="POST" use:enhance>
	<label for="token">Token</label>
	<input type="text" name="token" id="token" bind:value={$form.token} placeholder="abc123" />
	{#if $errors.token}<span class="invalid">{$errors.token}</span>{/if}

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
