<script>
	import { AlertDialog } from 'bits-ui'
	import { createClass } from '$utils/styles'
	import { flyScale } from '$lib/ui/transition'
	import { fade } from 'svelte/transition'

	let {
		children,
		trigger,
		isOpen = false,
		class: classProp,
		overlayClass,
		onOpenChange: onOpenChangeHandler
	} = $props()
</script>

<AlertDialog.Root bind:open={isOpen} onOpenChange={onOpenChangeHandler} class="outline-none">
	<AlertDialog.Trigger class="outline-none">
		{#if trigger}
			{@render trigger?.()}
		{/if}
	</AlertDialog.Trigger>
	<AlertDialog.Portal>
		<AlertDialog.Overlay
			forceMount
			class={createClass('fixed inset-0 z-50 bg-black/50 outline-none', overlayClass)}
		>
			{#snippet child({ props, open })}
				{#if open}
					<div {...props} in:fade={{ duration: 150 }} out:fade={{ duration: 150, delay: 50 }}></div>
				{/if}
			{/snippet}
		</AlertDialog.Overlay>

		<AlertDialog.Content
			forceMount
			interactOutsideBehavior="close"
			preventScroll={true}
			class={createClass(
				'fixed top-[50%] left-[50%] z-50 flex w-md max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-2xl bg-neutral-100 shadow-sm outline-none sm:max-w-lg md:w-sm',
				classProp
			)}
		>
			{#snippet child({ props, open })}
				{#if open}
					<div
						{...props}
						in:flyScale={{ duration: 125, delay: 80, y: 30, scale: 0.9, opacity: 0 }}
						out:flyScale={{ duration: 100, delay: 0, y: 15, scale: 0.97, opacity: 0 }}
					>
						{@render children?.()}
					</div>
				{/if}
			{/snippet}
		</AlertDialog.Content>
	</AlertDialog.Portal>
</AlertDialog.Root>
