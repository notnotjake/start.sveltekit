<script lang="ts">
	let inputElement = $state(null)
	let measureElement = $state(null)
	let inputWidth = $state(100)
	let value = $state('') // Track input value

	function updateWidth() {
		if (measureElement && inputElement) {
			measureElement.textContent = value || inputElement.placeholder
			inputWidth = measureElement.offsetWidth
		}
	}

	$inspect(inputWidth)
</script>

<div class="flex h-full w-full flex-col items-center justify-center">
	<p class="py-2 font-medium tracking-tight text-neutral-500">
		Enter your phone or email to get started
	</p>
	<div
		class="group flex h-10 w-fit min-w-20 items-center justify-center rounded-full bg-neutral-800 transition-all duration-100 ease-out focus-within:scale-105 focus-within:bg-black"
	>
		<span
			bind:this={measureElement}
			class="invisible absolute px-6 font-medium tracking-tight whitespace-pre text-neutral-200"
			aria-hidden="true"
		></span>
		<input
			type="text"
			bind:this={inputElement}
			bind:value
			class="bg-transparent px-6 font-medium tracking-tight text-neutral-200 outline-none placeholder:text-neutral-300"
			placeholder="Phone or Email"
			oninput={updateWidth}
			style:width="{inputWidth}px"
		/>
	</div>
</div>
