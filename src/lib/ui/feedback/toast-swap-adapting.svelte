<script lang="ts">
	import { onMount, onDestroy, tick } from 'svelte'
	import { fade, scale } from 'svelte/transition'
	import { Spring } from 'svelte/motion'
	import { createClass } from '$utils/styles'

	let {
		class: classProp,
		children,
		swapContent,
		isOpen = $bindable(false),
		swapData,
		trigger = $bindable(null),
		durationMs = 4000,
		isSwapActive = $bindable(false),
		open = $bindable(null),
		close = $bindable(null),
		adaptSize = false
	} = $props()

	let timer = $state(null)

	trigger = (duration: number = durationMs, data) => {
		// Clear any existing timer
		clearTimer()

		// Set active state
		isOpen = true
		swapData = data

		// Set timer to clear message
		timer = setTimeout(() => {
			isOpen = null
			data = null
			timer = null
		}, duration)
	}

	open = (data) => {
		clearTimer()
		isOpen = true
		swapData = data
	}

	close = () => {
		isOpen = false
		swapData = null
	}

	function clearTimer() {
		if (timer) {
			clearTimeout(timer)
			timer = null
		}
	}

	onDestroy(() => {
		clearTimer()
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
		if (isOpen) {
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

	let initialized = $derived.by(() => {
		if (normalContentWidth === 0 && normalContentHeight === 0) {
			return false
		} else {
			return true
		}
	})
</script>

<div
	class={createClass(
		'duraiton-100 relative overflow-hidden transition-opacity',
		initialized ? 'opacity-100' : 'opacity-0'
	)}
	style:width={`${containerWidth.current}px`}
	style:height={`${containerHeight.current}px`}
>
	{#if isOpen}
		<div
			class="absolute inset-0 h-fit w-fit whitespace-nowrap"
			bind:offsetWidth={swappedContentWidth}
			bind:offsetHeight={swappedContentHeight}
		>
			{@render swapContent(swapData)}
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
