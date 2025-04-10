<script>
	import { superForm } from 'sveltekit-superforms'
	import { zodClient } from 'sveltekit-superforms/adapters'

	import { createClass } from '$utils/create-class'

	import { startRegistration } from '@simplewebauthn/browser'

	let {} = $props()

	async function passkeyOptionsRequest() {
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
			console.error('Registration Error:', e)
		}
	}
	async function passkeyRegister(optionsJSON) {
		try {
			const registerResponse = await startRegistration({ optionsJSON })
			passkeyRegistrationVerify(registerResponse)
		} catch (e) {
			console.error('Registration Error:', e)
		}
	}
	async function passkeyRegistrationVerify(registrationResponse) {
		try {
			const response = await fetch('/auth/passkey-register/verify', {
				method: 'POST',
				body: JSON.stringify(registrationResponse),
				headers: { 'Content-Type': 'application/json' }
			})

			const result = await response.json()
		} catch (e) {
			console.error('Registration Error:', e)
		}
	}
</script>

<div class={createClass('w-full bg-neutral-100 px-3 py-2 font-medium')}>
	<button onclick={passkeyOptionsRequest}>Add a Passkey</button>
</div>
