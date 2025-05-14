<script lang="ts">
	import { IconEye, IconWorld, IconClockHour8Filled } from '@tabler/icons-svelte'
</script>

<div class="flex w-full items-center justify-center">
	<div class="flex items-center gap-[0.4rem] rounded-full bg-neutral-900 px-[0.4rem] py-[0.4rem]">
		<div
			class="flex w-fit cursor-pointer items-center gap-1 rounded-full bg-neutral-700/80 py-1.5 pr-4 pl-2 text-[0.92rem] font-medium text-neutral-100 inset-ring-1 inset-ring-neutral-500/40"
		>
			<IconClockHour8Filled size={18} class="text-neutral-400" />
			<p>Duration</p>
		</div>
		<div
			class="flex w-fit cursor-pointer items-center gap-1 rounded-full bg-neutral-700/80 py-1.5 pr-4 pl-2 text-[0.92rem] font-medium text-neutral-100 inset-ring-1 inset-ring-neutral-500/50"
		>
			<IconClockHour8Filled size={18} class="text-neutral-400" />
			<p>Constraints</p>
		</div>
		<div
			class="flex w-fit cursor-pointer items-center gap-1 rounded-full bg-neutral-700/80 py-1.5 pr-4 pl-2 text-[0.92rem] font-medium text-neutral-100 inset-ring-1 inset-ring-neutral-500/50"
		>
			<IconEye size={18} class="text-neutral-400" />
			<p>Private</p>
		</div>
		<div
			class="flex w-fit cursor-pointer items-center gap-1 rounded-full bg-neutral-700/80 py-1.5 pr-4 pl-2 text-[0.92rem] font-medium text-neutral-100 inset-ring-1 inset-ring-neutral-500/50"
		>
			<IconWorld size={18} class="text-neutral-400" />
			<p>Timezones</p>
		</div>
		<div
			class="w-fit cursor-pointer rounded-full bg-gradient-to-b from-neutral-900 to-neutral-700/70 px-4 py-1.5 text-[0.92rem] font-medium text-neutral-100 inset-ring-1 inset-ring-neutral-500/50"
		>
			Share
		</div>
	</div>
</div>
