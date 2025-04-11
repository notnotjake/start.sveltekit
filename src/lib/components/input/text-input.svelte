<script lang="ts">
	import type { Snippet } from 'svelte'
	import { createClass } from '$utils/create-class'

	import Arrow from '$ui/icons/arrow-circle-fill.svelte'
	import { Suspense } from '$ui/feedback'

	let errors = $state()

	let {
		value = $bindable(),
		withButton = true,
		submits = false,
		onSubmit,
		containerClass,
		inputClass,
		label,
		labelClass,
		disabled,
		buttonDisabled,
		error = false,
		message,
		delayed = false,
		timeout = false,
		elementLeft,
		elementRight,
		ref = $bindable(),
		...restProps
	}: {
		value: string
		withButton: boolean
		submits: boolean
		onSubmit: () => void
		containerClass: string
		inputClass: string
		label: string
		labelClass: string
		disabled: boolean
		buttonDisabled: boolean
		message: string | null
		error: string | boolean
		delayed: boolean
		timeout: boolean
		elementLeft: Snippet
		elementRight: Snippet
		ref: HTMLButtonElement
		[key: string]: any
	} = $props()
</script>

<div
	class={createClass(
		'group relative flex h-12 w-full items-center overflow-hidden rounded-[0.9rem] bg-neutral-100 ring-1 ring-neutral-100 focus-within:ring-2 focus-within:ring-blue-500',
		containerClass
	)}
>
	{#if elementLeft}
		{@render elementLeft?.()}
	{/if}

	<input
		bind:value
		{disabled}
		{...restProps}
		class={createClass(
			'h-full w-full flex-grow-1 pr-2 pl-4 font-[450] text-zinc-900 transition-all outline-none selection:bg-sky-200 selection:text-blue-600 placeholder:font-normal placeholder:text-neutral-500',
			inputClass
		)}
	/>

	{#if elementRight}
		{@render elementRight?.()}
	{:else}
		<button
			type={submits ? 'submit' : 'button'}
			disabled={buttonDisabled}
			onclick={onSubmit}
			aria-label="Continue"
			class={createClass(
				'group flex h-full shrink-0 flex-nowrap items-center justify-end px-2 transition-all duration-200',
				error ? 'cursor-[w-resize]' : 'cursor-pointer'
			)}
		>
			{#if error}
				<p
					class="animate-fade-in-scale-right pointer-events-none cursor-[w-resize] rounded-full bg-rose-100 px-3 py-1 text-[0.83rem] font-medium text-rose-600"
				>
					{error}
				</p>
			{:else if delayed && !timeout}
				<div class="flex h-full items-center px-3">
					<Suspense.Spinner size={18} thickness={7} />
				</div>
			{:else}
				<Arrow
					class="bi bi-arrow-right-circle-fill mr-1 h-6 w-6 cursor-pointer p-[0.1rem] text-blue-500 transition-colors duration-300 ease-in-out group-disabled:text-neutral-500/80"
				/>
			{/if}
		</button>
	{/if}
</div>
