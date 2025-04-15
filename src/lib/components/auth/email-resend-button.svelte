<script lang="ts">
	import { onDestroy, tick } from 'svelte'
	import { scale } from 'svelte/transition'
	import { createClass } from '$utils/create-class'
	import { ProgressRadial } from '$ui/feedback'

	let {
		cooldownMs = 20 * 1000,
		onclick,
		sendStatus
	}: {
		cooldownMs: number
		onclick: () => void | Promise<void>
		sendStatus: null | 'sending' | 'success' | 'error' | 'ready'
	} = $props()

	let lastSendSuccessTime: number | null = $state(null)
	let disabled: boolean = $state(false)
	let isCountdownShown: false | 'clicked' | 'hover' = $state(false)

	let cooldownTimer = null

	function getTimeElapsed(): number {
		if (!lastSendSuccessTime) return cooldownMs
		return Math.floor(Date.now() - lastSendSuccessTime) / 1000
	}

	$effect(() => {
		if (sendStatus === 'success') {
			clearTimers()

			// Start cooldown
			lastSendSuccessTime = Date.now()
			disabled = true
			cooldownTimer = setTimeout(() => {
				disabled = false
			}, cooldownMs)
		}
	})

	function handleClick() {
		if (disabled) {
			isCountdownShown = 'clicked'
		} else {
			isCountdownShown = false
			onclick()
		}
	}

	function handleMouseEnter() {
		if (isCountdownShown !== 'clicked') {
			isCountdownShown = 'hover'
		}
	}

	function handleMouseLeave() {
		if (isCountdownShown === 'hover') {
			isCountdownShown = false
		}
	}

	function clearTimers() {
		if (cooldownTimer) clearTimeout(cooldownTimer)
	}

	onDestroy(() => {
		clearTimers()
	})
</script>

<div class="flex items-center" onmouseenter={handleMouseEnter} onmouseleave={handleMouseLeave}>
	<button
		type="button"
		onclick={handleClick}
		in:scale={{ duration: 300, opacity: 0 }}
		class={createClass(
			'tracking-tight-sm cursor-pointer text-[0.93rem] font-[350] text-neutral-900 transition-colors',
			disabled ? 'text-neutral-500' : 'font-medium text-blue-500'
		)}
	>
		Resend
	</button>

	{#if disabled}
		<div
			class="overflow-hidden transition-all duration-250"
			style:opacity={isCountdownShown ? '100%' : '0%'}
			style:max-width={isCountdownShown ? '200px' : '0px'}
		>
			<div
				class="w-fit pl-1 transition-all duration-250"
				style:transform={isCountdownShown ? 'translateX(0)' : 'translateX(-100%)'}
			>
				<ProgressRadial totalTime={cooldownMs / 1000} currentTime={getTimeElapsed()} />
			</div>
		</div>
	{/if}
</div>
