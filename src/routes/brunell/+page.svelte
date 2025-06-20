<script lang="ts">
	import { Time } from '@internationalized/date'

	import TimeEditor from './time-editor.svelte'
	import AMorPM from './select-am-pm.svelte'
	import TimeEntry from './time-entry.svelte'
	import ClockInput from './time-entry-new.svelte'
	import SuspenseText from '$ui/feedback/suspense-text.svelte'
	import Button from '$ui/input/button.svelte'
	import AddBreak from './combo-button.svelte'

	import DatePicker from './date-picker.svelte'

	import TimeRange from '$bits/time-ticket/time-entry.svelte'

	import {
		IconCircleArrowRight,
		IconRotate,
		IconRotateClockwise,
		IconBubbleText,
		IconMapPinFilled,
		IconCirclePlusFilled,
		IconCalendarWeekFilled,
		IconCarFilled,
		IconMugFilled,
		IconPlus,
		IconPackage,
		IconCheck,
		IconHourglassFilled,
		IconX,
		IconListCheck,
		IconClipboardCheck
	} from '@tabler/icons-svelte'

	let expanded = $state(false)
	function expand() {
		expanded = !expanded
	}

	let timeRangeValue = $state({
		start: new Time(8, 30),
		end: new Time(4, 15)
	})

	let tickets = $state({
		job: {
			name: 'Redwood Park',
			location: 'Lot 12B',
			customer: 'RCI Builders'
		},
		date: new Date(),
		person: null,
		startTime: '08:30',
		endTime: '16:15',
		breaks: [12],
		travel: {
			type: 'miles',
			val: 24
		},
		materials: [
			{
				name: '2GIG Wall Panel',
				unit: 'whole',
				qty: 1
			}
		],
		work: ['Installed new wall panel']
	})
</script>

