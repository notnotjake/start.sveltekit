<script lang="ts">
	import { createClass } from '$utils/styles'
	import { IconChevronLeft, IconChevronRight } from '@tabler/icons-svelte'
</script>

<div class="w-full px-2 py-5">
	<div>
		<div class="flex justify-between px-4">
			<p class="text-[1.4rem] font-semibold">June</p>
			<div class="flex items-center gap-3">
				<button><IconChevronLeft size={32} stroke={2.25} /></button>
				<button><IconChevronRight size={32} stroke={2.25} /></button>
			</div>
		</div>

		<div class="flex flex-col gap-3 px-4 py-5">
			<div class="flex justify-between gap-1">
				<p class="text-[0.9rem] font-medium text-neutral-500">SUN</p>
				<p class="text-[0.9rem] font-medium text-neutral-500">MON</p>
				<p class="text-[0.9rem] font-medium text-neutral-500">TUE</p>
				<p class="text-[0.9rem] font-medium text-neutral-500">WED</p>
				<p class="text-[0.9rem] font-medium text-neutral-500">THU</p>
				<p class="text-[0.9rem] font-medium text-neutral-500">FRI</p>
				<p class="text-[0.9rem] font-medium text-neutral-500">SAT</p>
			</div>
			<div class="flex justify-between gap-1">
				{@render day({ number: '4' })}
				{@render day({ number: '5', hasTicket: true })}
				{@render day({ number: '6', hasTicket: true })}
				{@render day({ number: '7', hasTicket: true })}
				{@render day({ number: '8', hasTicket: true })}
				{@render day({ number: '9', hasTicket: true })}
				{@render day({ number: '10' })}
			</div>
			<div class="flex justify-between gap-1">
				{@render day({ number: '11' })}
				{@render day({ number: '12', hasTicket: true })}
				{@render day({ number: '13', isSelected: true })}
				{@render day({ number: '14', isToday: true })}
				{@render day({ number: '15', isFuture: true })}
				{@render day({ number: '16', isFuture: true })}
				{@render day({ number: '17', isFuture: true })}
			</div>
		</div>
	</div>
</div>

{#snippet day({ number, hasTicket, isToday, isFuture, isSelected })}
	<div
		class={createClass(
			'flex aspect-square w-full flex-col items-center justify-center rounded-full',
			isFuture && 'opacity-50',
			isToday && isSelected && 'bg-rose-500/20',
			isSelected && 'bg-blue-500/25'
		)}
	>
		<p
			class={createClass(
				'text-[1.2rem] font-medium text-neutral-800',
				isToday && 'text-rose-500',
				isSelected && 'text-blue-500'
			)}
		>
			{number}
		</p>
		{#if hasTicket}
			<div class="h-2 w-3.5 rounded-full bg-gradient-to-t from-sky-500 to-sky-300 shadow-sm"></div>
		{/if}
	</div>
{/snippet}
