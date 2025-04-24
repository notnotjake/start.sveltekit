<script lang="ts">
	import { onMount, onDestroy, tick } from 'svelte'
	import { fade, scale } from 'svelte/transition'
	import { createClass } from '$utils/create-class'
	import { Spring } from 'svelte/motion'

	let {
		class: classProp,
		children,
		swapContent,
		durationMs = 4000,
		trigger = $bindable(),
		isSwapActive = $bindable(false)
	} = $props()

	let timer = $state(null)
	let messageData = $state(null)

	trigger = (duration: number = durationMs, data) => {
		// Clear any existing timer
		if (timer) {
			clearTimeout(timer)
			timer = null
		}

		// Set active message
		isSwapActive = true
		messageData = data

		// Set timer to clear message
		timer = setTimeout(() => {
			isSwapActive = null
			messageData = null
			timer = null
		}, duration)
	}

	onDestroy(() => {
		clearTimeout(timer)
	})

	let containerWidth = new Spring(50, {
		stiffness: 0.05,
		damping: 0.33
	})

	let containerHeight = new Spring(20, {
		stiffness: 0.05,
		damping: 0.33
	})

	$effect(() => {
		if (isSwapActive) {
			containerWidth.target = swappedContentWidth
			containerHeight.target = swappedContentHeight
		} else {
			containerWidth.target = normalContentWidth
			containerHeight.target = normalContentHeight
		}
	})

	let swappedContentWidth = $state(0)
	let swappedContentHeight = $state(0)

	let normalContentWidth = $state(0)
	let normalContentHeight = $state(0)
</script>

<div
	class="relative overflow-hidden"
	style:width={`${containerWidth.current}px`}
	style:height={`${containerHeight.current}px`}
>
	{#if isSwapActive}
		<div
			class="absolute inset-0 h-fit w-fit whitespace-nowrap"
			bind:offsetWidth={swappedContentWidth}
			bind:offsetHeight={swappedContentHeight}
		>
			{@render swapContent(messageData)}
		</div>
	{:else}
		<div
			class="absolute inset-0 h-fit w-fit"
			bind:offsetHeight={normalContentHeight}
			bind:offsetWidth={normalContentWidth}
		>
			{@render children?.()}
		</div>
	{/if}
</div>
