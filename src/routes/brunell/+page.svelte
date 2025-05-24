<script lang="ts">
	import TimeEditor from './time-editor.svelte'
	import AMorPM from './select-am-pm.svelte'
	import TimeEntry from './time-entry.svelte'

	import { IconCircleArrowRight } from '@tabler/icons-svelte'
</script>

<div class="flex w-full justify-center bg-neutral-200">
	<div class="my-1 min-h-[100dvh] w-full max-w-lg rounded-3xl bg-white">
		<TimeEditor />
		<div class="flex w-full justify-between px-3">
			<div
				class="flex h-fit w-fit items-center gap-1 rounded-xl bg-none px-2 py-1 hover:bg-neutral-200/50"
			>
				<TimeEntry />
				<AMorPM />
			</div>

			<div
				class="flex w-40 items-center justify-center gap-1 bg-gradient-to-r from-blue-200/0 via-blue-300/40 to-blue-200/0"
			>
				<IconCircleArrowRight size={18} stroke={2} class="text-blue-500" />
				<p class="font-medium text-blue-500">7:20 hrs</p>
			</div>

			<div
				class="flex h-fit w-fit items-center gap-1 rounded-xl bg-none px-2 py-1 hover:bg-neutral-200/50"
			>
				<TimeEntry />
				<AMorPM />
			</div>
		</div>
	</div>
</div>
