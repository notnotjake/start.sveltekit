<script lang="ts">
	import { createClass, preserveClass } from '$utils/create-class'
</script>

<div class="relative h-2 w-20 overflow-hidden rounded-full bg-sky-100">
	<div class="suspense-bar h-full w-full">
		<div
			class="absolute top-0 -left-full h-full w-[80%] bg-gradient-to-r from-sky-500/0 via-sky-500 to-sky-500/0"
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
