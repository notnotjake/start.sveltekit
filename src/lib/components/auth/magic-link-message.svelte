<script lang="ts">
	import ProgressRadial from '$ui/feedback/progress-radial.svelte'
	import SuspenseText from '$ui/feedback/suspense-text.svelte'
	import { scale, slide } from 'svelte/transition'
	import { cubicOut } from 'svelte/easing'
	import { onMount, onDestroy } from 'svelte'
	import { createClass } from '$utils/create-class'
	import { superForm } from 'sveltekit-superforms'
	import { zodClient } from 'sveltekit-superforms/adapters'

	let { formData: resendEmailForm, schema, email } = $props()

	function wipeIn(node, { duration = 300, delay = 0, easing = cubicOut }) {
		const targetWidth = node.offsetWidth
		return {
			duration,
			delay,
			easing,
			css: (t) => `
				width: ${t * targetWidth}px;
				overflow: hidden;
				white-space: nowrap;
				opacity: ${t};
			`
		}
	}

	const { form, errors, allErrors, message, enhance, delayed, timeout } = superForm(
		resendEmailForm,
		{
			id: 'resendEmailForm',
			onSubmit({ formData, cancel }) {
				if (buttonState === 'disabled') {
					showCountdown = 'clicked'
					cancel()
				} else {
					formData.set('email', email)
					showCountdown = false
				}
			},
			onResult({ result }) {
				if (result.type === 'success') {
					timeLastSent = Date.now()
					buttonState = 'success'
					setTimeout(() => {
						$message = null
						buttonState = 'disabled'
					}, SUCCESS_MESSAGE_DURATION)
					setTimeout(() => {
						buttonState = 'enabled'
					}, COOLDOWN_TIME)
				} else {
					buttonState = 'error'
				}
			},
			delayMs: 300,
			timeoutMs: 9000
		}
	)

	const COOLDOWN_TIME = 20000 // ms
	const SUCCESS_MESSAGE_DURATION = 3000 // ms

	let timeLastSent = $state(Date.now())

	type ButtonState = 'enabled' | 'disabled' | 'success' | 'error'
	let buttonState: ButtonState = $state('enabled')

	onMount(() => {
		buttonState = 'disabled'
		setTimeout(() => {
			buttonState = 'enabled'
		}, COOLDOWN_TIME)
	})
	$effect(() => {
		if ($message?.success === false || $allErrors.length > 0 || $timeout) {
			buttonState = 'error'
		}
	})
	$effect(() => {
		if ($message?.success) {
			buttonState = 'success'
		}
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
</script>

<p></p>

<div class="w-full py-6">
	{#if buttonState === 'error'}
		<p class="tracking-tight-md animate-fade-in-scale w-full text-center text-rose-600">
			Unable to send email. Try again
		</p>
	{:else}
		<p class="tracking-tight-md animate-fade-in-scale w-full text-center">
			Check your email for a login link
		</p>
	{/if}

	<form method="POST" action="?/resendMagicLink" use:enhance>
		<div
			class="flex w-full items-center justify-center"
			onmouseenter={handleMouseEnter}
			onmouseleave={handleMouseLeave}
		>
			{#if $delayed && !$timeout}
				<div in:scale={{ duration: 250 }}>
					<SuspenseText class="animate-fade-in-scale text-[0.93rem]">Trying to Resend</SuspenseText>
				</div>
			{:else if buttonState === 'success'}
				<div in:wipeIn={{ duration: 400 }}>
					<p class="rounded-full bg-green-100/60 px-2 text-[0.93rem] text-green-600">Email Sent</p>
				</div>
			{:else}
				<button
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
	</form>
</div>
