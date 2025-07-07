<script lang="ts">
	import { superForm } from 'sveltekit-superforms'
	import { zodClient } from 'sveltekit-superforms/adapters'

	import { createClass } from '$utils/styles'

	import { startRegistration } from '@simplewebauthn/browser'

	let {
		name = null,
		submitSuccess = $bindable(null)
	}: {
		name?: string
		submitSuccess: null | 'success' | 'error' | 'suspense'
	} = $props()

	let errorMessage = $state<string>('')

	async function passkeyOptionsRequest() {
		submitSuccess = 'suspense'
		errorMessage = ''

		try {
			const response = await fetch('/auth/passkey-register/options', {
				method: 'POST'
			})

			if (!response.ok) {
				throw new Error(`Options request failed: ${response.status} ${response.statusText}`)
			}

			const result = await response.json()

			if (result?.success) {
				const optionsJSON = result?.data?.options
				passkeyRegister(optionsJSON)
			} else {
				throw new Error('Failed to get registration options')
			}
		} catch (e) {
			submitSuccess = 'error'
			errorMessage = e instanceof Error ? e.message : 'Failed to get registration options'
			console.error('Registration Error:', e)
		}
	}

	async function passkeyRegister(optionsJSON) {
		try {
			const registerResponse = await startRegistration({ optionsJSON })
			passkeyRegistrationVerify(registerResponse)
		} catch (e) {
			submitSuccess = 'error'
			errorMessage = e instanceof Error ? e.message : 'Failed to register passkey'
			console.error('Registration Error:', e)
		}
	}

	async function passkeyRegistrationVerify(registrationResponse) {
		try {
			const response = await fetch('/auth/passkey-register/verify', {
				method: 'POST',
				body: JSON.stringify({ registrationResponse: registrationResponse, name: name }),
				headers: { 'Content-Type': 'application/json' }
			})

			if (!response.ok) {
				const errorText = await response.text()
				throw new Error(`Verification failed: ${response.status} ${response.statusText} - ${errorText}`)
			}

			const result = await response.json()

			if (result?.success) {
				submitSuccess = 'success'
			} else {
				throw new Error(result?.message || 'Verification failed')
			}
		} catch (e) {
			submitSuccess = 'error'
			errorMessage = e instanceof Error ? e.message : 'Failed to verify registration'
			console.error('Registration Error:', e)
		}
	}
</script>

<div class="block">
	<button onclick={passkeyOptionsRequest}>Register Passkey</button>
	
	{#if errorMessage}
		<div class="error-message" style="color: red; margin-top: 10px;">
			{errorMessage}
		</div>
	{/if}
</div>
