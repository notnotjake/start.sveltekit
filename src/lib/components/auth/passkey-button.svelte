<script lang="ts">
	import { onMount } from 'svelte'
	import { goto } from '$app/navigation'
	import { createClass } from '$utils/styles'
	import { wipeVertical } from '$ui/transition'
	import { Suspense } from '$ui/feedback'
	import PasskeyIcon from '$ui/icon/passkey.svelte'

	import { IconChevronDown, IconReload, IconInfoTriangleFilled } from '@tabler/icons-svelte'

	import { startAuthentication } from '@simplewebauthn/browser'

	let { identifier, supressAuto = false }: { identifier: string; supressAuto: boolean } = $props()

	let isActivating = $state(false)

	onMount(() => {
		if (!supressAuto) {
			getOptions({ auto: true })
		}
	})

	async function handleClick() {
		if (isActivating && hasError.error && hasError.retry) {
			await getOptions({ auto: false })
			hasError.error = false
			hasError.message = null
		} else if (isActivating && hasError.error && !hasError.retry) {
			isActivating = false
			hasError.error = false
			hasError.message = null
		} else if (isActivating) {
			isActivating = false
		} else if (!isActivating) {
			await getOptions({ auto: false })
		}
	}

	function handleError({ message, retry }: { message: string | null; retry: boolean }) {
		if (isActivating) {
			hasError.error = true

			if (message) {
				hasError.message = message
				console.log('Passkey Error: ' + message)
			}

			hasError.retry = retry
		} else {
			console.log(
				message
					? `Passkey error after user cancelled. ${message}`
					: 'Passkey error after user cancelled'
			)
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
				console.log('Got Options')
				startAuth({ optionsJSON: result.data.optionsJSON, useBrowserAutofill: auto })
			} else {
				handleError({ message: 'Failed to connect to server', retry: true })
			}
		} catch (e) {
			handleError({ message: 'Unexpected issue connecting to server', retry: true })
		}
	}

	async function startAuth({ optionsJSON }) {
		try {
			const authResponse = await startAuthentication({ optionsJSON })
			console.log('Started auth')
			passkeyAuthenticationVerify(authResponse)
		} catch (e) {
			console.log(e)
			// handleError({ message: 'Browser was unable to start passkey authentication', retry: true })
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
				handleError({
					message: 'Failed to authenticate with passkey. Double check your credentials',
					retry: true
				})
			}
		} catch (e) {
			console.log(e)
			handleError({
				message: 'Unexpected error trying to authenticate with passkey. Try signing in another way',
				retry: false
			})
		}
	}

	let hasError = $state({
		error: false,
		message: null,
		retry: false
	})
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
			onclick={handleClick}
			class={createClass(
				'relative m-auto flex h-fit min-h-12 w-full max-w-full cursor-pointer items-center justify-center gap-2 rounded-[0.9rem] px-4 py-3 font-medium text-white outline-none',
				isActivating ? 'bg-vibrant-blue grow basis-1 rounded-full' : 'bg-vibrant-blue grow basis-1',
				isActivating && hasError.error && 'border-3 border-rose-500 bg-rose-100 text-rose-500'
			)}
		>
			{#if isActivating && !hasError.error}
				<Suspense.Spinner size={14} thickness={10} speed="fast" tint="var(--color-neutral-100)" />
				<Suspense.Text
					class="text-md"
					spread={13}
					colorBase="var(--color-sky-200)"
					colorHighlight="var(--color-white)">Trying Passkey</Suspense.Text
				>
			{:else if isActivating && hasError.error}
				<div class="flex">
					{#if hasError.retry}
						<IconReload />
					{/if}
					<p class="px-2 font-medium whitespace-nowrap">Something went wrong</p>
				</div>
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

	{#if hasError.error && hasError.message !== null}
		<div class="px-6 pt-8">
			<div class="flex flex-col items-start justify-start gap-1">
				<div class="flex items-center gap-1">
					<IconInfoTriangleFilled size={22} class="text-rose-600" />
					<p class="font-semibold text-rose-600">Details:</p>
				</div>
				<p class="text-neutral-800">
					{hasError.message}
				</p>
			</div>
		</div>
	{/if}

	{#if isActivating}
		<div class="h-5 w-full" transition:wipeVertical></div>
	{/if}
</div>
