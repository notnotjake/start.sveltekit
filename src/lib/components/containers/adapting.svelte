<script lang="ts">
	import type { Snippet } from 'svelte'
	import { createClass } from '$utils/create-class'
	import { Spring } from 'svelte/motion'
	import { elasticOut } from 'svelte/easing'

	type Props = {
		children?: Snippet
		class?: string
		startingSize?: number
		stiffness?: number
		damping?: number
	}
	let {
		children,
		class: classProp,
		startingSize = 150,
		stiffness = 0.05,
		damping = 0.33
	}: Props = $props()

	let innerHeight = $state(0)
	let containerHeight = new Spring(startingSize, {
		stiffness: stiffness,
		damping: damping
	})

	$effect(() => {
		containerHeight.target = innerHeight
	})
</script>

<div
	style:height={`${containerHeight.current}px`}
	class={createClass(classProp, 'relative overflow-hidden')}
>
	<div class="absolute inset-0 h-fit w-full" bind:offsetHeight={innerHeight}>
		{@render children()}
	</div>
</div>
