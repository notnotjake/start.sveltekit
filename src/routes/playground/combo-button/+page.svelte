<script>
	import { DropdownMenu } from 'bits-ui'
	import { IconChevronDown } from '@tabler/icons-svelte'
	import Button from '$ui/input/button.svelte'
</script>

<div
	class="shadow-card flex h-9 overflow-hidden rounded-xl border-[1px] border-neutral-200/80 bg-white"
>
	<Button
		resetStyles
		class="h-full px-3 font-medium text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
		>Copy</Button
	>
	<div class="h-full w-[2px] bg-neutral-100"></div>
	<DropdownMenu.Root>
		<DropdownMenu.Trigger
			class="flex h-full items-center justify-center px-1 text-neutral-700 outline-none hover:bg-neutral-100"
		>
			<IconChevronDown size={20} />
		</DropdownMenu.Trigger>
		<DropdownMenu.Portal>
			<DropdownMenu.Content
				class="shadow-card rounded-xl bg-neutral-900 p-1.5 outline-none"
				sideOffset={8}
				collisionPadding={8}
				align="start"
			>
				<DropdownMenu.Item class="outline-none">
					<button class="w-full" on:click={() => renamePasskey(passkey.id, 'TestName')}>
						<div
							class="flex cursor-pointer gap-2 rounded-md px-2 py-1.5 pr-3 text-white hover:bg-neutral-600/80"
						>
							<p class="px-1.5 font-medium text-neutral-200">Rename</p>
						</div>
					</button>
				</DropdownMenu.Item>
				<DropdownMenu.Item onSelect={() => openRemoveDialog(passkey)} class="outline-none">
					<div
						class="group flex cursor-pointer gap-2 rounded-md px-2 py-1.5 pr-3 text-white hover:bg-rose-900/50"
					>
						<p class="px-1.5 font-medium text-rose-500 group-hover:text-rose-500">Remove Passkey</p>
					</div>
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Portal>
	</DropdownMenu.Root>
</div>
