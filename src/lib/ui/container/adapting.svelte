<script lang="ts">
	import type { Snippet } from 'svelte'
	import { createClass } from '$utils/create-class'
	import { Spring } from 'svelte/motion'
	import { elasticOut } from 'svelte/easing'

	let {
		children,
		class: classProp,
		startingHeight = 150,
		startingWidth = 100,
		stiffness = 0.05,
		damping = 0.33
	}: {
		children?: Snippet
		class?: string
		startingHeight?: number
		startingWidth?: number
		stiffness?: number
		damping?: number
	} = $props()

	let innerHeight = $state(0)
	let innerWidth = $state(0)

	let containerHeight = new Spring(startingHeight, {
		stiffness: stiffness,
		damping: damping
	})

	let containerWidth = new Spring(startingWidth, {
		stiffness: stiffness,
		damping: damping
	})

	$effect(() => {
		containerHeight.target = innerHeight
		containerWidth.target = innerWidth
	})
</script>

<div
	style:height={`${containerHeight.current}px`}
	style:width={`${containerWidth.current}px`}
	class={createClass(classProp, 'relative overflow-hidden')}
>
	<div
		class="absolute inset-0 h-fit w-fit"
		bind:offsetHeight={innerHeight}
		bind:offsetWidth={innerWidth}
	>
		{@render children()}
	</div>
</div>
