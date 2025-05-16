<script lang="ts">
	import { IconClock, IconMessage, IconPackage, IconArrowsDiagonal } from '@tabler/icons-svelte'

	let cardOpen = $state<false | 'time' | 'message' | 'products'>('time')

	function toggleCard(name) {
		if (name === cardOpen) {
			cardOpen = false
		} else {
			cardOpen = name
		}
	}
</script>

<div class="h-full min-h-[100dvh] w-full">
	<div class="fixed top-0 right-0 h-[100dvh]">
		<div class="flex h-full w-fit items-center justify-center">
			{#if cardOpen !== false}
				<div class="min-h-80 min-w-60 rounded-3xl bg-neutral-800 px-3 py-2">
					<div class="flex items-center justify-between pl-1">
						<p class="text-[1.13rem] font-semibold text-neutral-50">Card Content</p>
						<IconArrowsDiagonal class="cursor-pointer text-neutral-50" />
					</div>
				</div>
			{/if}

			<div
				class="group flex min-h-40 min-w-18 items-center justify-end pr-0.5 pl-2 transition-all hover:pr-2"
			>
				<div
					class="flex flex-col items-center justify-center gap-3 rounded-full bg-neutral-100/0 p-1.5 ring-[0.5px] ring-neutral-200/0 transition-all group-hover:bg-neutral-100 group-hover:ring-neutral-200/80"
				>
					<div
						onclick={() => toggleCard('time')}
						class="cursor-pointer rounded-full bg-neutral-300/0 transition-all group-hover:p-1.5 hover:bg-neutral-300 hover:inset-shadow-sm"
					>
						<IconClock class="text-neutral-600 hover:text-neutral-800" size={21} />
					</div>
					<div
						onclick={() => toggleCard('message')}
						class="cursor-pointer rounded-full bg-neutral-300/0 transition-all group-hover:p-1.5 hover:bg-neutral-300 hover:inset-shadow-sm"
					>
						<IconMessage class="text-neutral-600 hover:text-neutral-800" size={21} />
					</div>
					<div
						onclick={() => toggleCard('products')}
						class="cursor-pointer rounded-full bg-neutral-300/0 transition-all group-hover:p-1.5 hover:bg-neutral-300 hover:inset-shadow-sm"
					>
						<IconPackage class="text-neutral-600 hover:text-neutral-800" size={21} />
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
