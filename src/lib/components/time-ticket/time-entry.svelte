<script lang="ts">
	import { TimeRangeField, type TimeRange } from 'bits-ui'
	import { Time } from '@internationalized/date'
	import { IconHourglassFilled } from '@tabler/icons-svelte'

	let placeholderTime = $state(new Time(8, 30))

	let { timesValue } = $props()

	let duration = $derived.by(() => {
		console.log(timesValue.start)
		if (!timesValue.start || !timesValue.end) return null

		return timesValue.end.subtract(timesValue.start)
	})
</script>

<TimeRangeField.Root
	bind:placeholder={placeholderTime}
	bind:value={timesValue}
	granularity="minute"
	class="flex w-full justify-between"
>
	<TimeRangeField.Input
		type="start"
		class="shadow-card flex flex w-fit w-fit items-baseline overflow-hidden rounded-xl border-[1px] border-neutral-200/80 bg-neutral-100 bg-white px-1 py-1 focus-within:border-blue-500 focus-within:!bg-white focus-within:outline-1 focus-within:outline-blue-500 hover:bg-neutral-100"
	>
		{#snippet children({ segments })}
			{#each segments as { part, value }}
				{#if part === 'literal'}
					<TimeRangeField.Segment {part} class="text-xl font-semibold text-neutral-500">
						{value}
					</TimeRangeField.Segment>
				{:else if part === 'hour'}
					<TimeRangeField.Segment
						{part}
						class="rounded-lg pl-2 text-xl font-semibold text-neutral-600 transition-colors outline-none hover:text-neutral-900 focus:bg-sky-500/10 focus:text-blue-500"
					>
						{value}
					</TimeRangeField.Segment>
				{:else if part === 'minute'}
					<TimeRangeField.Segment
						{part}
						class="rounded-md pr-2 text-xl font-semibold text-neutral-600 transition-colors outline-none hover:text-neutral-900 focus:bg-sky-500/10 focus:text-blue-500"
					>
						{value}
					</TimeRangeField.Segment>
				{:else if part === 'dayPeriod'}
					<TimeRangeField.Segment
						{part}
						class="-ml-1.5 rounded-full px-2 font-[550] text-neutral-600 transition-colors outline-none focus-within:bg-sky-500/10 hover:text-neutral-900 focus:text-blue-500"
					>
						{value}
					</TimeRangeField.Segment>
				{/if}
			{/each}
		{/snippet}
	</TimeRangeField.Input>

	<div
		class="flex items-center justify-center gap-1 bg-gradient-to-r from-[#55BEFF]/0 via-[#55BEFF]/25 to-[#55BEFF]/0"
	>
		<div class="absolute"></div>
		<IconHourglassFilled size={19} stroke={2.5} class="text-blue-500" />
		{#if duration}
			<p class="text-[1.05rem] font-medium text-blue-500">{duration.hour}:{duration.minute} hrs</p>
		{:else}
			<p class="text-[1.05rem] font-medium text-rose-500">Error</p>
		{/if}
	</div>

	<TimeRangeField.Input
		type="end"
		class="shadow-card flex flex w-fit w-fit items-baseline overflow-hidden rounded-xl border-[1px] border-neutral-200/80 bg-neutral-100 bg-white px-1 py-1 focus-within:border-blue-500 focus-within:!bg-white focus-within:outline-1 focus-within:outline-blue-500 hover:bg-neutral-100"
	>
		{#snippet children({ segments })}
			{#each segments as { part, value }}
				{#if part === 'literal'}
					<TimeRangeField.Segment {part} class="text-xl font-semibold text-neutral-500">
						{value}
					</TimeRangeField.Segment>
				{:else if part === 'hour'}
					<TimeRangeField.Segment
						{part}
						class="rounded-lg pl-2 text-xl font-semibold text-neutral-600 transition-colors outline-none hover:text-neutral-900 focus:bg-sky-500/10 focus:text-blue-500"
					>
						{value}
					</TimeRangeField.Segment>
				{:else if part === 'minute'}
					<TimeRangeField.Segment
						{part}
						class="rounded-md pr-2 text-xl font-semibold text-neutral-600 transition-colors outline-none hover:text-neutral-900 focus:bg-sky-500/10 focus:text-blue-500"
					>
						{value}
					</TimeRangeField.Segment>
				{:else if part === 'dayPeriod'}
					<TimeRangeField.Segment
						{part}
						class="-ml-1.5 rounded-full px-2 font-[550] text-neutral-600 transition-colors outline-none focus-within:bg-sky-500/10 hover:text-neutral-900 focus:text-blue-500"
					>
						{value}
					</TimeRangeField.Segment>
				{/if}
			{/each}
		{/snippet}
	</TimeRangeField.Input>
</TimeRangeField.Root>
