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

	async function passkeyOptionsRequest() {
		submitSuccess = 'suspense'

		try {
			const response = await fetch('/auth/passkey-register/options', {
				method: 'POST'
			})

			const result = await response.json()

			if (result?.success) {
				const optionsJSON = result?.data?.options
				passkeyRegister(optionsJSON)
			}
		} catch (e) {
			submitSuccess = 'error'
			console.error('Registration Error:', e)
		}
	}
	async function passkeyRegister(optionsJSON) {
		try {
			const registerResponse = await startRegistration({ optionsJSON })
			passkeyRegistrationVerify(registerResponse)
		} catch (e) {
			submitSuccess = 'error'
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

			const result = await response.json()

			if (result?.success) {
				submitSuccess = 'success'
			}
		} catch (e) {
			submitSuccess = 'error'
			console.error('Registration Error:', e)
		}
	}
</script>

<div class="block">
	<button onclick={passkeyOptionsRequest}>Register Passkey</button>
</div>
