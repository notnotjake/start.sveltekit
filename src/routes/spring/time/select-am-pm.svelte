<script lang="ts">
	import { createClass } from '$utils/styles'
	let selected = $state<'AM' | 'PM'>('AM')

	function toggle() {
		if (selected === 'AM') {
			selected = 'PM'
		} else {
			selected = 'AM'
		}
	}

	let isAM = $derived(selected === 'AM')
	let isPM = $derived(selected === 'PM')
</script>

<div
	onclick={toggle}
	class="flex h-full w-fit cursor-pointer items-center px-1.5 text-[0.9rem] font-semibold text-neutral-800 opacity-80 inset-shadow-sm/0 transition-colors select-none"
>
	<div class="relative h-5 w-2.5 overflow-hidden">
		<p
			class={createClass(
				'absolute inset-0 h-5 transition-all duration-300',
				isAM ? 'translate-y-0 opacity-100' : '-translate-y-[100%] opacity-0'
			)}
		>
			A
		</p>
		<p
			class={createClass(
				'absolute inset-0 h-5 transition-all duration-300',
				isAM ? 'translate-y-[100%] opacity-0' : 'translate-y-0 opacity-100'
			)}
		>
			P
		</p>
	</div>
	<div class="h-5">
		<p class="h-5">M</p>
	</div>
</div>
