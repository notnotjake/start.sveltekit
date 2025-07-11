<script lang="ts">
	import Button from '$ui/input/button.svelte'
	import AdaptingContainer from '$ui/container/adapting.svelte'
	import { IconCircleArrowRightFilled, IconChevronRight } from '@tabler/icons-svelte'

	import DateHeader from './date-header.svelte'
	let group = 'test'
</script>

<div class="p-5">
	<div
		class="shadow-card w-fit rounded-4xl border-1 border-neutral-200/50 bg-sky-400/10 px-5 pt-3 pb-1"
	>
		<p class="text-[1.1rem] font-medium opacity-80">You are receiving time tickets for free</p>
		<p class="tracking-[-0.015em] opacity-70">
			Upgrade to access job costing, scheduling, and more.
		</p>
		<div class="flex justify-start gap-3 pt-4 pb-4">
			<Button
				class="group flex gap-1 bg-gradient-to-t from-sky-500 to-sky-300 pr-2 font-semibold text-sky-50 transition-all hover:shadow-md"
			>
				<p class="pr-1 group-hover:text-white">Schedule Demo</p>

				<AdaptingContainer startingHeight={30} startingWidth={10}>
					<div class="relative w-0 overflow-hidden group-hover:w-fit">
						<IconCircleArrowRightFilled
							size={21}
							class="-transform-x-full group-hover:transform-x-0 opacity-0 transition-transform delay-500 duration-300 group-hover:opacity-90"
						/>
					</div>
				</AdaptingContainer>
			</Button>
			<Button style="ghost" class="hover:bg-blue-300/30"
				>View All Features <IconChevronRight /></Button
			>
		</div>
	</div>

	<div>
		<h3 class="text-2xl font-semibold tracking-tight">Time Tickets Submitted</h3>
		<DateHeader title="today" hasNewEntries date="Mon June 15th" />
		<DateHeader title="yesterday" hasNewEntries date="Mon June 14th" />
		<DateHeader date="Mon June 13th" />
		<DateHeader date="Mon June 12th" />
	</div>
</div>
