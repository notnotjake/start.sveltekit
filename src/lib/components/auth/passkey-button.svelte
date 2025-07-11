<script lang="ts">
	import { onMount } from 'svelte'
	import { goto } from '$app/navigation'
	import { createClass } from '$utils/styles'
	import { wipeVertical } from '$ui/transition'
	import { Suspense } from '$ui/feedback'
	import PasskeyIcon from '$ui/icon/passkey.svelte'

	import { IconReload, IconInfoTriangleFilled } from '@tabler/icons-svelte'

	import { startAuthentication, type AuthenticationResponseJSON } from '@simplewebauthn/browser'

	let { identifier, supressAuto = false }: { identifier: string; supressAuto: boolean } = $props()

	onMount(() => {
		if (!supressAuto) {
			getOptions({ auto: true })
		}
	})

	class PasskeyButtonState {
		#isActivating = $state(false)
		#error = $state(false)
		#cancelled = $state(false)
		#message = $state<string | null>(null)
		#retry = $state(false)

		// Computed getters for reactive state
		get isActivating() {
			return this.#isActivating
		}
		get hasError() {
			return this.#error
		}
		get isCancelled() {
			return this.#cancelled
		}
		get message() {
			return this.#message
		}
		get retry() {
			return this.#retry
		}

		// State management methods
		activate() {
			this.#isActivating = true
			this.clearError()
		}

		deactivate() {
			this.#isActivating = false
			this.clearError()
		}

		setError(message: string | null, retry: boolean = true) {
			if (this.#isActivating) {
				this.#error = true
				this.#message = message
				this.#retry = retry

				if (message) {
					console.log('Passkey Error: ' + message)
				}
			} else {
				console.log(
					message
						? `Passkey error after user cancelled. ${message}`
						: 'Passkey error after user cancelled'
				)
			}
		}

		setCancelled(message: string) {
			if (this.#isActivating) {
				this.#cancelled = true
				this.#message = message
				this.#retry = true

				console.log('Passkey Cancelled: ' + message)
			} else {
				console.log(`Passkey cancelled. ${message}`)
			}
		}

		clearError() {
			this.#error = false
			this.#cancelled = false
			this.#message = null
			this.#retry = false
		}

		// Convenience methods for common state checks
		get isInErrorState() {
			return this.#isActivating && this.#error
		}

		get canRetry() {
			return this.#isActivating && this.#error && this.#retry
		}

		get shouldShowErrorDetails() {
			return this.#error && this.#message !== null
		}
	}

	let buttonState = $state(new PasskeyButtonState())

	async function handleClick() {
		if (buttonState.canRetry) {
			await getOptions({ auto: false })
			buttonState.clearError()
		} else if (buttonState.isInErrorState && !buttonState.retry) {
			buttonState.deactivate()
		} else if (buttonState.isActivating) {
			buttonState.deactivate()
		} else {
			await getOptions({ auto: false })
		}
	}

	async function getOptions({ auto = false }: { auto: boolean }) {
		buttonState.activate()

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
				startAuth({ optionsJSON: result.data.optionsJSON })
			} else {
				buttonState.setError('Failed to connect to server', true)
			}
		} catch (e) {
			console.error(e)
			buttonState.setError('Unexpected issue connecting to server', true)
		}
	}

	async function startAuth({ optionsJSON }: { optionsJSON: any }) {
		try {
			const authResponse = await startAuthentication({ optionsJSON })
			console.log('Started auth')
			passkeyAuthenticationVerify(authResponse)
		} catch (e) {
			console.log(e)
			buttonState.setCancelled('Browser was unable to start passkey authentication')
		}
	}

	async function passkeyAuthenticationVerify(authResponse: AuthenticationResponseJSON) {
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
				buttonState.setError(
					'Failed to authenticate with passkey. Double check your credentials',
					true
				)
			}
		} catch (e) {
			console.log(e)
			buttonState.setError(
				'Unexpected error trying to authenticate with passkey. Try signing in another way',
				false
			)
		}
	}
</script>

<div class="relative flex w-full shrink-1 grow basis-1 flex-col items-center">
	{#if buttonState.isActivating}
		<div class="h-5 w-full" transition:wipeVertical></div>
	{/if}

	<div class="flex w-full">
		<div
			class={createClass(
				'transition-all',
				buttonState.isActivating ? 'w-full grow basis-1' : 'shrink grow-0 basis-0'
			)}
		></div>
		<button
			type="button"
			onclick={handleClick}
			class={createClass(
				'relative m-auto flex h-fit min-h-12 w-full max-w-full cursor-pointer items-center justify-center gap-2 rounded-[0.9rem] px-4 py-3 font-medium text-white outline-none',
				buttonState.isActivating
					? 'bg-vibrant-blue grow basis-1 rounded-full'
					: 'bg-vibrant-blue grow basis-1',
				buttonState.isInErrorState && 'border-3 border-rose-500 bg-rose-100 text-rose-500'
			)}
		>
			{#if buttonState.isActivating && !buttonState.hasError}
				<Suspense.Spinner size={14} thickness={10} speed="fast" tint="var(--color-neutral-100)" />
				<Suspense.Text
					class="text-md"
					spread={13}
					colorBase="var(--color-sky-200)"
					colorHighlight="var(--color-white)">Trying Passkey</Suspense.Text
				>
			{:else if buttonState.isInErrorState}
				<div class="flex">
					{#if buttonState.retry}
						<IconReload />
					{/if}
					<p class="px-2 font-medium whitespace-nowrap">Something went wrong</p>
				</div>
			{:else if buttonState.isCancelled}
				<div class="flex">
					{#if buttonState.retry}
						<IconReload />
					{/if}
					<p class="px-2 font-medium whitespace-nowrap">Cancelled. Try again</p>
				</div>
			{:else}
				<PasskeyIcon />
				<p class="whitespace-nowrap">Use Passkey</p>
			{/if}
		</button>
		<div
			class={createClass(
				'transition-all',
				buttonState.isActivating ? 'w-full grow basis-1' : 'shrink grow-0 basis-0'
			)}
		></div>
	</div>

	{#if buttonState.shouldShowErrorDetails}
		<div class="px-6 pt-8">
			<div class="flex flex-col items-start justify-start gap-1">
				<div class="flex items-center gap-1">
					<IconInfoTriangleFilled size={22} class="text-rose-600" />
					<p class="font-semibold text-rose-600">Details:</p>
				</div>
				<p class="text-neutral-800">
					{buttonState.message}
				</p>
			</div>
		</div>
	{/if}

	{#if buttonState.isActivating}
		<div class="h-5 w-full" transition:wipeVertical></div>
	{/if}
</div>
