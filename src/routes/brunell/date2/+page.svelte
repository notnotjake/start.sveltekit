<script lang="ts">
	import { createClass } from '$utils/styles'
	import { IconChevronLeft, IconChevronRight } from '@tabler/icons-svelte'
</script>

<div class="w-full px-2">
	<div>
		<div class="flex justify-between px-4">
			<p class="text-[1.4rem] font-semibold">June</p>
			<div class="flex items-center gap-3">
				<button><IconChevronLeft size={38} stroke={2.25} /></button>
				<button><IconChevronRight size={38} stroke={2.25} /></button>
			</div>
		</div>

		<div class="border-t-1 border-b-1 border-neutral-300 bg-neutral-100 px-4 py-2 inset-shadow-sm">
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
				{@render day({ number: '4', hasTicket: true })}
				{@render day({ number: '5', hasTicket: true })}
				{@render day({ number: '6', hasTicket: true })}
				{@render day({ number: '7', hasTicket: true })}
				{@render day({ number: '8', hasTicket: true })}
				{@render day({ number: '9', hasTicket: true })}
				{@render day({ number: '10', hasTicket: true })}
			</div>
			<div class="flex justify-between gap-1">
				{@render day({ number: '11', hasTicket: true })}
				{@render day({ number: '12', hasTicket: true })}
				{@render day({ number: '13', hasTicket: true })}
				{@render day({ number: '14', isToday: true })}
				{@render day({ number: '15', isFuture: true })}
				{@render day({ number: '16', isFuture: true })}
				{@render day({ number: '17', isFuture: true })}
			</div>
		</div>
	</div>
</div>

{#snippet day({ number, hasTicket, isToday, isFuture })}
	<div
		class={createClass(
			'flex aspect-square w-full flex-col items-center rounded-xl',
			isFuture && 'opacity-50',
			isToday && 'bg-rose-500/20',
			hasTicket && 'bg-gradient-to-b from-sky-300/30 to-sky-400/40'
		)}
	>
		<p
			class={createClass('text-[1.2rem] font-medium text-neutral-800', isToday && 'text-rose-500')}
		>
			{number}
		</p>
	</div>
{/snippet}
