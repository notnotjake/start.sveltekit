<script lang="ts">
	import type { Snippet } from 'svelte'
	import { createClass, preserveClass } from '$utils/create-class'

	type Props = {
		children: Snippet
		class: string
		duration: number
		spread: number
	}
	let { children, class: classProp, duration = 2, spread = 6 }: Props = $props()

	let element: HTMLElement

	let textLength = $state(1)
	$effect(() => {
		textLength = element.innerText.length
	})

	let totalSpread = $derived(spread * textLength)
</script>

<p
	bind:this={element}
	style:--duration={`calc(${textLength} * 0.2s)`}
	style:--spread={`calc(${spread} * 0.5ch)`}
	class={createClass(
		'relative inline-block whitespace-nowrap text-transparent',
		preserveClass('text-shimmer'),
		classProp
	)}
>
	{@render children()}
</p>

<style>
	.text-shimmer {
		--base-color: #828282;
		--base-gradient-color: #000;

		background:
			linear-gradient(
					100deg,
					#0000 calc(50% - var(--spread)),
					var(--base-gradient-color) 50%,
					#0000 calc(50% + var(--spread))
				)
				0 0 / 250% 100% no-repeat border-box,
			linear-gradient(var(--base-color), var(--base-color)) padding-box;

		background-clip: text;
		color: transparent;

		animation: shimmer var(--duration) infinite both linear;
	}
	@keyframes shimmer {
		0% {
			background-position: 100% center;
		}
		100% {
			background-position: 0% center;
		}
	}
</style>
