<script lang="ts">
	import { onMount } from 'svelte'
	import { goto } from '$app/navigation'
	import { startAuthentication } from '@simplewebauthn/browser'

	let {} = $props()

	onMount(async () => {
		try {
			const response = await fetch('/auth/passkey-authenticate/options-auto', {
				method: 'POST'
			})
			const result = await response.json()

			if (result?.success && result?.data) {
				startAuth({ optionsJSON: result.data.optionsJSON })
			} else {
				console.error('not verified')
			}
		} catch (e) {
			console.error(e)
		}
	})
	async function startAuth({ optionsJSON }) {
		try {
			const authResponse = await startAuthentication({ optionsJSON, useBrowserAutofill: true })
			passkeyAuthenticationVerify(authResponse)
		} catch (e) {
			console.error(e)
		}
	}
	async function passkeyAuthenticationVerify(authResponse) {
		try {
			const response = await fetch('/auth/passkey-authenticate/verify', {
				method: 'POST',
				body: JSON.stringify(authResponse),
				headers: { 'Content-Type': 'application/json' }
			})

			const result = await response.json()

			if (result?.success && result?.redirect) {
				goto(result.redirect)
			} else {
				console.error('not verified')
			}
		} catch (e) {
			console.error(e)
		}
	}
</script>
