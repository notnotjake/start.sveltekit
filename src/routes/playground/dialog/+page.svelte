<script>
	import Dialog from '$ui/container/dialog.svelte'
	import Button from '$ui/input/button.svelte'
	import { AlertDialog } from 'bits-ui'
	import { IconX } from '@tabler/icons-svelte'
</script>

<Dialog>
	{#snippet trigger()}
		<Button as="div" style="primary" rounded="md">Change Name</Button>
	{/snippet}
	<div class="flex w-full flex-col gap-3">
		<div
			class="relative flex items-center justify-center border-b-1 border-neutral-300/50 px-2 py-3.5"
		>
			<AlertDialog.Title class="text-center text-[1.15rem] font-semibold text-neutral-800"
				>Edit Wallet</AlertDialog.Title
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
			<AlertDialog.Description
				>Change your wallet's name and create an icon with a unique color and emoji or icon</AlertDialog.Description
			>
			<div class="aspect-square w-full rounded-lg bg-neutral-200"></div>
			<Button rounded="md" style="primary" class="bg-blue-400 py-3 hover:bg-blue-500"
				>Save Changes</Button
			>

			<AlertDialog.Action>Save Changes</AlertDialog.Action>
		</div>
	</div>
</Dialog>
