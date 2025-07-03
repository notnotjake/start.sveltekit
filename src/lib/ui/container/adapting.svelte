<script lang="ts">
	import type { Snippet } from 'svelte'
	import { createClass } from '$utils/styles'
	import { Spring } from 'svelte/motion'
	import { elasticOut } from 'svelte/easing'

	let {
		children,
		class: classProp,
		startingHeight = 150,
		startingWidth = 800,
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

	$inspect(stiffness)

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

	let debugPanel = false
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

{#if debugPanel}
	<div class="fixed inset-0 z-200 h-fit w-fit border-red-500 bg-rose-300">
		<div class="space-y-2">
			<label class="block">
				Stiffness:
				<input type="number" bind:value={stiffness} min="0.01" max="1" />
				<input type="range" bind:value={stiffness} min="0.01" max="1" step="0.01" class="w-full" />
			</label>
		</div>

		<div class="space-y-2">
			<label class="block">
				Damping:
				<input type="number" bind:value={damping} min="0.01" max="1" />
				<input type="range" bind:value={damping} min="0.01" max="1" step="0.01" class="w-full" />
			</label>
		</div>
	</div>
{/if}
