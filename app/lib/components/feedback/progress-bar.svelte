<script lang="ts">
	let { percent = 20 } = $props()
</script>

<div class="relative h-2 w-20 overflow-hidden rounded-full bg-sky-100">
	<div
		style:width={`${percent}%`}
		class="absolute top-0 left-0 h-full bg-sky-500 transition-[border-radius] duration-200"
	></div>
</div>
