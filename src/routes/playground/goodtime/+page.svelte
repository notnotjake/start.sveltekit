<script lang="ts">
	import ToggleButton from './toggle-button.svelte'
	import HelpTooltip from './help.svelte'
	import Toolbar from './owner-menu.svelte'
	import WeekGroup from './week-group.svelte'

	import { IconSelector } from '@tabler/icons-svelte'
</script>

<div class="flex w-full items-center justify-center gap-3 pt-0.5">
	<a class="text-[1.1rem] font-semibold text-green-600" href="/playground/goodtime"
		>https://goodtime.meet/acorn-rino-tent</a
	>
	<button class="text-[1.1rem] font-medium text-neutral-500 hover:text-neutral-700">copy</button>
</div>

<div class="flex w-full flex-col items-center justify-center pt-14 pb-12">
	<h3 class="text-[2.7rem] font-bold text-black/40">Meeting Name</h3>

	<h2 class="text-[1.2rem] font-medium text-black/40">Description</h2>
</div>

<Toolbar />

<div
	class="shadow-box mx-auto my-4 h-fit min-h-40 w-2xl rounded-[1.1rem] bg-white px-4 py-5 ring-2 ring-neutral-200/70"
>
	<div class="mb-2 flex w-full justify-end">
		<HelpTooltip />
	</div>

	<div class="flex gap-4 overflow-scroll pb-4">
		<WeekGroup />

		<div class="flex gap-[0.15rem]">
			<div
				class="flex w-fit flex-col items-center justify-center rounded-tl-lg rounded-bl-lg bg-neutral-200/90 py-1.5"
			>
				<IconSelector size={19} class="text-neutral-600" />
			</div>

			<div class="flex w-18 flex-col items-center justify-center bg-neutral-200/90 py-1.5">
				<h3 class="text-[1rem]/4 font-medium tracking-tight text-neutral-500">Wed</h3>
				<p class="text-[1.3rem]/6 font-bold text-neutral-800">31</p>
			</div>

			<div class="flex w-20 flex-col items-center justify-center bg-neutral-200/90 py-1.5">
				<h3 class="text-[1rem]/4 font-medium tracking-tight text-neutral-900 uppercase">June</h3>
				<p class="text-[1.3rem]/6 font-bold text-neutral-800">1</p>
			</div>

			<div class="flex w-20 flex-col items-center justify-center bg-neutral-200/90 py-1.5">
				<h3 class="text-[1rem]/4 font-medium tracking-tight text-neutral-500">Fri</h3>
				<p class="text-[1.3rem]/6 font-bold text-neutral-800">2</p>
			</div>

			<div class="flex w-20 flex-col items-center justify-center bg-neutral-200/90 py-1.5">
				<h3 class="text-[1rem]/4 font-medium tracking-tight text-neutral-500">Sat</h3>
				<p class="text-[1.3rem]/6 font-bold text-neutral-800">3</p>
			</div>

			<div class="flex w-20 flex-col items-center justify-center bg-neutral-200/90 py-1.5">
				<h3 class="text-[1rem]/4 font-medium tracking-tight text-neutral-500">Sun</h3>
				<p class="text-[1.3rem]/6 font-bold text-neutral-800">4</p>
			</div>

			<div class="flex w-20 flex-col items-center justify-center bg-neutral-200/90 py-1.5">
				<h3 class="text-[1rem]/4 font-medium tracking-tight text-neutral-500">Mon</h3>
				<p class="text-[1.3rem]/6 font-bold text-neutral-800">5</p>
			</div>

			<div
				class="flex w-20 flex-col items-center justify-center rounded-tr-lg rounded-br-lg bg-neutral-200/90 py-1.5"
			>
				<h3 class="text-[1rem]/4 font-medium tracking-tight text-neutral-500">Tue</h3>
				<p class="text-[1.3rem]/6 font-bold text-neutral-800">6</p>
			</div>
		</div>
	</div>
</div>

<div class="shadow-card w-fit rounded-full bg-neutral-700 px-2.5 py-1">
	<p class="text-[0.95rem] font-medium text-white">Add Comment</p>
</div>
