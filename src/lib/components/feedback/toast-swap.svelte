<script lang="ts">
	import { onMount, onDestroy, tick } from 'svelte'
	import { fade, scale } from 'svelte/transition'
	import { createClass } from '$utils/create-class'

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
</script>

<div class="relative">
	{#if isSwapActive}
		<div>
			{@render swapContent(messageData)}
		</div>
	{:else}
		<div>
			{@render children?.()}
		</div>
	{/if}
</div>
