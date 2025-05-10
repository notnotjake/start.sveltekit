<script lang="ts">
	import { onMount, onDestroy, tick } from 'svelte'
	import { fade, scale } from 'svelte/transition'
	import { createClass } from '$utils/create-class'

	let {
		class: classProp,
		children,
		swapContent,
		isOpen = $bindable(false),
		swapData,
		trigger = $bindable(null),
		durationMs = 4000,
		isSwapActive = $bindable(false)
	} = $props()

	let timer = $state(null)

	trigger = (duration: number = durationMs, data) => {
		// Clear any existing timer
		if (timer) {
			clearTimeout(timer)
			timer = null
		}

		// Set active state
		isOpen = true
		swapData = data

		// Set timer to clear message
		timer = setTimeout(() => {
			isOpen = false
			data = null
			timer = null
		}, duration)
	}

	onDestroy(() => {
		clearTimeout(timer)
	})
</script>

<div class="relative">
	{#if isOpen}
		<div>
			{@render swapContent(swapData)}
		</div>
	{:else}
		<div>
			{@render children?.()}
		</div>
	{/if}
</div>
