<script lang="ts">
	import { createClass } from '$utils/create-class'
	let { value, active = false } = $props()

	let expanded = $derived(value !== '')
</script>

<div class="relative flex h-full w-4 items-center justify-center">
	<div class="absolute top-0 left-0 flex h-full w-full items-center justify-center">
		<div
			style:opacity={expanded ? '0.0' : '1.0'}
			style:transform={expanded ? 'translateY(100%)' : 'translateY(0%)'}
			style:scaleY={expanded ? '3.0' : '1.0'}
			class={createClass(
				`h-2 w-2 rounded-full bg-neutral-400 transition-all duration-200`,
				`group-focus-within:bg-neutral-400`,
				'group-hover:not-group-focus-within:bg-neutral-500',
				active && `group-focus-within:bg-neutral-800`
			)}
		></div>
	</div>
	<p
		style:opacity={expanded ? '1.0' : '0.0'}
		style:transform={expanded ? 'translateY(0%)' : 'translateY(-35%)'}
		class:text-blue-600={active}
		class:bg-sky-200={active}
		class="w-full text-center text-[1.15rem] font-medium transition-all delay-100 duration-200"
	>
		{value}
	</p>
</div>
