<script lang="ts">
	import { createClass } from '$utils/styles'
	import {
		IconChevronDown,
		IconCarFilled,
		IconMugFilled,
		IconCirclePlusFilled
	} from '@tabler/icons-svelte'
	import Button from '$ui/input/button.svelte'
	import SelectAmPm from './select-am-pm.svelte'

	let hour = $state<number>(8)
	let minutes = $state<number>(45)

	let isEditing = $state<boolean>(false)
</script>

<div
	class="shadow-card flex h-9 w-fit overflow-hidden rounded-xl border-[1px] border-neutral-200/80 bg-white"
>
	<div
		class="flex h-full w-fit items-center justify-center text-neutral-700 outline-none hover:bg-neutral-100"
	>
		<SelectAmPm />
	</div>
</div>

<div class="my-3 w-full px-1">
	<div class="flex w-full rounded-2xl bg-neutral-200/50 px-3 py-2">
		<div class="flex w-full gap-2">
			<p class="text-lg font-medium opacity-70">Add Breaks and Travel</p>
		</div>
		<div>
			<IconCirclePlusFilled class="text-neutral-600" size={27} />
		</div>
	</div>
</div>

<div class="w-full px-1">
	<div class="flex w-full rounded-2xl bg-neutral-200/50 px-3 py-2">
		<div class="flex w-full gap-2">
			<div class="flex w-fit items-center gap-1 rounded-full bg-neutral-400/30 pr-2 pl-2">
				<IconMugFilled size={21} class="text-purple-500" />
				<p class="text-[1.1rem] font-medium opacity-70">12 mins</p>
			</div>
			<div class="flex w-fit items-center gap-1 rounded-full bg-neutral-400/30 pr-2 pl-2">
				<IconCarFilled size={21} class="text-green-500" />
				<p class="text-[1.1rem] font-medium opacity-70">24 miles</p>
			</div>
		</div>
		<div>
			<IconCirclePlusFilled class="text-neutral-600" size={27} />
		</div>
	</div>
</div>
