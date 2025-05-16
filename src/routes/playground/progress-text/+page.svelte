<script lang="ts">
	import { ProgressText } from '$ui/feedback/progress'
	import { tweened } from 'svelte/motion'
	import { cubicOut } from 'svelte/easing'

	// State for the demo
	let percent = 30

	// Function to increase the progress
	function increaseProgress() {
		percent = Math.min(100, percent + 10)
	}

	// Function to decrease the progress
	function decreaseProgress() {
		percent = Math.max(0, percent - 10)
	}
</script>

<div class="flex flex-col items-center gap-6 p-8">
	<ProgressText
		value={percent}
		max={55}
		direction="up"
		fillColor="var(--color-neutral-700)"
		class="py-[0.5em] text-5xl font-bold tracking-tight">Connecting to Base</ProgressText
	>

	<input type="range" bind:value={percent} />
</div>
