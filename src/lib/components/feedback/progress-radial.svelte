<script lang="ts">
	import { onMount, onDestroy } from 'svelte'

	let {
		totalTime = 30,
		currentTime = 0,
		size = '0.8rem',
		bgColor = '#e5e7eb',
		fillColor = 'hsla(216, 23%, 28%, 0.8)'
	} = $props()

	let mounted = $state(false)
	let progress = $state(0)
	let startTime = $state()
	let rafId = $state()

	function animate(timestamp) {
		if (!startTime) {
			startTime = timestamp - currentTime * 1000 // Adjust for currentTime
		}

		const elapsed = (timestamp - startTime) / 1000
		progress = (elapsed / totalTime) * 100

		if (elapsed >= totalTime) {
			mounted = false
			return
		}

		rafId = requestAnimationFrame(animate)
	}

	onMount(() => {
		mounted = true
		rafId = requestAnimationFrame(animate)
	})

	onDestroy(() => {
		if (rafId) cancelAnimationFrame(rafId)
	})
</script>

{#if mounted}
	<div class="flex items-center">
		<div
			class="pie grid place-items-center rounded-full"
			style:width={size}
			style:height={size}
			style:--bg={bgColor}
			style:--fill={fillColor}
			style:--progress={progress}
		></div>
		<div class="pl-0.5 font-mono text-[0.8rem] font-medium">
			{Math.ceil(totalTime - (progress / 100) * totalTime)}s
		</div>
	</div>
{/if}

<style>
	.pie {
		background: conic-gradient(var(--fill) calc((100 - var(--progress, 0)) * 1%), var(--bg) 0);
	}
</style>
