<script lang="ts">
	import { NavigationMenu, DropdownMenu } from 'bits-ui'
	import { createClass } from '$utils/styles'
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger class="outline-none">
		<p
			class="rounded-md px-2.5 py-1 text-[0.85rem] tracking-tight text-neutral-500 hover:bg-neutral-200 hover:text-black"
		>
			Help
		</p>
	</DropdownMenu.Trigger>

	<DropdownMenu.Portal>
		<DropdownMenu.Content
			class="shadow-card rounded-xl bg-neutral-900/60 p-1.5 outline-none"
			sideOffset={8}
			collisionPadding={8}
			align="center"
			side="top"
		>
			<DropdownMenu.Item class="outline-none">
				<button class="w-full">
					<div
						class="flex cursor-pointer gap-2 rounded-md px-2 py-1.5 pr-3 text-white hover:bg-neutral-300/20"
					>
						<p class="px-1.5 font-medium text-white">Recover Account</p>
					</div>
				</button>
			</DropdownMenu.Item>
			<DropdownMenu.Separator />
			<DropdownMenu.Item class="outline-none">
				<button class="w-full">
					<div
						class="flex cursor-pointer gap-2 rounded-md px-2 py-1.5 pr-3 text-white hover:bg-neutral-300/20"
					>
						<p class="px-1.5 font-medium text-white">Contact Support</p>
					</div>
				</button>
			</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Portal>
</DropdownMenu.Root>
