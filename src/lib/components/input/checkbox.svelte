<script lang="ts">
	import { createClass } from '$utils/create-class'
	import { fade, scale } from 'svelte/transition'
	import Checkmark from '$ui/icons/checkmark-nofill.svelte'

	type Props = {
		checked?: boolean
		onChange?: () => void
		name?: string
		submits?: boolean
		disabled?: boolean
		required?: boolean
		class?: string
		ref?: HTMLButtonElement
	}
	let {
		checked = $bindable(),
		onChange,
		name,
		submits = false,
		required = false,
		disabled = false,
		class: classProp,
		ref = $bindable()
	}: Props = $props()

	function handleToggle() {
		checked = !checked
		onChange()
	}
</script>

{#if name}
	<select class="hidden" {name} bind:value={checked} {disabled} {required}>
		<option value={true}>on</option>
		<option value={false}>off</option>
	</select>
{/if}

<button
	type={submits ? 'submit' : 'button'}
	onclick={handleToggle}
	{disabled}
	bind:this={ref}
	class={createClass(
		'flex h-7 w-7 items-center justify-center rounded-lg p-[0.2rem] transition-all duration-100 disabled:cursor-not-allowed',
		classProp,
		checked
			? 'border-2 border-neutral-800 bg-neutral-800'
			: 'border-2 border-neutral-300 bg-neutral-100',
		disabled && 'opacity-70'
	)}
>
	{#if checked}
		<div in:scale={{ duration: 150 }} class="flex items-center justify-center">
			<Checkmark class="text-neutral-100" />
		</div>
	{/if}
</button>
