<script lang="ts">
	import { onMount } from 'svelte'
	import { scale } from 'svelte/transition'
	import { wipeVertical, wipeHorizontal } from '$ui/transition'

	import { createClass } from '$utils/styles'
	import SuspenseText from '$ui/feedback/suspense-text.svelte'
	import ToastSwap from '$ui/feedback/toast-swap.svelte'
	import CodeInput from '$bits/auth/code-input.svelte'
	import ResendButton from '$bits/auth/email-resend-button.svelte'

	// Initial props from parent
	let { email, triggerAttention, emailSent: initialEmailSent } = $props()

	// Component state
	let sendStatus: null | 'sending' | 'success' | 'error' = $state(
		initialEmailSent ? 'success' : null
	)

	const RESENDS_BEFORE_ALERT = 2
	let resendCount = $state(initialEmailSent ? 1 : 0)

	// Show code input by default when email is sent
	let showCodeInput = $state(initialEmailSent)

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

	$effect(() => {
		if (sendStatus === 'success') {
			showCodeInput = true
		}
	})
</script>

<div class={createClass('w-full transition-all duration-300', sendStatus ? 'py-3' : 'py-1')}>
	{#if showCodeInput}
		<div in:wipeVertical class="mb-2 rounded-[0.9rem] py-5">
			<CodeInput {email} />
		</div>
	{:else if sendStatus === 'error'}
		<p class="tracking-tight-md animate-fade-in-scale w-full text-center text-rose-600">
			Unable to send email. Try again
		</p>
	{:else if sendStatus === 'success'}
		<p class="tracking-tight-md animate-fade-in-scale w-full text-center text-[1.05rem]">
			Check your email for a login code
		</p>
	{/if}

	<div class="flex w-full items-center justify-center py-1.5">
		{#if !sendStatus}
			<!-- Initial state: no email has been sent -->
			<div class="flex w-full justify-center text-[1.1rem] font-medium text-neutral-400">
				<button type="submit" onclick={sendEmail}>
					or <span class="text-neutral-600">login with email</span>
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
					<ResendButton onclick={resendButtonClickHandler} {sendStatus} cooldownMs={30000} />
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