<script lang="ts">
	import { onMount, onDestroy, tick } from 'svelte'
	import { fade, scale } from 'svelte/transition'
	import { createClass } from '$utils/create-class'

	let {
		class: classProp,
		children,
		swapContent,
		durationMs = 4000,
		trigger = $bindable()
	} = $props()

	let timer = $state(null)
	let activeMessage = $state(null)
	let messageData = $state(null)

	trigger = (duration: number = durationMs, data) => {
		// Clear any existing timer
		if (timer) {
			clearTimeout(timer)
			timer = null
		}

		// Set active message
		activeMessage = true
		messageData = data

		// Set timer to clear message
		timer = setTimeout(() => {
			activeMessage = null
			messageData = null
			timer = null
		}, duration)
	}

	onDestroy(() => {
		clearTimeout(timer)
	})
</script>

{#if activeMessage}
	<div>
		{@render swapContent(messageData)}
	</div>
{:else}
	<div>
		{@render children?.()}
	</div>
{/if}
