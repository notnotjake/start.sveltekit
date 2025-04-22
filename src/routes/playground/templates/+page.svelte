<script lang="ts">
	import { onMount } from 'svelte'

	let size = $state(1)

	let title = $state('We Make Yard Good')
</script>

<div class="flex flex-col items-center justify-center">
	<h1 class="text-lg text-neutral-900">Edit your Template</h1>
	<p class="text-neutral-600">Click on any text to edit</p>
</div>

<div class="aspect-[1.5] max-h-[80vh] min-w-[80%] bg-neutral-100">
	<div class="relative overflow-hidden">
		<div class="mt-4 flex items-center justify-center">
			<input
				style:width={`${size}px`}
				class="block px-2 py-1 text-2xl font-medium text-green-600"
				type="text"
				bind:value={title}
			/>
			<span
				class="pointer-events-none absolute px-2 py-1 text-2xl font-medium text-green-600 opacity-0"
				bind:offsetWidth={size}>{title}</span
			>
		</div>
	</div>
</div>

<div>
	<h2>Form Output</h2>
	<p>Title: <span class="font-mono">{title}</span></p>
</div>
