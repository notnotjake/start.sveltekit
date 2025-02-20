<script lang="ts">
	import { createClass, preserveClass } from '$utils/create-class'

	type Props = {
		class?: string
		spread?: number
		background?: string
		tint?: string
	}
	let {
		class: classProp,
		spread = 80,
		background = 'var(--color-sky-100)',
		tint = 'var(--color-sky-500)'
	} = $props()
</script>

<div
	style:background
	class={createClass('relative h-2 w-20 overflow-hidden rounded-full', classProp)}
>
	<div class="suspense-bar h-full w-full">
		<div
			style:--tint={tint}
			style:width={`${spread}%`}
			class="absolute top-0 -left-full h-full bg-gradient-to-r from-(--tint)/0 via-(--tint) to-(--tint)/0"
		></div>
	</div>
</div>

<style>
	.suspense-bar {
		animation: suspense-bar 2s infinite both linear;
	}
	@keyframes suspense-bar {
		100% {
			transform: translateX(200%);
		}
	}
</style>
