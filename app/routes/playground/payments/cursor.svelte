<script lang="ts">
	import { createPatternInput } from './pattern-input'

	let value = $state('')
	let pattern = '(###) ### ####'

	let length = $derived(value.length)

	let inputElement = $state()
	let cursor = $state(0)
	let end = $state(-1)

	let focus = $state(false)

	const { handleInput, handlePaste, formatValue } = createPatternInput()

	function updateCursor() {
		cursor = inputElement.selectionStart
		end = inputElement.selectionEnd ?? -1
	}
	function handleBlur() {
		focus = false
	}
	function handleFocus() {
		focus = true
	}
</script>

<svelte:document onselectionchange={updateCursor} />

<p>{cursor}</p>
<p>{end}</p>

<div class="relative h-fit w-fit">
	<input
		type="text"
		bind:this={inputElement}
		bind:value
		onblur={handleBlur}
		onfocus={handleFocus}
		placeholder="Card •••• ••••"
		maxlength="16"
		class="min-w-0 pl-4 outline-none focus:placeholder:text-neutral-900"
	/>

	{#if !focus && length > 0}
		<div
			class="pointer-events-none absolute top-0 left-0 flex h-full w-full items-center gap-1 bg-white pl-4"
		>
			{#each Array(length) as _, i}
				<div class="h-1 w-1 rounded-full bg-neutral-900"></div>
			{/each}
		</div>
	{/if}
</div>
