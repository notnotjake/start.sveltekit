<script lang="ts">
	import { createClass } from '$utils/create-class'

	type Props = {
		class?: string
		percent: number
		background?: string
		tint?: string
	}
	let {
		class: classProp,
		percent = 42,
		background = 'var(--color-sky-100)',
		tint = 'var(--color-sky-500)'
	} = $props()
</script>

<div
	style:background
	class={createClass('relative h-2 w-20 overflow-hidden rounded-full', classProp)}
>
	<div
		style:width={`${percent}%`}
		style:background={tint}
		class="absolute inset-0 h-full transition-all duration-150"
	></div>
</div>
