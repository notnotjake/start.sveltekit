<script lang="ts">
	import { onMount } from 'svelte'
	import { goto } from '$app/navigation'
	import { createClass } from '$utils/styles'
	import { wipeVertical } from '$ui/transition'
	import { Suspense } from '$ui/feedback'
	import PasskeyIcon from '$ui/icon/passkey.svelte'

	import { startAuthentication } from '@simplewebauthn/browser'

	let { identifier, supressAuto = false }: { identifier: string; supressAuto: boolean } = $props()

	let isActivating = $state(false)

	onMount(() => {
		if (!supressAuto) {
			getOptions({ auto: true })
		}
	})

	async function initiate() {
		if (isActivating) {
			isActivating = false
		} else {
			await getOptions({ auto: false })
		}
	}

	async function getOptions({ auto = false }: { auto: boolean }) {
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

			if (result?.success && result?.data) {
				startAuth({ optionsJSON: result.data.optionsJSON, useBrowserAutofill: auto })
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
	{#if isActivating}
		<div class="h-5 w-full" transition:wipeVertical></div>
	{/if}

	<div class="flex w-full">
		<div
			class={createClass(
				'transition-all',
				isActivating ? 'w-full grow basis-1' : 'shrink grow-0 basis-0'
			)}
		></div>
		<button
			type="button"
			onclick={initiate}
			class={createClass(
				'relative m-auto flex h-fit min-h-12 w-full max-w-full cursor-pointer items-center justify-center gap-2 rounded-[0.9rem] border-none px-4 py-3 font-medium text-white outline-none',
				isActivating ? 'bg-vibrant-blue grow basis-1 rounded-full' : 'bg-vibrant-blue grow basis-1'
			)}
		>
			{#if isActivating}
				<Suspense.Spinner size={14} thickness={10} speed="fast" tint="var(--color-neutral-100)" />
				<Suspense.Text
					class="text-md"
					spread={13}
					colorBase="var(--color-sky-200)"
					colorHighlight="var(--color-white)">Trying Passkey</Suspense.Text
				>
			{:else}
				<PasskeyIcon />
				<p class="whitespace-nowrap">Use Passkey</p>
			{/if}
		</button>
		<div
			class={createClass(
				'transition-all',
				isActivating ? 'w-full grow basis-1' : 'shrink grow-0 basis-0'
			)}
		></div>
	</div>

	{#if isActivating}
		<div class="h-5 w-full" transition:wipeVertical></div>
	{/if}
</div>
