<script lang="ts">
	import { onMount, onDestroy } from 'svelte'
	import { goto } from '$app/navigation'
	import { scale } from 'svelte/transition'
	import { wipeVertical, wipeHorizontal } from '$ui/motion/transitions'

	import { createClass } from '$utils/create-class'
	import ProgressRadial from '$ui/feedback/progress-radial.svelte'
	import SuspenseText from '$ui/feedback/suspense-text.svelte'
	import ToastSwap from '$ui/feedback/toast-swap.svelte'
	import CodeInput from '$ui/auth/code-input.svelte'
	import ResendButton from '$ui/auth/email-resend-button.svelte'

	// Initial props from parent
	let { email, triggerAttention, emailSent: initialEmailSent } = $props()

	// Component state
	let sendStatus: null | 'sending' | 'success' | 'error' = $state(
		initialEmailSent ? 'success' : null
	)

	const RESENDS_BEFORE_ALERT = 2
	let resendCount = $state(initialEmailSent ? 1 : 0)

	let showCodeInput = $state(false)

	let toastConfirmSent = $state(null)

	// Setup timers when component mounts
	onMount(() => {
		if (initialEmailSent) {
			showSendSuccessToast()
		}
	})

	function showSendSuccessToast() {
		if (toastConfirmSent) {
			toastConfirmSent(3500, 'success')
		}
	}

	function resendButtonClickHandler() {
		sendEmail()
	}

	// Request email resend
	async function sendEmail() {
		const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
		sendStatus = 'sending'

		try {
			const response = await fetch('/auth/magiclink/send', {
				method: 'POST',
				body: JSON.stringify({
					email,
					timezone
				})
			})

			const result = await response.json()

			if (result?.success) {
				// Update state on success
				sendStatus = 'success'
				showSendSuccessToast()

				resendCount += 1
				if (resendCount > RESENDS_BEFORE_ALERT) {
					triggerAttention()
				}
			} else {
				sendStatus = 'error'
			}
		} catch (e) {
			sendStatus = 'error'
		}
	}

	let messages: string[] = $state([])
	let eventSource: EventSource | null = $state(null)
	let listeningForCodeAvailable = $state(false)

	$effect(async () => {
		if (sendStatus === 'success' && listeningForCodeAvailable === false) {
			await subscribeCodeAvailable()
		}
	})

	// Start listening for SSE
	async function subscribeCodeAvailable() {
		console.log('subsribing...')
		listeningForCodeAvailable = true

		// Create EventSource connection to our endpoint
		eventSource = new EventSource('/auth/magiclink/code-subscribe')

		// Listen for the "message" event type
		eventSource.addEventListener('message', (event) => {
			const data = JSON.parse(event.data)
			console.log('A message')
			messages = [...messages, `Message: ${data.message}`]
		})

		// Listen for the "update" event type
		eventSource.addEventListener('update', (event) => {
			const data = JSON.parse(event.data)
			console.log('U message')
			messages = [...messages, `Update at: ${data.time}`]
		})

		// Listen for the "timeout" event
		eventSource.addEventListener('timeout', (event) => {
			const data = JSON.parse(event.data)
			console.log('T message')
			messages = [...messages, `Timeout: ${data.message}`]
			stopSSE()
		})

		// Handle connection errors
		eventSource.onerror = (error) => {
			console.error('SSE Error:', error)
			// Optionally try to reconnect
		}
	}

	function stopSSE() {
		if (eventSource) {
			eventSource.close()
			eventSource = null
			console.log('SSE connection closed')
		}
	}

	onDestroy(() => {
		// Clean up the connection when component unmounts
		if (eventSource) {
			stopSSE()
		}
	})
</script>

<div class="messages">
	<p>Messages</p>
	{#each messages as message}
		<div class="message">{message}</div>
	{/each}
</div>

<div class={createClass('w-full transition-all duration-300', sendStatus ? 'py-3' : 'py-1')}>
	{#if showCodeInput}
		<div in:wipeVertical class="mb-2 rounded-[0.9rem] bg-neutral-50 py-5">
			<CodeInput {email} />
		</div>
	{:else if sendStatus === 'error'}
		<p class="tracking-tight-md animate-fade-in-scale w-full text-center text-rose-600">
			Unable to send email. Try again
		</p>
	{:else if sendStatus === 'success'}
		<p class="tracking-tight-md animate-fade-in-scale w-full text-center text-[1.05rem]">
			Check your email for a login link
		</p>
	{/if}

	<div class="flex w-full items-center justify-center py-1.5">
		{#if !sendStatus}
			<!-- Initial state: no email has been sent -->
			<div class="flex w-full justify-center">
				<button type="submit" onclick={sendEmail}>
					or <span class="text-neutral-900 underline">login with email</span>
				</button>
			</div>
		{:else}
			{#if sendStatus === 'sending'}
				<div in:scale={{ duration: 250 }}>
					<SuspenseText class="animate-fade-in-scale text-[1.05rem]">Sending Email</SuspenseText>
				</div>
			{:else if resendCount > RESENDS_BEFORE_ALERT}
				<p class="tracking-tight-md flash-appear pr-2 text-[0.93rem] text-neutral-800">
					Is email correct?
				</p>
			{/if}

			<ToastSwap bind:trigger={toastConfirmSent}>
				{#snippet swapContent()}
					<div in:wipeHorizontal={{ duration: 400 }}>
						<p class="rounded-full bg-green-100/60 px-2 text-[0.93rem] text-green-600">
							Email Sent
						</p>
					</div>
				{/snippet}

				{#if sendStatus !== 'sending'}
					<ResendButton onclick={resendButtonClickHandler} {sendStatus} />
				{/if}
			</ToastSwap>
		{/if}
	</div>
</div>

<style>
	.flash-appear {
		animation: flash-in 0.9s ease-out forwards;
	}

	@keyframes flash-in {
		0% {
			opacity: 0;
			color: var(--color-blue-500);
		}
		25% {
			opacity: 1;
			color: var(--color-blue-500);
		}
		50% {
			color: var(--color-blue-500);
		}
		100% {
			color: inherit;
		}
	}
</style>