<div class="my-1 min-h-[50svh] w-full rounded-3xl bg-white pt-28">
	<div
		class="fixed top-0 z-10 w-full border-b-1 border-neutral-100 bg-white/80 px-4 py-2 backdrop-blur-xs"
	>
		<div class="mx-auto flex w-full max-w-2xl items-center justify-between gap-3">
			<div
				class="flex h-full items-center justify-center rounded-full bg-neutral-100 px-3 py-3 text-lg font-medium text-neutral-700"
			>
				<IconX stroke={2.5} />
			</div>
			<div class="flex gap-2">
				<div
					class="flex h-full items-center justify-center rounded-full bg-neutral-100 px-6 py-3 text-lg font-semibold text-neutral-600 hover:bg-sky-500/10 hover:text-blue-500"
				>
					Add Another
				</div>
				<div
					class="flex h-full items-center justify-center rounded-full bg-gradient-to-b from-sky-500 to-sky-400/80 px-6 py-3 text-lg font-semibold text-sky-50"
				>
					Save
				</div>
			</div>
		</div>
	</div>

	<div class="mx-auto mb-3 flex max-w-2xl flex-col gap-4 px-3">
		<div
			class="flex w-fit items-center gap-1 rounded-full bg-gradient-to-b from-neutral-200/50 to-neutral-200/80 px-4 py-2"
		>
			<IconMapPinFilled size={22} class="text-emerald-500" />
			<p class="text-[1.15rem] font-medium tracking-tight whitespace-nowrap">
				Redwook Park <span class="font-medium text-black">Lot 12B</span>
				<span class="text-[0.9rem] font-light opacity-70">RCI Builders</span>
			</p>
		</div>

		<div class="relative w-full max-w-full" onclick={expand}>
			<div
				class="flex w-fit items-center gap-1 rounded-full bg-gradient-to-b from-neutral-200/50 to-neutral-200/80 px-4 py-2"
			>
				<IconCalendarWeekFilled size={22} class="text-rose-600" />
				<p class="text-[1.15rem] font-semibold">Today</p>
			</div>

			{#if expanded}
				<div class="fixed inset-0 z-20 h-full w-full bg-black/10"></div>
				<div class="absolute inset-0 z-30 h-fit w-full rounded-3xl bg-white">
					<DatePicker />
				</div>
			{/if}
		</div>
	</div>

	<div class="mx-auto mt-9 max-w-2xl pl-4">
		<div class="flex justify-between px-3 py-2">
			<div class="flex items-center gap-2">
				<div
					class="flex aspect-square h-8 items-center justify-center rounded-full bg-gradient-to-b from-amber-500 to-amber-600 shadow-sm"
				>
					<p class="font-semibold text-white">TJ</p>
				</div>
				<p class="text-lg font-medium text-neutral-500">Just you</p>
			</div>
			<Button class="bg-sky-300/20 px-4 py-2">
				<div class="flex items-center gap-1">
					<IconPlus size={20} stroke={3} class="text-sky-600" />
					<p class="text-[1rem] text-sky-600">Add Crew</p>
				</div>
			</Button>
		</div>
	</div>

	<div class="mx-auto mb-7 max-w-2xl px-3">
		<div class="w-full px-1">
			<div class="flex w-full flex-col rounded-2xl bg-neutral-100 px-3 py-2.5">
				<div class="flex justify-between px-3 font-medium opacity-70">
					<p>Start</p>
					<p>End</p>
				</div>

				<div class="w-full">
					<TimeRange timesValue={timeRangeValue} />
				</div>

				<div class="my-4 h-[1.5px] w-full bg-neutral-300/80"></div>

				<div class="flex">
					<div class="flex w-full gap-2">
						<div class="flex w-fit items-center gap-1 rounded-full bg-neutral-400/25 pr-2 pl-2">
							<IconMugFilled size={21} class="text-purple-500" />
							<p class="text-[1.1rem] font-medium opacity-70">12 mins</p>
						</div>
						<div class="flex w-fit items-center gap-1 rounded-full bg-neutral-400/25 pr-2 pl-2">
							<IconCarFilled size={21} class="text-green-500" />
							<p class="text-[1.1rem] font-medium opacity-70">24 miles</p>
						</div>
					</div>
					<div>
						<IconCirclePlusFilled class="text-neutral-600" size={27} />
					</div>
				</div>
			</div>
		</div>
	</div>

	<div
		class="flex w-full snap-x snap-mandatory gap-5 overflow-x-scroll bg-neutral-200 px-4 pt-6 pb-30"
	>
		<div class="shrink-0 snap-center rounded-3xl bg-white">
			<div class="flex items-center justify-between px-2 py-2">
				<div class="flex items-center gap-2">
					<div class="w-fit rounded-full bg-gradient-to-b from-amber-500 to-amber-700 p-1.5">
						<IconPackage size={24} stroke={2} class="text-white" />
					</div>
					<h3 class="text-[1.45rem] font-semibold tracking-tight">Materials</h3>
				</div>
				<Button style="ghost" class="flex items-center justify-center gap-1 bg-sky-300/20 px-4"
					><IconPlus size={24} stroke={3} class="text-sky-600" /></Button
				>
			</div>
			<div class="px-4 pb-6">
				<div class="">
					<p class="py-10 text-center text-xl font-semibold text-black/40">
						It's looking pretty empty
					</p>
				</div>
			</div>
		</div>

		<div class="shrink-0 snap-center rounded-3xl bg-white">
			<div class="flex items-center justify-between px-2 py-2">
				<div class="flex items-center gap-2">
					<div class="w-fit rounded-full bg-gradient-to-b from-green-400 to-green-600 p-1.5">
						<IconClipboardCheck size={24} stroke={2} class="text-white" />
					</div>
					<h3 class="text-[1.45rem] font-semibold tracking-tight">Work Done</h3>
				</div>
				<Button style="ghost" class="flex items-center justify-center gap-1 bg-sky-300/20 px-4"
					><IconPlus size={24} stroke={3} class="text-sky-600" /></Button
				>
			</div>
			<div class="px-4 pb-6">
				<div class="">
					<p class="py-10 text-center text-xl font-semibold text-black/40">
						It's looking pretty empty
					</p>
				</div>
			</div>
		</div>
	</div>
</div>

{#snippet tick()}
	<span class="relative inline-block h-full w-[3px] rounded-full bg-black/15"></span>
{/snippet}
