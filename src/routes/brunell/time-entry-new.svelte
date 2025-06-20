<script lang="ts">
	import { createClass } from '$utils/styles'
	import { IconChevronDown } from '@tabler/icons-svelte'
	import Button from '$ui/input/button.svelte'
	import SelectAmPm from './select-am-pm.svelte'

	let hour = $state<number>(8)
	let minutes = $state<number>(45)

	let isEditing = $state<boolean>(false)
</script>

<div
	class="shadow-card flex h-9 w-fit overflow-hidden rounded-xl border-[1px] border-neutral-200/80 bg-white"
>
	<Button
		resetStyles
		class={createClass(
			'h-full rounded-tl-xl rounded-bl-xl pr-1.5 pl-2 font-medium text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
			isEditing
				? 'bg-gradient-to-t from-blue-300/30 to-blue-200/30 inset-ring-2 inset-ring-blue-500'
				: ''
		)}
	>
		<div class={createClass('w-fit py-1')}>
			<div class="group relative w-fit" onclick={() => (isEditing = !isEditing)}>
				<div
					class={createClass(
						'absolute top-0 right-0 text-neutral-600 transition-opacity duration-150',
						isEditing && 'text-neutral-900 opacity-0'
					)}
				>
					<p class="text-xl font-semibold">{hour}:{minutes}</p>
				</div>

				<div
					class={createClass(
						'flex origin-right scale-x-75 font-mono text-xl font-semibold opacity-0 transition-all duration-150',
						isEditing && 'scale-x-100 text-blue-500 opacity-100'
					)}
				>
					<div class="">
						<p>0{hour}</p>
					</div>
					<div>:</div>
					<div class="">
						<p>{minutes}</p>
					</div>
				</div>
			</div>
		</div>
	</Button>
	<div class="h-full w-[2px] bg-neutral-100"></div>
	<div
		class="flex h-full w-fit items-center justify-center text-neutral-700 outline-none hover:bg-neutral-100"
	>
		<SelectAmPm />
	</div>
</div>
