<script lang="ts">
	import { onMount, tick } from 'svelte'
	import { fade, scale } from 'svelte/transition'
	import { createClass } from '$utils/styles'

	let { class: classProp, children, durationMs = 2500, trigger = $bindable() } = $props()

	let visible = $state(false)
	let bounce = $state(false)
	let timer

	onMount(() => {
		return () => {
			if (timer) clearTimeout(timer)
		}
	})

	trigger = () => {
		if (timer) {
			clearTimeout(timer)
		}

		if (visible) {
			bounce = true
			setTimeout(() => {
				bounce = false
			}, 400)
		} else {
			bounce = false
		}

		visible = true

		timer = setTimeout(() => {
			visible = false
			bounce = false
			timer = undefined
		}, durationMs)
	}
</script>

{#if visible}
	<div
		class={createClass(classProp)}
		in:scale={{ opacity: 0, duration: 100 }}
		out:scale={{ duration: 300 }}
		class:interrupt-animation={bounce}
	>
		{@render children?.()}
	</div>
{/if}

<style>
	.interrupt-animation {
		animation: stretch 0.3s ease-in-out;
	}
	@keyframes bounce {
		0% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-4px);
		}
		55% {
			transform: translateY(-4px);
		}
		100% {
			transform: translateY(0);
		}
	}
	@keyframes stretch {
		0% {
			transform: scaleY(100%) scaleX(100%);
		}
		50% {
			transform: scaleY(120%) scaleX(105%);
		}
		55% {
			transform: scaleY(120%) scaleX(105%);
		}
		100% {
			transform: scaleY(100%) scaleX(100%);
		}
	}
</style>
