<script lang="ts">
	import { createClass, preserveClass } from '$utils/create-class'

	type Props = { class?: string }
	let { class: classProp }: Props = $props()
</script>

<div class="animate-[pulse_3s_cubic-bezier(0.4,0,0.6,1)_infinite] opacity-100">
	<div
		class={createClass(
			'shadow-inner-xs before:animate-shimmer relative flex h-6 min-w-14 items-center justify-center overflow-hidden rounded-full bg-gray-200 px-3 py-1 before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-slate-100/80 before:to-transparent',
			classProp
		)}
	></div>
</div>
