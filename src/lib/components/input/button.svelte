<script lang="ts">
	import type { Snippet, Component } from 'svelte'
	import { createClass } from '$utils/create-class'
	import { Suspense } from '$ui/feedback'

	type Props = {
		children: Snippet
		icon?: Component | HTMLElement
		onClick?: () => void
		suspense?: boolean
		class?: string
		variant?: string
		size?: string
		role?: string
		disabled?: boolean
		type?: 'button' | 'submit'
	}
	let {
		children,
		icon: Icon,
		onClick,
		suspense = false,
		class: classProp,
		variant,
		size,
		role,
		disabled,
		type = 'button'
	}: Props = $props()

	const variants = {
		base: 'relative flex items-center',
		variant: {
			primary: '',
			secondary: '',
			outline: '',
			ghost: ''
		},
		size: {
			sm: '',
			md: '',
			lg: ''
		},
		role: {
			success: '',
			destructive: ''
		}
	}
</script>

<div class="relative flex w-full shrink-1 grow basis-1 flex-col items-center">
	<button
		{type}
		{disabled}
		onclick={() => {
			suspense = !suspense
		}}
		class="hover:bg-neutral-150 relative m-auto flex h-11 w-full max-w-full cursor-pointer items-center justify-center gap-1 rounded-[0.9rem] border-none bg-neutral-100 px-4 font-[450] text-zinc-900 transition-colors duration-150 outline-none"
	>
		{#if suspense}
			<Suspense.Spinner size={16} />
		{:else}
			<Icon />
		{/if}
		{@render children?.()}
	</button>
</div>
