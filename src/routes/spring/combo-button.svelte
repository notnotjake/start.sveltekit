<script>
	import { DropdownMenu } from 'bits-ui'
	import { IconChevronDown, IconPlus } from '@tabler/icons-svelte'
	import Button from '$ui/input/button.svelte'
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class="flex aspect-square h-9 w-fit items-center justify-center rounded-full bg-neutral-200 px-1 text-neutral-900 outline-none"
	>
		<IconPlus size={21} stroke={2.5} />
	</DropdownMenu.Trigger>
	<DropdownMenu.Portal>
		<DropdownMenu.Content
			class="shadow-card rounded-xl bg-neutral-900 p-1.5 outline-none"
			side="right"
			sideOffset={8}
			collisionPadding={8}
			align="start"
		>
			<DropdownMenu.Item class="outline-none">
				<button class="w-full">
					<div
						class="flex cursor-pointer gap-2 rounded-md px-2 py-1.5 pr-3 text-white hover:bg-neutral-600/80"
					>
						<p class="px-1.5 font-medium text-neutral-200">5m</p>
					</div>
				</button>
			</DropdownMenu.Item>
			<DropdownMenu.Item class="outline-none">
				<button class="w-full">
					<div
						class="flex cursor-pointer gap-2 rounded-md px-2 py-1.5 pr-3 text-white hover:bg-neutral-600/80"
					>
						<p class="px-1.5 font-medium text-neutral-200">10m</p>
					</div>
				</button>
			</DropdownMenu.Item>
			<DropdownMenu.Item class="outline-none">
				<button class="w-full">
					<div
						class="flex cursor-pointer gap-2 rounded-md px-2 py-1.5 pr-3 text-white hover:bg-neutral-600/80"
					>
						<p class="px-1.5 font-medium text-neutral-200">15m</p>
					</div>
				</button>
			</DropdownMenu.Item>
			<DropdownMenu.Item class="outline-none">
				<div
					class="group flex cursor-pointer gap-2 rounded-md px-2 py-1.5 pr-3 text-white hover:bg-blue-400/30"
				>
					<p class="px-1.5 font-medium text-blue-400 group-hover:text-blue-500">Custom</p>
				</div>
			</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Portal>
</DropdownMenu.Root>
