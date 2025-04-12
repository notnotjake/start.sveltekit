<script lang="ts">
	import { onMount, onDestroy } from 'svelte'
	import { goto } from '$app/navigation'
	import { scale, slide } from 'svelte/transition'
	import { cubicOut } from 'svelte/easing'
	import { wipeVertical, wipeHorizontal } from '$ui/motion/transitions'

	import { createClass } from '$utils/create-class'
	import ProgressRadial from '$ui/feedback/progress-radial.svelte'
	import SuspenseText from '$ui/feedback/suspense-text.svelte'
	import CodeInput from '$ui/auth/code-input.svelte'

	let { email, triggerAttention, emailSent: initEmailSent } = $props()

	const COOLDOWN_TIME = 20 * 1000 // ms
	const SUCCESS_MESSAGE_DURATION = 4000 // ms
	const RESENDS_BEFORE_ALERT = 2

	let timeLastSent = $state(Date.now())

	let triesAttempted = $state(1)

	let initiated = $state(initEmailSent)

	type ButtonState = 'enabled' | 'disabled' | 'success' | 'error'
	let buttonState: ButtonState = $state('enabled')

	onMount(() => {
		if (initEmailSent) {
			buttonState = 'disabled'
			setTimeout(() => {
				buttonState = 'enabled'
			}, COOLDOWN_TIME)
		}

		setTimeout(() => {
			usingCode = true
		}, 3000)
	})

	// Should show after clicked until button is activated and when hovering
	type CountdownVisibility = false | 'clicked' | 'hover'
	let showCountdown: CountdownVisibility = $state(false)

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

	function getTimeElapsed(): number {
		if (!timeLastSent) return COOLDOWN_TIME
		return Math.floor(Date.now() - timeLastSent) / 1000
	}

	let delayed = $state(false)
	let delayedTimeout
	function clearDelay() {
		if (delayedTimeout) {
			clearTimeout(delayedTimeout)
			delayedTimeout = null
		}
		delayed = false
	}
	function startDelay() {
		delayedTimeout = setTimeout(() => {
			delayed = true
		}, 800)
	}

	async function requestEmailResend() {
		initiated = true

		if (buttonState === 'disabled') {
			showCountdown = 'clicked'
			return
		} else {
			showCountdown = false
		}

		const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

		clearDelay()
		startDelay()

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
				clearDelay()
				timeLastSent = Date.now()
				triesAttempted += 1

				if (triesAttempted > RESENDS_BEFORE_ALERT) {
					triggerAttention()
				}

				buttonState = 'success'
				setTimeout(() => {
					buttonState = 'disabled'
				}, SUCCESS_MESSAGE_DURATION)
				setTimeout(() => {
					buttonState = 'enabled'
				}, COOLDOWN_TIME)
			} else {
				buttonState = 'error'
				clearDelay()
			}
		} catch (e) {
			buttonState = 'error'
			clearDelay()
		}
	}

	onDestroy(() => {
		clearDelay()
	})

	let usingCode = $state(false)

	let pinCode = $state('')
	let submitPinResult = $state(null)
	function onComplete() {
		console.log('submitting ', pinCode)
	}
</script>

<div
	class={createClass(
		'w-full transition-all duration-300',
		initiated ? 'py-3' : 'py-1',
		usingCode ? '' : ''
	)}
>
	{#if usingCode}
		<div in:wipeVertical class="mb-2 rounded-[0.9rem] bg-neutral-100 py-5">
			<CodeInput bind:code={pinCode} {onComplete} submitSuccess={submitPinResult} />
		</div>
	{:else if buttonState === 'error'}
		<p class="tracking-tight-md animate-fade-in-scale w-full text-center text-rose-600">
			Unable to send email. Try again
		</p>
	{:else if initiated}
		<p class="tracking-tight-md animate-fade-in-scale w-full text-center">
			Check your email for a login link
		</p>
	{/if}

	<div>
		<!-- Hidden input to capture user's timezone -->
		<input type="hidden" name="timezone" value={Intl.DateTimeFormat().resolvedOptions().timeZone} />

		{#if !initiated}
			<div class="flex w-full justify-center">
				<button type="submit"
					>or <span class="text-neutral-900 underline">login with email</span></button
				>
			</div>
		{:else}
			<div
				class="flex w-full items-center justify-center pt-1"
				onmouseenter={handleMouseEnter}
				onmouseleave={handleMouseLeave}
			>
				{#if triesAttempted > RESENDS_BEFORE_ALERT}
					<p class="tracking-tight-md flash-appear pr-2 text-[0.93rem] text-neutral-800">
						Is email correct?
					</p>
				{/if}

				{#if delayed}
					<div in:scale={{ duration: 250 }}>
						<SuspenseText class="animate-fade-in-scale text-[0.93rem]"
							>Trying to Resend</SuspenseText
						>
					</div>
				{:else if buttonState === 'success'}
					<div in:wipeHorizontal={{ duration: 400 }}>
						<p class="rounded-full bg-green-100/60 px-2 text-[0.93rem] text-green-600">
							Email Sent
						</p>
					</div>
				{:else}
					<button
						onclick={requestEmailResend}
						in:scale={{ duration: 300, opacity: 0 }}
						class={createClass(
							'tracking-tight-sm cursor-pointer text-[0.93rem] font-[350] text-neutral-900 transition-colors',
							buttonState === 'disabled' ? 'text-neutral-500' : 'font-medium text-blue-500'
						)}
					>
						Resend
					</button>
				{/if}

				{#if buttonState === 'disabled'}
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
