<script lang="ts">
	import { onMount, onDestroy } from 'svelte'
	import { scale } from 'svelte/transition'
	import { wipeVertical, wipeHorizontal } from '$ui/motion/transitions'

	import { createClass } from '$utils/create-class'
	import ProgressRadial from '$ui/feedback/progress-radial.svelte'
	import SuspenseText from '$ui/feedback/suspense-text.svelte'
	import CodeInput from '$ui/auth/code-input.svelte'

	// Initial props from parent
	let { email, triggerAttention, emailSent: initialEmailSent } = $props()

	// Constants
	const COOLDOWN_TIME = 20 * 1000 // ms
	const SUCCESS_MESSAGE_DURATION = 3500 // ms
	const RESENDS_BEFORE_ALERT = 2
	const CODE_DISPLAY_DELAY = 10000 // ms

	// Component state
	let sendStatus: null | 'sending' | 'success' | 'error' | 'ready' = $state(
		initialEmailSent ? 'success' : null
	)
	let timeLastSent = $state(initialEmailSent ? Date.now() : null)
	let resendDisabled = $state(initialEmailSent)
	let showCodeInput = $state(false)
	let resendCount = $state(initialEmailSent ? 1 : 0)
	let showCountdown = $state(false) // false | 'hover' | 'clicked'

	// Pin code state
	let pinCode = $state('')
	let submitPinResult = $state(null)

	// Setup timers when component mounts
	onMount(() => {
		if (initialEmailSent) {
			// Start the cooldown timer for resend button
			setTimeout(() => {
				resendDisabled = false
			}, COOLDOWN_TIME)

			// Show code input after delay
			// setTimeout(() => {
			// 	showCodeInput = true
			// }, CODE_DISPLAY_DELAY)

			// Change status to 'ready' after success message duration
			if (sendStatus === 'success') {
				setTimeout(() => {
					sendStatus = 'ready'
				}, SUCCESS_MESSAGE_DURATION)
			}
		}
	})

	// Handle countdown visibility
	function handleMouseEnter() {
		if (showCountdown !== 'clicked') {
			showCountdown = 'hover'
		}
	}

	function handleMouseLeave() {
		if (showCountdown === 'hover') {
			showCountdown = false
		}
	}

	// Calculate time elapsed since last email sent
	function getTimeElapsed(): number {
		if (!timeLastSent) return COOLDOWN_TIME
		return Math.floor(Date.now() - timeLastSent) / 1000
	}

	// Delayed state for UI feedback
	let delayedTimeout
	function clearDelayedStatus() {
		if (delayedTimeout) {
			clearTimeout(delayedTimeout)
			delayedTimeout = null
		}
		sendStatus = null
	}

	// Request email resend
	async function sendEmail() {
		// If resend is disabled, just show the countdown
		if (resendDisabled) {
			showCountdown = 'clicked'
			return
		} else {
			showCountdown = false
		}

		const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
		sendStatus = 'sending'

		try {
			const response = await fetch('/auth/magiclink-send', {
				method: 'POST',
				body: JSON.stringify({
					email,
					timezone
				})
			})

			const result = await response.json()

			if (result?.success) {
				// Update state on success
				timeLastSent = Date.now()
				resendCount += 1
				sendStatus = 'success'

				if (resendCount > RESENDS_BEFORE_ALERT) {
					triggerAttention()
				}

				// Show code input after delay
				setTimeout(() => {
					showCodeInput = true
				}, CODE_DISPLAY_DELAY)

				// Disable resend button with cooldown
				resendDisabled = true

				// Change to 'ready' status after showing success message
				setTimeout(() => {
					sendStatus = 'ready'
				}, SUCCESS_MESSAGE_DURATION)

				setTimeout(() => {
					resendDisabled = false
				}, COOLDOWN_TIME)
			} else {
				sendStatus = 'error'
			}
		} catch (e) {
			sendStatus = 'error'
		}
	}

	// Clean up timers
	onDestroy(() => {
		if (delayedTimeout) {
			clearTimeout(delayedTimeout)
		}
	})

	// Handle pin code completion
	function onComplete() {
		console.log('submitting ', pinCode)
	}
</script>

<div class={createClass('w-full transition-all duration-300', sendStatus ? 'py-3' : 'py-1')}>
	<!-- Code input section -->
	{#if showCodeInput}
		<div in:wipeVertical class="mb-2 rounded-[0.9rem] bg-neutral-100 py-5">
			<CodeInput bind:code={pinCode} {onComplete} submitSuccess={submitPinResult} />
		</div>
	{:else if sendStatus === 'error'}
		<p class="tracking-tight-md animate-fade-in-scale w-full text-center text-rose-600">
			Unable to send email. Try again
		</p>
	{:else if sendStatus === 'success' || sendStatus === 'ready'}
		<p class="tracking-tight-md animate-fade-in-scale w-full text-center">
			Check your email for a login link
		</p>
	{/if}

	<div>
		<!-- Hidden input to capture user's timezone -->
		<input type="hidden" name="timezone" value={Intl.DateTimeFormat().resolvedOptions().timeZone} />

		{#if !sendStatus}
			<!-- Initial state: show "login with email" button -->
			<div class="flex w-full justify-center">
				<button type="submit" onclick={sendEmail}>
					or <span class="text-neutral-900 underline">login with email</span>
				</button>
			</div>
		{:else}
			<!-- Email sent state: show resend button with countdown -->
			<div
				class="flex w-full items-center justify-center pt-1"
				onmouseenter={handleMouseEnter}
				onmouseleave={handleMouseLeave}
			>
				{#if resendCount > RESENDS_BEFORE_ALERT}
					<p class="tracking-tight-md flash-appear pr-2 text-[0.93rem] text-neutral-800">
						Is email correct?
					</p>
				{/if}

				{#if sendStatus === 'sending'}
					<div in:scale={{ duration: 250 }}>
						<SuspenseText class="animate-fade-in-scale text-[0.93rem]">Sending Email</SuspenseText>
					</div>
				{:else if sendStatus === 'success'}
					<div in:wipeHorizontal={{ duration: 400 }}>
						<p class="rounded-full bg-green-100/60 px-2 text-[0.93rem] text-green-600">
							Email Sent
						</p>
					</div>
				{:else}
					<button
						onclick={sendEmail}
						in:scale={{ duration: 300, opacity: 0 }}
						class={createClass(
							'tracking-tight-sm cursor-pointer text-[0.93rem] font-[350] text-neutral-900 transition-colors',
							resendDisabled ? 'text-neutral-500' : 'font-medium text-blue-500'
						)}
					>
						Resend
					</button>
				{/if}

				{#if resendDisabled && sendStatus !== 'success'}
					<div
						class="overflow-hidden transition-all duration-250"
						style:opacity={showCountdown ? '100%' : '0%'}
						style:max-width={showCountdown ? '200px' : '0px'}
					>
						<div
							class="w-fit pl-1 transition-all duration-250"
							style:transform={showCountdown ? 'translateX(0)' : 'translateX(-100%)'}
						>
							<ProgressRadial totalTime={COOLDOWN_TIME / 1000} currentTime={getTimeElapsed()} />
						</div>
					</div>
				{/if}
			</div>
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
