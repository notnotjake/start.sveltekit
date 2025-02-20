<script>
	import { Spring } from 'svelte/motion'

	// Create a new Spring instance
	const width = new Spring(100, {
		stiffness: 0.09,
		damping: 0.27
	})

	// Prototyping
	let stiffness = $state(0.09)
	let damping = $state(0.27)

	$effect(() => {
		width.stiffness = stiffness
	})
	$effect(() => {
		width.damping = damping
	})

	let isExpanded = $state(false)
	function toggleWidth() {
		console.log('ran')
		isExpanded = !isExpanded
		width.target = isExpanded ? 200 : 100
	}

	let copyText = $state('Copy')
	function copy() {
		const config = {
			stiffness: Number(stiffness.toFixed(3)),
			damping: Number(damping.toFixed(3))
		}

		// Convert to formatted string
		const text = JSON.stringify(config, null, 2)

		// Copy to clipboard
		navigator.clipboard
			.writeText(text)
			.then(() => {
				// Optional: Add some feedback that it was copied
				const originalText = copyText
				copyText = 'Copied!'

				// Reset button text after 2 seconds
				setTimeout(() => {
					copyText = originalText
				}, 2000)
			})
			.catch((err) => {
				console.error('Failed to copy:', err)
			})
	}
</script>

<div style:width={`${width.current}px`} class="h-10 min-w-1 rounded-full bg-stone-200"></div>

<div class="w-80">
	<div
		class=" shadow-box my-4 flex h-fit min-h-40 w-full flex-col items-center justify-evenly gap-2 rounded-[1.1rem] bg-white py-4 ring-1 ring-neutral-200/70"
	>
		<button
			onclick={toggleWidth}
			class="cursor-pointer rounded-full bg-sky-100 px-3 py-1 font-medium text-blue-500"
			>Expand</button
		>
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

	<div class="h-fit rounded-lg bg-neutral-800 px-6 py-4">
		<pre class="text-green-500">
<span class="text-neutral-400">{'{'}</span>
	<span class="font-medium text-rose-400">stiffness:</span> {stiffness.toFixed(3)},
	<span class="font-medium text-rose-400">damping:</span> {damping.toFixed(3)}
<span class="text-neutral-400">{'}'}</span></pre>
		<button onclick={copy} class="w-full cursor-pointer text-center font-medium text-neutral-300"
			>{copyText}</button
		>
	</div>
</div>
