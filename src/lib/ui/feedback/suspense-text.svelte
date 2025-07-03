<script lang="ts">
	import type { Snippet } from 'svelte'
	import { createClass, preserveClass } from '$utils/styles'

	type Props = {
		children: Snippet
		class?: string
		speed?: number
		spread?: number
	}
	let {
		children,
		class: classProp,
		speed = 0.15,
		spread = 6,
		colorBase = '#828282',
		colorHighlight = '#000'
	}: {
		children: Snippet
		class?: string
		speed?: number
		spread?: number
		colorBase?: string
		colorHighlight?: string
	} = $props()

	let element: HTMLElement

	let textLength = $state(1)
	$effect(() => {
		textLength = element.innerText.length
	})
	let totalSpread = $derived(spread * textLength)
</script>

<div class="animate-fade-in-scale">
	<p
		bind:this={element}
		style:--duration={`calc(${textLength} * ${speed}s)`}
		style:--spread={`calc(${spread} * 0.5ch)`}
		style:--base-color={colorBase}
		style:--base-gradient-color={colorHighlight}
		class={createClass(
			'relative inline-block whitespace-nowrap text-transparent',
			preserveClass('text-shimmer'),
			classProp
		)}
	>
		{@render children()}
	</p>
</div>

<style>
	.text-shimmer {
		background:
			linear-gradient(
					100deg,
					#0000 calc(50% - var(--spread)),
					var(--base-gradient-color) 50%,
					#0000 calc(50% + var(--spread))
				)
				0 0 / 250% 100% no-repeat border-box,
			linear-gradient(var(--base-color), var(--base-color)) padding-box;
		color: transparent;
		background-clip: text;
		animation: shimmer var(--duration) infinite both ease-out;
	}
	@keyframes shimmer {
		0% {
			background-position: 100% center;
		}
		100% {
			background-position: -30% center;
		}
	}
</style>
