<script lang="ts">
	import type { Snippet } from 'svelte'
	import { createClass } from '$utils/styles'
	import { Tween } from 'svelte/motion'
	import { cubicOut } from 'svelte/easing'

	type Props = {
		children: Snippet
		class?: string
		baseColor?: string
		fillColor?: string
		value: number
		min?: number
		max?: number
		direction?: 'up' | 'down' | 'left' | 'right'
		dur?: number
		blur?: number
	}
	let {
		children,
		class: classProp,
		baseColor = 'var(--color-neutral-400)',
		fillColor = 'var(--color-neutral-700)',
		value = 0,
		min = 0,
		max = 100,
		direction = 'up',
		dur = 500,
		blur = 0
	}: Props = $props()

	// Create a tweened store for smooth transitions
	const progress = new Tween(value, {
		duration: dur,
		easing: cubicOut
	})

	// Update the progress when percentComplete changes
	$effect(() => {
		if (value >= 100) {
			progress.target = 100
		} else {
			progress.target = Math.min(max, Math.max(min, value))
		}
	})

	let gradientPosition = $derived(100 - progress.current)

	let gradientDirection = $derived.by(() => {
		if (direction === 'up') return 'to bottom'
		else if (direction === 'down') return 'to top'
		else if (direction === 'left') return 'to right'
		else if (direction === 'right') return 'to left'
		else return 'to bottom'
	})
</script>

<div
	class={createClass('progress-text', classProp)}
	style:--base-color={baseColor}
	style:--fill-color={fillColor}
	style:--gradient-dir={gradientDirection}
	style:--gradient-position={gradientPosition + '%'}
>
	{@render children?.()}
</div>

<style>
	.progress-text {
		display: inline-block;
		position: relative;
		background: linear-gradient(
			var(--gradient-dir),
			var(--base-color) var(--gradient-position),
			var(--fill-color) var(--gradient-position),
			var(--fill-color) 100%
		);
		color: transparent;
		background-clip: text;
		-webkit-background-clip: text;
	}
</style>
