<script>
	import { onMount } from 'svelte'
	import { superForm } from 'sveltekit-superforms'
	import { zodClient } from 'sveltekit-superforms/adapters'
	import { startRegistration } from '@simplewebauthn/browser'

	let { data } = $props()

	const { form, errors, allErrors, message, enhance } = superForm(data.registerForm, {
		resetForm: false,
		async onResult({ result }) {
			if (result.type === 'success' && result.data.form.message?.success) {
				const optionsJSON = result.data.form.message.options
				console.log(optionsJSON)
				try {
					// Start the WebAuthn registration process
					const regResponse = await startRegistration({ optionsJSON })

					await fetch('/auth/passkeys/verify-registration', {
						method: 'POST',
						body: JSON.stringify(regResponse),
						headers: { 'Content-Type': 'application/json' }
					})

					alert('Passkey registered successfully!')
				} catch (error) {
					console.error('Registration failed:', error)
					alert('Failed to register passkey.')
				}
			}
		}
	})
</script>

<p>Passkey Testing</p>

<form method="POST" action="?/registerPasskey" use:enhance>
	<input type="email" bind:value={$form.email} name="email" id="email" placeholder="Email" />
	<input type="text" bind:value={$form.name} name="name" id="name" placeholder="Name" />
	<button>Register a Passkey</button>
</form>

{#if $message}
	<p>Should register now</p>
{/if}
