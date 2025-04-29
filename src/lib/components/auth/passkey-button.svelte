<script lang="ts">
	import { goto } from '$app/navigation'
	import { createClass } from '$utils/create-class'
	import { Suspense } from '$ui/feedback'
	import PasskeyIcon from '$ui/icons/passkey.svelte'

	import { startAuthentication } from '@simplewebauthn/browser'

	let { identifier }: { identifier: string } = $props()
	$inspect(identifier)

	let isActivating = $state(false)

	async function getOptions({ identifier: string }) {
		isActivating = true
		try {
			const response = await fetch('/auth/passkey-authenticate/options', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					identifier
				})
			})

			const result = await response.json()

			console.log(result)

			if (result?.success && result?.data) {
				startAuth({ optionsJSON: result.data.optionsJSON })
			} else {
				console.error('not verified')
			}
		} catch (e) {
			console.error(e)
			isActivating = false
		}
	}

	async function startAuth({ optionsJSON }) {
		try {
			console.log(optionsJSON)
			const authResponse = await startAuthentication({ optionsJSON })
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

<div class="relative flex w-full shrink-1 grow basis-1 flex-col items-center">
	<button
		type="button"
		onclick={getOptions}
		class="relative m-auto flex h-11 w-full max-w-full cursor-pointer items-center justify-center gap-2 rounded-[0.9rem] border-none bg-neutral-800 px-4 font-medium text-white outline-none"
	>
		{#if isActivating}
			<Suspense.Spinner size={14} thickness={10} />
			<Suspense.Text
				class="text-sm"
				spread={13}
				colorBase="var(--color-neutral-200)"
				colorHighlight="var(--color-white)">Waiting for Authenticator...</Suspense.Text
			>
		{:else}
			<PasskeyIcon />
			Sign in with Passkey
		{/if}
	</button>
</div>
