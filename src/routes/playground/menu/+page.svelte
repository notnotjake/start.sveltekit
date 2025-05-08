<script lang="ts">
	import MultiDevice from '$ui/icons/multi-device.svelte'

	let name = ''
</script>

<div class="shadow-card min-w-60 rounded-2xl border-[1px] border-neutral-200/80 p-1.5">
	<h3 class="p-2 text-[0.9rem] font-light text-neutral-500">Model</h3>
	<div class="cursor-pointer rounded-lg p-2 hover:bg-neutral-100">
		<h1 class="leading-none">Canvas</h1>
		<h1 class="text-[0.9rem] text-neutral-500">Collaborate on writing and code</h1>
	</div>
	<div class="my-1 px-2"><div class="h-[1px] bg-neutral-200"></div></div>
	<div class="cursor-pointer rounded-lg p-2 hover:bg-neutral-100/80">
		<h1 class="leading-none">Canvas</h1>
		<h1 class="text-[0.9rem] text-neutral-500">Collaborate on writing and code</h1>
	</div>
	<div class="flex min-h-10 cursor-pointer items-center rounded-lg p-2 hover:bg-neutral-100/80">
		<MultiDevice class="text-neutral-600" />
		<h1 class="leading-none">Logout</h1>
	</div>
</div>
