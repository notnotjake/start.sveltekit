<script lang="ts">
	import { DropdownMenu, AlertDialog } from 'bits-ui'
	import { IconDots, IconPencil, IconTrash } from '@tabler/icons-svelte'

	let { data } = $props()

	function relativeTimeString(date: Date): string {
		const now = new Date()

		const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000)

		// Time intervals in seconds
		const intervals: Record<string, number> = {
			year: 365 * 24 * 60 * 60,
			month: 4 * 7 * 24 * 60 * 60,
			week: 7 * 24 * 60 * 60,
			day: 24 * 60 * 60,
			hour: 60 * 60,
			minute: 60,
			second: 1
		}

		// Check each interval
		for (const [unit, seconds] of Object.entries(intervals)) {
			const interval = Math.floor(secondsAgo / seconds)

			if (interval >= 1) {
				return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`
			}
		}
		return 'Just now'
	}

	let passkeysFormatted = null

	if (data.passkeys) {
		passkeysFormatted = data.passkeys.map((item) => {
			return {
				...item,
				relativeTime: relativeTimeString(item.createdAt)
			}
		})
	}

	function renamePasskey(passkeyId: string, newName: string): boolean {
		console.log(passkeyId)
		return true
	}

	function removePasskey(passkeyId: string): boolean {
		console.log(passkeyId)
		closeRemoveDialog()
		return true
	}

	// Track dialog state
	let dialogOpen = $state(false)
	let currentPasskey = $state(null)

	function openRemoveDialog(passkey) {
		currentPasskey = passkey
		dialogOpen = true
	}

	function closeRemoveDialog() {
		currentPasskey = null
		dialogOpen = false
	}
</script>

<div class="mx-auto mt-30 flex max-w-md flex-col items-center justify-center">
	<div class="w-full flex-col items-center justify-center px-7 py-5 text-center">
		<h2 class="tracking-tight-md animate-fade-in-scale text-[1.33rem] leading-loose font-[550]">
			Passkeys
		</h2>
	</div>

	<div class="flex w-full flex-col gap-1">
		{#if data.passkeys.length > 0}
			{#each passkeysFormatted as passkey}
				<div
					class="flex items-center gap-1 rounded-xl px-3 py-2 has-data-[state=open]:bg-neutral-100"
				>
					<div class="flex shrink-0 grow justify-between">
						<h1 class="font-medium">{passkey.name}</h1>
						<p class="text-neutral-600">Added {passkey.relativeTime}</p>
					</div>

					<div class="w-fit shrink grow-0 items-center">
						<DropdownMenu.Root>
							<DropdownMenu.Trigger
								class="aspect-square rounded-md px-1 outline-none hover:bg-neutral-100"
							>
								<IconDots size={18} color="var(--color-neutral-500)" />
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
												<IconPencil color="var(--color-neutral-200)" />
												<p class="px-1.5 font-medium text-neutral-200">Rename</p>
											</div>
										</button>
									</DropdownMenu.Item>
									<DropdownMenu.Item
										onSelect={() => openRemoveDialog(passkey)}
										class="outline-none"
									>
										<div
											class="group flex cursor-pointer gap-2 rounded-md px-2 py-1.5 pr-3 text-white hover:bg-rose-900/50"
										>
											<IconTrash color="var(--color-rose-500)" />
											<p class="px-1.5 font-medium text-rose-500 group-hover:text-rose-500">
												Remove Passkey
											</p>
										</div>
									</DropdownMenu.Item>
								</DropdownMenu.Content>
							</DropdownMenu.Portal>
						</DropdownMenu.Root>
					</div>
				</div>
			{/each}
		{:else}
			<div class="flex justify-between">
				<h1 class="font-medium">No Passkeys Found</h1>
			</div>
		{/if}
	</div>
</div>

<!-- Move the AlertDialog outside of the dropdown menu structure -->
{#if currentPasskey}
	<AlertDialog.Root bind:open={dialogOpen}>
		<AlertDialog.Portal>
			<AlertDialog.Overlay
				class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80"
			/>
			<AlertDialog.Content
				interactOutsideBehavior="close"
				class="shadow-popover data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-2xl border bg-neutral-100 p-7 outline-hidden sm:max-w-lg md:w-full "
			>
				<div class="flex flex-col gap-4 pb-6">
					<AlertDialog.Title class="text-lg font-semibold tracking-tight">
						Remove Passkey
					</AlertDialog.Title>
					<AlertDialog.Description class="text-foreground-alt text-sm">
						You're about to remove the passkey "{currentPasskey.name}"
						<div class="rounded-full bg-rose-100 px-3 py-1.5 text-rose-700">
							<span class="font-medium">Important</span>: You will no longer be able to login with
							this passkey
						</div>
					</AlertDialog.Description>
				</div>
				<div class="flex w-full items-center justify-center gap-2">
					<AlertDialog.Cancel
						class="grow rounded-2xl bg-neutral-200 py-4 font-medium text-neutral-800"
						>Cancel</AlertDialog.Cancel
					>
					<AlertDialog.Action
						class="grow rounded-2xl bg-red-500 py-4 font-semibold text-rose-100"
						onclick={() => removePasskey(currentPasskey.id)}
					>
						Delete
					</AlertDialog.Action>
				</div>
			</AlertDialog.Content>
		</AlertDialog.Portal>
	</AlertDialog.Root>
{/if}
