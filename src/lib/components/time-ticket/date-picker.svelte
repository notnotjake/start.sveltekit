<script lang="ts">
	import { IconChevronLeft, IconChevronRight, IconArrowBack } from '@tabler/icons-svelte'
	import {
		CalendarDate,
		startOfWeek,
		getLocalTimeZone,
		today,
		isSameDay
	} from '@internationalized/date'
	import { createClass } from '$utils/styles'

	let {
		selectedDate = $bindable(today(getLocalTimeZone())),
		onSelectedDateChange
	}: {
		selectedDate?: CalendarDate
		onSelectedDateChange?: (date: CalendarDate) => void
	} = $props()

	// Local state
	let currentVisibleMonth = $state(formatMonthYear(today(getLocalTimeZone())))
	let scrollElement: HTMLDivElement

	const todayDate = today(getLocalTimeZone())
	const todayWeekStart = startOfWeek(todayDate, 'en-US')

	function generateTwoWeekPeriod(weeksOffset: number) {
		const periodStart = todayWeekStart.add({ weeks: weeksOffset })

		const weeks = []
		for (let week = 0; week < 2; week++) {
			const weekStartDate = periodStart.add({ weeks: week })
			const weekDates = []

			for (let day = 0; day < 7; day++) {
				weekDates.push(weekStartDate.add({ days: day }))
			}
			weeks.push(weekDates)
		}

		return {
			startDate: periodStart,
			endDate: periodStart.add({ days: 13 }),
			weeks,
			weeksOffset
		}
	}

	// Generate all periods: 2 months back (~8 weeks) to 2 weeks forward
	const allPeriods = [-8, -6, -4, -2, 0, 2].map((offset) => generateTwoWeekPeriod(offset))

	const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

	function formatDate(date: CalendarDate) {
		return date.toDate(getLocalTimeZone()).toLocaleDateString('en-US', {
			weekday: 'short',
			month: 'short',
			day: 'numeric'
		})
	}

	function formatMonthYear(date: CalendarDate) {
		return date.toDate(getLocalTimeZone()).toLocaleDateString('en-US', {
			month: 'long',
			year: 'numeric'
		})
	}

	// Update visible month based on scroll position
	function handleScroll() {
		if (!scrollElement) return

		const scrollLeft = scrollElement.scrollLeft
		const containerWidth = scrollElement.offsetWidth
		const currentPeriodIndex = Math.round(scrollLeft / containerWidth)

		if (currentPeriodIndex >= 0 && currentPeriodIndex < allPeriods.length) {
			const currentPeriod = allPeriods[currentPeriodIndex]
			currentVisibleMonth = formatMonthYear(currentPeriod.startDate)
		}
	}

	function goToPrevious() {
		if (scrollElement) {
			const containerWidth = scrollElement.offsetWidth
			scrollElement.scrollBy({
				left: -containerWidth,
				behavior: 'smooth'
			})
		}
	}

	function goToNext() {
		if (scrollElement) {
			const containerWidth = scrollElement.offsetWidth
			scrollElement.scrollBy({
				left: containerWidth,
				behavior: 'smooth'
			})
		}
	}

	function goToToday() {
		selectedDate = todayDate
		onSelectedDateChange?.(todayDate)

		if (scrollElement) {
			const todayPeriodIndex = 4
			const containerWidth = scrollElement.offsetWidth
			scrollElement.scrollTo({
				left: todayPeriodIndex * containerWidth,
				behavior: 'smooth'
			})
		}
	}

	function selectDate(date: CalendarDate) {
		selectedDate = date
		onSelectedDateChange?.(date)
	}

	function getDateClasses(date: CalendarDate) {
		const isToday = isSameDay(date, todayDate)
		const isSelected = isSameDay(date, selectedDate)
		const isFuture = date.compare(todayDate) > 0

		return createClass(
			'relative h-12 w-full flex items-center justify-center text-[1.1rem] font-medium rounded-full transition-all cursor-pointer hover:bg-neutral-100 text-neutral-800 ',
			isSelected && 'bg-sky-300/20 text-blue-500 hover:bg-sky-300/30',
			isToday && 'text-blue-500',
			isFuture && 'text-neutral-500/80'
		)
	}

	// Initialize scroll position to today's period
	$effect(() => {
		if (scrollElement) {
			const todayPeriodIndex = 4
			const containerWidth = scrollElement.offsetWidth
			scrollElement.scrollLeft = todayPeriodIndex * containerWidth
		}
	})
</script>

<div
	class="shadow-card mx-auto mt-10 max-w-md overflow-hidden rounded-3xl border-1 border-neutral-200 bg-white"
>
	<!-- Header -->
	<div class="px-4 py-3">
		<div class="flex items-center justify-between">
			<!-- Left side - Month and Date -->
			<div>
				<p class="tracking-tight-sm text-xl font-semibold text-neutral-700">
					{formatDate(selectedDate)}
				</p>
			</div>

			<!-- Right side - Navigation -->
			<div class="flex items-center gap-2">
				<button
					onclick={goToToday}
					class="rounded-full bg-sky-200/15 p-2 transition-colors hover:bg-sky-300/20"
					aria-label="Go to today"
				>
					<IconArrowBack size={18} stroke={2.5} class="text-sky-600" />
				</button>

				<button
					onclick={goToPrevious}
					class="rounded-full p-2 transition-colors hover:bg-gray-100"
					aria-label="Previous period"
				>
					<IconChevronLeft size={21} stroke={2.5} class="text-gray-600" />
				</button>

				<button
					onclick={goToNext}
					class="rounded-full p-2 transition-colors hover:bg-gray-100"
					aria-label="Next period"
				>
					<IconChevronRight size={21} stroke={2.5} class="text-gray-600 " />
				</button>
			</div>
		</div>
	</div>

	<!-- Scrollable Calendar Container -->
	<div
		bind:this={scrollElement}
		onscroll={handleScroll}
		class="flex overflow-x-auto"
		style="scroll-snap-type: x mandatory; -ms-overflow-style: none; scrollbar-width: none;"
	>
		{#each allPeriods as period (period.weeksOffset)}
			<div class="min-w-full flex-shrink-0" style="scroll-snap-align: start;">
				<div class="h-full w-full p-4">
					<!-- Weekday Headers -->
					<div class="mb-2 grid grid-cols-7 gap-1">
						{#each weekdays as day}
							<div class="py-2 text-center text-[0.85rem] font-medium text-neutral-500 uppercase">
								{day}
							</div>
						{/each}
					</div>

					<!-- Date Grid -->
					<div class="space-y-1">
						{#each period.weeks as week, weekIndex}
							<div class="grid grid-cols-7 gap-1">
								{#each week as date}
									<button onclick={() => selectDate(date)} class={getDateClasses(date)}>
										{date.day}
										{#if isSameDay(date, todayDate)}
											<div
												class="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 transform rounded-full bg-current"
											></div>
										{/if}
									</button>
								{/each}
							</div>
						{/each}
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.overflow-x-auto::-webkit-scrollbar {
		display: none;
	}
</style>
