<script lang="ts">
	import TimeEditor from './time-editor.svelte'
	import AMorPM from './select-am-pm.svelte'
	import TimeEntry from './time-entry.svelte'
	import SuspenseText from '$ui/feedback/suspense-text.svelte'

	import {
		IconCircleArrowRight,
		IconRotate,
		IconRotateClockwise,
		IconBubbleText
	} from '@tabler/icons-svelte'
</script>

<div class="flex w-full flex-col items-center justify-center bg-neutral-200">
	<div class="my-1 flex w-full max-w-lg items-center justify-start gap-3 px-2">
		<IconBubbleText class="text-neutral-700" />
		<SuspenseText class="text-[1.1rem] font-medium text-neutral-600"
			>drafting your time sheet</SuspenseText
		>
	</div>

	<div class="my-1 min-h-[100dvh] w-full max-w-lg rounded-3xl bg-white">
		<TimeEditor />

		<div
			class="flex h-fit w-fit cursor-pointer items-center gap-1 rounded-xl border-2 border-blue-500 bg-gradient-to-b from-sky-400/30 to-sky-300/20 px-2 py-1 text-blue-500"
		>
			<TimeEntry />
			<AMorPM />
		</div>

		<div class="flex w-full justify-between px-3">
			<div
				class="flex h-fit w-fit cursor-pointer items-center gap-1 rounded-xl bg-none px-2 py-1 hover:bg-neutral-200/40"
			>
				<TimeEntry />
				<AMorPM />
			</div>

			<div
				class="flex w-40 items-center justify-center gap-1 bg-gradient-to-r from-blue-200/0 via-blue-400/25 to-blue-200/0"
			>
				<IconCircleArrowRight size={19} stroke={2.5} class="text-blue-500" />
				<p class="text-[1.05rem] font-medium text-blue-500">7:20 hrs</p>
			</div>

			<div
				class="flex h-fit w-fit cursor-pointer items-center gap-1 rounded-xl bg-none px-2 py-1 hover:bg-neutral-200/40"
			>
				<TimeEntry />
				<AMorPM />
			</div>
		</div>
		<div
			class="relative flex min-h-10 w-full items-center justify-between bg-neutral-200/30 px-4 font-medium"
		>
			<div class="flex items-center gap-2">
				<IconRotate size={20} stroke={2.5} class="-rotate-180 text-neutral-600" />
				<button class="text-[0.9rem] font-semibold">10m</button>
				<button class="text-[0.9rem] font-semibold">5m</button>
			</div>
			<div class="relative h-8 w-full max-w-50 cursor-grab">
				<div
					class="absolute inset-0 z-0 flex h-full w-full items-center justify-evenly rounded-full bg-neutral-200 py-2"
				>
					{@render tick()}
					{@render tick()}
					{@render tick()}
					{@render tick()}
					{@render tick()}
					{@render tick()}
					{@render tick()}
					{@render tick()}
					{@render tick()}
					{@render tick()}
					{@render tick()}
					{@render tick()}
					{@render tick()}
					{@render tick()}
					{@render tick()}
				</div>
			</div>
			<div class="flex items-center gap-2">
				<button class="text-[0.9rem] font-semibold">5m</button>
				<button class="text-[0.9rem] font-semibold">10m</button>
				<IconRotateClockwise size={20} stroke={2.5} class="rotate-180 text-neutral-600" />
			</div>
		</div>
	</div>
</div>

{#snippet tick()}
	<span class="relative inline-block h-full w-[3px] rounded-full bg-black/15"></span>
{/snippet}
