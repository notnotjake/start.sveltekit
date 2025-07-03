<script lang="ts">
	import { createClass } from '$utils/styles'

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
		'flex h-7 w-12 rounded-full p-[0.2rem] transition-all duration-200 disabled:cursor-not-allowed',
		classProp,
		checked ? 'bg-neutral-800' : 'bg-neutral-150',
		disabled && 'opacity-70'
	)}
>
	<!-- Invisible spacer element that grows/shrinks -->
	<div
		class={createClass('transition-all duration-200 ease-out', checked ? 'flex-grow' : 'w-0')}
	></div>
	<div class="aspect-square h-full rounded-full bg-white shadow-sm"></div>
</button>
