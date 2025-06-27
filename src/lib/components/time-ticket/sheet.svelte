<script>
	import Dialog from '$ui/container/dialog.svelte'
	import Button from '$ui/input/button.svelte'
	import { AlertDialog } from 'bits-ui'
	import { IconX } from '@tabler/icons-svelte'

	let {
		title = 'Edit',
		description = 'No description provided',
		children,
		trigger: passedTrigger
	} = $props()
</script>

<Dialog>
	{#snippet trigger()}
		{#if passedTrigger}
			{@render passedTrigger()}
		{:else}
			<Button as="div" style="primary" rounded="md">Open</Button>
		{/if}
	{/snippet}
	<div class="flex w-full flex-col gap-3">
		<div
			class="relative flex items-center justify-center border-b-1 border-neutral-300/50 px-2 py-3.5"
		>
			<AlertDialog.Title class="text-center text-[1.15rem] font-semibold text-neutral-800"
				>{title}</AlertDialog.Title
			>
			<div class="absolute top-0 right-3 flex h-full w-fit items-center justify-center">
				<AlertDialog.Cancel
					class="group rounded-full p-1 transition-all duration-100 hover:scale-110 hover:bg-neutral-200"
				>
					<IconX size={22} class="text-neutral-500 group-hover:text-black" />
				</AlertDialog.Cancel>
			</div>
		</div>

		<div class="flex flex-col gap-4 px-5 pb-2">
			<AlertDialog.Description class="px-3 text-[0.95rem]/5 font-[450] text-neutral-600"
				>{description}</AlertDialog.Description
			>

			{@render children?.()}

			<AlertDialog.Action
				><Button
					rounded="full"
					style="primary"
					class="mt-5 mb-3 w-full bg-blue-400 py-3 hover:bg-blue-500">Save Changes</Button
				></AlertDialog.Action
			>
		</div>
	</div>
</Dialog>
